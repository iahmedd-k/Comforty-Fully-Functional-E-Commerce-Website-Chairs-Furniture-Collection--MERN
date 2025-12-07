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
import  {upload } from "../middleware/uploadImages.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:slug", getProduct);

router.post("/",isAdmin, upload.array("images", 5), createProduct);
router.put("/:slug", isAdmin,upload.array("images", 5), updateProduct);
router.delete("/:slug", isAdmin, deleteProduct);

router.post("/:slug/review", authMiddleware, addReview);

export default router;
