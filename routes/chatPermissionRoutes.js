import { Router } from "express";
const router = Router();

// UserPermission Controller
import {
  getAllChatPermissions,
  getChatPermission,
  updateChatPermission,
  deleteChatPermission,
  createChatPermissions,
  getChatPermissions,
  getUserChatPermissionsRequest,
  getChatRequest,
  AcceptedMessage,
} from "../controllers/chatPermissionController.js";
router.route("/all").get(getAllChatPermissions);
router.route("/request").get(getUserChatPermissionsRequest);
router.route("/").post(createChatPermissions);
router.route("/check").get(getChatRequest);
router.route("/").get(getChatPermissions);
router.route("/approved/sms").post(AcceptedMessage);
router
  .route("/:id")
  .get(getChatPermission)
  .patch(updateChatPermission)
  .delete(deleteChatPermission);

export default router;
