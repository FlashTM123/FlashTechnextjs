import {
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  ChevronRight,
  Activity,
  Zap,
  PackageCheck,
  CreditCard,
  Target,
  BarChart3,
  Globe2,
  Clock,
  Sparkles
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Vortex Command Center - FlashTech",
  description: "Hệ thống quản trị thế hệ mới",
};

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const recentOrders = [
  { id: "ORD-9981", customer: "Elena Rodriguez", email: "elena.r@example.com", amount: "$1,250.00", status: "Completed", date: "2m ago", avatar: "E" },
  { id: "ORD-9982", customer: "Marcus Chen", email: "m.chen@example.com", amount: "$3,450.50", status: "Processing", date: "15m ago", avatar: "M" },
  { id: "ORD-9983", customer: "Sarah Jenkins", email: "s.jenkins@example.com", amount: "$890.99", status: "Pending", date: "1h ago", avatar: "S" },
  { id: "ORD-9984", customer: "David Kim", email: "dkim.90@example.com", amount: "$5,120.00", status: "Completed", date: "3h ago", avatar: "D" },
  { id: "ORD-9985", customer: "Alex Mercer", email: "alex.mercer@example.com", amount: "$450.00", status: "Cancelled", date: "5h ago", avatar: "A" },
];

const statusConfig = {
  Completed: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-200 dark:border-emerald-500/20",
  Pending: "bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-200 dark:border-amber-500/20",
  Processing: "bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-500 border-indigo-200 dark:border-indigo-500/20",
  Cancelled: "bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-500 border-rose-200 dark:border-rose-500/20",
};

export default async function AdminDashboard() {
  const totalUsers = await prisma.user.count();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentUsers = await prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } });
  const growth = totalUsers > 0 ? ((recentUsers / totalUsers) * 100).toFixed(1) : "0";

  return (
    <div className="min-h-screen bg-transparent dark:bg-[url('https://grainy-gradients.vercel.app/noise.svg')] dark:bg-blend-multiply text-slate-800 dark:text-slate-200 p-4 md:p-8 lg:p-10 space-y-8 animate-in fade-in duration-1000 relative overflow-hidden transition-colors">
      
      {/* Background Ambient Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 dark:bg-indigo-600/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 dark:bg-fuchsia-600/20 blur-[150px] rounded-full pointer-events-none" />

      {/* Header & Hero */}
      <div className="flex flex-col xl:flex-row gap-8 relative z-10 items-stretch">
        <div className="flex-1 relative rounded-[40px] overflow-hidden bg-slate-900/5 dark:bg-black/40 border border-slate-200 dark:border-white/5 p-10 lg:p-14 backdrop-blur-2xl shadow-xl dark:shadow-2xl flex flex-col justify-center min-h-[350px]">
          {/* Animated decorative grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] opacity-30" />
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
              FlashTech Neural Engine v3.0
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-[1.1] transition-colors">
              Pulse Check. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-600 dark:from-indigo-400 dark:via-fuchsia-400 dark:to-rose-400">
                All systems nominal.
              </span>
            </h1>
            
            <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-xl mb-10 transition-colors">
              Your command center is connected. Live data streaming in real-time with sub-millisecond latency. 
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button className="h-14 px-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 font-bold shadow-lg transition-all hover:scale-105 active:scale-95 text-sm">
                Initiate Sequence
                <Zap className="ml-2 w-4 h-4 text-indigo-300 dark:text-indigo-600 fill-current" />
              </Button>
              <Button variant="outline" className="h-14 px-8 rounded-full bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-white border-slate-200 dark:border-white/10 backdrop-blur-md font-bold transition-all hover:scale-105 active:scale-95 text-sm group">
                <Globe2 className="mr-2 w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white transition-colors" />
                Live Map
              </Button>
            </div>
          </div>

          {/* Right side floating elements inside hero */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4">
            <div className="w-64 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-xl dark:shadow-2xl animate-[float_6s_ease-in-out_infinite] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                 <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"><Activity className="w-5 h-5" /></div>
                 <div>
                   <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold transition-colors">Server Load</p>
                   <p className="text-slate-900 dark:text-white font-black text-xl transition-colors">24.5%</p>
                 </div>
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden transition-colors">
                 <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 w-1/4 rounded-full" />
              </div>
            </div>

            <div className="w-64 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-xl dark:shadow-2xl animate-[float_6s_ease-in-out_infinite_1s] ml-12 transition-colors">
              <div className="flex items-center gap-3 mb-1">
                 <div className="p-2.5 rounded-xl bg-fuchsia-100 dark:bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400"><Users className="w-5 h-5" /></div>
                 <div>
                   <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold transition-colors">Active Users</p>
                   <p className="text-slate-900 dark:text-white font-black text-xl transition-colors">12,408</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {[
          { title: "Total Revenue", value: "$428,920.00", sub: "+14.5% from last month", icon: DollarSign, trend: "up", gradient: "from-indigo-500 to-purple-500", delay: "delay-100" },
          { title: "Total Users", value: totalUsers.toLocaleString(), sub: `+${growth}% new accounts`, icon: Users, trend: "up", gradient: "from-sky-500 to-blue-600", delay: "delay-200" },
          { title: "Active Orders", value: "8,234", sub: "Currently processing", icon: PackageCheck, trend: "neutral", gradient: "from-emerald-500 to-teal-500", delay: "delay-300" },
          { title: "Conversion Rate", value: "4.2%", sub: "-0.4% from yesterday", icon: Target, trend: "down", gradient: "from-rose-500 to-orange-500", delay: "delay-500" },
        ].map((stat, idx) => (
          <div key={idx} className={`group relative bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-[32px] p-6 hover:bg-slate-50 dark:hover:bg-white/[0.08] transition-all duration-500 backdrop-blur-xl hover:border-slate-300 dark:hover:border-white/10 shadow-sm overflow-hidden cursor-default ${stat.delay}`}>
            {/* Glow effect on hover */}
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

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative z-10">
        
        {/* Complex Data Table (Takes 2 columns) */}
        <div className="xl:col-span-2 bg-white dark:bg-white/[0.03] backdrop-blur-2xl border border-slate-200 dark:border-white/5 rounded-[40px] shadow-sm overflow-hidden flex flex-col transition-colors">
           <div className="p-8 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 dark:bg-white/[0.01]">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3 transition-colors">
                  <Activity className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                  Live Transactions
                </h2>
                <p className="text-sm font-medium text-slate-500 mt-1">Real-time financial stream from all access points.</p>
              </div>
              <Button variant="outline" className="rounded-full h-11 px-6 font-bold text-sm bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white transition-all hover:scale-105 active:scale-95 group">
                 View Ledger
                 <ChevronRight className="ml-1 w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white transition-colors" />
              </Button>
           </div>
           
           <div className="flex-1 overflow-x-auto custom-scrollbar p-6">
              <table className="w-full text-left border-separate border-spacing-y-2">
                 <thead>
                   <tr>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Transaction ID</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">User Profile</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Volume</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Action</th>
                   </tr>
                 </thead>
                 <tbody>
                   {recentOrders.map((order, i) => (
                     <tr key={i} className="group bg-slate-50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-transparent dark:hover:border-white/5 transition-all duration-300 rounded-3xl">
                       <td className="px-6 py-5 rounded-l-3xl">
                          <span className="font-mono text-xs font-black text-indigo-600 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-500/20">
                            {order.id}
                          </span>
                       </td>
                       <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-slate-700 dark:to-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center font-black text-slate-700 dark:text-white text-sm shadow-sm dark:shadow-inner group-hover:scale-110 transition-transform">
                              {order.avatar}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-0.5 transition-colors">{order.customer}</p>
                              <p className="text-[11px] font-medium text-slate-500">{order.email}</p>
                            </div>
                          </div>
                       </td>
                       <td className="px-6 py-5 font-black text-base text-slate-900 dark:text-white transition-colors">{order.amount}</td>
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
                              <DropdownMenuItem className="rounded-xl font-bold text-xs py-3 cursor-pointer focus:bg-slate-50 dark:focus:bg-white/10 dark:hover:text-white transition-colors">Inspect Data</DropdownMenuItem>
                              <DropdownMenuItem className="rounded-xl font-bold text-xs py-3 text-rose-500 dark:text-rose-400 focus:bg-rose-50 dark:focus:bg-rose-500/10 focus:text-rose-600 dark:focus:text-rose-300 cursor-pointer transition-colors mt-1">Halt Process</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                       </td>
                     </tr>
                   ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Right Sidebar - Analytics & Quick Actions */}
        <div className="flex flex-col gap-6">
           {/* Financial Mini Chart / Insight */}
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
                    <p className="text-slate-500 dark:text-white/70 text-sm font-bold uppercase tracking-widest mb-2 transition-colors">Network Liquidity</p>
                    <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter shadow-sm transition-colors">$2.4M</h2>
                    <div className="mt-4 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm bg-emerald-100 dark:bg-emerald-400/10 w-fit px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-400/20">
                       <TrendingUp className="w-4 h-4" />
                       Net positive variance
                    </div>
                 </div>
              </div>
           </div>

           {/* Security / System Logs */}
           <div className="bg-white dark:bg-white/[0.03] backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-[40px] p-8 flex-1 flex flex-col transition-colors">
              <div className="flex items-center gap-3 mb-8">
                 <Clock className="w-5 h-5 text-slate-400" />
                 <h3 className="text-lg font-black text-slate-900 dark:text-white transition-colors">System Logs</h3>
              </div>
              <div className="flex-1 space-y-6 relative before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-slate-200 dark:before:bg-white/10">
                 {[
                    { title: "Firewall rule updated", time: "10 min ago", color: "bg-emerald-500" },
                    { title: "Anomaly detected in US node", time: "42 min ago", color: "bg-rose-500" },
                    { title: "Cluster synchronization complete", time: "2 hours ago", color: "bg-indigo-500" },
                    { title: "Admin [DK] logged in", time: "5 hours ago", color: "bg-slate-500" }
                 ].map((log, idx) => (
                    <div key={idx} className="flex gap-5 relative group cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 p-2 -my-2 -mx-2 rounded-2xl transition-colors">
                       <div className={`w-6 h-6 rounded-full border-[4px] border-white dark:border-[#0A0A0B] ${log.color} relative z-10 shrink-0 group-hover:scale-125 transition-transform`} />
                       <div className="flex-1 -mt-1">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 transition-colors">{log.title}</p>
                          <p className="text-[11px] font-medium text-slate-500 mt-1">{log.time}</p>
                       </div>
                    </div>
                 ))}
              </div>
              <Button className="w-full mt-6 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white rounded-2xl h-12 font-bold text-xs uppercase tracking-widest border border-slate-200 dark:border-white/5 transition-all">
                Export Audit Trail
              </Button>
           </div>
        </div>

      </div>
    </div>
  );
}
