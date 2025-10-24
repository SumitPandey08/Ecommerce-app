import Seller from "../models/seller.model.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import sendStyledOTP from "../helper/nodemailer.js";
import accessToken from "../helper/token.js";

// SELLER SIGNUP
export const signUp = asyncHandler(async (req, res) => {
    const { name, email, companyName, password } = req.body;

    if (!name || !email || !companyName || !password) {
        res.status(400);
        throw new Error("Please fill all fields");
    }

    // Check if seller already exists
    const sellerExists = await Seller.findOne({ email });
    if (sellerExists) {
        res.status(400);
        throw new Error("Seller already exists");
    }

    // Generate OTP & hash it
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 mins from now
    const hashedOTP = bcrypt.hashSync(otp.toString(), 10); // Hash OTP

    // Send OTP email (plaintext code)
    await sendStyledOTP(email, otp);

    // Create seller (not verified yet)
    const seller = await Seller.create({
        name,
        email,
        companyName,
        password, // Will be hashed by schema (see pre('save') in schema)
        verifyToken: hashedOTP,
        verifyTokenExpiration: otpExpiration,
        isVerified: false,
    });

    if (seller) {
        res.status(201).json({
            message: "Registration successful! An OTP has been sent to your email.",
            sellerId: seller._id,
            email: seller.email,
        });
    } else {
        res.status(400);
        throw new Error("Invalid seller data");
    }
});

// SELLER EMAIL VERIFY
export const verifySeller = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        res.status(400);
        throw new Error("Please provide email and OTP");
    }

    const seller = await Seller.findOne({ email });
    if (!seller) {
        res.status(404);
        throw new Error("Seller not found");
    }

    if (!seller.verifyToken || !seller.verifyTokenExpiration || seller.verifyTokenExpiration < new Date()) {
        res.status(400);
        throw new Error("OTP has expired");
    }

    const isOtpValid = bcrypt.compareSync(otp.toString(), seller.verifyToken);
    if (!isOtpValid) {
        res.status(400);
        throw new Error("Invalid OTP");
    }

    seller.isVerified = true;
    seller.verifyToken = null;
    seller.verifyTokenExpiration = null;
    await seller.save();

    res.status(200).json({
        message: "Seller verified successfully",
        sellerId: seller._id,
        email: seller.email,
    });
});

// SELLER RESEND OTP
export const resendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400);
        throw new Error("Please provide an email");
    }

    const seller = await Seller.findOne({ email });
    if (!seller) {
        res.status(404);
        throw new Error("Seller not found");
    }

    // Generate new OTP and hash
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);
    const hashedOTP = bcrypt.hashSync(otp.toString(), 10);

    await sendStyledOTP(email, otp);

    seller.verifyToken = hashedOTP;
    seller.verifyTokenExpiration = otpExpiration;
    await seller.save();

    res.status(200).json({
        message: "OTP resent successfully",
        sellerId: seller._id,
        email: seller.email,
    });
});

// SELLER LOGIN
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("Please fill all fields");
    }

    const seller = await Seller.findOne({ email }).select('+password');
    if (!seller) {
        res.status(404);
        throw new Error("Seller not found");
    }

    if (!seller.isVerified) {
        res.status(403);
        throw new Error("Account not verified. Please verify your account first.");
    }

    const isPasswordValid = await bcrypt.compare(password, seller.password);
    if (!isPasswordValid) {
        res.status(401);
        throw new Error("Invalid credentials");
    }

    const token = accessToken(seller._id, seller.email);

    res.status(200).json({
        message: "Login successful",
        sellerId: seller._id,
        email: seller.email,
        accessToken: token,
    });
});

// SELLER FORGOT PASSWORD
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400);
        throw new Error("Please provide an email");
    }

    const seller = await Seller.findOne({ email });
    if (!seller) {
        res.status(404);
        throw new Error("Seller not found");
    }

    const forgotPasswordToken = Math.floor(100000 + Math.random() * 900000);
    const expiration = new Date(Date.now() + 10 * 60 * 1000);
    const hashedToken = bcrypt.hashSync(forgotPasswordToken.toString(), 10);

    await sendStyledOTP(email, forgotPasswordToken);

    seller.isForgotPassword = true;
    seller.forgotPasswordToken = hashedToken;
    seller.forgotPasswordTokenExpiration = expiration;
    await seller.save();

    res.status(200).json({
        message: "Forgot password token sent successfully",
        sellerId: seller._id,
        email: seller.email,
    });
});

// SELLER RESET PASSWORD
export const resetPassword = asyncHandler(async (req, res) => {
    const { email, forgotPasswordToken, newPassword } = req.body;

    if (!email || !forgotPasswordToken || !newPassword) {
        res.status(400);
        throw new Error("Please fill all fields");
    }

    const seller = await Seller.findOne({ email }).select('+password');
    if (!seller) {
        res.status(404);
        throw new Error("Seller not found");
    }

    if (!seller.forgotPasswordTokenExpiration || seller.forgotPasswordTokenExpiration < new Date()) {
        res.status(400);
        throw new Error("Forgot password token has expired");
    }

    const isTokenValid = bcrypt.compareSync(forgotPasswordToken.toString(), seller.forgotPasswordToken);
    if (!isTokenValid) {
        res.status(400);
        throw new Error("Invalid forgot password token");
    }

    seller.password = newPassword; // Will be hashed by schema pre('save')
    seller.isForgotPassword = false;
    seller.forgotPasswordToken = null;
    seller.forgotPasswordTokenExpiration = null;
    await seller.save();

    res.status(200).json({
        message: "Password reset successfully",
        sellerId: seller._id,
        email: seller.email,
    });
});

export const addProduct = asyncHandler(async (req, res) => {
    const { name, description, price, category, stock, images } = req.body;
    const sellerId = req.user._id;

    if (!name || !description || !price || !category || !stock) {
        res.status(400);
        throw new Error("All fields are required");
    }

    const product = await Product.create({
        name,
        description,
        price,
        category,
        stock,
        images: images || [],
        seller: sellerId,
    });

    res.status(201).json({
        message: "Product added successfully",
        productId: product._id,
    });
});

export const getProducts = asyncHandler(async (req, res) => {
    const sellerId = req.user._id;

    const products = await Product.find({ seller: sellerId }).populate("seller", "name email companyName");
    res.status(200).json(products);
});

export const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, stock, images } = req.body;
    const sellerId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error("Invalid product ID");
    }

    const product = await Product.findOneAndUpdate(
        { _id: id, seller: sellerId },
        { name, description, price, category, stock, images: images || [] },
        { new: true }
    );

    if (!product) {
        res.status(404);
        throw new Error("Product not found or you do not have permission to update it");
    }

    res.status(200).json({
        message: "Product updated successfully",
        product,
    });
});
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const sellerId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid product ID.");
  }

  const product = await Product.findOneAndDelete({ _id: id, seller: sellerId });
  if (!product) {
    res.status(404);
    throw new Error("Product not found or you do not have permission to delete it.");
  }

  res.status(200).json({ message: "Product deleted successfully." });
});

