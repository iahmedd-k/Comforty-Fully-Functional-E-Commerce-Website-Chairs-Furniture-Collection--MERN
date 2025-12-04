import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  addReview
} from "../controllers/product_controller.js";

import { authMiddleware } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:slug", getProduct);

router.post("/",isAdmin, createProduct);
router.put("/:slug", isAdmin, updateProduct);
router.delete("/:slug", isAdmin, deleteProduct);

router.post("/:slug/review", authMiddleware, addReview);

export default router;
