import { Router } from "express";
const router = Router();

// Group Controller
import {
  getAllGroups,
  getGroup,
  updateGroup,
  deleteGroup,
  createGroup,
  getLists,
  createGroup12,
  ListGroupsFromUser,
  ListGroupsFromSchool,
  myGroups,
  updateAvatar,
  groupAllSms,
  groupIndividualUserSms,
} from "../controllers/groupController.js";

// Auth Controller

import { login, signup, protect, restrictTo } from "./../controllers/authController.js";

// router.use(protect);

router.route("/").get(getAllGroups);

router.route("/user").get(ListGroupsFromUser);

router.route("/school").get(ListGroupsFromSchool);

router.route("/").post(createGroup);

router.route("/test").post(createGroup12);

router.route("/lists").get(getLists);

router.route("/:id").get(getGroup).patch(updateGroup).delete(deleteGroup);

router.route("/user/group").get(myGroups);

router.route("/avatar/:id").put(updateAvatar);

router.route("/groupallsms").post(groupAllSms)

router.route("/groupindividualsms").post(groupIndividualUserSms);

export default router;
