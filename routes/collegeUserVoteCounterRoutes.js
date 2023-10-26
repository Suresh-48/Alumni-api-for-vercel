import { Router } from "express";
import { deleteCollegeUserVoteCounter, getAllCollegeUserVoteCounters, getCollegeUserVoteCounter, getPopularAlumni, updateCollegeUserVoteCounter } from "../controllers/collegeUserVoteCountController.js";
const router = Router();

router.route("/").get(getAllCollegeUserVoteCounters);
router.route("/votes").get(getPopularAlumni);
router.route("/:id").get(getCollegeUserVoteCounter).patch(updateCollegeUserVoteCounter).delete(deleteCollegeUserVoteCounter);

export default router;
