import mongoose from "mongoose";
import { getAll, getOne, updateOne, deleteOne, createOne } from "./baseController.js";
import User from "../models/userModel.js";
import collegeGroupMembers from "../models/collegeGroupMembersModel.js";
import collegeGroup from "../models/collegeGroupModel.js";
import { getPublicImagUrl, uploadBase64File } from "../utils/s3.js";
import sendNotificationAll from "../utils/notificationAll.js";

export async function deleteMe(req, res, next) {
  try {
    await collegeGroup.findByIdAndUpdate(req.user.id, {
      active: false,
    });
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
}
//Create Groups
export async function createGroup12(req, res, next) {
  try {
    const name = req.body.name;
    const createdBy = req.body.createdBy;
    const collegeId = req.body.collegeId;
    const degree = req.body.degree;
    const year = req.body.year;
    const dept = req.body.dept;
    const group1 = await collegeGroup.find(
      { collegeId: collegeId, degree: degree, year: year, dept: dept}
      //If suppose we added School Find School Id and Group name
      //,{schoolId:schoolId}
    );
    if (group1.length == 0) {
      const group2 = await collegeGroup.find(
        { collegeId: collegeId, degree: degree, createdBy: createdBy }
        //If suppose we added School Find School Id and Group name
        //,{schoolId:schoolId}
      );
      if (group2.length == 0) {
        const group = await collegeGroup.create({
          name: name,
          createdBy: createdBy,
          collegeId: collegeId,
          degree: degree,
          year: year,
          dept: dept,
        });
        const groupId = group.id;
        const adminJoin = await collegeGroupMembers.create({
          userId: createdBy,
          collegeGroupId: groupId,
          collegeId: collegeId,
          status: "approved",
          degree: degree,
          year: year,
          dept: dept,
        });
        res.status(201).json({
          status: "success",
          message: "Group created successfully",
          data: {
            group,
            adminJoin,
          },
        });
      }else{
        res.status(200).json({
          message: "Group Name Already Exist",
          data: {
            group1,
          },
        });
      }
    
    } else {
      res.status(200).json({
        message: "Group Name Already Exist",
        data: {
          group1,
        },
      });
    }
  } catch (err) {
    next(err);
  }
}

export const getAllCollegeGroups = getAll(collegeGroup);
export const getCollegeGroup = getOne(collegeGroup);
export const createCollegeGroup = createOne(collegeGroup);

//Get Group Lists
export async function getCollegeGroupLists(req, res, next) {
  try {
    const userId = req.query.userId;

    const collegeGroupData = await collegeGroup.find({ createdBy: userId });

    const collegeIds = [];
    collegeGroupData.forEach((res, i) => {
      collegeIds.push(res._id);
    });

    const collegeGroupMembersData = await collegeGroupMembers.find({ collegeGroupId: { $in: collegeIds } });

    const pendingCollegeIds = [];
    collegeGroupMembersData.forEach((res) => {
      if (res.status === "pending") {
        pendingCollegeIds.push(res.collegeGroupId);
      }
    });

    const data = await collegeGroup.find({ _id: { $in: pendingCollegeIds } });

    // const doc = await collegeGroup
    //   .aggregate([
    //     {
    //       $lookup: {
    //         from: "users",
    //         localField: "userId",
    //         foreignField: "_id",
    //         as: "users",
    //       },
    //     },
    //   ])
    //   .match({
    //     $and: [
    //       {
    //         createdBy: mongoose.Types.ObjectId(id),
    //       },
    //     ],
    //   })
    //   .allowDiskUse(true);

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export const updateCollegeGroup = updateOne(collegeGroup);
export const deleteCollegeGroup = deleteOne(collegeGroup);

//Get User Group
export async function ListCollegeGroupsFromUser(req, res, next) {
  try {
    //user Id
    const userId = req.query.userId;
    const collegeId = req.query.collegeId;

    const doc = await collegeGroupMembers
      .aggregate([
        {
          $lookup: {
            from: "collegegroups",
            localField: "collegeGroupId",
            foreignField: "_id",
            as: "collegeGroup",
          },
        },
      ])
      .match({
        $and: [
          {
            userId: mongoose.Types.ObjectId(userId),
            collegeId: mongoose.Types.ObjectId(collegeId),
          },
          { status: "approved" },
        ],
      })
      .allowDiskUse(true);
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  } catch (err) {
    next(err);
  }
}
//list Groups From School
export async function ListcollegeGroupsFromCollege(req, res, next) {
  try {
    //schoolId
    const collegeId = req.query.collegeId;
    const collegeGroups = await collegeGroup.find({ collegeId: collegeId });
    res.status(200).json({
      status: "success",
      results: collegeGroups.length,
      data: {
        data: collegeGroups,
      },
    });
  } catch (err) {
    next(err);
  }
}
//Shows only user Joined Groups
export async function myGroups(req, res, next) {
  try {
    const id = req.query.userId;

    const userGroup = await collegeGroupMembers
      .find({
        userId: id,
        status: "approved",
      })
      .populate({ path: "collegeGroupId", select: "name" })
      .populate({ path: "collegeId", select: "name" });
    res.status(200).json({
      status: "success",
      results: userGroup.length,
      data: {
        data: userGroup,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updatecollegeGroupAvatar(req, res, next) {
  try {
    const collegeGroupId = req.params.id;
    const file = req.body.image;
    const collegeGROUP_PATH = "media/collegeGroups";
    const type = file && file.split(";")[0].split("/")[1];
    const fileName = `${collegeGroupId}.${type}`;
    const filePath = `${collegeGROUP_PATH}/${fileName}`;
    const collegeGroupDetails = await Group.findById(collegeGroupId);
    if (!collegeGroupDetails) {
      return next(new Error("Group not found"));
    }

    // Upload file
    uploadBase64File(file, filePath, async (err, mediaPath) => {
      if (err) {
        return callback(err);
      }
      Group.updateOne(
        { _id: collegeGroupId }, // Filter
        { image: mediaPath, imageUrl: getPublicImagUrl(mediaPath) } // Update
      )
        .then((obj) => {
          res.status(200).json({
            status: "Group Image updated successfully",
            data: {
              collegeGroupDetails,
              imageUrl: getPublicImagUrl(mediaPath),
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

export async function collegeGroupAllSms(req, res, next) {
  try {
    const collegeGroupId = req.body.collegeGroupId;
    const eventTitle = req.body.eventTitle;
    const location = req.body.location;
    const dateTime = req.body.dateTime;

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
            collegeGroupId: mongoose.Types.ObjectId(collegeGroupId),
          },
          { status: "approved" },
        ],
      })
      .allowDiskUse(true);

    const users = [];
    doc.forEach((res, i) => {
      const userId = res.Users[0].fcmToken;
      if (users.indexOf(`${userId}`) < 0) {
        users.push(`${userId}`);
      }
    });
    // sendSms ("message",users)
    const message = `Dear Friends, Heartly invite you to join ${eventTitle} party to be held at ${location}. I hope you will arrive and made the occasion more memorable one.`;
    sendNotificationAll(users, message);
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    next(error);
  }
}

export async function collegeGroupIndividualUserSms(req, res, next) {
  try {
    const userId = req.body.userId;
    const eventTitle = req.body.eventTitle;
    const location = req.body.location;
    const dateTime = req.body.dateTime;

    const users = [];
    userId.forEach(async (res, i) => {
      const userId = res;
      const phone = await User.findById({ _id: userId });
      if (users.indexOf(phone.phone) < 0) {
        users.push(phone.phone);
      }
    });
    const message = `Dear Friends, Heartly invite you to join ${eventTitle} party to be held at ${location}. I hope you will arrive and made the occasion more memorable one.`;
    sendNotificationAll(users, message);

    res.status(200).json({
      status: "success",
      users,
    });
  } catch (err) {
    next(err);
  }
}
