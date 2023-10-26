import collegeEvent from "../models/collegeEventModel.js";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import collegeGroupMembers from "../models/collegeGroupMembersModel.js";
import { getPublicImagUrl, uploadBase64File } from "../utils/s3.js";

import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "./baseController.js";
import sendNotificationAll from "../utils/notificationAll.js";
//Delete Event based On Id
export async function deleteMe(req, res, next) {
  try {
    await collegeEvent.findByIdAndUpdate(req.user.id, {
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
// Create a Event
export async function createCollegeEvent(req, res, next) {
  try {
    const data = req.body;
    const exist = await collegeEvent.find({
      title: data.title,
      date: data.date,
      collegeId: data.collegelId,
      collegeGroupId: data.collegeGroupId,
    });
    if (exist.length == 0) {
      const event = await collegeEvent.create(data);
      res.status(201).json({
        status: "success",
        message: "Event created successfully",
        data: {
          event,
        },
      });
    } else {
      res.status(201).json({
        status: "success",
        message: "Event Already Exist",
      });
    }
  } catch (err) {
    next(err);
  }
}

export const getAllCollegeEvents = getAll(collegeEvent);
export const getCollegeEvent = getOne(collegeEvent);
export async function getCollegeEventLists(req, res, next) {
  try {
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

export async function collegePastEvents(req, res, next) {
  try {
    //pass group id
    const id = req.query.collegeGroupId;
    const dateFormat = "DD-MM-YYYY";
    let d = new Date();
    const doc = await collegeEvent
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "co1",
            foreignField: "_id",
            as: "User",
          },
        },
      ])
      .match({
        $and: [
          {
            collegeGroupId: mongoose.Types.ObjectId(id),
          },
          {
            date: { $lt: d },
          },
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
  } catch (error) {
    next(error);
  }
}
export async function collegeUpcomingEvents(req, res, next) {
  try {
    const id = req.query.collegeGroupId;
    const dateFormat = "DD-MM-YYYY";
    let d = new Date();
    // const date = moment(d).format(dateFormat);
    const doc = await collegeEvent
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "co1",
            foreignField: "_id",
            as: "User",
          },
        },
      ])
      .match({
        $and: [
          {
            collegeGroupId: mongoose.Types.ObjectId(id),
          },
          {
            date: { $gte: d },
          },
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
  } catch (error) {
    next(error);
  }
}

export const updateCOllegeEvent = updateOne(collegeEvent);
export const deleteCollegeEvent = deleteOne(collegeEvent);

//Create Event Based On School
export async function createEventBasedOnCollege(req, res, next) {
  try {
    const data = req.body;
    const event = await collegeEvent.create(data);
    res.status(201).json({
      status: "success",
      message: "Event created successfully",
      data: {
        event,
      },
    });
  } catch (err) {
    next(err);
  }
}
//pastEvents based on School Id
export async function pastEventsBasedOnCollege(req, res, next) {
  try {
    //pass schoolId id
    const id = req.query.collegeId;
    const dateFormat = "DD-MM-YYYY";
    let d = new Date();
    const doc = await collegeEvent
      .aggregate([
        // {
        //   $lookup: {
        //     from: "users",
        //     localField: "co1",
        //     foreignField: "_id",
        //     as: "User",
        //   },
        // },
      ])
      .match({
        $and: [
          {
            collegeId: mongoose.Types.ObjectId(id),
          },
          {
            date: { $lt: d },
          },
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
  } catch (error) {
    next(error);
  }
}

export async function upcomingEventsBasedOnCollege(req, res, next) {
  try {
    const id = req.query.collegeId;

    const dateFormat = "DD-MM-YYYY";
    let d = new Date();
    // const date = moment(d).format(dateFormat);
    const doc = await collegeEvent
      .aggregate([
        // {
        //   $lookup: {
        //     from: "users",
        //     localField: "co1",
        //     foreignField: "_id",
        //     as: "User",
        //   },
        // },
      ])
      .match({
        $and: [
          {
            collegeId: mongoose.Types.ObjectId(id),
          },
          {
            date: { $gte: d },
          },
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
  } catch (error) {
    next(error);
  }
}

export async function allUserSms(req, res, next) {
  try {
    const collegeId = req.query.collegeId;
    const eventTitle = req.query.eventTitle;
    const location = req.query.location;
    const dateTime = req.query.dateTime;

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
      results: users.length,
      data: {
        data: users,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function individualUserSms(req, res, next) {
  try {
    const userId = req.body.userId;
    const eventTitle = req.body.eventTitle;
    const location = req.body.location;
    const dateTime = req.body.dateTime;
    const message = `Dear Friends, Heartly invite you to join ${eventTitle} party to be held at ${location}. I hope you will arrive and made the occasion more memorable one.`;

    const users = [];
    userId.forEach(async (res, i) => {
      const user = await User.findById({ _id: res });
      users.push(user.fcmToken);
      if (users.length == userId.length) {
        sendNotificationAll(users, message);
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

export async function sendSmsToSelectedGroup(req, res, next) {
  try {
    const eventTitle = req.body.eventTitle;
    const location = req.body.location;
    const dateTime = req.body.dateTime;
    const collegeGroupId = req.body.collegeGroupId;
    const groupLen = collegeGroupId.length;
    const userData = [];
    let studentCount = 0;
    let usersId = [];
    const message = `Dear Friends, Heartly invite you to join ${eventTitle} party to be held at ${location}. I hope you will arrive and made the occasion more memorable one.`;

    collegeGroupId.forEach(async (res, i) => {
      const group = await collegeGroupMembers
        .find({
          collegeGroupId: res,
          status: "approved",
        })
        .populate("userId");
      studentCount = studentCount + group.length;

      group.forEach((res, n) => {
        usersId.push(res.userId.fcmToken);
        if (studentCount === usersId.length && groupLen === i + 1) {
          sendNotificationAll(usersId, message);
        }
      });
    });
    res.status(200).json({
      status: "success",
      data: {
        eventTitle,
        location,
        dateTime,
        userData,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function upcomingEventImage(req, res, next) {
  try {
    const eventId = req.body.eventId;
    const file = req.body.image;
    const event_PATH = "media/upcomingEventImage";
    const type = file && file.split(";")[0].split("/")[1];
    const random = new Date().getTime();
    const fileName = `${eventId}-${random}.${type}`;
    const filePath = `${event_PATH}/${fileName}`;
    const eventDetails = await collegeEvent.findById(eventId);
    if (!eventDetails) {
      return next(new Error("Event not found"));
    }

    uploadBase64File(file, filePath, async (err, mediaPath) => {
      if (err) {
        return console.log(`err`, err);
      }

      collegeEvent
        .updateOne(
          { _id: eventId }, // Filter
          { eventImage: mediaPath, eventImageUrl: getPublicImagUrl(mediaPath) } // Update
        )
        .then((obj) => {
          res.status(201).json({
            status: "Event Image updated successfully",
            data: {
              eventDetails,
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
