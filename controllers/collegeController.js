import college from "../models/collegeModel.js";
import mongoose from "mongoose";
import fs from "fs";
import csv from "csvtojson";
import User from "../models/userModel.js";
import collegeGroupMembers from "../models/collegeGroupMembersModel.js";
import { getAll, getOne, updateOne, deleteOne } from "./baseController.js";
import nodemailer from "nodemailer";
import { EMAIL, PASSWORD } from "../config.js";
import { getPublicImagUrl, uploadBase64File } from "../utils/s3.js";

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
});

export async function createCollegeRequest(req, res, next) {
  try {
    const data = req.body;

    const exist = await college.find({ pincode: req.body.pincode, name: req.body.name });

    if (exist.length == 0) {
      const colleges = await college.create(data);

      if (colleges) {
        res.status(201).json({
          status: "success",
          message: "College created successfully",
          data: {
            colleges,
          },
        });
      }
      // to :usermail
      // const htmlcontent = `<p>This college is not in our database please approve for adding new alumni
      //   college.</p><br>
      //         <p> Requesting College Name : <b><font size="3"> ${colleges.name}<b></p><br>

      //         <p>Thanks and Regards,</p>
      //         <p>AVIAR Technology Services,<br>
      //           565, Vivekanadar Street,<br>
      //           Nehru Nagar, Vengikkal,<br>
      //           Tiruvannamalai,  606604.</p>
      //         <p>Visit:  www.aviartechservices.com</p>
      // `;
      // var mailOptions = {
      //   from: EMAIL,
      //   to: "sureshbefrank92@gmail.com",
      //   subject: "Alumni Request For New College",
      //   html: htmlcontent,
      // };
      // transporter.sendMail(mailOptions, function (error, info) {
      //   if (error) {
      //     console.log(error);
      //   } else {
      //     console.log("Email sent: " + info.response);
      //   }
      // });
    } else {
      res.status(201).json({
        status: "success",
        message: "College Already Exist",
        data: {
          exist,
        },
      });
    }
  } catch (err) {
    next(err);
  }
}
export async function pendingCollegeRequest(req, res, next) {
  try {
    const pendingColleges = await college.find({ status: "pending" });
    res.status(200).json({
      status: "success",
      results: pendingColleges.length,
      data: {
        data: pendingColleges,
      },
    });
  } catch (err) {
    next(err);
  }
}
export async function acceptCollegeRequest(req, res, next) {
  try {
    const collegeId = req.body.collegeId;
    const collegeData = await college.updateOne({ _id: collegeId }, { status: "approved" });
    const colleges = await college.findOne({ _id: collegeId });

    res.status(200).json({
      status: "success",
      message: "college Added Successfully",
      data: colleges,
    });
  } catch (err) {
    next(err);
  }
}
export async function addCollege(req, res, next) {
  try {
    importCsvData2MongoDB(req.file.path);
    function importCsvData2MongoDB(filePath) {
      csv()
        .fromFile(filePath)
        .then((collegeList) => {
          collegeList.forEach(async (data) => {
            const datas = await college.find({ name: data.name, city: data.city });
            const listLength = datas.length;
            {
              listLength === 0 ? await college.create(data) : null;
            }
          });
          fs.unlinkSync(filePath);
        });
    }
    res.json({
      msg: "File uploaded/import successfully!",
      file: req.file,
    });
  } catch (err) {
    next(err);
  }
}

export async function getAllColleges(req, res, next) {
  try {
    const { skip, limit, search, city, state, pincode } = req.query;
    const skipValue = parseInt(skip);
    const limitValue = parseInt(limit);
    if (search || state || city || pincode) {
      try {
        if (search && search != undefined) {
          const query = { $text: { $search: `\"${search}\"` }, status: "approved" };
          function checkValues(value, key) {
            {
              value && value != undefined ? (query[key] = value) : {};
            }
          }
          checkValues(state, "state");
          checkValues(city, "city");
          checkValues(pincode, "pincode");
          const data = await college.find(query).limit(limitValue).skip(skipValue).sort({ name: 1 });
          res.status(200).json({
            status: "success",
            result: data.length,
            data: {
              data: data,
            },
          });
        } else {
          const query = { status: "approved" };
          function checkValues(value, key) {
            {
              value ? (query[key] = value) : {};
            }
          }
          checkValues(state, "state");
          checkValues(city, "city");
          checkValues(pincode, "pincode");
          const data = await college.find(query).limit(limitValue).skip(skipValue).sort({ name: 1 });
          res.status(200).json({
            status: "success",
            result: data.length,
            data: {
              data: data,
            },
          });
        }
      } catch (err) {
        next(err);
      }
    } else {
      try {
        const data = await college.find({ status: "approved" }).limit(limitValue).skip(skipValue).sort({ name: 1 });

        res.status(200).json({
          status: "success",
          result: data.length,
          data: {
            data: data,
          },
        });
      } catch (err) {
        console.log(`err`, err);
      }
    }
  } catch (err) {
    next(err);
  }
}
//export const getAllColleges = getAll(college);

export async function ListUsersFromCollege(req, res, next) {
  try {
    //user Id
    const userId = req.query.userId;
    const collegeId = req.query.collegeId;
    const doc = await collegeGroupMembers
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "Users",
          },
        },
      ])
      .match({
        $and: [
          {
            collegeId: mongoose.Types.ObjectId(collegeId),
          },
          { status: "approved" },
        ],
      })
      .allowDiskUse(true);
    const users = [];
    doc.forEach((res, i) => {
      const userId = res.Users[0]._id;
      if (users.indexOf(`${userId}`) < 0) {
        users.push(`${userId}`);
      }
    });
    const userData = await User.find({ _id: users }).sort({ firstName: 1 });
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: userData,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function ListCollegesFromUser(req, res, next) {
  try {
    //user Id
    const userId = req.query.userId;
    const collegeData = await collegeGroupMembers.find({
      status: "approved",
      userId: userId,
    });
    let collegeIds = [];
    collegeData.forEach((collegeDetails) => {
      const collegeId = collegeDetails.collegeId;
      if (collegeIds.indexOf(`${collegeId}`) < 0) {
        collegeIds.push(`${collegeId}`);
      }
    });

    const collegeName = await college.find({ _id: collegeIds });

    res.status(200).json({
      status: "success",
      results: collegeData.length,
      data: {
        data: collegeName,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateCollegeAvatar(req, res, next) {
  try {
    const collegeId = req.params.id;
    const file = req.body.image;
    const college_PATH = "media/college";
    const type = file && file.split(";")[0].split("/")[1];
    const random = new Date().getTime();
    const fileName = `${collegeId}-${random}.${type}`;
    const filePath = `${college_PATH}/${fileName}`;
    const collegeDetails = await college.findById(collegeId);
    if (!collegeDetails) {
      return next(new Error("College not found"));
    }

    // Upload file
    uploadBase64File(file, filePath, async (err, mediaPath) => {
      if (err) {
        return callback(err);
      }
      college
        .updateOne(
          { _id: collegeId }, // Filter
          { image: mediaPath, imageUrl: getPublicImagUrl(mediaPath) } // Update
        )
        .then((obj) => {
          res.status(200).json({
            status: "College Image updated successfully",
            data: {
              collegeDetails,
            },
          });
        })
        .catch((err) => {
          console.log("Error: " + err);
        });
    });
  } catch (err) {
    next(err);
  }
}

export async function getCollegeLists(req, res, next) {
  try {
    const data = req.query;

    const doc = await college.find({ createdBy: { $eq: data.userId } });
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  } catch (error) {
    next(error);
  }
}

export const getCollege = getOne(college);
export const updateCollege = updateOne(college);
export const deleteCollege = deleteOne(college);
