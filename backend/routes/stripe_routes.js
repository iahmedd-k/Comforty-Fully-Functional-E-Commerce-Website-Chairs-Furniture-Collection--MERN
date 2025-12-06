import express from "express";
import { stripeWebhook } from "../controllers/stripe_webhook_controller.js";

const router = express.Router();

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

export default router;
