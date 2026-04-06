import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const customerId = request.nextUrl.searchParams.get("customerId");

    if (!customerId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { customer_id: customerId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { items: true }
        }
      }
    });

    return NextResponse.json({ orders });

  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
