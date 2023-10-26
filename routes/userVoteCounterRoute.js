import { Router } from "express";
const router = Router();

// UserVoteCounter Controller
import {
  getAllUserVoteCounters,
  getUserVoteCounter,
  updateUserVoteCounter,
  deleteUserVoteCounter,
  getPopularAlumni,
} from "../controllers/userVoteCounterController.js";

router.route("/").get(getAllUserVoteCounters);
router.route("/votes").get(getPopularAlumni);
router.route("/:id").get(getUserVoteCounter).patch(updateUserVoteCounter).delete(deleteUserVoteCounter);

export default router;
