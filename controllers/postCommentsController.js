import postComments from "../models/postCommentsModel.js";
import knowledgeSharing from "../models/knowledgeSharingModel.js";
import mongoose from "mongoose";
// Base Controller
import { getAll, getOne, updateOne, deleteOne, createOne } from "./baseController.js";

export async function createPostComments(req, res, next) {
  try {
    const commentData = req.body;
    const Comments = await postComments.create(commentData);
    const postId= Comments.postId
    const data = await postComments.find({ postId: postId });
    const dataLength = data.length

    await knowledgeSharing.findByIdAndUpdate(postId, {
      $set: {
        commentCount:dataLength ,
      },
    });
  
    res.status(201).json({
      status: "success",
      message: "commented successfully",
      data: {
        Comments,
      },
    });
  } catch (err) {
    next(err);
  }
}
export async function getIndividualPostComments(req, res, next) {
  try {
    const id = req.query.postId;
    const doc = await postComments
      .find({
        postId: id,
      })
      .populate({ path: "userId", select: ["firstName", "lastName", "avatarUrl", "showProfile"] });
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
        totalComments: doc.length,
      },
    });
  } catch (error) {
    next(error);
  }
}

export const getPostComments = getOne(postComments);
export const getAllPostComments = getAll(postComments);
export const updatePostComments = updateOne(postComments);

export async function deletePostComments(req, res, next) {
  try {
    const commentId = req.query.commentId;
    const postId = req.query.postId;
    const commentDelete = await postComments.deleteOne({ _id: commentId });
    const data = await postComments.find({ postId: postId });
    const length = data.length;
    await knowledgeSharing.findByIdAndUpdate(postId, {
      $set: {
        commentCount: length,
      },
    });
    res.status(201).json({
      status: "success",
      message: "Deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
