import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  createProject,
  getProjectById,
  getProjects,
  updateProject,
} from "../controllers/projectController";
import { allowRoles } from "../middlewares/roleMiddleware";
const router = Router();

// Only managers can create projects
router.post("/", authMiddleware, allowRoles("manager"), createProject);
router.put("/:id", authMiddleware, allowRoles("manager"), updateProject);

// Anyone logged in can view projects
router.get("/", authMiddleware, getProjects);
router.get("/:id", authMiddleware, getProjectById);

export default router;
