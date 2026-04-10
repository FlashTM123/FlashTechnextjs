"use client";

import Link from "next/link";
import { 
  Heart, 
  Trash2, 
  ShoppingCart, 
  ChevronLeft, 
  Home, 
  ChevronRight,
  ShoppingBag,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/app/context/wishlist-context";
import { useCart } from "@/app/context/cart-context";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, isInitialized } = useWishlist();
  const { addToCart } = useCart();

  const formatPrice = (price: number) => 
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  if (!isInitialized) return (
    <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Wishlist...</p>
        </div>
    </div>
  );

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-8 px-6 text-center">
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-[32px] bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-300"
        >
          <Heart size={48} strokeWidth={1} />
        </motion.div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Danh sách trống</h1>
          <p className="text-slate-500 font-medium max-w-xs mx-auto">Bạn chưa yêu thích sản phẩm nào. Hãy khám phá và lưu lại những món đồ bạn ưng ý nhất!</p>
        </div>
        <Link href="/">
          <Button className="h-14 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-500/20 group">
            <ChevronLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Về trang chủ
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] pb-32">
        {/* Breadcrumbs */}
        <div className="bg-slate-50/50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5 py-3 mb-12">
            <div className="max-w-7xl mx-auto px-6">
                <nav className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    <Link href="/" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5 group">
                        <Home size={12} className="group-hover:scale-110 transition-transform" />
                        Trang chủ
                    </Link>
                    <ChevronRight size={10} className="opacity-50" />
                    <span className="text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Yêu thích</span>
                </nav>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-slate-100 dark:border-white/5">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 text-[10px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20">
                        <Heart size={12} className="fill-current" /> SẢN PHẨM CỦA BẠN
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
                        MY <span className="text-rose-500 italic">WISHLIST</span>
                    </h1>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">{wishlistItems.length} Sản phẩm đã lưu</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <AnimatePresence mode="popLayout">
                    {wishlistItems.map((item) => (
                        <motion.div 
                            layout
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="group flex flex-col h-full bg-white dark:bg-white/[0.02] rounded-[40px] border border-slate-100 dark:border-white/5 overflow-hidden hover:shadow-2xl hover:shadow-black/[0.02] transition-all"
                        >
                            <div className="relative aspect-square p-8 bg-slate-50 dark:bg-white/[0.01]">
                                <Image 
                                    src={item.image} 
                                    alt={item.name} 
                                    fill 
                                    className="object-contain p-8 group-hover:scale-110 transition-transform duration-500" 
                                />
                                <button 
                                    onClick={() => removeFromWishlist(item.id)}
                                    className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-rose-500 shadow-xl opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="flex-1 p-8 flex flex-col justify-between space-y-6">
                                <div className="space-y-2">
                                    <Link href={`/product/${item.slug}`}>
                                        <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-tight hover:text-indigo-600 transition-colors line-clamp-2">
                                            {item.name}
                                        </h3>
                                    </Link>
                                    <p className="text-xl font-black text-indigo-600 tracking-tighter">{formatPrice(item.price)}</p>
                                </div>

                                <div className="space-y-3">
                                    <Button 
                                        onClick={() => addToCart({
                                            id: `${item.id}-base`,
                                            productId: item.id,
                                            variantId: null,
                                            name: item.name,
                                            variantName: null,
                                            image: item.image,
                                            price: item.price,
                                            quantity: 1
                                        })}
                                        className="w-full h-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all"
                                    >
                                        <ShoppingCart size={14} className="mr-2" /> Thêm vào giỏ
                                    </Button>
                                    <Link href={`/product/${item.slug}`} className="block">
                                        <Button variant="ghost" className="w-full h-12 rounded-2xl border border-slate-100 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500 group/btn">
                                            Chi tiết <ArrowRight size={14} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    </div>
  );
}
