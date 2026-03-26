import {
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  ChevronRight,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard - FlashTech Admin",
  description: "Hệ thống quản trị dữ liệu thông minh",
};

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const recentOrders = [
  { id: "#12345", customer: "John Doe", email: "john@example.com", amount: "$156.00", status: "Completed", date: "2 giờ trước" },
  { id: "#12346", customer: "Jane Smith", email: "jane@example.com", amount: "$234.50", status: "Pending", date: "4 giờ trước" },
  { id: "#12347", customer: "Bob Johnson", email: "bob@example.com", amount: "$89.99", status: "Processing", date: "6 giờ trước" },
  { id: "#12348", customer: "Alice Brown", email: "alice@example.com", amount: "$312.00", status: "Completed", date: "1 ngày trước" },
];

const statusConfig = {
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Pending: "bg-amber-50 text-amber-700 border-amber-100",
  Processing: "bg-sky-50 text-sky-700 border-sky-100",
  Cancelled: "bg-rose-50 text-rose-700 border-rose-100",
};

export default async function AdminDashboard() {
  const totalUsers = await prisma.user.count();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentUsers = await prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } });
  const growth = totalUsers > 0 ? ((recentUsers / totalUsers) * 100).toFixed(1) : "0";

  const stats = [
    { name: "Tổng người dùng", value: totalUsers.toLocaleString(), change: `+${growth}%`, trend: "up", icon: Users, color: "blue" },
    { name: "Tổng đơn hàng", value: "1,234", change: "+8.2%", trend: "up", icon: ShoppingCart, color: "green" },
    { name: "Doanh thu", value: "$45,678", change: "-3.1%", trend: "down", icon: DollarSign, color: "purple" },
    { name: "Tăng trưởng", value: "23.5%", change: "+4.3%", trend: "up", icon: TrendingUp, color: "orange" },
  ];

  const colorMap = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    green: "text-emerald-600 bg-emerald-50 border-emerald-100",
    purple: "text-violet-600 bg-violet-50 border-violet-100",
    orange: "text-orange-600 bg-orange-50 border-orange-100",
  };

  return (
    <div className="p-2 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Trạm điều hành</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Chào mừng trở lại! Đây là tổng quan hoạt động kinh doanh hôm nay.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200 h-10 font-bold text-xs px-5 hover:bg-slate-50 transition-all">Lịch sử hoạt động</Button>
          <Button className="rounded-xl bg-slate-900 hover:bg-black text-white h-10 font-bold text-xs px-5 shadow-lg shadow-slate-200 transition-all">Xuất báo cáo</Button>
        </div>
      </div>

      {/* Stats Grid - Compact & Elegant */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClass = colorMap[stat.color as keyof typeof colorMap];
          return (
            <Card key={stat.name} className="relative group overflow-hidden p-6 border border-slate-100 bg-white hover:border-slate-300 hover:shadow-xl transition-all duration-300 rounded-[24px]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{stat.name}</h3>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                </div>
                <div className={cn("p-3 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300 border", colorClass)}>
                  <Icon size={20} strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-black",
                  stat.trend === "up" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                )}>
                  {stat.trend === "up" ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />}
                  {stat.change}
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">so với tháng trước</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Orders - Refined Table */}
      <Card className="border border-slate-100 shadow-sm rounded-[32px] overflow-hidden bg-white">
        <div className="bg-slate-50/50 px-8 py-6 flex items-center justify-between border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Giao dịch gần đây</h2>
          <Button variant="ghost" className="text-indigo-600 font-bold text-xs hover:bg-indigo-50 rounded-xl">Xem tất cả</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã đơn</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Khách hàng</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Giá trị</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Tác vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentOrders.map((order) => (
                <tr key={order.id} className="group hover:bg-slate-50/50 transition-all duration-200">
                  <td className="px-8 py-5 font-black text-sm text-slate-900">{order.id}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-500 text-xs">{order.customer[0]}</div>
                      <div>
                        <p className="text-sm font-black text-slate-900 leading-none mb-1">{order.customer}</p>
                        <p className="text-[10px] font-bold text-slate-400">{order.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 font-black text-sm text-slate-900">{order.amount}</td>
                  <td className="px-8 py-5">
                    <Badge className={cn(
                      statusConfig[order.status as keyof typeof statusConfig],
                      "rounded-lg border-none px-2.5 py-1 text-[9px] font-black uppercase tracking-widest"
                    )}>{order.status}</Badge>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-900 transition-all">
                          <MoreVertical size={16} />
                        </Button>
                      }/>
                      <DropdownMenuContent align="end" className="w-44 p-1.5 rounded-xl border-slate-100 shadow-xl">
                        <DropdownMenuItem className="rounded-lg font-bold text-xs py-2.5 cursor-pointer">Chi tiết</DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg font-bold text-xs py-2.5 text-rose-500 focus:bg-rose-50 cursor-pointer">Hủy đơn</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
