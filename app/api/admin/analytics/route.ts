import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { subDays, startOfDay, format } from "date-fns";

export async function GET() {
  try {
    // 1. Basic Counts & Sums
    const [totalOrders, totalCustomers, deliveredOrders] = await Promise.all([
      prisma.order.count(),
      prisma.customer.count(),
      prisma.order.findMany({
        where: { status: "DELIVERED" },
        select: { total_amount: true }
      })
    ]);

    const totalRevenue = deliveredOrders.reduce((acc, curr) => acc + curr.total_amount, 0);

    // 2. Revenue History (Last 30 Days)
    const thirtyDaysAgo = subDays(new Date(), 30);
    const recentOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
        status: "DELIVERED"
      },
      select: {
        total_amount: true,
        createdAt: true
      }
    });

    // Bucket revenue by day
    const historyMap: Record<string, { revenue: number, orders: number }> = {};
    for (let i = 0; i <= 30; i++) {
        const dateStr = format(subDays(new Date(), i), "dd/MM");
        historyMap[dateStr] = { revenue: 0, orders: 0 };
    }

    recentOrders.forEach(order => {
        const dateStr = format(order.createdAt, "dd/MM");
        if (historyMap[dateStr]) {
            historyMap[dateStr].revenue += order.total_amount;
            historyMap[dateStr].orders += 1;
        }
    });

    const revenueHistory = Object.entries(historyMap)
        .map(([name, data]) => ({ name, ...data }))
        .reverse();

    // 3. Category Distribution
    const categoryCounts = await prisma.product.groupBy({
        by: ['category'],
        _count: { id: true }
    });

    const totalProducts = categoryCounts.reduce((acc, curr) => acc + curr._count.id, 0);
    const categoryData = categoryCounts.map(c => ({
        name: c.category.charAt(0) + c.category.slice(1).toLowerCase(),
        value: Math.round((c._count.id / totalProducts) * 100)
    }));

    // 4. Top Selling Products
    // We get order items and group them by product name
    const orderItems = await prisma.orderItem.findMany({
        select: {
            name: true,
            quantity: true,
            price: true,
            product_id: true
        }
    });

    const productsMap: Record<string, { sales: number, revenue: number }> = {};
    orderItems.forEach(item => {
        if (!productsMap[item.name]) {
            productsMap[item.name] = { sales: 0, revenue: 0 };
        }
        productsMap[item.name].sales += item.quantity;
        productsMap[item.name].revenue += item.price * item.quantity;
    });

    const topProducts = Object.entries(productsMap)
        .map(([name, data]) => ({ 
            id: name, 
            name, 
            sales: data.sales, 
            revenue: data.revenue 
        }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5)
        .map((p, i) => ({
            ...p,
            id: i + 1,
            revenue: p.revenue >= 1000000 ? `${(p.revenue / 1000000).toFixed(1)}M` : `${p.revenue.toLocaleString()}đ`,
            status: i === 0 ? "Hot" : "Steady"
        }));

    return NextResponse.json({
        stats: {
            totalRevenue,
            totalOrders,
            totalCustomers,
            conversionRate: "3.24%" // Mocked for now as we don't track sessions in DB
        },
        revenueHistory,
        categoryData,
        topProducts
    });

  } catch (error: any) {
    console.error("Analytics API Error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
