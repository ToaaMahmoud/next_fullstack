import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import Order from "@/lib/models/order";
import { verifyAuthToken } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import User from "@/lib/models/user";

const updateOrderSchema = z.object({
  status: z
    .enum(["pending", "confirmed", "shipped", "delivered", "cancelled"])
    .optional(),
  trackingNumber: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = request.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = verifyAuthToken(token);
    await connectDB();

    const { id } = await params;

    const order = await Order.findOne({ _id: id, user: payload.userId })
      .populate("items.product", "name price images")
      .populate("user", "name email");

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Get order error:", error);
    return NextResponse.json(
      { message: "Failed to fetch order" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = request.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = verifyAuthToken(token);
    await connectDB();

    const body = await request.json();
    const parsed = updateOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const updates = parsed.data;

    const { id } = await params;

    const order = await Order.findOneAndUpdate(
      { _id: id, user: payload.userId },
      updates,
      { new: true },
    ).populate("items.product", "name price images");

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Send email notification if status changed
    if (updates.status) {
      try {
        const user = await User.findById(order.user);
        if (user) {
          await sendEmail(
            user.email,
            `Order ${updates.status}`,
            `Your order ${order._id} status has been updated to ${updates.status}.`,
          );
        }
      } catch (emailError) {
        console.error("Email send error:", emailError);
      }
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json(
      { message: "Failed to update order" },
      { status: 500 },
    );
  }
}
