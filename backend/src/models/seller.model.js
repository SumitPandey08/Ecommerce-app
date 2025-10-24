import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const sellerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // prevents password from being returned in queries by default
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    productCatalog: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyToken: {
      type: String,
      default: null,
    },
    verifyTokenExpiration: {
      type: Date,
      default: null,
    },
    isForgotPassword: {
      type: Boolean,
      default: false,
    },
    forgotPasswordToken: {
      type: String,
      default: null,
    },
    forgotPasswordTokenExpiration: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Hash password before saving
sellerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Optional: Add a method for password comparison
sellerSchema.methods.isPasswordValid = async function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

const Seller = mongoose.model("Seller", sellerSchema);

export default Seller;
