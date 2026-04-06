"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  CheckCircle2, 
  ArrowRight, 
  ShoppingBag, 
  Package, 
  Truck, 
  CreditCard,
  ChevronRight,
  ShieldCheck,
  Send,
  Zap,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function CheckoutSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const resp = await fetch(`/api/customer/orders/${id}`);
        const data = await resp.json();
        if (resp.ok) {
           setOrder(data.order);
        }
      } catch (error) {
        console.error("Order fetch failed");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  if (loading) return (
      <div className="h-[80vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 animate-pulse">
              <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center">
                  <Package className="text-indigo-600 w-8 h-8" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Verifying Transaction...</p>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] pb-32">
      <div className="max-w-4xl mx-auto px-6 pt-24 space-y-16">
        
        {/* Hero Success Section */}
        <div className="text-center space-y-8 relative">
            <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 rounded-[32px] bg-emerald-500 flex items-center justify-center text-white mx-auto shadow-2xl shadow-emerald-500/30"
            >
                <CheckCircle2 size={48} strokeWidth={2.5} />
            </motion.div>
            
            <div className="space-y-4">
                <h1 className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                    Success <span className="text-emerald-500 italic">Confirmed</span>
                </h1>
                <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed italic">
                    Giao dịch của bạn đã được mã hóa và xác thực thành công. Đơn hàng hiện đã được chuyển vào hàng đợi xử lý logic.
                </p>
            </div>

            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Entity Identifier</span>
                <div className="h-4 w-px bg-slate-200 dark:bg-white/10" />
                <span className="text-sm font-black text-slate-900 dark:text-white tracking-widest uppercase">#{order?.order_number || "FT-PROCESSING"}</span>
            </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/account/orders">
                <Button className="w-full h-20 rounded-[32px] bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/20 group overflow-hidden">
                    Theo dõi đơn hàng <Package size={18} className="ml-3 group-hover:scale-110 transition-transform" />
                </Button>
            </Link>
             <Link href="/">
                <Button variant="outline" className="w-full h-20 rounded-[32px] border-2 border-slate-900 dark:border-white bg-transparent text-slate-900 dark:text-white font-black text-xs uppercase tracking-[0.2em] group">
                    Tiếp tục mua hàng <ShoppingBag size={18} className="ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
            </Link>
        </div>

        {/* Detailed Receipt Artifact */}
        <div className="bg-slate-50 dark:bg-white/[0.02] rounded-[50px] border border-slate-200 dark:border-white/10 p-10 md:p-16 space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-200 dark:border-white/10 pb-10 font-bold uppercase tracking-widest text-xs">
                <div className="space-y-4">
                    <p className="text-slate-400 text-[10px]">TIME OF SETTLEMENT</p>
                    <p className="text-slate-900 dark:text-white flex items-center gap-2">
                        <Calendar size={14} className="text-indigo-500" />
                        {order?.createdAt ? format(new Date(order.createdAt), "HH:mm, MMMM dd, yyyy") : "N/A"}
                    </p>
                </div>
                 <div className="space-y-4 md:text-right">
                    <p className="text-slate-400 text-[10px]">PAYMENT CLEARANCE</p>
                    <p className="text-emerald-500 flex items-center md:justify-end gap-2">
                        <CreditCard size={14} /> {order?.payment_method} - {order?.payment_status}
                    </p>
                </div>
            </div>

            <div className="space-y-8">
                 <div className="flex items-center gap-3 text-indigo-600">
                    <Zap size={20} />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Logistic Pipeline</h3>
                </div>
                <div className="space-y-6">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">RECIPIENT ENTITY</span>
                        <span className="font-black text-xl text-slate-900 dark:text-white uppercase leading-none">{order?.full_name}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">ADDRESS COORDINATES</span>
                        <p className="font-bold text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-xl">{order?.shipping_address}</p>
                    </div>
                </div>
            </div>

            <div className="pt-10 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">LIQUIDITY TOTAL</p>
                    <p className="text-4xl font-black text-indigo-600 tracking-tighter italic">
                        {order?.total_amount?.toLocaleString('vi-VN')} VND
                    </p>
                </div>
                 <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    <ShieldCheck size={14} className="mr-2" /> Verified Order
                 </Badge>
            </div>
        </div>

        {/* Support Section */}
        <div className="flex flex-col items-center gap-6 pt-12">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Cần hỗ trợ về giao dịch? Chat với nhân viên vận hành 24/7</p>
            <div className="flex items-center gap-4">
                <Button variant="ghost" className="rounded-2xl text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 h-12 px-8">
                   <Send size={14} className="mr-2" /> Download PDF Receipt
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
