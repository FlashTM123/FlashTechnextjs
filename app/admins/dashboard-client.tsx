"use client";

import {
  Users, ShoppingCart, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight,
  MoreVertical, ChevronRight, Activity, Zap, PackageCheck, CreditCard,
  Target, BarChart3, Globe2, Clock, Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/app/context/language-context";
import Link from "next/link";

const statusConfig = {
  PENDING: "bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-200 dark:border-amber-500/20",
  CONFIRMED: "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-200 dark:border-blue-500/20",
  SHIPPING: "bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-500 border-indigo-200 dark:border-indigo-500/20",
  DELIVERED: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-200 dark:border-emerald-500/20",
  CANCELLED: "bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20",
  RETURNED: "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/20",
};

import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface DashboardClientProps {
  totalRevenue: number;
  totalUsers: number;
  activeOrders: number;
  conversionRate: string;
  customerGrowth: string;
  recentOrders: any[];
  systemEvents: any[];
}

export default function DashboardClient({ 
  totalRevenue, 
  totalUsers, 
  activeOrders, 
  conversionRate, 
  customerGrowth,
  recentOrders,
  systemEvents
}: DashboardClientProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-transparent dark:bg-[url('https://grainy-gradients.vercel.app/noise.svg')] dark:bg-blend-multiply text-slate-800 dark:text-slate-200 p-4 md:p-8 lg:p-10 space-y-8 animate-in fade-in duration-1000 relative overflow-hidden transition-colors">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 dark:bg-indigo-600/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 dark:bg-fuchsia-600/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="flex flex-col xl:flex-row gap-8 relative z-10 items-stretch">
        <div className="flex-1 relative rounded-[40px] overflow-hidden bg-slate-900/5 dark:bg-black/40 border border-slate-200 dark:border-white/5 p-10 lg:p-14 backdrop-blur-2xl shadow-xl dark:shadow-2xl flex flex-col justify-center min-h-[350px]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] opacity-30" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
              FlashTech Commerce Management Hub v1.0
            </div>

            <h1 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-[1.1] transition-colors">
              Store Performance <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-600 dark:from-indigo-400 dark:via-fuchsia-400 dark:to-rose-400">
                All metrics operational.
              </span>
            </h1>

            <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-xl mb-10 transition-colors">
              Chào mừng quay trở lại, Admin. Hệ thống đang theo dõi {activeOrders} đơn hàng đang hoạt động và hiệu suất bán hàng đang duy trì ở mức cao.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button className="h-14 px-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 font-bold shadow-lg transition-all hover:scale-105 active:scale-95 text-sm">
                Bắt đầu chuỗi lệnh
                <Zap className="ml-2 w-4 h-4 text-indigo-300 dark:text-indigo-600 fill-current" />
              </Button>
              <Button variant="outline" className="h-14 px-8 rounded-full bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-white border-slate-200 dark:border-white/10 backdrop-blur-md font-bold transition-all hover:scale-105 active:scale-95 text-sm group">
                <Globe2 className="mr-2 w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white transition-colors" />
                Live Map
              </Button>
            </div>
          </div>

          <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4">
            <div className="w-64 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-xl dark:shadow-2xl animate-[float_6s_ease-in-out_infinite] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"><Activity className="w-5 h-5" /></div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold transition-colors">Server Health</p>
                  <p className="text-slate-900 dark:text-white font-black text-xl transition-colors">99.9%</p>
                </div>
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden transition-colors">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 w-full rounded-full" />
              </div>
            </div>

            <div className="w-64 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-xl dark:shadow-2xl animate-[float_6s_ease-in-out_infinite_1s] ml-12 transition-colors">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2.5 rounded-xl bg-fuchsia-100 dark:bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400"><Users className="w-5 h-5" /></div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold transition-colors">Khách hàng mới</p>
                  <p className="text-slate-900 dark:text-white font-black text-xl transition-colors">+{customerGrowth}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {[
          { title: "Tổng doanh thu", value: `${totalRevenue.toLocaleString("vi-VN")}đ`, sub: "Dữ liệu tích lũy", icon: DollarSign, trend: "up", gradient: "from-indigo-500 to-purple-500", delay: "delay-100" },
          { title: "Tổng người dùng", value: totalUsers.toLocaleString(), sub: `+${customerGrowth}% so với tháng trước`, icon: Users, trend: "up", gradient: "from-sky-500 to-blue-600", delay: "delay-200" },
          { title: "Đơn hàng mới", value: activeOrders.toLocaleString(), sub: "Đang chờ xử lý", icon: PackageCheck, trend: "neutral", gradient: "from-emerald-500 to-teal-500", delay: "delay-300" },
          { title: "Tỷ lệ chuyển đổi", value: `${conversionRate}%`, sub: "Dựa trên KH đăng ký", icon: Target, trend: "down", gradient: "from-rose-500 to-orange-500", delay: "delay-500" },
        ].map((stat, idx) => (
          <div key={idx} className={`group relative bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-[32px] p-6 hover:bg-slate-50 dark:hover:bg-white/[0.08] transition-all duration-500 backdrop-blur-xl hover:border-slate-300 dark:hover:border-white/10 shadow-sm overflow-hidden cursor-default ${stat.delay}`}>
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 blur-3xl transition-opacity duration-700 rounded-full`} />

            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="p-3 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-sm">
                <stat.icon className="w-6 h-6 text-slate-700 dark:text-white" />
              </div>
              <div className={cn(
                "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-inner backdrop-blur-md flex items-center gap-1",
                stat.trend === "up" ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20" :
                  stat.trend === "down" ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20" : "text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10"
              )}>
                {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3" strokeWidth={3} /> :
                  stat.trend === "down" ? <ArrowDownRight className="w-3 h-3" strokeWidth={3} /> :
                    <span className="w-3 h-3 flex items-center justify-center">-</span>}
                {stat.trend === "up" ? "High" : stat.trend === "down" ? "Low" : "Stable"}
              </div>
            </div>

            <div className="relative z-10 transition-colors">
              <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-slate-500 mb-2">{stat.title}</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">{stat.value}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative z-10">

        <div className="xl:col-span-2 bg-white dark:bg-white/[0.03] backdrop-blur-2xl border border-slate-200 dark:border-white/5 rounded-[40px] shadow-sm overflow-hidden flex flex-col transition-colors">
          <div className="p-8 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 dark:bg-white/[0.01]">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3 transition-colors">
                <Activity className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                Giao dịch trực tiếp
              </h2>
              <p className="text-sm font-medium text-slate-500 mt-1">Luồng dữ liệu tài chính từ mọi điểm truy cập.</p>
            </div>
            <Link href="/admins/orders">
              <Button variant="outline" className="rounded-full h-11 px-6 font-bold text-sm bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white transition-all hover:scale-105 active:scale-95 group">
                Xem sổ kế toán
                <ChevronRight className="ml-1 w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white transition-colors" />
              </Button>
            </Link>
          </div>

          <div className="flex-1 overflow-x-auto custom-scrollbar p-6">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Mã giao dịch</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Hồ sơ</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Khối lượng</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Trạng thái</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, i) => (
                  <tr key={i} className="group bg-slate-50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-transparent dark:hover:border-white/5 transition-all duration-300 rounded-3xl">
                    <td className="px-6 py-5 rounded-l-3xl">
                      <span className="font-mono text-xs font-black text-indigo-600 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-500/20">
                        {order.order_number}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-slate-700 dark:to-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center font-black text-slate-700 dark:text-white text-sm shadow-sm dark:shadow-inner group-hover:scale-110 transition-transform">
                          {order.customer?.avatar ? <img src={order.customer.avatar} className="rounded-2xl" /> : (order.customer?.full_name?.substring(0, 1) || "C")}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-0.5 transition-colors">{order.customer?.full_name || "Guest"}</p>
                          <p className="text-[11px] font-medium text-slate-500">{order.customer?.email || ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-black text-base text-slate-900 dark:text-white transition-colors">{order.total_amount.toLocaleString("vi-VN")}đ</td>
                    <td className="px-6 py-5">
                      <Badge className={cn(
                        statusConfig[order.status as keyof typeof statusConfig],
                        "rounded-[10px] border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest shadow-inner dark:shadow-black/20"
                      )}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-center rounded-r-3xl">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 dark:hover:text-white hover:text-slate-800 dark:hover:bg-white/10 hover:bg-slate-200 transition-all shadow-sm border border-transparent dark:hover:border-white/10 outline-none cursor-pointer flex-shrink-0 mx-auto dark:bg-black/20 bg-slate-100">
                          <MoreVertical size={16} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl bg-white dark:bg-[#0A0A0B]/95 backdrop-blur-xl text-slate-800 dark:text-white">
                          <Link href={`/admins/orders/${order.id}`}>
                            <DropdownMenuItem className="rounded-xl font-bold text-xs py-3 cursor-pointer focus:bg-slate-50 dark:focus:bg-white/10 dark:hover:text-white transition-colors">Chi tiết đơn hàng</DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem className="rounded-xl font-bold text-xs py-3 text-rose-500 dark:text-rose-400 focus:bg-rose-50 dark:focus:bg-rose-500/10 focus:text-rose-600 dark:focus:text-rose-300 cursor-pointer transition-colors mt-1">Dừng xử lý</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-gradient-to-br from-indigo-50 dark:from-indigo-900/50 to-purple-50 dark:to-purple-900/50 border border-slate-200 dark:border-white/10 rounded-[40px] p-8 relative overflow-hidden group transition-colors">
            <div className="absolute inset-0 dark:bg-[url('https://grainy-gradients.vercel.app/noise.svg')] dark:opacity-20 dark:mix-blend-overlay" />
            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-white dark:bg-white/10 rounded-2xl shadow-sm dark:backdrop-blur-md">
                  <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-white" />
                </div>
                <Badge className="bg-white dark:bg-white/10 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/20 border-slate-200 dark:border-none px-3 py-1 rounded-full text-xs font-bold dark:backdrop-blur-md">
                  Live Feed
                </Badge>
              </div>
              <div>
                <p className="text-slate-500 dark:text-white/70 text-sm font-bold uppercase tracking-widest mb-2 transition-colors">Thanh khoản mạng</p>
                <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter shadow-sm transition-colors">$2.4M</h2>
                <div className="mt-4 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm bg-emerald-100 dark:bg-emerald-400/10 w-fit px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-400/20">
                  <TrendingUp className="w-4 h-4" />
                  Biến động tích cực
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-white/[0.03] backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-[40px] p-8 flex-1 flex flex-col transition-colors">
            <div className="flex items-center gap-3 mb-8">
              <Clock className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white transition-colors">Nhật ký hệ thống</h3>
            </div>
            <div className="flex-1 space-y-6 relative before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-slate-200 dark:before:bg-white/10">
              {systemEvents.map((log, idx) => (
                <div key={idx} className="flex gap-5 relative group cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 p-2 -my-2 -mx-2 rounded-2xl transition-colors">
                  <div className={cn(
                    "w-6 h-6 rounded-full border-[4px] border-white dark:border-[#0A0A0B] relative z-10 shrink-0 group-hover:scale-125 transition-transform",
                    log.type === "order" ? "bg-indigo-500" : "bg-emerald-500"
                  )} />
                  <div className="flex-1 -mt-1">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 transition-colors">{log.title}</p>
                    <p className="text-[11px] font-medium text-slate-500 mt-1 uppercase tracking-tighter">
                      {formatDistanceToNow(new Date(log.time), { addSuffix: true, locale: vi })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-6 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white rounded-2xl h-12 font-bold text-xs uppercase tracking-widest border border-slate-200 dark:border-white/5 transition-all">
              Xuất dữ liệu Logs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
