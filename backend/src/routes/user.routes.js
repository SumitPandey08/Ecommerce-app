import express from "express";
import { signUp, verifyUser , login , forgotPassword ,  resendOTP , resetPassword, addCart, removeCartItem, getCart, clearCart , updateCart } from "../controllers/user.control.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/verify", verifyUser);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/resend-otp", resendOTP);
router.post("/reset-password", resetPassword);
router.post("/add-cart", protect, addCart);
router.put("/update-cart", protect, updateCart);
router.delete("/remove-cart", protect, removeCartItem);
router.get("/get-cart", protect, getCart);
router.delete('/clear-cart', protect, clearCart);
export default router;

