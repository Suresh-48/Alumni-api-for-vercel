import scholarship from "../models/scholarshipModel.js";

// Base Controller
import { getAll, getOne, updateOne, deleteOne } from "./baseController.js";

export async function createScholarship(req, res, next) {
  try {
    const data = req.body;
    const exist = await scholarship.find({
      purpose: data.purpose,
      schoolId: data.schoolId,
      amount: data.amount,
    });
    if (exist.length == 0) {
      const fund = await scholarship.create(data);
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

export async function getScholarshipFromSchool(req, res, next) {
  try {
    const schoolId = req.query.schoolId;
    const scholar = await scholarship.find({
      schoolId: schoolId,
    });
    res.status(200).json({
      status: "success",
      scholar,
    });
  } catch (err) {
    next(err);
  }
}
export const getAllScholarships = getAll(scholarship);
export const getScholarship = getOne(scholarship);
export const updateScholarship = updateOne(scholarship);
export const deleteScholarship = deleteOne(scholarship);
