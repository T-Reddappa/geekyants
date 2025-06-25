import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { allowRoles } from "../middlewares/roleMiddleware";
import {
  createAssignment,
  getAssignments,
  updateAssignment,
  deleteAssignment,
} from "../controllers/assignmentController";

const router = Router();

// Both roles can view
router.get("/", authMiddleware, getAssignments);

// Only managers can create/update/delete assignments
router.post("/", authMiddleware, allowRoles("manager"), createAssignment);
router.put("/:id", authMiddleware, allowRoles("manager"), updateAssignment);
router.delete("/:id", authMiddleware, allowRoles("manager"), deleteAssignment);

export default router;
