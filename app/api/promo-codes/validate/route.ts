import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import PromoCode from "@/lib/models/promoCode";

const validatePromoSchema = z.object({
  code: z.string().min(1),
  subtotal: z.number().min(0),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const parsed = validatePromoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { code, subtotal } = parsed.data;
    const normalizedCode = code.toUpperCase().trim();

    const promo = await PromoCode.findOne({
      code: normalizedCode,
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() },
    });

    if (!promo) {
      return NextResponse.json(
        { message: "Invalid or expired promo code" },
        { status: 400 },
      );
    }

    if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
      return NextResponse.json(
        { message: "Promo code usage limit exceeded" },
        { status: 400 },
      );
    }

    if (promo.minOrderAmount && subtotal < promo.minOrderAmount) {
      return NextResponse.json(
        { message: `Minimum order amount is $${promo.minOrderAmount}` },
        { status: 400 },
      );
    }

    let discount = 0;
    if (promo.discountType === "percentage") {
      discount = (subtotal * promo.discountValue) / 100;
      if (promo.maxDiscount) {
        discount = Math.min(discount, promo.maxDiscount);
      }
    } else {
      discount = promo.discountValue;
    }

    discount = Number(discount.toFixed(2));

    return NextResponse.json({
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      discount,
      maxDiscount: promo.maxDiscount,
    });
  } catch (error) {
    console.error("Validate promo error:", error);
    return NextResponse.json(
      { message: "Failed to validate promo code" },
      { status: 500 },
    );
  }
}
