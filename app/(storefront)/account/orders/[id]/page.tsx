"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCustomerAuth } from "@/app/context/customer-auth-context";
import { 
  ChevronLeft, 
  Package, 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  Calendar, 
  RefreshCcw,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  AlertCircle,
  Box,
  ShoppingCart
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const statusConfig: Record<string, { label: string, icon: any, color: string, bg: string }> = {
  PENDING: { label: "Chờ xác nhận", icon: Clock, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-500/10" },
  CONFIRMED: { label: "Đã xác nhận", icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-500/10" },
  SHIPPING: { label: "Đang giao hàng", icon: Truck, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
  DELIVERED: { label: "Giao hàng thành công", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  CANCELLED: { label: "Đã hủy", icon: XCircle, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-500/10" },
  RETURNED: { label: "Trả hàng", icon: AlertCircle, color: "text-slate-600", bg: "bg-slate-50 dark:bg-slate-500/10" },
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const { customer } = useCustomerAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrderDetail = useCallback(async () => {
    if (!customer || !id) return;
    try {
      const resp = await fetch(`/api/customer/orders/${id}?customerId=${customer.id}`);
      const data = await resp.json();
      if (resp.ok) {
        setOrder(data.order);
      }
    } catch (error) {
      console.error("Fetch order detail failed", error);
    } finally {
      setLoading(false);
    }
  }, [customer, id]);

  useEffect(() => {
    fetchOrderDetail();
  }, [customer, id, fetchOrderDetail]);

  const handleCancelOrder = async () => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;
    
    setCancelling(true);
    try {
      const resp = await fetch(`/api/customer/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          customerId: customer?.id,
          action: "CANCEL" 
        }),
      });

      const data = await resp.json();
      if (resp.ok) {
        toast.success("Đã hủy đơn hàng thành công");
        await fetchOrderDetail();
      } else {
        toast.error(data.message || "Không thể hủy đơn hàng");
      }
    } catch (error) {
       toast.error("Lỗi kết nối máy chủ");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <RefreshCcw className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center">Đang nạp chi tiết đơn hàng...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-6">
        <Package className="w-16 h-16 text-slate-200" />
        <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Không tìm thấy đơn hàng</h2>
            <p className="text-slate-500 font-medium">Đơn hàng này không tồn tại hoặc bạn không có quyền truy cập.</p>
        </div>
        <Link href="/account/orders" className="h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 active:scale-95 transition-all inline-flex items-center gap-2">
            <ChevronLeft size={20} /> QUAY LẠI DANH SÁCH
        </Link>
      </div>
    );
  }

  const status = statusConfig[order.status] || statusConfig.PENDING;

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      <Link href="/account/orders" className="inline-flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] mb-8 hover:gap-3 transition-all group">
        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Quay lại danh sách đơn hàng
      </Link>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Column: Items & Summary */}
        <div className="flex-1 space-y-10">
          <div className="bg-white dark:bg-slate-950/40 rounded-[3rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-2xl shadow-slate-200/20 dark:shadow-none">
            {/* Header section in card */}
            <div className="p-10 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <Box className="text-indigo-600" size={24} />
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
                            Đơn hàng <span className="text-indigo-600 italic">#{order.order_number}</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
                        <Calendar size={14} />
                        <span>Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                </div>
                <div className={cn("inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest", status.bg, status.color)}>
                    <status.icon size={18} />
                    {status.label}
                </div>
            </div>

            {/* Items List */}
            <div className="divide-y divide-slate-100 dark:divide-white/5">
                {order.items.map((item: any) => (
                    <div key={item.id} className="p-10 flex flex-col sm:flex-row items-center gap-8 group">
                        <div className="w-32 h-32 rounded-[2rem] bg-slate-50 dark:bg-white/5 p-4 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-white/5 transition-transform group-hover:scale-105 duration-500">
                            {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                            ) : (
                                <Package className="text-slate-200 w-12 h-12" />
                            )}
                        </div>
                        <div className="flex-grow space-y-2 text-center sm:text-left">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight line-clamp-2">
                                {item.name}
                            </h3>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                                <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    Variant: {item.variant_name || "Default"}
                                </span>
                                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">QTy: {item.quantity}</span>
                            </div>
                        </div>
                        <div className="text-right">
                             <div className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
                                {item.price.toLocaleString('vi-VN')}đ
                             </div>
                             <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Đơn giá</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Total Footer */}
            <div className="p-10 bg-slate-50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5">
                <div className="flex flex-col items-end gap-2">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Tổng thanh toán (VND)</span>
                    <div className="text-5xl font-black tracking-tighter text-indigo-600 italic">
                        {order.total_amount.toLocaleString('vi-VN')}đ
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Info & Status */}
        <div className="lg:w-[380px] space-y-8">
            {/* Delivery Info */}
            <div className="bg-white dark:bg-slate-950/40 rounded-[3rem] border border-slate-200 dark:border-white/5 p-8 shadow-2xl shadow-slate-200/10 dark:shadow-none space-y-8">
                <h3 className="text-lg font-black uppercase tracking-widest text-indigo-600 flex items-center gap-3">
                    <Truck size={18} /> Giao hàng & Liên lạc
                </h3>
                
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 shrink-0">
                            <User size={18} />
                        </div>
                        <div className="space-y-1">
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Người nhận</div>
                            <div className="font-black text-slate-900 dark:text-white uppercase">{order.full_name}</div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                            <Phone size={18} />
                        </div>
                        <div className="space-y-1">
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Số điện thoại</div>
                            <div className="font-bold text-slate-900 dark:text-white">{order.phone_number}</div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                            <MapPin size={18} />
                        </div>
                        <div className="space-y-1">
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Địa chỉ nhận hàng</div>
                            <div className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed uppercase">{order.shipping_address}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white dark:bg-slate-950/40 rounded-[3rem] border border-slate-200 dark:border-white/5 p-8 shadow-2xl shadow-slate-200/10 dark:shadow-none space-y-6">
                 <h3 className="text-lg font-black uppercase tracking-widest text-indigo-600 flex items-center gap-3">
                    <CreditCard size={18} /> Thanh toán
                </h3>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phương thức</span>
                    <span className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{order.payment_method}</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trạng thái</span>
                    <span className={cn("px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", 
                        order.payment_status === "PAID" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500")}>
                        {order.payment_status === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4">
                {order.status === "PENDING" && (
                    <Button 
                        disabled={cancelling}
                        onClick={handleCancelOrder}
                        variant="outline" 
                        className="w-full h-16 rounded-[2rem] border-rose-200 dark:border-rose-500/20 font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all flex items-center gap-3"
                    >
                        {cancelling ? (
                            <RefreshCcw size={20} className="animate-spin" />
                        ) : (
                            <XCircle size={20} />
                        )}
                        Hủy đơn hàng
                    </Button>
                )}
                
                <Button className="w-full h-16 rounded-[2rem] bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 transition-all flex items-center gap-3">
                    <ShoppingCart size={20} /> Mua lại đơn này
                </Button>
                <Button variant="outline" className="w-full h-16 rounded-[2rem] border-slate-200 dark:border-white/10 font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                    Yêu cầu hỗ trợ
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
