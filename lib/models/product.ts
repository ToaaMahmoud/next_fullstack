import mongoose, { Model, Schema } from "mongoose";

export interface IProduct {
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string; // category id
  stock: number;
  seller: string; // user id
  isActive: boolean;
  tags: string[];
  attributes: { [key: string]: string }; // e.g., color, size
  averageRating: number;
  reviewCount: number;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    images: { type: [String], default: [] },
    category: { type: String },
    stock: { type: Number, required: true, min: 0 },
    seller: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    tags: { type: [String], default: [] },
    attributes: { type: Map, of: String, default: {} },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

const Product =
  (mongoose.models.Product as Model<IProduct>) ||
  mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
