import Announcement from "../models/announcementModel.js";
import groupMembers from "../models/groupMembersModel.js";
import collegeGroupMembers from "../models/collegeGroupMembersModel.js";
import User from "../models/userModel.js";
import sendNotificationAll from "../utils/notificationAll.js";

import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "./baseController.js";
import { awsAccessKeyId } from "../config.js";

export async function createAnnouncement(req, res, next) {
  try {
    const data = req.body;
    const createAnnouncement = await Announcement.create(data);
    res.status(201).json({
      message: "Announcement Created Successfully",
      data: {
        createAnnouncement,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getAnnouncement(req, res, next) {
  try {
    const data = req.query;
    const announcementList = await Announcement.find(
      data?.schoolId
        ? { $or: [{ schoolId: data?.schoolId }, { userRole: "appAdmin" }] }
        : { $or: [{ collegeId: data?.collegeId }, { userRole: "appAdmin" }] }
    );
    res.status(200).json({
      message: "List Of Announcement",
      data: {
        announcementList,
      },
    });
  } catch (err) {
    next(err);
  }
}
export async function editAnnouncement(req, res, next) {
  try {
    const data = req.query;
    const editAnnouncement = await Announcement.findByIdAndUpdate(
      data.announcementId,
      { title: data.title, announcement: data.announcement }
    );
    res.status(201).json({
      message: "Announcement updated Successfully",
      data: {
        editAnnouncement,
      },
    });
  } catch (err) {
    next(err);
  }
}
export const getOneAnnouncement = getOne(Announcement);
export const updateAnnouncement = updateOne(Announcement);
export const deleteAnnouncement = deleteOne(Announcement);

export async function allUserSms(req, res, next) {
  try {
    const data = req.body;
    const collegeId = data?.collegeId;
    const schoolId = data?.schoolId;
    const message = `You Have Announcement From Your ${
      data?.schoolId ? "School" : "College"
    }`;

    const allUsers = data?.schoolId
      ? await groupMembers
          .find({ schoolId: schoolId, status: "approved" })
          .populate("userId")
      : await collegeGroupMembers
          .find({ collegeId: collegeId, status: "approved" })
          .populate("userId");
    const users = [];
    allUsers.forEach((res, i) => {
      const userId = res.userId.fcmToken;
      users.push(userId)
      if(allUsers.length==users.length){
        sendNotificationAll(users, message);

      }
      })

    // sendSms ("message",users)

    res.status(200).json({
      status: "success",
      message: `Notification Send To All Alumni In ${
        data?.schoolId ? "School" : "College"
      }`,
    });
  } catch (err) {
    next(err);
  }
}

export async function individualUserSms(req, res, next) {
  try {
    const data = req.body;
    const userId = data.userId;
    const userlen = userId.length;
    const users = [];

    const message = `You Have Announcement From Your ${
      data?.schoolId ? "School" : "College"
    }`;

    userId.map(async (res, i) => {
      const userDetail = await User.findOne({ _id: res });
      if (users.indexOf(userDetail.fcmToken) < 0) {
        users.push(userDetail.fcmToken);
        if (i + 1 === userlen) {
          sendNotificationAll(users, message);
        }
      }
    });
    // sendSms ("message",users)

    res.status(200).json({
      status: "success",
      message: "Notification Send To Selected Alumni Members",
    });
  } catch (err) {
    next(err);
  }
}

export async function sendSmsToSelectedGroup(req, res, next) {
  try {
    const data = req.body;
    // const schoolId=data?.schoolId
    // const collegeId=data?.collegeId
    const groupId = data.groupId;
    const groupLen = groupId.length;

    const message = `You Have Announcement From Your ${
      data?.schoolId ? "School" : "College"
    }`;
    let studentCount = 0;
    let usersId = [];

    {
      data?.schoolId
        ? groupId.forEach(async (list, i) => {
            const group = await groupMembers
              .find({ groupId: list, status: "approved" })
              .populate("userId");
            studentCount = studentCount + group.length;
            group.forEach((res, n) => {
              // if (usersId.indexOf(`${res.userId.fcmToken}`) < 0) {
              usersId.push(res.userId.fcmToken);
              // }
              if (studentCount === usersId.length && groupLen === i + 1) {
                sendNotificationAll(usersId, message);
              }
            });
          })
        : groupId.forEach(async (list, i) => {
            const group = await collegeGroupMembers
              .find({ collegeGroupId: list, status: "approved" })
              .populate("userId");
            studentCount = studentCount + group.length;
            group.forEach((res, n) => {
              // if (usersId.indexOf(`${res.userId.fcmToken}`) < 0) {
              usersId.push(res.userId.fcmToken);
              // }
              if (studentCount === usersId.length && groupLen === i + 1) {
                sendNotificationAll(usersId, message);
              }
            });
          });
    }

    res.status(200).json({
      status: "success",
      message: "Notification Send To Selected Batches",
    });
  } catch (err) {
    next(err);
  }
}

export async function appAdminAnnouncementList(req, res, next) {
  try {
    const announcementList = await Announcement.find({ userRole: "appAdmin" });

    res.status(200).json({
      status: "success",
      message: "Notification Send To Selected Alumni Members",
      data: {
        announcementList,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function allAlumniNotification(req, res, next) {
  try {
    const data = req.body;
    const allUsers = await User.find({ fcmToken: { $exists: true } });
    const users = [];
    const message="You Have Notification From Alumni App Admin"

    allUsers.map(async (res, i) => {
     users.push(res.fcmToken)
     if(allUsers.length==users.length){
      sendNotificationAll(users, message);

     }
    });
    // sendSms ("message",users)

    res.status(200).json({
      status: "success",
      message: "Notification Send To Selected Alumni Members",
    });
  } catch (err) {
    next(err);
  }
}
