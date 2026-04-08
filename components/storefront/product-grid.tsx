"use client";

import { ProductCard } from "./product-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ProductGridProps {
  title?: string;
  subtitle?: string;
  products: any[];
  limit?: number;
}

export function ProductGrid({ title, subtitle, products, limit = 8 }: ProductGridProps) {
  const displayProducts = products.slice(0, limit);

  return (
    <section className="py-24 bg-white dark:bg-[#0A0A0B] transition-colors relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(circle_at_50%_50%,#4f46e5_0,transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="space-y-4">
            {title && (
              <div className="flex flex-col gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 w-fit">
                  <Sparkles size={12} className="fill-current" />
                  Sản phẩm mới nhất
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                  {title}
                </h2>
              </div>
            )}
            {subtitle && (
              <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl text-lg">
                {subtitle}
              </p>
            )}
          </div>
          <Link href="/products">
            <Button variant="outline" className="h-12 px-8 rounded-full border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 font-bold text-sm transition-all hover:scale-105 active:scale-95 group">
              Xem tất cả
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {displayProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 bg-slate-50 dark:bg-white/[0.02] rounded-[60px] border border-dashed border-slate-200 dark:border-white/10">
             <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-300 dark:text-slate-700">
                <Sparkles size={40} />
             </div>
             <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Chưa có sản phẩm nào</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Dữ liệu sản phẩm đang được cập nhật, vui lòng quay lại sau.</p>
             </div>
          </div>
        )}
      </div>
    </section>
  );
}
