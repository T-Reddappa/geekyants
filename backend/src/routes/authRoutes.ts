import { Router } from "express";
import { getProfile, login } from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);

export default router;
