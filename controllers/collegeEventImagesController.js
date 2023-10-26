import collegeEventImage from "../models/collegeEventImagesModel.js";
import { getAll, getOne, updateOne, deleteOne, createOne } from "./baseController.js";
import { getPublicImagUrl, uploadBase64File } from "../utils/s3.js";
//Past Event Images
export async function collegePastEventImage(req, res, next) {
  try {
    const collegeEventId = req.query.collegeEventId;
    const data = await collegeEventImage.find({ collegeEventId: collegeEventId });
    res.status(200).json({
      status: "success",
      message: "Event Images uploaded successfully",
      data: {
        data,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateCollegeEventImage(req, res, next) {
  const collegeEventId = req.params.id;
  const file = req.body.image;
  const USER_PATH = "media/CollegeEvents";
  const type = file && file.split(";")[0].split("/")[1];
  const random = new Date().getTime();
  const fileName = `${collegeEventId}-${random}.${type}`;
  const filePath = `${USER_PATH}/${fileName}`;

  const eventDetails = await collegeEvent.findById(collegeEventId);
  if (!eventDetails) {
    return next(new Error("Event not found"));
  }

  uploadBase64File(file, filePath, (err, mediaPath) => {
    if (err) {
      return callback(err);
    }
    eventImage
      .updateOne(
        { collegeEventId: collegeEventId }, // Filter
        { image: mediaPath, imageUrl: getPublicImagUrl(mediaPath) } // Update
      )
      .then((obj) => {
        res.status(200).json({
          status: "Event Image Uploaded successfully",
          data: {
            mediaPath,
          },
        });
      })
      .catch((err) => {
        console.log("Error: " + err);
      });
  });
}

export async function collegepostEventImage(req, res, next) {
  const collegeEventId = req.body.collegeEventId;
  const file = req.body.image;
  const userId = req.body.userId;

  file.forEach((url) => {
    const data = url.data;
    const USER_PATH = "media/collegeEvents";
    const type = url.mime.split("/")[1];
    const fileName = `${collegeEventId}.${Math.floor(Date.now())}.${type}`;
    const filePath = `${USER_PATH}/${collegeEventId}/${fileName}`;

    uploadBase64File(data, filePath, (err, mediaPath) => {
      if (err) {
        return callback(err);
      }

      collegeEventImage
        .create(
          {
            userId: userId,
            collegeEventId: collegeEventId,
            image: mediaPath,
            imageUrl: getPublicImagUrl(mediaPath),
          } // Update
        )
        .then((obj) => {})
        .catch((err) => {
          console.log("Error: " + err);
        });
    });
  });
  res.status(200).json({
    status: "Event Image Uploaded successfully",
    data: {},
  });
}
export const deleteImage = deleteOne(collegeEventImage);
export const getAllImage = getAll(collegeEventImage);
export const getImage = getOne(collegeEventImage);
