import Group from "../models/groupModel.js";
import mongoose from "mongoose";
import { getAll, getOne, updateOne, deleteOne, createOne } from "./baseController.js";
import User from "../models/userModel.js";
import groupMembers from "../models/groupMembersModel.js";
import group from "../models/groupModel.js";
import { getPublicImagUrl, uploadBase64File } from "../utils/s3.js";
import sendNotificationAll from "../utils/notificationAll.js";
export async function deleteMe(req, res, next) {
  try {
    await Group.findByIdAndUpdate(req.user.id, {
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
    const schoolId = req.body.schoolId;
    const standard = req.body.standard;
    const year = req.body.year;
    const section = req.body.section;


    const group1 = await Group.find(
      {
        schoolId: schoolId, standard: standard, year: year, section: section,
      }
      //If suppose we added School Find School Id and Group name
      //,{schoolId:schoolId}
    );
    if (group1.length == 0) {

      const group2 = await Group.find(
        { schoolId: schoolId, standard: standard, createdBy: createdBy });
      if (group2.length == 0) {
        const group = await Group.create({
          name: name,
          createdBy: createdBy,
          schoolId: schoolId,
          standard: standard,
          year: year,
          section: section,

        });
        const groupId = group.id;
        const adminJoin = await groupMembers.create({
          userId: createdBy,
          groupId: groupId,
          schoolId: schoolId,
          status: "approved",
          standard: standard,
          year: year,
          section: section,
        });
        res.status(201).json({
          status: "success",
          message: "Group created successfully",
          data: {
            group,
            adminJoin,
          },
        });
      } else {
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

export const getAllGroups = getAll(Group);
export const getGroup = getOne(Group);
export const createGroup = createOne(Group);
//Get Group Lists
export async function getLists(req, res, next) {
  try {
    const userId = req.query.userId;

    const schoolGroup = await group.find({ createdBy: userId });

    const schoolIds = [];
    schoolGroup.forEach((res, i) => {
      schoolIds.push(res._id);
    });

    const schoolGroupData = await groupMembers.find({ groupId: { $in: schoolIds } });

    const pendingSchoolIds = [];
    schoolGroupData.forEach((res) => {
      if (res.status === "pending") {
        pendingSchoolIds.push(res.groupId);
      }
    });

    const data = await group.find({ _id: { $in: pendingSchoolIds } });

    // const doc = await Group.aggregate([
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "userId",
    //       foreignField: "_id",
    //       as: "users",
    //     },
    //   },
    // ])
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

export const updateGroup = updateOne(Group);
export const deleteGroup = deleteOne(Group);

//Get User Group
export async function ListGroupsFromUser(req, res, next) {
  try {
    //user Id
    const userId = req.query.userId;
    const schoolId = req.query.schoolId;
    const doc = await groupMembers
      .aggregate([
        {
          $lookup: {
            from: "groups",
            localField: "groupId",
            foreignField: "_id",
            as: "Group",
          },
        },
      ])
      .match({
        $and: [
          {
            userId: mongoose.Types.ObjectId(userId),
            schoolId: mongoose.Types.ObjectId(schoolId),
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
export async function ListGroupsFromSchool(req, res, next) {
  try {
    //schoolId
    const schoolId = req.query.schoolId;
    const schoolGroups = await group.find({ schoolId: schoolId });
    res.status(200).json({
      status: "success",
      results: schoolGroups.length,
      data: {
        data: schoolGroups,
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

    const userGroup = await groupMembers
      .find({
        userId: id,
        status: "approved",
      })
      .populate({ path: "groupId", select: "name" })
      .populate({ path: "schoolId", select: "name" });
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

export async function updateAvatar(req, res, next) {
  try {
    const groupId = req.params.id;
    const file = req.body.image;
    const GROUP_PATH = "media/groups";
    const type = file && file.split(";")[0].split("/")[1];
    const fileName = `${groupId}.${type}`;
    const filePath = `${GROUP_PATH}/${fileName}`;
    const groupDetails = await Group.findById(groupId);
    if (!groupDetails) {
      return next(new Error("Group not found"));
    }

    // Upload file
    uploadBase64File(file, filePath, async (err, mediaPath) => {
      if (err) {
        return callback(err);
      }
      Group.updateOne(
        { _id: groupId }, // Filter
        { image: mediaPath, imageUrl: getPublicImagUrl(mediaPath) } // Update
      )
        .then((obj) => {
          res.status(200).json({
            status: "Group Image updated successfully",
            data: {
              groupDetails,
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

export async function groupAllSms(req, res, next) {
  try {
    const groupId = req.body.groupId;
    const eventTitle = req.body.eventTitle;
    const location = req.body.location;
    const dateTime = req.body.dateTime;
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
            groupId: mongoose.Types.ObjectId(groupId),
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

export async function groupIndividualUserSms(req, res, next) {
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
    res.status(200).json({
      status: "success",
      users,
    });
  } catch (err) {
    next(err);
  }
}
