import express from "express";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getFeaturedProducts,
    toogleFeaturedProduct,
    getProductsByCategory,
    getRecomendationProduct
} from "../controllers/product.controller.js";
import { adminRoute, privateRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/", privateRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/recomendation", getRecomendationProduct);
router.get("/category/:category", getProductsByCategory);
router.post("/", privateRoute, adminRoute, createProduct);
router.patch("/:id", privateRoute, adminRoute, toogleFeaturedProduct);
router.delete("/:id", privateRoute, adminRoute, deleteProduct);

export const productRoutes = router;
