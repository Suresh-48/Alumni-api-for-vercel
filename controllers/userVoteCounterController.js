import userVoteCounter from "../models/userVoteCounterModel.js";

// Base Controller
import { getAll, getOne, updateOne, deleteOne } from "./baseController.js";
export async function getPopularAlumni(req, res, next) {
  try {
    const schoolId = req.query.schoolId;

    const votesBySchool = await userVoteCounter
      .find({
        schoolId: schoolId,
      })
      .sort({ votes: -1 })
      .populate("userId")
      .limit(10);
    res.status(200).json({
      status: "success",
      results: votesBySchool.length,
      data: {
        votesBySchool,
      },
    });
  } catch (err) {
    next(err);
  }
}
export const getAllUserVoteCounters = getAll(userVoteCounter);
export const getUserVoteCounter = getOne(userVoteCounter);
export const updateUserVoteCounter = updateOne(userVoteCounter);
export const deleteUserVoteCounter = deleteOne(userVoteCounter);
