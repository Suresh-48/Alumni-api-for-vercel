import { Router } from "express";
const router = Router();

import { collegePastEventImage, collegepostEventImage, deleteImage, getAllImage, updateCollegeEventImage } from "../controllers/collegeEventImagesController.js";

router.route("/").post(collegepostEventImage);

router.route("/:id").put(updateCollegeEventImage);

router.route("/list").get(collegePastEventImage);

router.route("/all").get(getAllImage);

router.route("/:id").delete(deleteImage);

export default router;
