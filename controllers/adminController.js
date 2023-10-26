import Group from "../models/groupModel.js";
import collegeGroup from "../models/collegeGroupModel.js";
import School from "../models/schoolModel.js";
import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "./baseController.js";
import User from "../models/userModel.js";
import College from "../models/collegeModel.js";
import groupMembers from "../models/groupMembersModel.js";

export async function adminBatched(req, res, next) {
  try {
    const data = req.query;
    if (data.institute === "school") {
      const batches = await Group.find({ schoolId: data.instituteId });
      res.status(200).json({
        status: "success",
        message: "List Of Batches In School",
        batches,
      });
    } else {
      const batches = await collegeGroup.find({ collegeId: data.instituteId });
      res.status(200).json({
        status: "success",
        message: "List Of Batches In College",
        batches,
      });
    }
  } catch (err) {
    next(err);
  }
}
export async function schoolAdminRequestList(req, res, next) {
  try {
    const requestList = await User.find({
      schoolId: { $exists: true },
      adminStatus: "pending",
      role: "admin",
    }).populate("schoolId")
    res.status(200).json({
      status: "success",
      message: "School Admin Pending Request List",
      requestList,
    });
  } catch (err) {
    next(err);
  }
}
export async function collegeAdminRequestList(req, res, next) {
  try {
    const requestList = await User.find({
      collegeId: { $exists: true },
      adminStatus: "pending",
      role: "admin",
    }).populate("collegeId")
    res.status(200).json({
      status: "success",
      message: "College Admin Pending Request List",
      requestList,
    });
  } catch (err) {
    next(err);
  }
}
export async function acceptAdmin(req, res, next) {
  try {
    const data = req.body;
    const requestList = await User.findByIdAndUpdate(data.userId, {
      adminStatus: "approved",
    });
    res.status(200).json({
      status: "success",
      message: "Admin Pending Request List",
      requestList,
    });
  } catch (err) {
    next(err);
  }
}

export async function schoolPendingRequest(req, res, next) {
  try {
    const requestList = await School.find({ status: "pending" });
    res.status(200).json({
      status: "success",
      message: "Admin Pending Request List",
      requestList,
    });
  } catch (err) {
    next(err);
  }
}
export async function collegePendingRequest(req, res, next) {
  try {
    const requestList = await College.find({ status: "pending" });
    res.status(200).json({
      status: "success",
      message: "Admin Pending Request List",
      requestList,
    });
  } catch (err) {
    next(err);
  }
}

export async function acceptSchoolCollegeRequest(req, res, next) {
  try {
    const data = req.body;
    if (data.schoolId) {
      const accepet = await School.findByIdAndUpdate(data.schoolId, {
        status: "approved",
      });
      res.status(200).json({
        status: "success",
        message: "Admin Pending Request List",
        accepet,
      });
    } else {
      const accepet = await College.findByIdAndUpdate(data.collegeId, {
        status: "approved",
      });
      res.status(200).json({
        status: "success",
        message: "School Or College Accepted",
        accepet,
      });
    }
  } catch (err) {
    next(err);
  }
}
