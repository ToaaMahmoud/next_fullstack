import mongoose, { Model, Schema } from "mongoose";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface IOrderItem {
  product: string; // product id
  quantity: number;
  price: number; // price at time of order
}

export interface IOrder {
  user: string; // user id
  items: IOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  paymentMethod: string; // payment id
  trackingNumber?: string;
  notes?: string;
  promoCode?: string;
  discountAmount: number;
}

const OrderItemSchema = new Schema({
  product: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
});

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: String, required: true },
    items: { type: [OrderItemSchema], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    trackingNumber: { type: String },
    notes: { type: String },
    promoCode: { type: String },
    discountAmount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

const Order =
  (mongoose.models.Order as Model<IOrder>) ||
  mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
