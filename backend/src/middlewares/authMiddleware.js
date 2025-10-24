import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Seller from "../models/seller.model.js";
import asyncHandler from "express-async-handler";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // ✅ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ Handle both id and _id in payload
      const userId = decoded.id || decoded._id;

      if (!userId) {
        res.status(401);
        throw new Error("Invalid token payload");
      }

      // ✅ Try Users first
      let foundUser = await User.findById(userId).select("-password");

      // ✅ If not found, try Sellers
      if (!foundUser) {
        foundUser = await Seller.findById(userId).select("-password");
      }

      if (!foundUser) {
        res.status(401);
        throw new Error("Not authorized, user or seller not found");
      }

      // ✅ Attach the user/seller to req
      req.user = foundUser;

      next();
    } catch (error) {
      console.error("❌ JWT Error:", error.message);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export { protect };
