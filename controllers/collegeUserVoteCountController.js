import collegeUserVoteCounter from "../models/collegeUserVoteCounterModel.js";

// Base Controller
import { getAll, getOne, updateOne, deleteOne } from "./baseController.js";
export async function getPopularAlumni(req, res, next) {
  try {
    const collegeId = req.query.collegeId;
    const votesByCollege = await collegeUserVoteCounter
      .find({
        collegeId: collegeId,
      })
      .sort({ votes: -1 })
      .populate("userId")
      .limit(10);
    res.status(200).json({
      status: "success",
      results: votesByCollege.length,
      data: {
        votesByCollege,
      },
    });
  } catch (err) {
    next(err);
  }
}
export const getAllCollegeUserVoteCounters = getAll(collegeUserVoteCounter);
export const getCollegeUserVoteCounter = getOne(collegeUserVoteCounter);
export const updateCollegeUserVoteCounter = updateOne(collegeUserVoteCounter);
export const deleteCollegeUserVoteCounter = deleteOne(collegeUserVoteCounter);
