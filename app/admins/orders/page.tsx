"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  ChevronRight, 
  MoreHorizontal, 
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  AlertCircle,
  Calendar,
  User as UserIcon,
  CreditCard,
  RefreshCcw,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusConfig: Record<string, { label: string, color: string, bg: string, icon: any }> = {
  PENDING: { label: "Pending", color: "text-amber-500", bg: "bg-amber-500/10", icon: Clock },
  CONFIRMED: { label: "Confirmed", color: "text-blue-500", bg: "bg-blue-500/10", icon: CheckCircle2 },
  SHIPPING: { label: "Shipping", color: "text-indigo-500", bg: "bg-indigo-500/10", icon: Truck },
  DELIVERED: { label: "Delivered", color: "text-emerald-500", bg: "bg-emerald-500/10", icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", color: "text-rose-500", bg: "bg-rose-500/10", icon: XCircle },
  RETURNED: { label: "Returned", color: "text-slate-500", bg: "bg-slate-500/10", icon: AlertCircle },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search,
        status: statusFilter === "ALL" ? "" : statusFilter
      }).toString();
      const resp = await fetch(`/api/admin/orders?${query}`);
      const data = await resp.json();
      if (resp.ok) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Fetch orders failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-[1600px] mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-widest mb-1">
            <ShoppingCart size={14} /> Order Fulfillment
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Order <span className="text-indigo-600 italic">Management</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Global oversight of all customer transactions and delivery states.</p>
        </div>

        <div className="flex items-center gap-3">
             <Button variant="outline" onClick={fetchOrders} className="rounded-xl border-slate-200 dark:border-white/10 h-11 px-4">
                <RefreshCcw size={18} className={cn(loading && "animate-spin")} />
             </Button>
             <Link href="/admins/analytics">
                <Button className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold gap-2">
                    <ArrowUpRight size={18} /> View Analytics
                </Button>
             </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col lg:flex-row items-center gap-4 bg-white dark:bg-slate-950/40 p-4 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
        <div className="relative flex-1 w-full lg:w-auto overflow-hidden">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
                placeholder="Search order #, customer name..." 
                className="pl-12 h-12 bg-slate-50 dark:bg-white/5 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-indigo-500/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
             <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "ALL")}>
                <SelectTrigger className="h-12 w-full lg:w-48 bg-slate-50 dark:bg-white/5 border-none rounded-2xl font-semibold">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-200 dark:border-white/10 dark:bg-slate-950">
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="SHIPPING">Shipping</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
             </Select>
             <Button variant="outline" className="h-12 px-5 rounded-2xl border-slate-200 dark:border-white/10 bg-white dark:bg-white/5">
                <Filter size={18} className="mr-2" /> More Filters
             </Button>
        </div>
      </div>

      {/* Orders Grid/List */}
      <div className="bg-white dark:bg-slate-950/40 rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-slate-50/50 dark:bg-white/[0.02] text-left border-b border-slate-100 dark:border-white/5">
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Order Information</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Customer Identity</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Fulfillment</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {loading ? (
                        [...Array(5)].map((_, i) => (
                            <tr key={i} className="animate-pulse">
                                <td colSpan={5} className="px-8 py-8 h-20 bg-slate-50/20 dark:bg-white/[0.01]" />
                            </tr>
                        ))
                    ) : (
                        orders.map((order) => {
                            const status = statusConfig[order.status] || statusConfig.PENDING;
                            const Icon = status.icon;
                            return (
                                <motion.tr 
                                    layout
                                    key={order.id}
                                    className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">#{order.order_number}</span>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                <Calendar size={12} />
                                                {format(new Date(order.createdAt), "MMM dd, yyyy • HH:mm")}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                                                <UserIcon size={18} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">{order.customer.full_name}</span>
                                                <span className="text-xs text-slate-500 truncate max-w-[140px]">{order.customer.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <Badge className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-none shadow-none", status.bg, status.color)}>
                                            <Icon size={12} className="mr-1.5" />
                                            {status.label}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col items-start">
                                            <span className="text-sm font-black text-indigo-600 tracking-tight">{order.total_amount.toLocaleString('vi-VN')}đ</span>
                                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                <CreditCard size={10} />
                                                {order.payment_method}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admins/orders/${order.id}`}>
                                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-indigo-600 transition-all">
                                                    <ExternalLink size={18} />
                                                </Button>
                                            </Link>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center transition-all">
                                                    <MoreHorizontal size={18} className="text-slate-500" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl border-slate-200 dark:border-white/10 dark:bg-slate-950">
                                                    <DropdownMenuItem className="py-2.5 font-bold cursor-pointer">View Customer Profile</DropdownMenuItem>
                                                    <DropdownMenuItem className="py-2.5 font-bold cursor-pointer">Quick Print Invoice</DropdownMenuItem>
                                                    <DropdownMenuItem className="py-2.5 font-bold cursor-pointer text-rose-500">Cancel Order</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })
                    )}
                    {!loading && orders.length === 0 && (
                        <tr>
                            <td colSpan={5} className="py-24 text-center">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-300">
                                        <ShoppingCart size={32} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">No match found</p>
                                        <p className="text-sm text-slate-500">Your filters yielded no transactions in the current index.</p>
                                    </div>
                                    <Button onClick={() => { setSearch(""); setStatusFilter("ALL"); }} variant="link" className="text-indigo-600 font-bold">Clear All Filters</Button>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
