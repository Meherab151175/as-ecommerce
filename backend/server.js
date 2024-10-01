import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import { productRoutes } from "./routes/product.route.js";
import { couponRoutes } from "./routes/coupon.route.js";
import { paymentRoutes } from "./routes/payment.route.js";
import { analyticsRoutes } from "./routes/analytics.route.js";
import { cartRoutes } from "./routes/cart.routes.js";

dotenv.config();


const app = express();

app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello World!");
});


// routes
app.use('/api/auth', authRoutes);
app.use('/api/products',productRoutes)
app.use('/api/cart',cartRoutes)
app.use('/api/coupons',couponRoutes)
app.use('/api/payments',paymentRoutes)
app.use('/api/analytics',analyticsRoutes)

app.listen(5000, async () => {
    await connectDB()
    console.log("Server is running on port 5000");
});