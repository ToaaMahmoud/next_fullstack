import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import Order from "@/lib/models/order";
import PromoCode from "@/lib/models/promoCode";
import User from "@/lib/models/user";
import Product from "@/lib/models/product";
import { verifyAuthToken } from "@/lib/auth";

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      product: z.string(),
      quantity: z.number().min(1),
    }),
  ),
  shippingAddress: z.string().min(1),
  paymentMethod: z.enum([
    "credit_card",
    "paypal",
    "razorpay",
    "cash_on_delivery",
    "wallet",
  ]),
  promoCode: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = verifyAuthToken(token);
    await connectDB();

    const orders = await Order.find({ user: payload.userId })
      .sort({ createdAt: -1 })
      .populate("items.product", "name price images")
      .populate("paymentMethod");

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
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
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { items, shippingAddress, paymentMethod, promoCode } = parsed.data;

    // Validate products and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive || product.stock < item.quantity) {
        return NextResponse.json(
          { message: `Product ${item.product} not available` },
          { status: 400 },
        );
      }
      totalAmount += product.price * item.quantity;
      orderItems.push({
        product: item.product,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Apply promo code
    let discountAmount = 0;
    if (promoCode) {
      const promo = await PromoCode.findOne({
        code: promoCode.toUpperCase(),
        isActive: true,
      });
      if (
        !promo ||
        promo.validUntil < new Date() ||
        promo.validFrom > new Date()
      ) {
        return NextResponse.json(
          { message: "Invalid promo code" },
          { status: 400 },
        );
      }
      if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
        return NextResponse.json(
          { message: "Promo code usage limit reached" },
          { status: 400 },
        );
      }
      if (promo.minOrderAmount && totalAmount < promo.minOrderAmount) {
        return NextResponse.json(
          { message: "Minimum order amount not met for promo code" },
          { status: 400 },
        );
      }

      if (promo.discountType === "percentage") {
        discountAmount = (totalAmount * promo.discountValue) / 100;
        if (promo.maxDiscount && discountAmount > promo.maxDiscount) {
          discountAmount = promo.maxDiscount;
        }
      } else {
        discountAmount = promo.discountValue;
      }

      promo.usedCount += 1;
      await promo.save();
    }

    totalAmount -= discountAmount;

    // Create order
    const order = await Order.create({
      user: payload.userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      discountAmount,
      promoCode,
    });

    // Update user order history
    await User.findByIdAndUpdate(payload.userId, {
      $push: { orderHistory: order._id.toString() },
    });

    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { message: "Failed to create order" },
      { status: 500 },
    );
  }
}
