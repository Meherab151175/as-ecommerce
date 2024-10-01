import express from "express";
import { privateRoute } from "../middleware/auth.middleware.js";
import { checkoutSuccess, createCheckoutSession } from "../controllers/payment.controller.js";
import { stripe } from "../lib/stripe.js";
import Coupon from "../models/coupon.model.js";


const router = express.Router();

router.post('/create-checkout-session',privateRoute,createCheckoutSession) 
router.post('/checkout-success',privateRoute,checkoutSuccess) 

export const paymentRoutes = router