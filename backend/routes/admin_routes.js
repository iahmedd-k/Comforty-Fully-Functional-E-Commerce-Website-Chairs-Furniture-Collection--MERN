import express from "express";
import { getAdminDashboard } from "../controllers/admin_controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, isAdmin, getAdminDashboard);

export default router;
