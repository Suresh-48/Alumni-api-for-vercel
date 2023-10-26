import { Router } from "express";
const router = Router();

import {
  createChat,
  deleteChat,
  getAllChat,
  getChat,
  updateChat,
  chatNotification,
  chatPushNotification
} from "../controllers/chatController.js";

router.route("/").get(getAllChat).post(createChat);

router.route("/list").get(getChat)

router.route("/:id").patch(updateChat).delete(deleteChat);

router.route("/notification").get(chatNotification)

router.route("/push/notification/message").post(chatPushNotification)

export default router;
