import lookingForEmployee from "../models/lookingForEmployee.js";

// Base Controller
import { getAll, getOne, updateOne, deleteOne, createOne } from "./baseController.js";

export async function createLookingForEmployee(req, res, next) {
  try {
    const data = req.body;
    const exist = await lookingForEmployee.find({
      name: data.name,
      jobtitle: data.jobtitle,
      experience: data.experience,
      phone: data.phone,
      schoolId: data.schoolId,
      email: data.email,
    });
    if (exist.length == 0) {
      const event = await lookingForEmployee.create(data);
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

export async function getEmployeeFromSchool(req, res, next) {
  try {
    const schoolId = req.query.schoolId;
    const employee = await lookingForEmployee.find({
      schoolId: schoolId,
    });
    res.status(200).json({
      status: "success",
      employee,
    });
  } catch (err) {
    next(err);
  }
}
export const getAllLookingForEmployees = getAll(lookingForEmployee);
export const getLookingForEmployee = getOne(lookingForEmployee);
export const updateLookingForEmployee = updateOne(lookingForEmployee);
export const deleteLookingForEmployee = deleteOne(lookingForEmployee);
