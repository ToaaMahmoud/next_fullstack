import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import { verifyAuthToken } from "@/lib/auth";

const addFavoriteSchema = z.object({
  productId: z.string(),
});

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = verifyAuthToken(token);
    await connectDB();

    const user = await User.findById(payload.userId).select("favorites");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ favorites: user.favorites });
  } catch (error) {
    console.error("Get favorites error:", error);
    return NextResponse.json(
      { message: "Failed to fetch favorites" },
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
    const parsed = addFavoriteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { productId } = parsed.data;

    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!user.favorites.includes(productId)) {
      user.favorites.push(productId);
      await user.save();
    }

    return NextResponse.json({ favorites: user.favorites });
  } catch (error) {
    console.error("Add favorite error:", error);
    return NextResponse.json(
      { message: "Failed to add favorite" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = verifyAuthToken(token);
    await connectDB();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID required" },
        { status: 400 },
      );
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.favorites = user.favorites.filter((id) => id !== productId);
    await user.save();

    return NextResponse.json({ favorites: user.favorites });
  } catch (error) {
    console.error("Remove favorite error:", error);
    return NextResponse.json(
      { message: "Failed to remove favorite" },
      { status: 500 },
    );
  }
}
