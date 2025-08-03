import express from "express";
import {
  submitApplication,
  getApplicationsForEmployer,
  getApplicationsForJobseeker,
  deleteApplicationByJobseeker,
} from "../controllers/applicationController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Job Seeker submits an application
router.post("/", isAuthenticated, submitApplication);

// Employer views all received applications
router.get("/employer", isAuthenticated, getApplicationsForEmployer);

// Job Seeker views their own submitted applications
router.get("/jobseeker", isAuthenticated, getApplicationsForJobseeker);

// Job Seeker deletes a specific application
router.delete("/:id", isAuthenticated, deleteApplicationByJobseeker);

export default router;
