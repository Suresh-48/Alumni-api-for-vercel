import schoolFund from "../models/schoolFundModel.js";

// Base Controller
import { getAll, getOne, updateOne, deleteOne } from "./baseController.js";

export async function createSchoolFund(req, res, next) {
  try {
    const data = req.body;
    const exist = await schoolFund.find({
      name: data.name,
      schoolId: data.schoolId,
      phone: data.phone,
      need: data.need,
      dueDate: data.dueDate,
    });
    if (exist.length == 0) {
      const fund = await schoolFund.create(data);
      res.status(201).json({
        status: "success",
        message: "SchoolFund created successfully",
        data: {
          fund,
        },
      });
    } else {
      res.status(201).json({
        status: "success",
        message: "SchoolFund created successfully",
      });
    }
  } catch (err) {
    next(err);
  }
}
export async function getSchoolFundFromSchool(req, res, next) {
  try {
    const schoolId = req.query.schoolId;
    const fund = await schoolFund.find({
      schoolId: schoolId,
    });
    res.status(200).json({
      status: "success",
      fund,
    });
  } catch (err) {
    next(err);
  }
}

export const getAllSchoolFunds = getAll(schoolFund);
export const getSchoolFund = getOne(schoolFund);
export const updateSchoolFund = updateOne(schoolFund);
export const deleteSchoolFund = deleteOne(schoolFund);
