import { Router } from "express";

import csvFileUpload from "../csvFileUpload.js";

const router = Router();

import {
  getAllColleges,
  getCollege,
  updateCollege,
  deleteCollege,
  addCollege,
  ListUsersFromCollege,
  ListCollegesFromUser,
  updateCollegeAvatar,
  getCollegeLists,
  pendingCollegeRequest,
  acceptCollegeRequest,
  createCollegeRequest,
} from "../controllers/collegeController.js";

router.route("/").get(getAllColleges);

router.route("/request").post(createCollegeRequest);

router.route("/user").get(ListUsersFromCollege);

router.route("/user/college").get(ListCollegesFromUser);

router.route("/avatar/:id").put(updateCollegeAvatar);

router.route("/lists").get(getCollegeLists);

router.route("/pending").get(pendingCollegeRequest);

router.route("/accept").post(acceptCollegeRequest);

router.route("/:id").get(getCollege).patch(updateCollege).delete(deleteCollege);

router.post("/addCollege", csvFileUpload, addCollege);

export default router;
