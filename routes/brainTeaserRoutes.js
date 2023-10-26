import { Router } from "express";
import {
  createBrainTeaser,
  deleteBrainTeaser,
  getAllBrainTeaser,
  getBrainTeaser,
  getUserLevel,
  updateBrainTeaser,
} from "../controllers/brainTeaserController.js";
const router = Router();

router.route("/").post(createBrainTeaser).get(getAllBrainTeaser);

router
  .route("/:id")
  .patch(updateBrainTeaser)
  .delete(deleteBrainTeaser)
  .get(getBrainTeaser);

router.route("/user/level").get(getUserLevel)

export default router;
