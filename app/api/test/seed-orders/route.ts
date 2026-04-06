import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { customerId } = await request.json();

    if (!customerId) {
      return NextResponse.json({ message: "Missing customerId" }, { status: 400 });
    }

    // 1. Get some products to create items
    const products = await prisma.product.findMany({
      take: 2,
      include: { variants: true }
    });

    if (products.length === 0) {
      return NextResponse.json({ message: "No products found to seed orders" }, { status: 400 });
    }

    const orderDate = new Date();
    const dateStr = orderDate.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
    
    // 2. Create 3 Mock Orders
    const orders = [];
    const statuses = ["DELIVERED", "SHIPPING", "PENDING"];

    for (let i = 0; i < 3; i++) {
        const orderNumber = `FT-${dateStr}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
        const status = statuses[i] as any;
        
        const newOrder = await prisma.order.create({
            data: {
                order_number: orderNumber,
                customer_id: customerId,
                total_amount: products[0].base_price * (i + 1),
                status: status,
                shipping_address: "123 Technology St, Cầu Giấy, Hà Nội",
                phone_number: "0987654321",
                full_name: "Customer Tester",
                payment_method: "COD",
                payment_status: status === "DELIVERED" ? "PAID" : "UNPAID",
                items: {
                    create: [
                        {
                            product_id: products[0].id,
                            product_variant_id: products[0].variants[0]?.id || null,
                            name: products[0].name,
                            variant_name: products[0].variants[0]?.name || "Default",
                            image: products[0].images[0] || "",
                            quantity: i + 1,
                            price: products[0].base_price
                        }
                    ]
                }
            }
        });
        orders.push(newOrder);
    }

    return NextResponse.json({
      message: "Seed orders created successfully",
      orders
    });

  } catch (error) {
    console.error("Seed Orders Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
