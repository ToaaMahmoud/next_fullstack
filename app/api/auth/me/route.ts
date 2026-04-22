import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import { toPublicUser, verifyAuthToken } from "@/lib/auth";

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(6).optional(),
  address: z.string().optional(),
  storeName: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    const payload = verifyAuthToken(token);
    await connectDB();

    const userDoc = await User.findById(payload.userId);
    if (!userDoc) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: toPublicUser(userDoc) });
  } catch {
    return NextResponse.json({ user: null });
  }
}

export async function PUT(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = verifyAuthToken(token);
    await connectDB();

    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const updates = parsed.data;

    // Check for unique phone if updating phone
    if (updates.phone) {
      const existingPhoneUser = await User.findOne({
        phone: updates.phone.trim(),
        _id: { $ne: payload.userId },
      });
      if (existingPhoneUser) {
        return NextResponse.json(
          { message: "Phone already exists" },
          { status: 409 },
        );
      }
    }

    const userDoc = await User.findByIdAndUpdate(
      payload.userId,
      { ...updates, phone: updates.phone?.trim() },
      { new: true },
    );

    if (!userDoc) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: toPublicUser(userDoc) });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { message: "Failed to update profile" },
      { status: 500 },
    );
  }
}
