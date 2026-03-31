import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./dashboard-client";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Vortex Command Center - FlashTech",
  description: "Hệ thống quản trị thế hệ mới",
};



export default async function AdminDashboard() {
  const totalUsers = await prisma.user.count();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentUsers = await prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } });
  const growth = totalUsers > 0 ? ((recentUsers / totalUsers) * 100).toFixed(1) : "0";

  return <DashboardClient totalUsers={totalUsers} growth={growth} />;
}
