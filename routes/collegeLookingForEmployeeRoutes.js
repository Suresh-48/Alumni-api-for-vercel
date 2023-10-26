import { Router } from "express";
const router = Router();

// LookingForEmployee Controller
import { createLookingForEmployee, getAllLookingForEmployees, getEmployeeFromCollege, getLookingForEmployee, updateLookingForEmployee } from "../controllers/collegeLookingForEmployeeController.js";

router.route("/").get(getAllLookingForEmployees);

router.route("/college").get(getEmployeeFromCollege);

router.route("/").post(createLookingForEmployee);

router.route("/:id").get(getLookingForEmployee).patch(updateLookingForEmployee);

export default router;
