import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 },
      );
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    return NextResponse.redirect(new URL("/signin?verified=true", request.url));
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json(
      { message: "Failed to verify email" },
      { status: 500 },
    );
  }
}
