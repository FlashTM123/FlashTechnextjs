import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./dashboard-client";

export const metadata: Metadata = {
  title: "FlashTech Commerce Hub - Management Panel",
  description: "Hệ thống quản trị thương mại điện tử FlashTech",
};

export default async function AdminDashboard() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // 1. Total Counts
  const totalUsers = await prisma.user.count();
  const totalCustomers = await prisma.customer.count();
  const totalProducts = await prisma.product.count();
  const totalOrders = await prisma.order.count({ where: { status: { not: "CANCELLED" } } });

  // 2. Revenue Calculation
  const revenueData = await prisma.order.aggregate({
    where: { status: { not: "CANCELLED" } },
    _sum: { total_amount: true },
  });
  const totalRevenue = revenueData._sum.total_amount || 0;

  // 3. Active Orders (Processing/Pending)
  const activeOrdersCount = await prisma.order.count({
    where: { status: { in: ["PENDING", "CONFIRMED", "SHIPPING"] } }
  });

  // 4. Growth Rates (Last 30 days vs 30 days before that)
  const currentMonthUsers = await prisma.customer.count({
    where: { createdAt: { gte: thirtyDaysAgo } }
  });
  const previousMonthUsers = await prisma.customer.count({
    where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } }
  });
  const customerGrowth = previousMonthUsers > 0 
    ? ((currentMonthUsers - previousMonthUsers) / previousMonthUsers * 100).toFixed(1)
    : "100.0";

  // 5. Recent Orders (with customer data)
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      customer: {
        select: {
          full_name: true,
          email: true,
          avatar: true
        }
      }
    }
  });

  // 6. Conversion Rate
  const conversionRate = totalCustomers > 0 
    ? ((totalOrders / totalCustomers) * 100).toFixed(1) 
    : "0.0";

  // 7. System Events (Combine latest 2 orders and latest 2 customers)
  const latestO = await prisma.order.findMany({ take: 2, orderBy: { createdAt: "desc" } });
  const latestC = await prisma.customer.findMany({ take: 2, orderBy: { createdAt: "desc" } });

  const events = [
    ...latestO.map(o => ({ title: `Đơn hàng mới ${o.order_number}`, time: o.createdAt, type: "order" })),
    ...latestC.map(c => ({ title: `Khách hàng mới: ${c.full_name}`, time: c.createdAt, type: "customer" }))
  ].sort((a, b) => b.time.getTime() - a.time.getTime());

  return (
    <DashboardClient 
      totalRevenue={totalRevenue}
      totalUsers={totalCustomers}
      activeOrders={activeOrdersCount}
      conversionRate={conversionRate}
      customerGrowth={customerGrowth}
      recentOrders={recentOrders}
      systemEvents={events}
    />
  );
}
