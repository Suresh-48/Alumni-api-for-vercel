import { Router } from "express";
const router = Router();
// User Controller
import {
  deleteMe,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getGroups,
  updateAvatar,
  deleteAvatarImage,
  checkingUser,
  admin,
  adminLogin,
  checkingPhone,
  adminSchoolCollegeList,
  notificationCount,
  findAlumniDeleteUser,
  updateAllStatus,
  inActiveUser,
} from "../controllers/userController.js";
// Auth Controller
import { login, signup, protect, restrictTo } from "./../controllers/authController.js";
//import checkNotification from "../utils/notification.js";
//router.use(protect);
//----------------------------------------------------->
//=============================>
router.post("/login", login);
router.post("/signup", signup);
// Protect all routes after this middleware
router.delete("/deleteMe", deleteMe);
// Only admin have permission to access for the below APIs
// router.use(restrictTo('admin'));
router.route("/").get(getAllUsers);
router.route("/delete/User").delete(deleteUser);
router.route("/check").post(checkingUser);
router.route("/admin").post(admin);
router.route("/avatar/:id").put(updateAvatar);
router.route("/:id").get(getUser).patch(updateUser);
router.route("/:id/groups").get(getGroups);
router.route("/checkPhone").post(checkingPhone);

router.route("/deleteAvatarImage/:id").put(deleteAvatarImage);

// router.route("/notification").post(checkNotification);
router.route("/adminLogin").post(adminLogin);
router.route("/admin/list").get(adminSchoolCollegeList);
router.route("/notification/count").get(notificationCount);
router.route("/find").post(findAlumniDeleteUser);

router.route('/account/inactive/:id').put(inActiveUser)

router.route('/update/all/status').put(updateAllStatus);

export default router;
