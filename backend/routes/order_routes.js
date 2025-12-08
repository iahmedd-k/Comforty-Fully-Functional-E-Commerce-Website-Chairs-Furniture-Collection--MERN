import express from "express";
import {
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    getAllOrders,
    checkout,
    confirmPayment
} from "../controllers/order_controller.js";

import { authMiddleware } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";

const router = express.Router();

router.post("/checkout", authMiddleware, checkout);
router.post("/confirm-payment", authMiddleware, confirmPayment);
router.get("/my-orders", authMiddleware, getMyOrders);
router.get("/", authMiddleware, isAdmin, getAllOrders); // Must come before /:id route
router.get("/:id", authMiddleware, getOrderById);
router.put("/:id", authMiddleware, updateOrderStatus);


export default router;
