import collegeFund from "../models/collegeFundModel.js";

// Base Controller
import { getAll, getOne, updateOne, deleteOne } from "./baseController.js";

export async function createSchoolFund(req, res, next) {
  try {
    const data = req.body;
    const exist = await collegeFund.find({
      name: data.name,
      collegeId: data.collegeId,
      phone: data.phone,
      need: data.need,
      dueDate: data.dueDate,
    });
    if (exist.length == 0) {
      const fund = await collegeFund.create(data);
      res.status(201).json({
        status: "success",
        message: "CollegeFund created successfully",
        data: {
          fund,
        },
      });
    } else {
      res.status(201).json({
        status: "success",
        message: "CollegeFund Already Exist",
      });
    }
  } catch (err) {
    next(err);
  }
}
export async function getSchoolFundFromCollege(req, res, next) {
  try {
    const collegeId = req.query.collegeId;
    const fund = await collegeFund.find({
      collegeId: collegeId,
    });
    res.status(200).json({
      status: "success",
      fund,
    });
  } catch (err) {
    next(err);
  }
}

export const getAllSchoolFunds = getAll(collegeFund);
export const getSchoolFund = getOne(collegeFund);
export const updateSchoolFund = updateOne(collegeFund);
export const deleteSchoolFund = deleteOne(collegeFund);
