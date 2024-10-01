import express from "express";
const router = express.Router();
import { login, signup, logout, refreshToken, getProfile } from "../controllers/auth.controller.js";
import { privateRoute } from "../middleware/auth.middleware.js";


router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/profile", privateRoute, getProfile);


export default router