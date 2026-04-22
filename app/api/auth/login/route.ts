import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import { comparePassword, signAuthToken, toPublicUser } from "@/lib/auth";

const loginSchema = z.object({
  emailOrPhone: z.string().min(3),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
    }

    const { emailOrPhone, password } = parsed.data;
    const loginKey = emailOrPhone.trim();

    const userDoc = await User.findOne({
      $or: [{ email: loginKey.toLowerCase() }, { phone: loginKey }],
    });

    if (!userDoc) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const validPassword = await comparePassword(password, userDoc.password);
    if (!validPassword) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const user = toPublicUser(userDoc);
    const token = signAuthToken({
      userId: user.id,
      role: user.role,
      email: user.email,
    });

    const response = NextResponse.json({ message: "Logged in", user, token });
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Failed to login" }, { status: 500 });
  }
}
