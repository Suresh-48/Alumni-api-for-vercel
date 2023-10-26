import { Router } from "express";
const router = Router();

import {createPostCount,} from '../controllers/postCountController.js';


router.route("/like").post(createPostCount);

export default router;
