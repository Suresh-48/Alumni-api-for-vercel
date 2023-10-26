import eventImage from "../models/eventImagesModel.js";
import { getAll, getOne, updateOne, deleteOne, createOne } from "./baseController.js";
import { getPublicImagUrl, uploadBase64File } from "../utils/s3.js";
//Past Event Images
export async function PastEventImage(req, res, next) {
  try {
    const eventId = req.query.eventId;
    const data = await eventImage.find({ eventId: eventId });
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

export async function updateEventImage(req, res, next) {
  const eventId = req.params.id;
  const file = req.body.image;
  const USER_PATH = "media/events";
  const type = file && file.split(";")[0].split("/")[1];
  const random = (new Date()).getTime();
  const fileName = `${eventId}-${random}.${type}`;
  const filePath = `${USER_PATH}/${fileName}`;

  const eventDetails = await Event.findById(eventId);
  if (!eventDetails) {
    return next(new Error("Event not found"));
  }

  uploadBase64File(file, filePath, (err, mediaPath) => {
    if (err) {
      return callback(err);
    }
    eventImage
      .updateOne(
        { eventId: eventId }, // Filter
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

export async function postEventImage(req, res, next) {
  const eventId = req.body.eventId;
  const file = req.body.image;
  const userId = req.body.userId;

  file.forEach((url) => {
    const data = url.data;
    const USER_PATH = "media/events";
    const type = url.mime.split("/")[1];
    const fileName = `${eventId}.${Math.floor(Date.now())}.${type}`;
    const filePath = `${USER_PATH}/${eventId}/${fileName}`;

    uploadBase64File(data, filePath, (err, mediaPath) => {
      if (err) {
        return callback(err);
      }

      eventImage
        .create(
          {
            userId: userId,
            eventId: eventId,
            image: mediaPath,
            imageUrl: getPublicImagUrl(mediaPath),
          } // Update
        )
        .then((obj) => {
        })
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
export const deleteImage = deleteOne(eventImage);
export const getAllImage = getAll(eventImage);
export const getImage = getOne(eventImage);
