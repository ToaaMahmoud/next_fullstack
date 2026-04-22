import mongoose, { Model, Schema } from "mongoose";

export interface IPromoCode {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  applicableCategories?: string[]; // category ids
  applicableProducts?: string[]; // product ids
}

const PromoCodeSchema = new Schema<IPromoCode>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: { type: Number, required: true, min: 0 },
    minOrderAmount: { type: Number, min: 0 },
    maxDiscount: { type: Number, min: 0 },
    usageLimit: { type: Number, min: 1 },
    usedCount: { type: Number, default: 0 },
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    applicableCategories: { type: [String], default: [] },
    applicableProducts: { type: [String], default: [] },
  },
  {
    timestamps: true,
  },
);

const PromoCode =
  (mongoose.models.PromoCode as Model<IPromoCode>) ||
  mongoose.model<IPromoCode>("PromoCode", PromoCodeSchema);

export default PromoCode;
