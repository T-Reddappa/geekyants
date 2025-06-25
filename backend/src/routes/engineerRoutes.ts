import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { allowRoles } from "../middlewares/roleMiddleware";
import {
  getEngineerCapacity,
  getEngineers,
  updateEngineer,
  getEngineerById,
} from "../controllers/engineerController";

const router = Router();

// Accessible to both managers and engineers
router.get("/", authMiddleware, getEngineers);
router.get("/:id", authMiddleware, getEngineerById);

// Only managers should call this (but could be open if needed)
router.get("/:id/capacity", authMiddleware, getEngineerCapacity);

// Route to update an engineer's profile
router.put("/:id", authMiddleware, updateEngineer);

export default router;
