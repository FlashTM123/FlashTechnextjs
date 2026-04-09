import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { 
      code, description, type, value, min_order_amount, 
      max_discount, start_date, end_date, usage_limit, is_active 
    } = body;

    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        code: code?.toUpperCase(),
        description,
        type,
        value: value !== undefined ? Number(value) : undefined,
        min_order_amount: min_order_amount !== undefined ? Number(min_order_amount) : undefined,
        max_discount: max_discount !== undefined ? Number(max_discount) : undefined,
        start_date: start_date ? new Date(start_date) : undefined,
        end_date: end_date ? new Date(end_date) : undefined,
        usage_limit: usage_limit !== undefined ? Number(usage_limit) : undefined,
        is_active,
      },
    });

    return NextResponse.json({ coupon });
  } catch (error) {
    console.error("Update Coupon Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    await prisma.coupon.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Delete Coupon Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
