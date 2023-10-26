import { Router } from "express";
const router = Router();

// LookingForJob Controller
import {
  getAllLookingForJobs,
  getLookingForJob,
  updateLookingForJob,
  createLookingForJob,
  getJobFromSchool,
} from "../controllers/lookingForJobController.js";

router.route("/").get(getAllLookingForJobs);

router.route("/school").get(getJobFromSchool);

router.route("/").post(createLookingForJob);

router.route("/:id").get(getLookingForJob).patch(updateLookingForJob);

export default router;
