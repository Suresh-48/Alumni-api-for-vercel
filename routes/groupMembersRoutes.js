import { Router } from "express";
const router = Router();

// GroupMembers Controller
import {
  getAllGroupMembers,
  getGroupMembers,
  updateGroupMembers,
  deleteGroupMembers,
  createGroupMembers,
  getLists,
  invite,
  getApprovedMembersLists,
  requestedUsers,
  AcceptedMessage,
  // userGroups,
  getGroupMembersPendingRequestList,
} from "../controllers/groupMembersController.js";

router.route("/").get(getAllGroupMembers);

router.route("/lists/pending").get(getLists);

router.route("/lists/approved").get(getApprovedMembersLists);

router.route("/").post(createGroupMembers);

router.route("/invite").post(invite);

router.route("/:id").get(getGroupMembers);

router.route("/user/requested").get(requestedUsers);

router.route("/lists/approved/sms").post(AcceptedMessage);

router.route("/request/list").get(getGroupMembersPendingRequestList);

router.route("/:id").get(getGroupMembers).patch(updateGroupMembers).delete(deleteGroupMembers);

export default router;
