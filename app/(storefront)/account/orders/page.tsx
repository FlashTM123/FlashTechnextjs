"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCustomerAuth } from "@/app/context/customer-auth-context";
import { Package, ChevronRight, Clock, CheckCircle2, Truck, XCircle, AlertCircle, RefreshCcw, LayoutDashboard, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const statusConfig: Record<string, { label: string, icon: any, color: string, bg: string }> = {
  PENDING: { label: "Chờ xác nhận", icon: Clock, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-500/10" },
  CONFIRMED: { label: "Đã xác nhận", icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-500/10" },
  SHIPPING: { label: "Đang giao hàng", icon: Truck, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
  DELIVERED: { label: "Giao hàng thành công", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  CANCELLED: { label: "Đã hủy", icon: XCircle, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-500/10" },
  RETURNED: { label: "Trả hàng", icon: AlertCircle, color: "text-slate-600", bg: "bg-slate-50 dark:bg-slate-500/10" },
};

export default function OrdersPage() {
  const { customer } = useCustomerAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  const fetchOrders = async () => {
    if (!customer) return;
    try {
      const resp = await fetch(`/api/customer/orders?customerId=${customer.id}`);
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
    fetchOrders();
  }, [customer]);

  const handleSeedOrders = async () => {
    if (!customer) return;
    setIsSeeding(true);
    try {
      const resp = await fetch("/api/test/seed-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: customer.id }),
      });
      if (resp.ok) {
        toast.success("Đã tạo 3 đơn hàng mẫu để kiểm tra!");
        fetchOrders();
      } else {
        toast.error("Không thể tạo đơn hàng mẫu. Hãy thử lại!");
      }
    } catch (error) {
      toast.error("Lỗi kết nối khi tạo đơn mẫu.");
    } finally {
      setIsSeeding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <RefreshCcw className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Đang tải lược sử đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
                <LayoutDashboard size={14} />
                Quản lý tài khoản
            </div>
          <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
            Đơn hàng <span className="text-indigo-600 italic">của tôi</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Theo dõi và quản lý các đơn hàng công nghệ đỉnh cao tại FlashTech.</p>
        </div>

        {orders.length === 0 && (
            <Button 
                onClick={handleSeedOrders}
                disabled={isSeeding}
                className="h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 active:scale-95 transition-all gap-3"
            >
                {isSeeding ? <RefreshCcw size={20} className="animate-spin" /> : <Plus size={20} />}
                Tạo Đơn Hàng Mẫu Để Kiểm Tra
            </Button>
        )}
      </div>

      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {orders.length > 0 ? (
            orders.map((order, index) => {
              const status = statusConfig[order.status] || statusConfig.PENDING;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <Link href={`/account/orders/${order.id}`}>
                    <div className="bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-[2rem] p-8 hover:border-indigo-500/50 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 group-hover:scale-[1.01]">
                        <div className="flex items-center gap-6">
                            <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center p-4", status.bg)}>
                                <status.icon className={cn("w-10 h-10", status.color)} />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order ID: {order.order_number}</span>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                    Đơn hàng Flash<span className="text-indigo-600">Tech</span>
                                </h3>
                                <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    <span>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                    <span>{order._count.items} sản phẩm</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
                            <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest", status.bg, status.color)}>
                                <status.icon size={14} />
                                {status.label}
                            </div>
                            <div className="text-3xl font-black tracking-tighter text-indigo-600">
                                {order.total_amount.toLocaleString('vi-VN')}đ
                            </div>
                        </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })
          ) : (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 px-8 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/5 space-y-6 text-center"
            >
                <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-300">
                    <Package size={48} />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Chưa có đơn hàng nào</h2>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto">Có vẻ như bạn chưa thực hiện đơn mua hàng nào tại FlashTech. Hãy bắt đầu trải nghiệm ngay!</p>
                </div>
                <Link href="/" className={cn(buttonVariants({ variant: "default", size: "lg" }), "h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 active:scale-95 transition-all text-white")}>
                    MUA SẮM NGAY <ChevronRight size={20} className="ml-2" />
                </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function buttonVariants({ variant, size }: { variant: string, size: string }) {
    // Shorthand for Link styling
    return "inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
}
