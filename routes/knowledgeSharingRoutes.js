import { Router } from "express";
const router = Router();

import {
  createImagePost,
  createKnowledgeSharing,
  deleteKowledgeSharing,
  deletePostImage,
  getAllKowledgeSharing,
  getKowledgeSharing,
  updateKowledgeSharing,
} from "../controllers/knowledgeSharingController.js";

router.route("/").get(getAllKowledgeSharing);
router.route("/").post(createKnowledgeSharing);
router.route("/:id").get(getKowledgeSharing);
router.route("/:id").put(updateKowledgeSharing);
router.route("/:id").delete(deleteKowledgeSharing);
router.route("/post/create").post(createImagePost);
router.route("/:id").delete(deletePostImage);



export default router;
