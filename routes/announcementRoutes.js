import { Router } from "express";
const router = Router();
import {
  createAnnouncement,
  getAnnouncement,
  getOneAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  allUserSms,
  individualUserSms,
  sendSmsToSelectedGroup,
  appAdminAnnouncementList,
  allAlumniNotification,
} from "../controllers/announcementController.js";

router.route("/add").post(createAnnouncement);

router.route("/list").get(getAnnouncement);

router
  .route("/:id")
  .get(getOneAnnouncement)
  .patch(updateAnnouncement)
  .delete(deleteAnnouncement);

router.route("/notify/allUsers").post(allUserSms);

router.route("/notify/individual").post(individualUserSms);

router.route("/notify/batch").post(sendSmsToSelectedGroup);

router.route("/appAdmin/List").get(appAdminAnnouncementList);

router.route("/notify/allAlumni").post(allAlumniNotification);

export default router;
