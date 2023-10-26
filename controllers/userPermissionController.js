import UserPermission from "../models/UserPermissionModel.js";
import User from "../models/userModel.js";
import sendNotificationAll from "../utils/notificationAll.js";
// Base Controller
import { getAll, getOne, updateOne, deleteOne } from "./baseController.js";
import sendSms from "../utils/sms.js";

export async function createUserPermissions(req, res, next) {
  try {
    //user Id>

    const userId = req.body.userId;
    const requestedUserId = req.body.requestedUserId;
    const checkDuplicate = await UserPermission.find({
      userId: userId,
      requestedUserId: requestedUserId,
    });
    const userRequested = await User.findById({ _id: userId });
    const requestor = await User.findById({ _id: requestedUserId });
    const userRequestedName = userRequested.firstName;
    const requestorName = requestor.firstName + " " + requestor.lastName;
    const fcmToken = userRequested.fcmToken;
    const message = `Hi ${userRequestedName}, Your Batchmate ${requestorName} is Requested To View Your Profile`;
    sendNotificationAll(fcmToken, message);

    if (checkDuplicate == 0) {
      const permission = await UserPermission.create({
        userId: userId,
        requestedUserId: requestedUserId,
      });
      res.status(200).json({
        status: "success",
        results: permission.length,
        message: "Requested Successfully",
        data: {
          permission,
        },
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "Request Already Send Successfully",
        data: {
          checkDuplicate,
        },
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function getUserPermissions(req, res, next) {
  try {
    //user Id

    const userId = req.query.userId;
    const requestedUserId = req.query.requestedUserId;

    const permission = await UserPermission.find({
      userId: userId,
      requestedUserId: requestedUserId,
      status: "Accepted",
    });

    res.status(200).json({
      status: "success",
      result: permission.length,
      data: {
        permission,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getUserRequest(req, res, next) {
  try {
    const userId = req.query.userId;
    const requestedUserId = req.query.requestedUserId;

    const permission = await UserPermission.find({
      userId: userId,
      requestedUserId: requestedUserId,
      status: "Requested",
    });

    res.status(200).json({
      status: "success",
      result: permission.length,
      data: {
        permission,
      },
    });
  } catch (err) {
    next(err);
  }
}
export async function getUserPermissionsRequest(req, res, next) {
  try {
    //user Id
    const userId = req.query.userId;

    const permission = await UserPermission.find({
      userId: userId,
      status: "Requested",
    }).populate("requestedUserId");

    res.status(200).json({
      status: "success",
      result: permission.length,
      data: {
        permission,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function AcceptedMessage(req, res, next) {
  try {
    const requestorId = req.body.requestorId;
    const userId = req.body.userId;
    const requestor = await User.findById({ _id: requestorId });
    const user = await User.findById({ _id: userId });
    const userName = user.firstName + " " + user.lastName;
    const fcmToken = requestor.fcmToken;
    const requestorName = requestor.firstName;
    const message = `Hi ${requestorName}, Your Friend ${userName} Has Accepted Your Request To View His/Her Profile.`;
    sendNotificationAll(fcmToken, message);
    res.status(201).json({
      status: "success",
      message: " Request Send successfully",
      data: {
        message,
      },
    });
  } catch (err) {
    next(err);
  }
}

export const getAllUserPermissions = getAll(UserPermission);
export const getUserPermission = getOne(UserPermission);
export const updateUserPermission = updateOne(UserPermission);
export const deleteUserPermission = deleteOne(UserPermission);
