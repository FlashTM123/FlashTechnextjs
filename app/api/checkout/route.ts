import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
        customer_id, 
        items, 
        total_amount, 
        full_name, 
        phone_number, 
        shipping_address, 
        payment_method 
    } = body;

    if (!customer_id || !items || items.length === 0) {
      return NextResponse.json({ message: "Invalid order data" }, { status: 400 });
    }

    // Generate unique order number: FT-DATE-RANDOM
    const date = new Date();
    const dateStr = `${date.getDate()}${date.getMonth() + 1}${date.getFullYear().toString().slice(-2)}`;
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    const orderNumber = `FT-${dateStr}-${randomStr}`;

    // Use a transaction to create Order and OrderItems
    const result = await prisma.$transaction(async (tx) => {
      // 1. Check stock for each variant and update
      for (const item of items) {
        if (item.variantId) {
          const variant = await tx.productVariant.findUnique({
            where: { id: item.variantId },
            select: { stock: true, name: true }
          });

          if (!variant || variant.stock < item.quantity) {
             throw new Error(`Sản phẩm "${item.name} (${variant?.name || 'Mặc định'})" không đủ hàng trong kho.`);
          }

          // Decrement stock
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } }
          });
        }
      }

      // 2. Create the Order
      const order = await tx.order.create({
        data: {
          order_number: orderNumber,
          customer_id: customer_id,
          total_amount: total_amount,
          full_name: full_name,
          phone_number: phone_number,
          shipping_address: shipping_address,
          payment_method: payment_method,
          status: "PENDING",
          payment_status: "UNPAID",
        },
      });

      // 3. Create OrderItems
      const orderItemsData = items.map((item: any) => ({
        order_id: order.id,
        product_id: item.productId,
        product_variant_id: item.variantId,
        name: item.name,
        variant_name: item.variantName,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
      }));

      await tx.orderItem.createMany({
        data: orderItemsData,
      });

      return order;
    });

    return NextResponse.json({ 
        message: "Order created successfully", 
        orderId: result.id,
        orderNumber: result.order_number
    });

  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ message: "Failed to create order" }, { status: 500 });
  }
}
