import express from "express";
import { privateRoute } from "../middleware/auth.middleware.js";
import { getCoupon, validateCoupon } from "../controllers/coupon.controller.js";
const router = express.Router();

router.get("/", privateRoute, getCoupon);
router.get("/validate", privateRoute, validateCoupon);

export const couponRoutes = router;
