import { Router } from "express";
const router = Router();

// UserVote Controller
import { createUserVotes, deleteCollegeUserVote, getAllCOllegeUserVotes, getCollegeUserVote, updateCollegeUserVote, voteCounter, voteCreatedByUser } from "../controllers/collegeUserVoteController.js";

router.route("/").get(getAllCOllegeUserVotes).post(createUserVotes);

router.route("/count").get(voteCounter);

router.route("/voted").get(voteCreatedByUser);

router.route("/:id").get(getCollegeUserVote).patch(updateCollegeUserVote).delete(deleteCollegeUserVote);

export default router;
