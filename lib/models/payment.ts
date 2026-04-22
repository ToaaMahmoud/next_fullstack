import mongoose, { Model, Schema } from "mongoose";

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface IPayment {
  order: string; // order id
  amount: number;
  method: "credit_card" | "paypal" | "razorpay" | "cash_on_delivery" | "wallet";
  status: PaymentStatus;
  transactionId?: string;
  details: { [key: string]: any }; // gateway specific details
}

const PaymentSchema = new Schema<IPayment>(
  {
    order: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    method: {
      type: String,
      enum: ["credit_card", "paypal", "razorpay", "cash_on_delivery", "wallet"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    transactionId: { type: String },
    details: { type: Map, of: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
  },
);

const Payment =
  (mongoose.models.Payment as Model<IPayment>) ||
  mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
