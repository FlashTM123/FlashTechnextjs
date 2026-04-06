"use client";

import Link from "next/link";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ChevronLeft, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  ShoppingBag,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/app/context/cart-context";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalAmount, totalItems, isInitialized } = useCart();

  const formatPrice = (price: number) => 
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  if (!isInitialized) {
      return (
          <div className="min-h-[70vh] flex items-center justify-center">
              <div className="animate-pulse flex flex-col items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Cart Data...</p>
              </div>
          </div>
      );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-8 px-6">
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-[32px] bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-300"
        >
          <ShoppingBag size={48} strokeWidth={1} />
        </motion.div>
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Giỏ hàng trống</h1>
          <p className="text-slate-500 font-medium max-w-xs mx-auto">Bạn chưa chọn sản phẩm nào. Hãy khám phá những siêu phẩm công nghệ mới nhất!</p>
        </div>
        <Link href="/">
          <Button className="h-14 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-500/20 group">
            <ChevronLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Tiếp tục mua sắm
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] pb-32">
        {/* Header Section */}
        <div className="bg-slate-50/50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5 py-12 mb-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4 text-center md:text-left">
                         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                            <ShoppingCart size={12} /> GIỎ HÀNG CỦA BẠN
                         </div>
                         <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                            Shopping <span className="text-indigo-600 italic">Bag</span>
                         </h1>
                    </div>
                    <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                        <div className="flex flex-col items-center md:items-end">
                            <span className="text-[10px] text-slate-400">TỔNG VẬT PHẨM</span>
                            <span className="text-slate-900 dark:text-white">{totalItems} đơn vị</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-16 items-start">
                
                {/* Items List (Left) */}
                <div className="xl:col-span-2 space-y-6">
                    <AnimatePresence mode="popLayout">
                        {cartItems.map((item) => (
                            <motion.div 
                                layout
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                className="group p-6 md:p-8 rounded-[40px] bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 hover:border-indigo-500/20 transition-all shadow-sm hover:shadow-xl hover:shadow-black/[0.02]"
                            >
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    <div className="w-40 h-40 rounded-[32px] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 p-6 flex items-center justify-center shrink-0 relative overflow-hidden">
                                        <Image src={item.image} alt={item.name} fill className="object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
                                    </div>

                                    <div className="flex-1 space-y-4 text-center md:text-left">
                                        <div className="space-y-1">
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.name}</h3>
                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                                {item.variantName && (
                                                     <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px] font-bold border-slate-200 dark:border-white/10 text-slate-500 uppercase tracking-widest">
                                                       {item.variantName}
                                                    </Badge>
                                                )}
                                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Sẵn hàng</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                                            <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-2xl h-11 px-2">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-xl hover:bg-white dark:hover:bg-white/5 flex items-center justify-center font-bold text-lg transition-all">-</button>
                                                <span className="w-10 text-center font-black">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-xl hover:bg-white dark:hover:bg-white/5 flex items-center justify-center font-bold text-lg transition-all">+</button>
                                            </div>
                                            <button 
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                                            >
                                                <Trash2 size={16} /> Gỡ bỏ
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-center md:text-right space-y-1">
                                        <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                                            {formatPrice(item.price * item.quantity)}
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {formatPrice(item.price)} / đơn vị
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Summary Section (Right) */}
                <div className="xl:sticky xl:top-32 space-y-8">
                    <div className="p-10 rounded-[40px] bg-slate-900 text-white shadow-2xl shadow-indigo-600/20 space-y-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] -z-0 group-hover:bg-indigo-500/30 transition-colors" />
                        
                        <div className="relative z-10 space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 flex items-center gap-2">
                                <Zap size={14} /> TÓM TẮT ĐƠN HÀNG
                            </h3>

                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Tạm tính ({totalItems} món)</span>
                                    <span className="font-black tracking-tight">{formatPrice(totalAmount)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Vận chuyển</span>
                                    <span className="font-black text-emerald-400 uppercase tracking-widest text-[10px]">Miễn phí</span>
                                </div>
                                <Separator className="bg-white/10" />
                                <div className="flex flex-col gap-1 pt-2">
                                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-400">TỔNG CỘNG THUẾ</span>
                                    <div className="text-4xl font-black tracking-tighter italic">
                                        {formatPrice(totalAmount)}
                                    </div>
                                </div>
                            </div>

                            <Link href="/checkout">
                                <Button className="w-full h-16 rounded-2xl bg-white text-slate-900 font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-100 transition-all shadow-xl group">
                                    Xác nhận mua hàng <ArrowRight size={18} className="ml-3 group-hover:translate-x-2 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Trust Signals */}
                    <div className="p-8 rounded-[32px] bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 space-y-6">
                        {[
                            { icon: ShieldCheck, title: "Thanh toán an toàn", desc: "Mọi giao dịch đều được mã hóa SSL 256-bit" },
                            { icon: Truck, title: "Giao hàng thần tốc", desc: "Hỗ trợ giao nhanh 2h trong nội thành" },
                            { icon: RotateCcw, title: "Đổi trả linh hoạt", desc: "Hoàn tiền ngay trong 7 ngày nếu lỗi" }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                                    <item.icon size={20} strokeWidth={1.5} />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">{item.title}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-tight">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
