import { Router } from "express";
const router = Router();
import csvFileUpload from "../csvFileUpload.js";
// School Controller
import {
  getAllSchools,
  getSchool,
  updateSchool,
  deleteSchool,
  createSchoolRequest,
  getLists,
  ListSchoolsFromUser,
  ListUsersFromSchool,
  updateAvatar,
  addSchool,
  pendingSchoolRequest,
  acceptSchoolRequest,
} from "../controllers/schoolController.js";

// Auth Controller

router.route("/").get(getAllSchools);

router.route("/request").post(createSchoolRequest);
//school
router.route("/user").get(ListUsersFromSchool);

router.route("/user/school").get(ListSchoolsFromUser);

router.route("/avatar/:id").put(updateAvatar);

router.route("/lists").get(getLists);

router.route("/pending").get(pendingSchoolRequest);

router.route("/accept").post(acceptSchoolRequest);

router.route("/:id").get(getSchool).patch(updateSchool).delete(deleteSchool);

router.post("/addSchool", csvFileUpload, addSchool);

export default router;
