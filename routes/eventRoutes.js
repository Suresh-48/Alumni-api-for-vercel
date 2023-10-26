import { Router } from "express";
const router = Router();

// Event Controller
import {
  getAllEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  createEvent,
  getLists,
  pastEvents,
  upcomingEvents,
  createEventBasedOnSchool,
  upcomingEventsBasedOnSchool,
  pastEventsBasedOnSchool,
  allUserSms,
  individualUserSms,
  sendSmsToSelectedGroup,
  upcomingEventImage,
} from "../controllers/eventController.js";

router.route("/").get(getAllEvents);

router.route("/past").get(pastEvents);

router.route("/upcoming").get(upcomingEvents);

router.route("/school/past").get(pastEventsBasedOnSchool);

router.route("/school/upcoming").get(upcomingEventsBasedOnSchool);

router.route("/school").post(createEventBasedOnSchool);

router.route("/").post(createEvent);

router.route("/:id").get(getEvent).patch(updateEvent).delete(deleteEvent);

router.route("/sms/allUser").get(allUserSms);

router.route("/sms/individualUser").post(individualUserSms);

router.route("/group/invite").post(sendSmsToSelectedGroup);

router.route("/upcomingEventImage").put(upcomingEventImage);

export default router;
