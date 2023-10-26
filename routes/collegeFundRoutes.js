import { Router } from "express";
const router = Router();

import { createSchoolFund, deleteSchoolFund, getAllSchoolFunds, getSchoolFund, getSchoolFundFromCollege, updateSchoolFund } from "../controllers/collegeFundController.js";

router.route("/").get(getAllSchoolFunds).post(createSchoolFund);

router.route("/college").get(getSchoolFundFromCollege);

router.route("/:id").get(getSchoolFund).patch(updateSchoolFund).delete(deleteSchoolFund);

export default router;
