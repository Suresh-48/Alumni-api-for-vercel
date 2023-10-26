import BrainTeaser from "../models/brainTeaserModel.js";

// Base Controller
import { getAll, getOne, updateOne, deleteOne, createOne } from "./baseController.js";

export const getAllBrainTeaser = getAll(BrainTeaser);
export const getBrainTeaser = getOne(BrainTeaser);
export const updateBrainTeaser = updateOne(BrainTeaser);
export const deleteBrainTeaser = deleteOne(BrainTeaser);

export async function createBrainTeaser(req, res, next) {
  try {
    const data = req.body;
    const exist = await BrainTeaser.find({
      userId: data.userId,
      category: data.category,
      level: data.level,
    });

    if (exist.length === 0) {
      const createUserResult = await BrainTeaser.create(data);
      res.status(201).json({
        message: "User Quiz Result Created",
        createUserResult,
      });
    } else {
      const updateResult = await BrainTeaser.findByIdAndUpdate(
        { _id: exist[0]._id },
        { scored: data.scored, status: data.status }
      );
      res.status(201).json({
        message: "User Quiz Result Updated",
        updateResult,
      });
    }
  } catch (err) {
    next(err);
    console.log("err", err);
  }
}

export async function getUserLevel(req, res, next) {
  try {
    const data = req.query;

    const getUserLevel = await BrainTeaser.find({
      userId: data.userId,
      category: data.category,
      status: "completed",
    }).countDocuments();

    res.status(201).json({
      message: "User Quiz Level",
      userLevel: getUserLevel,
    });
  } catch (err) {
    next(err);
    console.log("err", err);
  }
}
