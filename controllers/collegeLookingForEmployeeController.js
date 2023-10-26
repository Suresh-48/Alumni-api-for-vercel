import collegeLookingForEmployee from "../models/collegeLookingForEmployeeModel.js";

// Base Controller
import { getAll, getOne, updateOne, deleteOne, createOne } from "./baseController.js";

export async function createLookingForEmployee(req, res, next) {
  try {
    const data = req.body;
    const exist = await collegeLookingForEmployee.find({
      name: data.name,
      jobtitle: data.jobtitle,
      experience: data.experience,
      phone: data.phone,
      collegeId: data.collegeId,
      email: data.email,
    });
    if (exist.length == 0) {
      const event = await collegeLookingForEmployee.create(data);
      res.status(201).json({
        status: "success",
        message: "Job Profile created successfully",
        data: {
          event,
        },
      });
    } else {
      res.status(201).json({
        status: "success",
        message: "Job Profile Already Exist",
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function getEmployeeFromCollege(req, res, next) {
  try {
    const collegeId = req.query.collegeId;
    const employee = await collegeLookingForEmployee.find({
      collegeId: collegeId,
    });
    res.status(200).json({
      status: "success",
      employee,
    });
  } catch (err) {
    next(err);
  }
}
export const getAllLookingForEmployees = getAll(collegeLookingForEmployee);
export const getLookingForEmployee = getOne(collegeLookingForEmployee);
export const updateLookingForEmployee = updateOne(collegeLookingForEmployee);
export const deleteLookingForEmployee = deleteOne(collegeLookingForEmployee);
