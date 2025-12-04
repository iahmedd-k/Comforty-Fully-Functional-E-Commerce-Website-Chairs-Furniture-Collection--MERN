import express from "express";
import {
    getUserCart,
    addItemToCart,
    updateCartItem,
    removeItemFromCart,
    clearCart
} from "../controllers/cart_controller.js";

import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, getUserCart);
router.post("/add", authMiddleware, addItemToCart);
router.put("/update", authMiddleware, updateCartItem);
router.delete("/remove", authMiddleware, removeItemFromCart);
router.delete("/clear", authMiddleware, clearCart);

export default router;
