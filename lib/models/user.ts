import mongoose, { Model, Schema } from "mongoose";

export type UserRole = "customer" | "seller" | "admin";

export interface IPaymentMethod {
  type: "credit_card" | "paypal" | "wallet";
  details: {
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    paypalEmail?: string;
    walletBalance?: number;
  };
}

export interface IUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  address?: string;
  storeName?: string;
  status: "active" | "pending" | "suspended";
  favorites: string[]; // product ids
  paymentMethods: IPaymentMethod[];
  orderHistory: string[]; // order ids
  reviews: string[]; // review ids
  emailVerified: boolean;
  emailVerificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  loyaltyPoints: number;
  referralCode?: string;
  referredBy?: string;
}

const PaymentMethodSchema = new Schema({
  type: {
    type: String,
    enum: ["credit_card", "paypal", "wallet"],
    required: true,
  },
  details: {
    cardNumber: { type: String },
    expiryDate: { type: String },
    cvv: { type: String },
    paypalEmail: { type: String },
    walletBalance: { type: Number, default: 0 },
  },
});

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer",
      required: true,
    },
    address: { type: String, default: "" },
    storeName: { type: String, default: "" },
    status: {
      type: String,
      enum: ["active", "pending", "suspended"],
      default: "active",
    },
    favorites: { type: [String], default: [] },
    paymentMethods: { type: [PaymentMethodSchema], default: [] },
    orderHistory: { type: [String], default: [] },
    reviews: { type: [String], default: [] },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    loyaltyPoints: { type: Number, default: 0 },
    referralCode: { type: String },
    referredBy: { type: String },
  },
  {
    timestamps: true,
  },
);

const User =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export default User;
