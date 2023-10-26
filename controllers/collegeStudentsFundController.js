import collegeStudentsFund from "../models/collegeStudentsFundModel.js";

// Base Controller
import { getAll, getOne, updateOne, deleteOne } from "./baseController.js";

export async function createScholarship(req, res, next) {
  try {
    const data = req.body;
    const exist = await collegeStudentsFund.find({
      purpose: data.purpose,
      collegeId: data.collegeId,
      amount: data.amount,
    });
    if (exist.length == 0) {
      const fund = await collegeStudentsFund.create(data);
      res.status(201).json({
        status: "success",
        message: "scholarship Created Successfully",
        data: {
          fund,
        },
      });
    } else {
      res.status(201).json({
        status: "success",
        message: "Scholarship Already Created",
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function getScholarshipFromcollege(req, res, next) {
  try {
    const collegeId = req.query.collegeId;
    const scholar = await collegeStudentsFund.find({
      collegeId: collegeId,
    });
    res.status(200).json({
      status: "success",
      scholar,
    });
  } catch (err) {
    next(err);
  }
}
export const getAllScholarships = getAll(collegeStudentsFund);
export const getScholarship = getOne(collegeStudentsFund);
export const updateScholarship = updateOne(collegeStudentsFund);
export const deleteScholarship = deleteOne(collegeStudentsFund);
