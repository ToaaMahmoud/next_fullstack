import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import Review from "@/lib/models/review";
import User from "@/lib/models/user";
import Product from "@/lib/models/product";
import Order from "@/lib/models/order";
import { verifyAuthToken } from "@/lib/auth";

const createReviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const userId = searchParams.get("userId");

    const query: any = {};
    if (productId) query.product = productId;
    if (userId) query.user = userId;

    const reviews = await Review.find(query)
      .populate("user", "name")
      .populate("product", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Get reviews error:", error);
    return NextResponse.json(
      { message: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = verifyAuthToken(token);
    await connectDB();

    const body = await request.json();
    const parsed = createReviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { productId, rating, comment, images } = parsed.data;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    // Check if user has purchased the product
    const hasPurchased = await Order.findOne({
      user: payload.userId,
      "items.product": productId,
      status: { $in: ["delivered", "shipped"] },
    });

    const review = await Review.create({
      user: payload.userId,
      product: productId,
      rating,
      comment,
      images: images || [],
      isVerified: !!hasPurchased,
    });

    // Update product rating
    const allReviews = await Review.find({ product: productId });
    const averageRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Product.findByIdAndUpdate(productId, {
      averageRating,
      reviewCount: allReviews.length,
    });

    // Add to user reviews
    await User.findByIdAndUpdate(payload.userId, {
      $push: { reviews: review._id.toString() },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json(
      { message: "Failed to create review" },
      { status: 500 },
    );
  }
}
