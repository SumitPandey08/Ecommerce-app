import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  filterProducts,
  getSellerProducts,
} from "../controllers/product.controller.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";

const router = express.Router();

// CREATE product (with Cloudinary upload; optional: use upload.array('images') for multiple)
router.post("/", protect, upload.array('images', 5), createProduct);


router.get("/", filterProducts);

router.get("/seller/:sellerId", getSellerProducts);

router.get("/:id", getProductById);

router.put("/:id", protect, upload.array('images', 5), updateProduct);

router.delete("/:id", protect, deleteProduct);

//router.get("/search", searchProducts);

router.get("/", getAllProducts);

export default router;
