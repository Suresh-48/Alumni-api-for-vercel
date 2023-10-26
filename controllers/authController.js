import { promisify } from "util";
import sendSms from "../utils/sms.js";
import getRandomNumberForOtp from "../utils/otp.js";
import jsonwebtoken from "jsonwebtoken";
const { sign, verify } = jsonwebtoken;
import User from "../models/userModel.js";

// App Error
import AppError from "../utils/appError.js";

import { environments, PRODUCTION_ENV } from "../config.js";

//
/**
 * Create Token
 *
 * @param {*} id
 */
const createToken = (id) => {
  return sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

/**
 * Login
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
//Login Api
export async function login(req, res, next) {
  try {
    const { phone, fcmToken } = req.body;
    const userData = await User.findOne({
      phone: phone,
      isActive: true,
    });
if (!userData) {
      res.status(200).json({
        status: "404",
        message: "Can't find User Details",
      });
    }
if(userData.adminStatus!=="approved"&&userData.role==="admin"){
  res.status(200).json({
    status: "403",
    message: "Your Request Is Still In Pending ",
  });
}
    // 2) All correct, send jwt to client
    //const token = createToken(user._id);
    const token = Math.floor(Date.now());

    const newOtp = environments === PRODUCTION_ENV ? getRandomNumberForOtp(1000, 9999) : "1234";

    const user = await User.findByIdAndUpdate(userData._id, {
      otp: newOtp,
      fcmToken: fcmToken,
    });

    //Send Sms
    if (environments === PRODUCTION_ENV) {
      sendSms(`Your Verification Code is ${user.otp}`, phone);
    }
    res.status(200).json({
      status: "updated",
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
}

// Sign Up Module
export async function signup(req, res, next) {
  try {
    const phone = req.body.phone;

    //find User Phone
    const exist = await User.find({ phone: phone, isActive: true });

    if (exist.length == 0) {
      //create new user
      const user = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        role: req.body.role,
      });

      const token = Math.floor(Date.now());
      user.password = undefined;

      res.status(201).json({
        status: "success",
        message: "User signuped successfully",
        token,
        data: {
          user,
        },
      });
    } else {
      //update a existing user
      const filter = { phone: phone };

      const updateDoc = {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          phone: req.body.phone,
          role: req.body.role,
        },
      };

      await User.updateOne(filter, updateDoc, {
        new: true,
      });

      const user = await User.findOne({ phone: phone });

      const token = Math.floor(Date.now());

      res.status(201).json({
        status: "updated",
        message: "User Already exist",
        token,
        data: {
          user,
        },
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function protect(req, res, next) {
  try {
    // 1) check if the token is there
    let token;
    if (req.headers.authorization) {
      token = req.headers.authorization;
    }

    if (!token) {
      return next(new AppError(401, "fail", "You are not logged in! Please login in to continue"), req, res, next);
    }

    // 2) Verify token
    // const decode = await promisify(verify)(token, process.env.JWT_SECRET);

    // 3) check if the user is exist (not deleted)
    const user = await User.find({
      token: { $eq: token },
    });

    if (!user) {
      return next(new AppError(401, "fail", "This user is no longer exist"), req, res, next);
    }

    req.user = user;
    req.isAdmin = user.role === "admin";
    req.isAlumini = user.role === "alumini";

    next();
  } catch (err) {
    next(err);
  }
}

// Authorization check if the user have rights to do this action
export function restrictTo(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, "fail", "You are not allowed to do this action"), req, res, next);
    }

    next();
  };
}
