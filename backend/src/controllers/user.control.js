import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import sendStyledOTP from "../helper/nodemailer.js";
import accessToken from "../helper/token.js";

export const signUp = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400); throw new Error("Please fill all fields");
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400); throw new Error("User already exists");
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);
    const hashedOTP = bcrypt.hashSync(otp.toString(), 10);
    await sendStyledOTP(email, otp);
    const user = await User.create({
        username, email, password,
        verifyToken: hashedOTP, verifyTokenExpiration: otpExpiration, isVerified: false,
    });
    if (user) {
        res.status(201).json({
            message: "Registration successful! An OTP has been sent to your email.",
            userId: user._id,
            email: user.email,
        });
    } else {
        res.status(400); throw new Error("Invalid user data");
    }
});

export const verifyUser = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        res.status(400); throw new Error("Please provide email and OTP");
    }
    const user = await User.findOne({ email });
    if (!user) {
        res.status(404); throw new Error("User not found");
    }
    if (!user.verifyToken || !user.verifyTokenExpiration || user.verifyTokenExpiration < new Date()) {
        res.status(400); throw new Error("OTP has expired");
    }
    const isOtpValid = bcrypt.compareSync(otp.toString(), user.verifyToken);
    if (!isOtpValid) {
        res.status(400); throw new Error("Invalid OTP");
    }
    user.isVerified = true;
    user.verifyToken = null;
    user.verifyTokenExpiration = null;
    await user.save();
    res.status(200).json({
        message: "User verified successfully",
        userId: user._id,
        email: user.email,
    });
});

export const resendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400); throw new Error("Please provide an email");
    }
    const user = await User.findOne({ email });
    if (!user) {
        res.status(404); throw new Error("User not found");
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);
    const hashedOTP = bcrypt.hashSync(otp.toString(), 10);
    await sendStyledOTP(email, otp);
    user.verifyToken = hashedOTP;
    user.verifyTokenExpiration = otpExpiration;
    await user.save();
    res.status(200).json({
        message: "OTP resent successfully",
        userId: user._id,
        email: user.email,
    });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400); throw new Error("Please fill all fields");
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        res.status(404); throw new Error("User not found");
    }
    if (!user.isVerified) {
        res.status(403); throw new Error("Account not verified. Please verify your account first.");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        res.status(401); throw new Error("Invalid credentials");
    }
    const token = accessToken(user._id, user.email);
    res.status(200).json({
        message: "Login successful",
        userId: user._id,
        email: user.email,
        accessToken: token,
    });
});

export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400); throw new Error("Please provide an email");
    }
    const user = await User.findOne({ email });
    if (!user) {
        res.status(404); throw new Error("User not found");
    }
    const forgotPasswordToken = Math.floor(100000 + Math.random() * 900000);
    const expiration = new Date(Date.now() + 10 * 60 * 1000);
    const hashedToken = bcrypt.hashSync(forgotPasswordToken.toString(), 10);
    await sendStyledOTP(email, forgotPasswordToken);
    user.isForgotPassword = true;
    user.forgotPasswordToken = hashedToken;
    user.forgotPasswordTokenExpiration = expiration;
    await user.save();
    res.status(200).json({
        message: "Forgot password token sent successfully",
        userId: user._id,
        email: user.email,
    });
});

export const resetPassword = asyncHandler(async (req, res) => {
    const { email, forgotPasswordToken, newPassword } = req.body;
    if (!email || !forgotPasswordToken || !newPassword) {
        res.status(400); throw new Error("Please fill all fields");
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        res.status(404); throw new Error("User not found");
    }
    if (!user.forgotPasswordTokenExpiration || user.forgotPasswordTokenExpiration < new Date()) {
        res.status(400); throw new Error("Forgot password token has expired");
    }
    const isTokenValid = bcrypt.compareSync(forgotPasswordToken.toString(), user.forgotPasswordToken);
    if (!isTokenValid) {
        res.status(400); throw new Error("Invalid forgot password token");
    }
    user.password = newPassword;
    user.isForgotPassword = false;
    user.forgotPasswordToken = null;
    user.forgotPasswordTokenExpiration = null;
    await user.save();
    res.status(200).json({
        message: "Password reset successfully",
        userId: user._id,
        email: user.email,
    });
});

export const addCart = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(404); throw new Error("User not found");
    }
    const productIndex = user.cart.findIndex(
        (item) => item.productId.toString() === productId.toString()
    );
    if (productIndex !== -1) {
        user.cart[productIndex].quantity += 1;
    } else {
        user.cart.push({ productId, quantity: 1 });
    }
    await user.save();
    res.json({ message: "Product added to cart", cart: user.cart });
});

export const getCart = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).populate(
        "cart.productId",
        "name price images"
    );
    if (!user) {
        res.status(404); throw new Error("User not found");
    }
    res.json(user.cart);
});

export const updateCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(404); throw new Error("User not found");
    }
    const item = user.cart.find(
        (item) => item.productId.toString() === productId
    );
    if (item) {
        item.quantity = quantity;
    } else {
        user.cart.push({ productId, quantity });
    }
    await user.save();
    await user.populate("cart.productId", "name price images");
    res.json({ message: "Cart updated", cart: user.cart });
});

export const removeCartItem = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(404); throw new Error("User not found");
    }
    user.cart = user.cart.filter(
        (item) => item.productId.toString() !== productId.toString()
    );
    await user.save();
    res.json({ message: "Item removed from cart", cart: user.cart });
});

export const clearCart = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(404); throw new Error("User not found");
    }
    user.cart = [];
    await user.save();
    res.json({ message: "Cart cleared", cart: [] });
});
