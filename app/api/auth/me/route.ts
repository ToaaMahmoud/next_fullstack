import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import { toPublicUser, verifyAuthToken } from "@/lib/auth";

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
