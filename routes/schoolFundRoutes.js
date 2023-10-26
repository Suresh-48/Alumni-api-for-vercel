import { Router } from "express";
const router = Router();

import {
  getAllSchoolFunds,
  getSchoolFund,
  updateSchoolFund,
  deleteSchoolFund,
  createSchoolFund,
  getSchoolFundFromSchool,
} from "../controllers/schoolFundController.js";

router.route("/").get(getAllSchoolFunds).post(createSchoolFund);

router.route("/school").get(getSchoolFundFromSchool);

router.route("/:id").get(getSchoolFund).patch(updateSchoolFund).delete(deleteSchoolFund);

export default router;
