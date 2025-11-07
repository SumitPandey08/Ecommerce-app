import mongoose from "mongoose";
import bcrypt from "bcryptjs";
//cart schema
const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    accessToken: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyToken: {
      type: String,
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
    verifyTokenExpiration: {
      type: Date,
      default: null,
    },
    forgotPasswordTokenExpiration: {
      type: Date,
      default: null,
    },
    cart: {
      type: [cartItemSchema],
      default: [],
    },
    orders: {
      type: Array,
      default: [],
    },
    address :{
      type : String,
    }
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
