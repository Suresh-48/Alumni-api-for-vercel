import { Router } from "express";
const router = Router();

// LookingForEmployee Controller
import {
  getAllLookingForEmployees,
  getLookingForEmployee,
  updateLookingForEmployee,
  deleteLookingForEmployee,
  createLookingForEmployee,
  getEmployeeFromSchool,
} from "../controllers/lookingForEmployeeController.js";

router.route("/").get(getAllLookingForEmployees);

router.route("/school").get(getEmployeeFromSchool);

router.route("/").post(createLookingForEmployee);

router.route("/:id").get(getLookingForEmployee).patch(updateLookingForEmployee);

export default router;
