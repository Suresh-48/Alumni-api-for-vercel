import { Router } from "express";
const router = Router();

// Event Controller
import { allUserSms, collegePastEvents, collegeUpcomingEvents, createCollegeEvent, createEventBasedOnCollege, deleteCollegeEvent, getAllCollegeEvents, getCollegeEvent, individualUserSms, pastEventsBasedOnCollege, sendSmsToSelectedGroup, upcomingEventImage, upcomingEventsBasedOnCollege, updateCOllegeEvent } from "../controllers/collegeEventController.js";

router.route("/").get(getAllCollegeEvents);

router.route("/collegeGroupPast").get(collegePastEvents);

router.route("/collegeGroupUpcoming").get(collegeUpcomingEvents);

router.route("/college/past").get(pastEventsBasedOnCollege);

router.route("/college/upcoming").get(upcomingEventsBasedOnCollege);

router.route("/college").post(createEventBasedOnCollege);

router.route("/").post(createCollegeEvent);


router.route("/:id").get(getCollegeEvent).patch(updateCOllegeEvent).delete(deleteCollegeEvent);

router.route("/sms/allUser").get(allUserSms);

router.route("/sms/individualUser").post(individualUserSms);

router.route("/group/invite").post(sendSmsToSelectedGroup);

router.route("/upcomingEventImage").put(upcomingEventImage);

export default router;
