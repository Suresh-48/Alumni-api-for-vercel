import collegeLookingForJob from "../models/collegeLookingForJobModel.js";

// Base Controller
import { getAll, getOne, updateOne, deleteOne, createOne } from "./baseController.js";

export async function createLookingForJob(req, res, next) {
  try {
    const data = req.body;
    const exist = await collegeLookingForJob.find({
      name: data.name,
      jobtitle: data.jobtitle,
      experience: data.experience,
      phone: data.phone,
      collegeId: data.collegeId,
    });
    if (exist.length == 0) {
      const event = await collegeLookingForJob.create(data);
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
export async function getJobFromCollege(req, res, next) {
  try {
    const collegeId = req.query.collegeId;
    const job = await collegeLookingForJob.find({
      collegeId: collegeId,
    });
    res.status(200).json({
      status: "success",
      job,
    });
  } catch (err) {
    next(err);
  }
}

export const getAllLookingForJobs = getAll(collegeLookingForJob);
export const getLookingForJob = getOne(collegeLookingForJob);
export const updateLookingForJob = updateOne(collegeLookingForJob);
export const deleteLookingForJob = deleteOne(collegeLookingForJob);
