import mongoose, { Model, Schema } from "mongoose";

export interface IReview {
  user: string; // user id
  product: string; // product id
  rating: number; // 1-5
  comment?: string;
  images?: string[];
  isVerified: boolean; // if user purchased the product
}

const ReviewSchema = new Schema<IReview>(
  {
    user: { type: String, required: true },
    product: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    images: { type: [String], default: [] },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

// Compound index to ensure one review per user per product
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

const Review =
  (mongoose.models.Review as Model<IReview>) ||
  mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
