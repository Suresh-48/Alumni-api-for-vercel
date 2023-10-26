import { Router } from "express";
const router = Router();

import {createPostComments, deletePostComments, getIndividualPostComments,
    getAllPostComments, updatePostComments,} from '../controllers/postCommentsController.js'

router.route("/").get(getAllPostComments);
router.route("/").post(createPostComments);
router.route("/:id").put(updatePostComments);
router.route("/").delete(deletePostComments);
router.route("/individual").get(getIndividualPostComments);


export default router;
