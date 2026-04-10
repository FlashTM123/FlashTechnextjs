"use client";

import { motion } from "framer-motion";

const brands = [
  { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
  { name: "Samsung", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" },
  { name: "Sony", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg" },
  { name: "Dell", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Dell_logo.svg" },
  { name: "Asus", logo: "https://upload.wikimedia.org/wikipedia/commons/d/de/Asus-Logo.svg" },
  { name: "Logitech", logo: "https://upload.wikimedia.org/wikipedia/commons/1/17/Logitech_logo.svg" },
];

export function BrandWall() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-white/[0.01] border-y border-slate-100 dark:border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400">
            Thương Hiệu Đồng Hành
          </h2>
          <p className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
            Hợp tác từ những <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">tập đoàn hàng đầu</span>.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 dark:opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
          {brands.map((brand, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="w-24 md:w-32 h-12 relative flex items-center justify-center"
            >
              <img 
                src={brand.logo} 
                alt={brand.name}
                className="max-w-full max-h-full object-contain dark:invert"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
