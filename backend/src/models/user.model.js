import mongoose from "mongoose";
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
    VerifyToken: {
      type: String,
      default: null,
    },
    VerifyTokenExpiration: {
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

const User = mongoose.model("User", userSchema);

export default User;
