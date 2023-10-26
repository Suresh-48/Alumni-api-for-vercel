import { Router } from "express";
const router = Router();

import { createScholarship, deleteScholarship, getAllScholarships, getScholarship, getScholarshipFromcollege, updateScholarship } from "../controllers/collegeStudentsFundController.js";

router.route("/").get(getAllScholarships);

router.route("/college").get(getScholarshipFromcollege);

router.route("/").post(createScholarship);

router.route("/:id").get(getScholarship).patch(updateScholarship).delete(deleteScholarship);

export default router;
