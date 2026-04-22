import mongoose, { Model, Schema } from "mongoose";

export type UserRole = "customer" | "seller" | "admin";

export interface IUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  address?: string;
  storeName?: string;
  status: "active" | "pending";
  favorites: string[];
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
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
    status: { type: String, enum: ["active", "pending"], default: "active" },
    favorites: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

const User = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>("User", UserSchema);

export default User;
