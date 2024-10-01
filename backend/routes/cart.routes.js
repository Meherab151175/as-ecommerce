import express from "express";
import {
  addToCart,
  updateQuantity,
  getCartProducts,
  removeAllFromCart,
} from "../controllers/cart.controller.js";
import { privateRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", privateRoute, getCartProducts);
router.post("/",privateRoute, addToCart);
router.delete("/",privateRoute, removeAllFromCart);
router.put('/:id',privateRoute,updateQuantity)

export const cartRoutes = router;
