import { Router } from "express";
import {
  createBrainTeaserQuestions,
  deleteBrainTeaserQuestions,
  getAllBrainTeaserQuestions,
  getBrainTeaserQuestions,
  getCategoryList,
  getRandomQuestions,
  updateBrainTeaserQuestions,
  uploadBrainTeaserQuestions,
} from "../controllers/brainTeaserQuestionsController.js";
const router = Router();
import upload from "../csvFileUpload.js";

router
  .route("/")
  .post(createBrainTeaserQuestions)
  .get(getAllBrainTeaserQuestions);

router
  .route("/:id")
  .patch(updateBrainTeaserQuestions)
  .delete(deleteBrainTeaserQuestions)
  .get(getBrainTeaserQuestions);

router.route("/upload/question").post(upload, uploadBrainTeaserQuestions);

router.route("/random/list").get(getRandomQuestions);

router.route("/category/list").get(getCategoryList)

export default router;
