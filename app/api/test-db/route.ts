import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
    try {
        await connectDB();
        return NextResponse.json({ message: "DB Connected" });
    } catch (error) {
        return NextResponse.json({ message: "DB Failed", error }, { status: 500 });
    }
}