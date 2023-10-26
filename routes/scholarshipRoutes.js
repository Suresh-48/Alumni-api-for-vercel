import { Router } from "express";
const router = Router();

import {
  getAllScholarships,
  getScholarship,
  updateScholarship,
  deleteScholarship,
  createScholarship,
  getScholarshipFromSchool,
} from "../controllers/scholarshipController.js";

router.route("/").get(getAllScholarships);

router.route("/school").get(getScholarshipFromSchool);

router.route("/").post(createScholarship);

router.route("/:id").get(getScholarship).patch(updateScholarship).delete(deleteScholarship);

export default router;
