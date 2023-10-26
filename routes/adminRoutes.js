import { Router } from "express";
const router = Router();

import {
  acceptAdmin,
  adminBatched,
  schoolAdminRequestList,
  collegeAdminRequestList,
  collegePendingRequest,
  schoolPendingRequest,
  acceptSchoolCollegeRequest,
} from "../controllers/adminController.js";

router.route("/batch").get(adminBatched);

router.route("/school/request/list").get(schoolAdminRequestList);

router.route("/college/request/list").get(collegeAdminRequestList);

router.route("/accept").post(acceptAdmin);

router.route("/pending/school").get(schoolPendingRequest);

router.route("/pending/college").get(collegePendingRequest);

router.route("/schoolCollege/accept").post(acceptSchoolCollegeRequest);

export default router;
