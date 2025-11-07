
import bcrypt from "bcryptjs";
import sendStyledOTP from "./nodemailer.js";

export const generateAndSendOTP = async (email, user) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);
    const hashedOTP = bcrypt.hashSync(otp.toString(), 10);

    await sendStyledOTP(email, otp);

    user.verifyToken = hashedOTP;
    user.verifyTokenExpiration = otpExpiration;

    await user.save();
};
