import { Router } from "express";
const router = Router();

// Group Controller
import {
  collegeGroupAllSms,
  collegeGroupIndividualUserSms,
  createCollegeGroup,
  createGroup12,
  deleteCollegeGroup,
  deleteMe,
  getAllCollegeGroups,
  getCollegeGroup,
  getCollegeGroupLists,
  ListcollegeGroupsFromCollege,
  ListCollegeGroupsFromUser,
  myGroups,
  updateCollegeGroup,
  updatecollegeGroupAvatar,
} from "../controllers/collegeGroupControllers.js";

// Auth Controller

import { login, signup, protect, restrictTo } from "./../controllers/authController.js";

// router.use(protect);

router.route("/").get(getAllCollegeGroups);

router.route("/user").get(ListCollegeGroupsFromUser);

router.route("/college").get(ListcollegeGroupsFromCollege);

router.route("/").post(createCollegeGroup);

router.route("/create").post(createGroup12);

router.route("/lists").get(getCollegeGroupLists);

router.route("/:id").get(getCollegeGroup).patch(updateCollegeGroup).delete(deleteCollegeGroup);

router.route("/user/group").get(myGroups);

router.route("/delete").get(deleteMe);

router.route("/avatar/:id").put(updatecollegeGroupAvatar);

router.route("/groupallsms").post(collegeGroupAllSms);

router.route("/groupindividualsms").post(collegeGroupIndividualUserSms);

export default router;
