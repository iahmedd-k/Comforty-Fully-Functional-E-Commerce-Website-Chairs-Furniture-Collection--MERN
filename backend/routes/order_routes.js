import express from "express";
import {
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    getAllOrders,
    checkout
} from "../controllers/order_controller.js";

import { authMiddleware } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";

const router = express.Router();

router.post("/checkout", authMiddleware, checkout);
router.get("/my-orders", authMiddleware, getMyOrders);
router.get("/:id", authMiddleware, getOrderById);
router.put("/:id", authMiddleware, updateOrderStatus);
router.get("/", isAdmin, getAllOrders);

export default router;
