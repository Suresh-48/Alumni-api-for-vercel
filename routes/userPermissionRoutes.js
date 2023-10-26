import { Router } from "express";
const router = Router();

// UserPermission Controller
import {
  getAllUserPermissions,
  getUserPermission,
  updateUserPermission,
  deleteUserPermission,
  createUserPermissions,
  getUserPermissions,
  getUserPermissionsRequest,
  getUserRequest,
  AcceptedMessage,
} from "../controllers/userPermissionController.js";
router.route("/all").get(getAllUserPermissions);
router.route("/request").get(getUserPermissionsRequest);
router.route("/").post(createUserPermissions);
router.route("/check").get(getUserRequest);
router.route("/").get(getUserPermissions);
router.route("/approved/sms").post(AcceptedMessage);
router.route("/:id").get(getUserPermission).patch(updateUserPermission).delete(deleteUserPermission);

export default router;
