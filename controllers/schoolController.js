import School from "../models/schoolModel.js";
import User from "../models/userModel.js";
import groupMembers from "../models/groupMembersModel.js";
import mongoose from "mongoose";
import fs from "fs";
import csv from "csvtojson";
import { getAll, getOne, updateOne, deleteOne } from "./baseController.js";
import { getPublicImagUrl, uploadBase64File } from "../utils/s3.js";
import nodemailer from "nodemailer";
import { EMAIL, PASSWORD } from "../config.js";

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
});

export async function createSchoolRequest(req, res, next) {
  try {
    const data = req.body;

    const exist = await School.find({ name: req.body.name, address1: req.body.address1 });

    if (exist.length == 0) {
      const Schools = await School.create(data);
      if (Schools) {
        res.status(201).json({
          status: "success",
          message: "School created successfully",
          data: {
            Schools,
          },
        });
      }
      // to :usermail
      // const htmlcontent = `<p>This college is not in our database please approve for adding new alumni
      //   college.</p><br>
      //         <p> Requesting College Name : <b><font size="3"> ${Schools.name}<b></p><br>

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
      //   subject: "Alumni Request For New School",
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
        message: "School Already Exist",
        data: {
          exist,
        },
      });
    }
  } catch (err) {
    next(err);
  }
}
export async function pendingSchoolRequest(req, res, next) {
  try {
    const pendingSchools = await School.find({ status: "pending" });
    res.status(200).json({
      status: "success",
      results: pendingSchools.length,
      data: {
        data: pendingSchools,
      },
    });
  } catch (err) {
    next(err);
  }
}
export async function acceptSchoolRequest(req, res, next) {
  try {
    const schoolId = req.body.schoolId;
    const schoolData = await School.updateOne({ _id: schoolId }, { status: "approved" });
    const school = await School.findOne({ _id: schoolId });

    res.status(200).json({
      status: "success",
      message: "School Added Successfully",
      data: school,
    });
  } catch (err) {
    next(err);
  }
}

export async function getAllSchools(req, res, next) {
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
          const data = await School.find(query).limit(limitValue).skip(skipValue).sort({ name: 1 });
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
          const data = await School.find(query).limit(limitValue).skip(skipValue).sort({ name: 1 });
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
        const data = await School.find({ status: "approved" }).limit(limitValue).skip(skipValue).sort({ name: 1 });

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
//export const getAllSchools = getAll(School);
export const getSchool = getOne(School);

export async function getLists(req, res, next) {
  try {
    const data = req.query;

    const doc = await School.find({ createdBy: { $eq: data.userId } });
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

export const updateSchool = updateOne(School);
export const deleteSchool = deleteOne(School);

//School
export async function ListUsersFromSchool(req, res, next) {
  try {
    //user Id
    const userId = req.query.userId;
    const schoolId = req.query.schoolId;
    const doc = await groupMembers
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
            schoolId: mongoose.Types.ObjectId(schoolId),
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

export async function ListSchoolsFromUser(req, res, next) {
  try {
    //user Id
    const userId = req.query.userId;
    const schoolId = req.query.schoolId;

    const schoolData = await groupMembers.find({
      status: "approved",
      userId: userId,
    });

    let schoolIds = [];
    schoolData.forEach((schoolDetails) => {
      const schoolId = schoolDetails.schoolId;
      if (schoolIds.indexOf(`${schoolId}`) < 0) {
        schoolIds.push(`${schoolId}`);
      }
    });

    const schoolName = await School.find({ _id: schoolIds });
    const updateDate = await User.findByIdAndUpdate(userId, { last_login_date: Date.now() }, function (err, docs) {});
    res.status(200).json({
      status: "success",
      results: schoolData.length,
      data: {
        data: schoolName,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateAvatar(req, res, next) {
  try {
    const schoolId = req.params.id;
    const file = req.body.image;
    const SCHOOL_PATH = "media/schools";
    const type = file && file.split(";")[0].split("/")[1];
    const random = new Date().getTime();
    const fileName = `${schoolId}-${random}.${type}`;
    const filePath = `${SCHOOL_PATH}/${fileName}`;
    const schoolDetails = await School.findById(schoolId);
    if (!schoolDetails) {
      return next(new Error("School not found"));
    }

    // Upload file
    uploadBase64File(file, filePath, async (err, mediaPath) => {
      if (err) {
        return callback(err);
      }
      School.updateOne(
        { _id: schoolId }, // Filter
        { image: mediaPath, imageUrl: getPublicImagUrl(mediaPath) } // Update
      )
        .then((obj) => {
          res.status(200).json({
            status: "School Image updated successfully",
            data: {
              schoolDetails,
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

export async function addSchool(req, res, next) {
  try {
    importCsvData2MongoDB(req.file.path);
    function importCsvData2MongoDB(filePath) {
      csv()
        .fromFile(filePath)
        .then((schoolList) => {
          schoolList.forEach(async (data) => {
            const datas = await School.find({ name: data.name, pincode: data.pincode });
            const listLength = datas.length;
            {
              listLength === 0 ? await School.create(data) : null;
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
