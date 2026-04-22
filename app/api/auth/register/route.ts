import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import { hashPassword, signAuthToken, toPublicUser } from "@/lib/auth";

const registerSchema = z
  .object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(6),
    password: z.string().min(6),
    address: z.string().optional(),
    storeName: z.string().optional(),
    role: z.enum(["customer", "seller"]),
  })
  .superRefine((val, ctx) => {
    if (val.role === "seller" && !val.storeName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["storeName"],
        message: "Store name is required for sellers",
      });
    }
  });

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid input", errors: parsed.error.flatten() }, { status: 400 });
    }

    const { fullName, email, phone, password, role, address, storeName } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPhone = phone.trim();

    const [existingEmailUser, existingPhoneUser] = await Promise.all([
      User.findOne({ email: normalizedEmail }),
      User.findOne({ phone: normalizedPhone }),
    ]);

    if (existingEmailUser) {
      return NextResponse.json({ message: "Email already exists" }, { status: 409 });
    }

    if (existingPhoneUser) {
      return NextResponse.json({ message: "Phone already exists" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const createdUser = await User.create({
      name: fullName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      password: passwordHash,
      role,
      address: address?.trim() || "",
      storeName: role === "seller" ? storeName?.trim() || "" : "",
      status: role === "seller" ? "pending" : "active",
      favorites: [],
    });

    const user = toPublicUser(createdUser);
    const token = signAuthToken({
      userId: user.id,
      role: user.role,
      email: user.email,
    });

    const response = NextResponse.json(
      { message: "Registered successfully", user, token },
      { status: 201 }
    );
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ message: "Failed to register" }, { status: 500 });
  }
}
