import express from "express";
import { adminRoute, privateRoute } from "../middleware/auth.middleware.js";
import {
  getAnalyticsData,
  getDailySalesData,
} from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/", privateRoute, adminRoute, async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData(req.user._id);

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const salesData = await getDailySalesData(startDate, endDate);
    res.json({ analyticsData, salesData });
  } catch (error) {
    console.log(`Error in occured when getAnalyticsData ==> ${error}`);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

export const analyticsRoutes = router;
