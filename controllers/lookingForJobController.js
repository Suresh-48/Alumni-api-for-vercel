import lookingForJob from "../models/lookingforjobModel.js";

// Base Controller
import { getAll, getOne, updateOne, deleteOne, createOne } from "./baseController.js";

export async function createLookingForJob(req, res, next) {
  try {
    const data = req.body;
    const exist = await lookingForJob.find({
      name: data.name,
      jobtitle: data.jobtitle,
      experience: data.experience,
      phone: data.phone,
      schoolId: data.schoolId,
    });
    if (exist.length == 0) {
      const event = await lookingForJob.create(data);
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
export async function getJobFromSchool(req, res, next) {
  try {
    const schoolId = req.query.schoolId;
    const job = await lookingForJob.find({
      schoolId: schoolId,
    });
    res.status(200).json({
      status: "success",
      job,
    });
  } catch (err) {
    next(err);
  }
}

export const getAllLookingForJobs = getAll(lookingForJob);
export const getLookingForJob = getOne(lookingForJob);
export const updateLookingForJob = updateOne(lookingForJob);
export const deleteLookingForJob = deleteOne(lookingForJob);
