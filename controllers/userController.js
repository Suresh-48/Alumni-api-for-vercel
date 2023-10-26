import User from "../models/userModel.js";
import Group from "../models/groupModel.js";
import School from "../models/schoolModel.js";
import College from "../models/collegeModel.js";
import nodemailer from "nodemailer";
import { EMAIL, PASSWORD, fromEmail } from "../config.js";
import UserPermission from "../models/UserPermissionModel.js";
import collegeGroupMembers from "../models/collegeGroupMembersModel.js";
import Chat from "../models/chatModel.js";
import sgMail from "@sendgrid/mail";

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
});

// Base Controller
import sendSms from "../utils/sms.js";
import { getAll, getOne, updateOne, deleteOne } from "./baseController.js";
import groupMembers from "../models/groupMembersModel.js";
import { getPublicImagUrl, uploadBase64File } from "../utils/s3.js";
import getRandomNumberForOtp from "../utils/otp.js";
import { environments, PRODUCTION_ENV } from "../config.js";

export async function deleteMe(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      active: false,
    });
    res.status(204).json({
      status: "Updated Successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function getGroups(req, res, next) {
  try {
    //User id
    const userId = req.params.id;
    const data = await groupMembers
      .find({
        userId: userId,
        status: "approved",
      })
      .populate("groupId");
    res.status(200).json({
      status: "Users Group Displayed ",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAvatar(req, res, next) {
  const userId = req.params.id;
  const file = req.body.avatar;
  const USER_PATH = "media/users";
  const type = file && file.split(";")[0].split("/")[1];
  const random = new Date().getTime();
  const fileName = `${userId}-${random}.${type}`;
  const filePath = `${USER_PATH}/${fileName}`;
  const userDetails = await User.findById(userId);

  if (!userDetails) {
    return next(new Error("User not found"));
  }

  // Upload file
  uploadBase64File(file, filePath, (err, mediaPath) => {
    if (err) {
      return callback(err);
    }
    User.updateOne(
      { _id: userId }, // Filter
      { avatar: mediaPath, avatarUrl: getPublicImagUrl(mediaPath) } // Update
    )
      .then((obj) => {
        res.status(200).json({
          status: "User profile updated successfully",
          data: {
            userDetails,
          },
        });
      })
      .catch((err) => {
        console.log("Error: " + err);
      });
  });
}

export async function deleteAvatarImage(req, res, next) {
  try {
    const userId = req.params.id;
    const data = User.findByIdAndUpdate(
      { _id: userId }, // Filter
      { avatarUrl: null, avatar: null } // Update
    ).then((obj) => {
      res.status(200).json({
        status: "User profile updated successfully",
        data: {
          data,
        },
      });
    });
  } catch (error) {
    next(error);
  }
}

export async function checkingUser(req, res, next) {
  try {
    const { phone, firstName, lastName, email, role, fcmToken } = req.body;

    const exist = await User.find({ phone: phone, isActive: true });

    if (exist.length === 0) {
      const otp = environments === PRODUCTION_ENV ? getRandomNumberForOtp(1000, 9999) : "1234";

      //create new user
      const user = await User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        role: role,
        otp: otp,
        fcmToken: fcmToken,
        isRegister: true,
      });

      const token = Math.floor(Date.now());

      user.password = undefined;
      if (environments === PRODUCTION_ENV) {
        sendSms(`Your Verification Code is ${otp}`, phone);
      }

      res.status(201).json({
        status: "New User",
        message: "User signuped successfully",
        token,
        data: {
          user,
        },
      });
    } else {
      if (exist[0].active === false) {
        const otp = environments === PRODUCTION_ENV ? getRandomNumberForOtp(1000, 9999) : "1234";

        const user = await User.findOne({ phone: phone });
        const token = Math.floor(Date.now());
        user.password = undefined;

        // Otp Generation
        if (environments === PRODUCTION_ENV) {
          sendSms(`Your Verification Code is ${user.otp}`, phone);
        }

        await User.findByIdAndUpdate(user._id, {
          otp: otp,
        });

        res.status(200).json({
          status: "User invited profile ",
          message: "User signuped successfully",
          token,
          data: {
            user,
          },
        });
      } else {
        res.status(200).json({
          status: "Already Existing User",
        });
      }
    }
  } catch (error) {
    next(error);
  }
}
export async function checkingPhone(req, res, next) {
  try {
    const phone = req.body.phone;

    const exist = await User.findOne({ phone: phone });
    const otp = environments === PRODUCTION_ENV ? getRandomNumberForOtp(1000, 9999) : "1234";
    //console.log("OTP Verification....", otp);

    // to :usermail
    // const htmlcontent = `<p>Please use this code to reset the phone number for Alumni app account.</p><br>
    //           <p>  Here is your verification code : <b><font size="3"> ${otp}<b></p><br>

    //           <p>Thanks and Regards,</p>
    //           <p>AVIAR Technology Services,<br>
    //             565, Vivekanadar Street,<br>
    //             Nehru Nagar, Vengikkal,<br>
    //             Tiruvannamalai,  606604.</p>
    //           <p>Visit:  www.aviartechservices.com</p>
    //   `;
    // var mailOptions = {
    //   from: "sureshbefrank92@gmail.com",
    //   to: exist.email,
    //   subject: "Alumni Account Phone Number Reset",
    //   html: htmlcontent,
    // };

    // transporter.sendMail(mailOptions, function (error, info) {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log("Email sent: " + info.response);
    //   }
    // });
    res.status(200).json({
      message: otp,
    });
  } catch (error) {
    next(error);
  }
}
export const getAllUsers = getAll(User);
export const getUser = getOne(User);
export const updateUser = updateOne(User);

export async function admin(req, res, next) {
  try {
    const { firstName, lastName, email, phone, schoolId, collegeId, principalName, principalContactNumber } = req.body;
    const userCheck = await User.find({ phone: phone, isActive: true });
    const otp = environments === PRODUCTION_ENV ? getRandomNumberForOtp(1000, 9999) : "1234";
    const data = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      principalName: principalName,
      principalContactNumber: principalContactNumber,
      adminStatus: "pending",
      role: "admin",
      otp: otp,
      isRegister: true,
    };

    function addDataIntoObject(value, key) {
      {
        value && value != undefined ? (data[key] = value) : {};
      }
    }
    {
      schoolId ? addDataIntoObject(schoolId, "schoolId") : addDataIntoObject(collegeId, "collegeId");
    }
    {
      schoolId ? addDataIntoObject("school", "institute") : addDataIntoObject("college", "institute");
    }
    if (userCheck != null && userCheck.length === 0) {
      const user = await User.create(data);
      res.status(201).json({
        status: "New User",
        message: "User signuped successfully",
        data: {
          user,
        },
      });
    } else {
      const user = await User.updateOne({ _id: userCheck[0]._id }, { $set: data });
      res.status(201).json({
        status: "Existing User",
        message: "User Updated successfully",
        data: {
          user,
        },
      });
    }
  } catch (err) {
    console.log(`err`, err);
  }
}

export async function adminLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    const findUser = await User.find({
      email: email,
      password: password,
    });
    if (findUser.length === 1) {
      res.status(200).json({
        status: "Success",
        message: "User Logged In successfully",
      });
    } else {
      res.status(200).json({
        status: "Failed",
        message: "User Not Found",
      });
    }
  } catch (err) {
    console.log(`err`, err);
  }
}
export async function adminSchoolCollegeList(req, res, next) {
  try {
    const userId = req.query.userId;
    const schoolCollegeList = await User.findOne({ _id: userId });

    if (schoolCollegeList.schoolId) {
      const list = await School.findOne({ _id: schoolCollegeList.schoolId });
      res.status(200).json({
        message: "User Not Found",
        data: {
          institute: "school",
          list,
        },
      });
    } else {
      const list = await College.findOne({ _id: schoolCollegeList.collegeId });

      res.status(200).json({
        message: "User Not Found",
        data: {
          institute: "college",
          list,
        },
      });
    }
  } catch (err) {
    console.log(`err`, err);
  }
}

//notification count
export async function notificationCount(req, res, next) {
  try {
    const data = req.query;
    const schoolGroupInvites = await groupMembers
      .find({
        userId: data.userId,
        status: "requested",
      })
      .countDocuments();

    const collegeGroupinvites = await collegeGroupMembers
      .find({
        userId: data.userId,
        status: "requested",
      })
      .countDocuments();

    const profilrViewPermission = await UserPermission.find({
      userId: data.userId,
      status: "Requested",
    }).countDocuments();

    const chatMessageCount = await Chat.find({
      receiverId: data.userId,
      received: false,
    }).countDocuments();

    const messageCount = chatMessageCount === 0 ? 0 : 1;

    const notificationCount = schoolGroupInvites + collegeGroupinvites + profilrViewPermission + messageCount;

    res.status(200).json({
      message: "Notification Count",
      data: {
        notificationCount,
      },
    });
  } catch (err) {
    console.log(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const data = req.query;
    const deleteUser = await User.findByIdAndDelete({ _id: data.userId });

    res.status(200).json({
      message: "User Deleted",
    });
  } catch (err) {
    console.log(err);
  }
}

export async function findAlumniDeleteUser(req, res, next) {
  try {
    const data = req.body;
    const userData = await User.find({
      phone: data.phone,
      email: data.email,
    });

    if (userData.length !== 0) {
      const randomOTP = getRandomNumberForOtp(1000, 9999);
      const userDetails = await User.findByIdAndUpdate(
        userData[0]._id,
        {
          otp: randomOTP,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      // using Twilio SendGrid's v3 Node.js Library
      // https://github.com/sendgrid/sendgrid-nodejs
      // const sgMail = require("@sendgrid/mail");
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: "civildinesh313@gmail.com",
        from: fromEmail,
        subject: "OTP Verification for Alumni Account Delete",
        text: "Alumni",
        html: `This is your verification code <strong>${randomOTP}</strong>`,
      };
      sgMail.send(msg);
      res.status(200).json({
        status: "success",
        userDetails,
      });
    } else {
      res.status(404).json({
        status: "User Not Found",
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function inActiveUser(req, res, next) {
  try {
    const id = req.params.id;
    const userData = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      {
        runValidators: true,
        new: true,
      }
    );

    res.status(200).json({
      message: "User Deleted Successfully",
    });
  } catch (err) {
    next(err);
  }
}
export async function updateAllStatus(req, res, next) {
  try {
    const editData = {
      isActive: true,
    };

    const updateMany = await User.updateMany(editData);

    res.status(200).json({
      message: "updated successfully",
    });
  } catch (err) {
    next(err);
  }
}
