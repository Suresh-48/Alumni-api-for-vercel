import { Router } from "express";
const router = Router();

// GroupMembers Controller
import { AcceptedMessage, createCollegeGroupMembers, deleteCollegeGroupMembers, deleteMe, getAllCollegeGroupMembers, getApprovedCollegeMembersLists, getCollegeGroupMembers, getCollegeMembersLists, invite, requestedUsers, updateCollegeGroupMembers } from "../controllers/collegeMembersController.js";

router.route("/").get(getAllCollegeGroupMembers);

router.route("/delete").get(deleteMe);

router.route("/lists/pending").get(getCollegeMembersLists);

router.route("/lists/approved").get(getApprovedCollegeMembersLists);

router.route("/").post(createCollegeGroupMembers);

router.route("/invite").post(invite);


router.route("/user/requested").get(requestedUsers);

router.route("/lists/approved/sms").post(AcceptedMessage);

router.route("/:id").get(getCollegeGroupMembers).patch(updateCollegeGroupMembers).delete(deleteCollegeGroupMembers);

export default router;
