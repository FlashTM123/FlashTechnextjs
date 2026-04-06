import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    const customerId = request.nextUrl.searchParams.get("customerId");

    if (!customerId) {
        return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        customer_id: customerId // Security check: Ensure order belongs to customer
      },
      include: {
        items: true
      }
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });

  } catch (error) {
    console.error("Order Detail Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    const body = await request.json();
    const { customerId, action } = body;

    if (!customerId || action !== "CANCEL") {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    // 1. Transaction to handle cancellation and stock restoration
    const result = await prisma.$transaction(async (tx) => {
      // Find the order with items
      const order = await tx.order.findUnique({
        where: { id: orderId, customer_id: customerId },
        include: { items: true }
      });

      if (!order) {
        throw new Error("Không tìm thấy đơn hàng");
      }

      if (order.status !== "PENDING") {
        throw new Error("Chỉ có thể hủy đơn hàng đang ở trạng thái 'Chờ xác nhận'");
      }

      // Update status to CANCELLED
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" }
      });

      // Restore stock for each variant
      for (const item of order.items) {
        if (item.product_variant_id) {
          await tx.productVariant.update({
            where: { id: item.product_variant_id },
            data: { stock: { increment: item.quantity } }
          });
        }
      }

      return updatedOrder;
    });

    return NextResponse.json({ 
        message: "Đã hủy đơn hàng thành công", 
        order: result 
    });

  } catch (error: any) {
    console.error("Cancel Order Error:", error);
    return NextResponse.json({ message: error.message || "Failed to cancel order" }, { status: 500 });
  }
}
