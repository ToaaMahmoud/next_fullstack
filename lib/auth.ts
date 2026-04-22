import bcrypt from "bcryptjs";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { IUser, UserRole } from "@/lib/models/user";

const TOKEN_EXPIRES_IN = "7d";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Please define JWT_SECRET in .env.local");
  }
  return secret;
}

export interface AuthTokenPayload extends JwtPayload {
  userId: string;
  role: UserRole;
  email: string;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  address?: string;
  storeName?: string;
  status: "active" | "pending" | "suspended";
  favorites: string[];
  paymentMethods: any[]; // simplified
  orderHistory: string[];
  reviews: string[];
  emailVerified: boolean;
  loyaltyPoints: number;
  referralCode?: string;
}

export function toPublicUser(
  user: IUser & { _id: { toString: () => string } },
): PublicUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    address: user.address,
    storeName: user.storeName,
    status: user.status,
    favorites: user.favorites || [],
    paymentMethods: user.paymentMethods || [],
    orderHistory: user.orderHistory || [],
    reviews: user.reviews || [],
    emailVerified: user.emailVerified,
    loyaltyPoints: user.loyaltyPoints,
    referralCode: user.referralCode,
  };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signAuthToken(
  payload: Omit<AuthTokenPayload, keyof JwtPayload>,
): string {
  const options: SignOptions = { expiresIn: TOKEN_EXPIRES_IN };
  return jwt.sign(payload, getJwtSecret(), options);
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  return jwt.verify(token, getJwtSecret()) as AuthTokenPayload;
}
