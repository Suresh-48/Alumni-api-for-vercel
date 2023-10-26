import knowledgeSharing from "../models/knowledgeSharingModel.js";
import { getPublicImagUrl, uploadBase64File } from "../utils/s3.js";

// Base Controller
import { getAll, getOne, updateOne, deleteOne, createOne } from "./baseController.js";

export async function createKnowledgeSharing(req, res, next) {
  try {
    const data = req.body;
    const date = Date.now();
    const exist = await knowledgeSharing.find({
      title: data.title,
      description: data.description,
      userId: data.userId,
    });
    if (exist.length == 0) {
      const knowledge = await knowledgeSharing.create({
        title: data.title,
        description: data.description,
        category: data.category,
        userId: data.userId,
        count: data.count,
        commentCount: data.commentCount,
        postImageUrl: data.postImageUrl,
        createdOn: date,
      });
      res.status(201).json({
        status: "success",
        message: "knowledge sharing created successfully",
        data: {
          knowledge,
        },
      });
    } else {
      res.status(201).json({
        status: "success",
        message: "knowledge sharing Already Exist",
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function getAllKowledgeSharing(req, res, next) {
  try {
    const category = req.query.category;

    const asscendingBy = {
      createdOn: -1,
    }
    const data = await knowledgeSharing
      .find({ category: category })
      .populate({ path: "userId", select: ["firstName", "lastName", "avatarUrl"] }).sort(asscendingBy);
    res.status(200).json({
      status: "success",
      message: "Data Get Sucessfully",
      data: {
        data: data,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function createImagePost(req, res, next) {
  const data=req.body
  const title = req.body.title;
  const category = req.body.category;
  const description = req.body.description;
  const userId = req.body.userId;
  const file = req.body.postImage;
  const USER_PATH = "media/postImage";
  const type = file && file.split(";")[0].split("/")[1];
  const random = new Date().getTime();
  const fileName = `${userId}-${random}.${type}`;
  const filePath = `${USER_PATH}/${fileName}`;
  const date = Date.now();

   const exist = await knowledgeSharing.find({
     title:title,
     description:description,
     category:category,
     userId:userId,
   });

  if (!exist) {
    return next(new Error("Post not found"));
  }
if(file===null){
  const knowledge = await knowledgeSharing.create({
      title: title,
      description: description,
      category: category,
      userId: userId,
      postImageUrl:file,
      createdOn: date,
    })
    .then((obj) => {
      res.status(200).json({
        status: "Posted successfully",
        data: {
          // knowledge,
        },
      });
    })
    .catch((err) => {
      console.log("Error: " + err);
    });
}else{
  uploadBase64File(file, filePath, (err, mediaPath) => {
    if (err) {
      return callback(err);
    }
    knowledgeSharing
      .create({
        title: title,
        description: description,
        category: category,
        userId: userId,
        postImageUrl: getPublicImagUrl(mediaPath),
        createdOn: date,
      })
      .then((obj) => {
        res.status(200).json({
          status: "Posted successfully",
          data: {
            exist,
          },
        });
      })
      .catch((err) => {
        console.log("Error: " + err);
      });
  });
}
}

export async function deletePostImage(req, res, next) {
  try {
    const postId = req.params.id;
    const data = knowledgeSharing.findByIdAndDelete(
      { _id: postId }, // Filter
      { postImageUrl: null, postImage: null } // Update
    ).then((obj) => {
      res.status(200).json({
        status: "Post Deleted  successfully",
        data: {
          data,
        },
      });
    });
  } catch (error) {
    next(error);
  }
}

export const getKowledgeSharing = getOne(knowledgeSharing);
export const updateKowledgeSharing = updateOne(knowledgeSharing);
export const deleteKowledgeSharing = deleteOne(knowledgeSharing);
