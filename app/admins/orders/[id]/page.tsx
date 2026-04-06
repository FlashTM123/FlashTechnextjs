"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  Package, 
  MapPin, 
  Phone, 
  User as UserIcon, 
  CreditCard, 
  Calendar, 
  RefreshCcw,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  AlertCircle,
  Box,
  ArrowRight,
  ShieldCheck,
  History,
  Send,
  Zap,
  Tag
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const statusOptions = [
    { value: "PENDING", label: "Pending", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { value: "CONFIRMED", label: "Confirmed", icon: CheckCircle2, color: "text-blue-500", bg: "bg-blue-500/10" },
    { value: "SHIPPING", label: "Shipping", icon: Truck, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { value: "DELIVERED", label: "Delivered", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { value: "CANCELLED", label: "Cancelled", icon: XCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
    { value: "RETURNED", label: "Returned", icon: AlertCircle, color: "text-slate-500", bg: "bg-slate-500/10" },
];

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrderDetail = async () => {
    try {
      const resp = await fetch(`/api/admin/orders/${id}`);
      const data = await resp.json();
      if (resp.ok) {
        setOrder(data.order);
      }
    } catch (error) {
      console.error("Fetch order detail failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrderDetail();
  }, [id]);

  const handleUpdateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const resp = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (resp.ok) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrderDetail();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Error updating order status");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePayment = async (newStatus: string) => {
    setUpdating(true);
    try {
        const resp = await fetch(`/api/admin/orders/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payment_status: newStatus }),
        });
        if (resp.ok) {
          toast.success(`Payment status updated to ${newStatus}`);
          fetchOrderDetail();
        }
      } catch (error) {
        toast.error("Error updating payment status");
      } finally {
        setUpdating(false);
      }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCcw className="w-10 h-10 animate-spin text-indigo-600" />
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading Intelligence...</p>
        </div>
      </div>
    );
  }

  if (!order) return <div>Order not found</div>;

  const currentStatus = statusOptions.find(s => s.value === order.status) || statusOptions[0];

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-[1600px] mx-auto">
      {/* Back & Breadcrumb */}
      <div className="flex items-center gap-4 mb-2">
        <Link href="/admins/orders" className="h-10 w-10 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-all">
            <ChevronLeft size={20} />
        </Link>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
             <Link href="/admins/orders" className="hover:text-indigo-500 transition-colors">Orders</Link>
             <ChevronLeft size={10} className="rotate-180" />
             <span className="text-indigo-600">Details</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Left Column: Order Content */}
        <div className="xl:col-span-2 space-y-8">
            {/* Header Section */}
            <div className="bg-white dark:bg-slate-950/40 rounded-[3rem] border border-slate-200 dark:border-white/5 p-10 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -z-10 group-hover:bg-indigo-500/10 transition-colors" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                                <Box size={24} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
                                    #{order.order_number}
                                </h1>
                                <div className="flex items-center gap-3 mt-1 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    <Calendar size={14} />
                                    <span>Placed on {format(new Date(order.createdAt), "MMMM dd, yyyy 'at' HH:mm")}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                         <Badge className={cn("px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-none shadow-none", currentStatus.bg, currentStatus.color)}>
                            <currentStatus.icon size={16} className="mr-2" />
                            {currentStatus.label}
                         </Badge>
                         <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Order Status</div>
                    </div>
                </div>
            </div>

            {/* Line Items */}
            <div className="bg-white dark:bg-slate-950/40 rounded-[3rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
                <div className="px-10 py-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01]">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                        <Zap size={16} className="text-indigo-600" /> Line Item Intelligence
                    </h3>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                    {order.items.map((item: any) => (
                        <div key={item.id} className="p-10 flex flex-col sm:flex-row items-center gap-8 hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors">
                            <div className="w-24 h-24 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 p-3 flex items-center justify-center shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex-1 space-y-1 text-center sm:text-left">
                                <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.name}</h4>
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        <Tag size={12} /> {item.variant_name || "Standard Variant"}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Qty: {item.quantity}</span>
                                </div>
                            </div>
                             <div className="text-right">
                                <div className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</div>
                                <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{item.price.toLocaleString('vi-VN')}đ / unit</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-10 bg-slate-50/30 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5">
                    <div className="flex flex-col items-end gap-2">
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Total Settlement</span>
                        <div className="text-5xl font-black tracking-tighter text-indigo-600 italic">
                            {order.total_amount.toLocaleString('vi-VN')}đ
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Sidebar Actions */}
        <div className="space-y-8">
            {/* Status Control Panel */}
            <div className="bg-white dark:bg-slate-950/40 rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-8 shadow-sm space-y-8">
                <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-600 flex items-center gap-2 mb-1">
                        <ShieldCheck size={18} /> Operation Control
                    </h3>
                    <p className="text-xs text-slate-400 font-medium italic">Transition order through delivery lifecycle.</p>
                </div>

                <div className="space-y-3">
                    {statusOptions.map((opt) => (
                        <button
                            key={opt.value}
                            disabled={updating || order.status === opt.value}
                            onClick={() => handleUpdateStatus(opt.value)}
                            className={cn(
                                "w-full p-4 rounded-2xl border flex items-center justify-between group transition-all active:scale-95",
                                order.status === opt.value 
                                    ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-500/20" 
                                    : "bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 hover:border-indigo-500/50"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <opt.icon size={18} className={cn(order.status === opt.value ? "text-white" : "text-slate-400 group-hover:text-indigo-500")} />
                                <span className="text-sm font-black uppercase tracking-tight">{opt.label}</span>
                            </div>
                            {order.status === opt.value ? (
                                <CheckCircle2 size={16} />
                            ) : (
                                <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Payment & Logistics */}
            <div className="bg-white dark:bg-slate-950/40 rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-8 shadow-sm space-y-8">
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-emerald-500">
                        <CreditCard size={18} />
                        <h3 className="text-xs font-black uppercase tracking-widest">Financial Status</h3>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Payment Status</span>
                        <Select value={order.payment_status} onValueChange={(val) => val && handleUpdatePayment(val)} disabled={updating}>
                            <SelectTrigger className="w-[140px] h-9 border-none bg-transparent font-black uppercase tracking-tighter text-xs p-0 shadow-none focus:ring-0">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl dark:bg-slate-900 border-slate-200 dark:border-white/10">
                                <SelectItem value="UNPAID">UNPAID</SelectItem>
                                <SelectItem value="PAID">PAID</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Separator className="bg-slate-100 dark:bg-white/5" />

                <div className="space-y-6 text-slate-600 dark:text-slate-300">
                     <div className="flex items-center gap-3 text-indigo-500">
                        <MapPin size={18} />
                        <h3 className="text-xs font-black uppercase tracking-widest">Shipping Meta</h3>
                    </div>
                    <div className="space-y-4 px-1">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recipient</span>
                            <span className="font-bold text-slate-900 dark:text-white">{order.full_name}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Direct Contact</span>
                            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Phone size={12} /> {order.phone_number}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Destination</span>
                            <span className="text-xs font-bold leading-relaxed">{order.shipping_address}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-500/20 space-y-6">
                <div className="space-y-1">
                    <h3 className="text-lg font-black uppercase tracking-tight">External Links</h3>
                    <p className="text-[10px] font-medium text-white/70 uppercase tracking-widest">Connect with ecosystem</p>
                </div>
                <div className="grid gap-3">
                     <Button className="w-full h-12 rounded-xl bg-white/10 hover:bg-white/20 border-none text-white font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
                        <History size={14} /> Audit Trail
                     </Button>
                     <Button className="w-full h-12 rounded-xl bg-white/10 hover:bg-white/20 border-none text-white font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
                        <Send size={14} /> Send Email Update
                     </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
