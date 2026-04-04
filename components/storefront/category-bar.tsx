"use client";

import { Smartphone, Laptop, Tablet, Headphones, Watch, Cpu, Mouse, Keyboard, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const categories = [
  { name: "Smartphones", icon: Smartphone, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20", href: "/category/SMARTPHONE" },
  { name: "Laptops", icon: Laptop, color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20", href: "/category/LAPTOP" },
  { name: "Tablets", icon: Tablet, color: "text-sky-500", bg: "bg-sky-500/10", border: "border-sky-500/20", href: "/category/TABLET" },
  { name: "Audio", icon: Headphones, color: "text-fuchsia-500", bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/20", href: "/category/AUDIO" },
  { name: "Watches", icon: Watch, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", href: "/category/SMARTWATCH" },
  { name: "Components", icon: Cpu, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", href: "/category/COMPONENT" },
  { name: "Accessories", icon: Mouse, color: "text-slate-500", bg: "bg-slate-500/10", border: "border-slate-500/20", href: "/category/ACCESSORIES" },
];

export function CategoryBar() {
  return (
    <section className="py-20 bg-white dark:bg-[#0A0A0B] border-y border-slate-100 dark:border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <Zap size={12} className="fill-current" />
              Khám phá danh mục
            </div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Sản Phẩm <span className="text-indigo-600">Nổi Bật</span></h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm text-sm">
            Duyệt qua các danh mục hàng đầu của chúng tôi để tìm thấy thiết bị hoàn hảo cho nhu cầu của bạn.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
            >
              <Link 
                href={cat.href}
                className="group flex flex-col items-center justify-center p-6 rounded-[32px] bg-slate-50 dark:bg-white/[0.02] border border-transparent hover:border-slate-200 dark:hover:border-white/10 hover:bg-white dark:hover:bg-white/5 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-500 h-full"
              >
                <div className={`w-14 h-14 rounded-2xl ${cat.bg} border ${cat.border} flex items-center justify-center ${cat.color} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <cat.icon size={28} strokeWidth={2.5} />
                </div>
                <span className="mt-4 text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-widest text-center group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {cat.name}
                </span>
                <div className="mt-2 w-0 group-hover:w-8 h-1 bg-indigo-600 rounded-full transition-all duration-500 opacity-0 group-hover:opacity-100" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
