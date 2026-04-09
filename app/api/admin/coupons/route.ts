import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ coupons });
  } catch (error) {
    console.error("Fetch Coupons Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      code, description, type, value, min_order_amount, 
      max_discount, start_date, end_date, usage_limit, is_active 
    } = body;

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        description,
        type: type || "PERCENTAGE",
        value: Number(value),
        min_order_amount: Number(min_order_amount) || 0,
        max_discount: max_discount ? Number(max_discount) : null,
        start_date: start_date ? new Date(start_date) : new Date(),
        end_date: end_date ? new Date(end_date) : null,
        usage_limit: usage_limit ? Number(usage_limit) : null,
        is_active: is_active ?? true,
      },
    });

    return NextResponse.json({ coupon });
  } catch (error: any) {
    console.error("Create Coupon Error:", error);
    if (error.code === 'P2002') {
        return NextResponse.json({ message: "Coupon code already exists" }, { status: 400 });
    }
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
