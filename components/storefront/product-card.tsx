"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Eye, Star, Heart, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    base_price: number;
    images: string[];
    brand: { name: string };
    category: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(product.base_price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col h-full bg-white dark:bg-white/[0.03] rounded-[40px] border border-slate-100 dark:border-white/5 overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/20"
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden p-6">
        <div className="absolute inset-0 bg-slate-50 dark:bg-black/20 transition-colors" />
        
        {/* Badges */}
        <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
          <Badge className="bg-white/80 dark:bg-black/50 backdrop-blur-md text-indigo-600 dark:text-indigo-400 border-none px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
            {product.category}
          </Badge>
          {product.base_price > 20000000 && (
             <Badge className="bg-rose-500 text-white border-none px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20">
               Premium
             </Badge>
          )}
        </div>

        {/* Hover Actions */}
        <div className="absolute top-6 right-6 z-10 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-75">
          <Button size="icon" className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xl hover:bg-indigo-600 hover:text-white transition-all">
            <Heart size={18} />
          </Button>
          <Button size="icon" className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xl hover:bg-indigo-600 hover:text-white transition-all">
            <Eye size={18} />
          </Button>
        </div>

        <Link href={`/product/${product.slug}`} className="relative h-full w-full block">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-contain transition-all duration-700 group-hover:scale-110 group-hover:-rotate-3"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-200 dark:text-slate-800">
               <Sparkles size={80} strokeWidth={1} />
            </div>
          )}
        </Link>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-8 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">{product.brand?.name}</p>
            <div className="flex items-center gap-1">
              <Star size={10} className="fill-amber-400 text-amber-400" />
              <span className="text-[10px] font-bold text-slate-400">4.9</span>
            </div>
          </div>
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              {product.base_price < (product as any).original_price && (
                <p className="text-xs font-bold text-slate-400 line-through decoration-rose-500/50 mb-1">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format((product as any).original_price)}
                </p>
              )}
              <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">
                {formattedPrice}
              </p>
            </div>
            <Button size="icon" className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white hover:bg-indigo-600 hover:text-white transition-all duration-500 shadow-sm border border-transparent dark:hover:border-indigo-500/30">
              <ShoppingCart size={18} />
            </Button>
          </div>
          
          <Link href={`/product/${product.slug}`} className="w-full">
            <Button variant="ghost" className="w-full h-12 rounded-2xl border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-center gap-2 group/btn">
              Xem chi tiết
              <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
