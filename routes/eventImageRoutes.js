import { Router } from "express";
const router = Router();

import {
  updateEventImage,
  postEventImage,
  PastEventImage,
  deleteImage,
  getAllImage,
} from "../controllers/eventImageController.js";

router.route("/").post(postEventImage);

router.route("/:id").put(updateEventImage);

router.route("/").get(PastEventImage);

router.route("/all").get(getAllImage);

router.route("/:id").delete(deleteImage);

export default router;
