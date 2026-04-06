import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { order_number: { contains: search, mode: "insensitive" } },
        { customer: { full_name: { contains: search, mode: "insensitive" } } },
        { full_name: { contains: search, mode: "insensitive" } } // Shipping name
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: {
          select: {
            full_name: true,
            email: true,
            customer_id: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });

  } catch (error) {
    console.error("Admin Fetch Orders Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
