"use client";

import { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
  LineChart, Line, Legend
} from "recharts";
import { 
  TrendingUp, TrendingDown, Users, ShoppingBag, DollarSign, Activity, ArrowUpRight, ArrowDownRight, 
  MapPin, Clock, Star, Package, CheckCircle2, AlertTriangle, Filter, Calendar, Download, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock Data removed as it is now sourced from API
const COLORS = ["#6366f1", "#a855f7", "#ec4899", "#f43f5e"];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [activeRange, setActiveRange] = useState("30D");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/admin/analytics");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const stats = data ? [
    { label: "Doanh thu tổng", value: `${data.stats.totalRevenue.toLocaleString()} VNĐ`, change: "+12.5%", trending: "up", icon: DollarSign, color: "bg-indigo-500" },
    { label: "Số lượng đơn hàng", value: data.stats.totalOrders.toLocaleString(), change: "+8.2%", trending: "up", icon: ShoppingBag, color: "bg-purple-500" },
    { label: "Khách hàng mới", value: data.stats.totalCustomers.toLocaleString(), change: "+24.1%", trending: "up", icon: Users, color: "bg-pink-500" },
    { label: "Tỷ lệ chuyển đổi", value: data.stats.conversionRate, change: "-1.5%", trending: "down", icon: Activity, color: "bg-rose-500" },
  ] : [];

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Đang đồng bộ dữ liệu hệ thống...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Trung tâm phân tích</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Báo cáo tình hình kinh doanh thời gian thực trên toàn mạng lưới.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white dark:bg-white/5 p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
           {["7D", "30D", "90D", "All"].map((range) => (
             <button
               key={range}
               onClick={() => setActiveRange(range)}
               className={cn(
                 "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                 activeRange === range 
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg" 
                  : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
               )}
             >
               {range}
             </button>
           ))}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="group p-8 rounded-[32px] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-2xl hover:border-indigo-500/20 transition-all duration-500 relative overflow-hidden">
            <div className={cn("absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-5 blur-2xl", stat.color)} />
            
            <div className="flex justify-between items-start relative z-10">
              <div className={cn("p-4 rounded-2xl bg-slate-50 dark:bg-white/10 text-slate-900 dark:text-white group-hover:scale-110 transition-transform duration-500 shadow-inner")}>
                <stat.icon size={20} />
              </div>
              <div className={cn(
                "flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
                stat.trending === "up" 
                  ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20"
                  : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20"
              )}>
                {stat.trending === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </div>
            </div>

            <div className="mt-8 relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
              <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1 group-hover:translate-x-1 transition-transform duration-500 truncate">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart - 2/3 Width */}
        <div className="lg:col-span-2 p-8 lg:p-10 rounded-[40px] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm">
           <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                 <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                 <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Doanh thu định kỳ</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hiệu suất tài chính 30 ngày gần nhất</p>
                 </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full border border-slate-100 dark:border-white/5">
                <Download size={16} />
              </Button>
           </div>

           <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.revenueHistory}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(203, 213, 225, 0.1)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                    tickFormatter={(value) => `${(value / 1000000)}M`}
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', background: 'rgba(255, 255, 255, 0.9)'}}
                    itemStyle={{fontWeight: 900, fontSize: '12px'}}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Category Breakdown - 1/3 Width */}
        <div className="p-8 lg:p-10 rounded-[40px] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm flex flex-col">
           <div className="flex items-center gap-4 mb-10">
              <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
              <div>
                 <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Phân bộ ngành hàng</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tỷ lệ bán ra theo danh mục</p>
              </div>
           </div>

           <div className="flex-1 flex flex-col items-center justify-center">
             <div className="h-[250px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={data.categoryData}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={8}
                     dataKey="value"
                   >
                     {data.categoryData.map((entry: any, index: number) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={8} />
                     ))}
                   </Pie>
                   <Tooltip />
                 </PieChart>
               </ResponsiveContainer>
             </div>

             <div className="w-full space-y-3 mt-6">
                {data.categoryData.map((item: any, index: number) => (
                  <div key={item.name} className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest group">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index]}} />
                      <span className="text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{item.name}</span>
                    </div>
                    <span className="text-slate-900 dark:text-white">{item.value}%</span>
                  </div>
                ))}
             </div>
           </div>
        </div>
      </div>

      {/* Bottom Product Table & Recent Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="p-8 lg:p-10 rounded-[40px] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8">Sản phẩm tiêu điểm (Top Selling)</h3>
            <div className="space-y-4">
               {data.topProducts.map((product: any) => (
                 <div key={product.id} className="group p-5 rounded-2xl bg-slate-50/50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center shadow-sm font-black text-xs text-indigo-500">
                         #{product.id}
                       </div>
                       <div>
                          <p className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[150px]">{product.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.sales} đơn hàng</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">{product.revenue}</p>
                       <Badge className="bg-emerald-50! text-emerald-600! border-emerald-100! text-[8px] uppercase font-black tracking-widest px-2 py-0.5 rounded-md">{product.status}</Badge>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="p-8 lg:p-10 rounded-[40px] bg-indigo-600 shadow-[0_30px_60px_-15px_rgba(99,102,241,0.3)] relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="relative z-10">
              <Badge className="bg-white/20 text-white border-white/20 text-[10px] font-black uppercase tracking-widest mb-4">Real-time Stream</Badge>
              <h3 className="text-3xl font-black text-white leading-tight">Mục tiêu quý 4 sắp hoàn thành</h3>
              <p className="text-indigo-100/70 mt-4 font-medium leading-relaxed max-w-sm">Dựa trên tốc độ tăng trưởng hiện tại, bạn dự kiến sẽ vượt 15% chỉ tiêu đề ra cho mùa mua sắm cuối năm.</p>
            </div>

            <div className="relative z-10 pt-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Tiến độ hiện tại</span>
                <span className="text-lg font-black text-white">85.4%</span>
              </div>
              <div className="h-4 bg-white/10 rounded-full overflow-hidden p-1 shadow-inner ring-1 ring-white/20">
                <div className="h-full bg-gradient-to-r from-white/60 to-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all duration-1000" style={{width: '85.4%'}} />
              </div>
              <div className="flex justify-between mt-6">
                <Button className="bg-white text-indigo-600 font-black text-[10px] uppercase tracking-widest px-8 rounded-xl shadow-xl hover:bg-slate-50 active:scale-95 transition-all">Xem chi tiết</Button>
                <div className="flex -space-x-3">
                   {[1, 2, 3].map((i) => (
                     <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-slate-200 overflow-hidden">
                       <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
                     </div>
                   ))}
                </div>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
}
