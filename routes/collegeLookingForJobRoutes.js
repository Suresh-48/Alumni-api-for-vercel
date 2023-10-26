import { Router } from "express";
const router = Router();

// LookingForJob Controller
import { createLookingForJob, getAllLookingForJobs, getJobFromCollege, getLookingForJob, updateLookingForJob } from "../controllers/collegeLookingForJobController.js";


router.route("/").get(getAllLookingForJobs);

router.route("/college").get(getJobFromCollege);

router.route("/").post(createLookingForJob);

router.route("/:id").get(getLookingForJob).patch(updateLookingForJob);

export default router;
