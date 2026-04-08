"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Sparkles, ArrowRight, Loader2, Command, X, PackageSearch } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  category: string;
  images: string[];
}

export function SearchOverlay({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=6`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (slug: string) => {
    onOpenChange(false);
    setQuery("");
    router.push(`/product/${slug}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden border-none bg-white/90 dark:bg-[#0A0A0B]/90 backdrop-blur-2xl shadow-[0_0_80px_rgba(0,0,0,0.1)] dark:shadow-[0_0_80px_rgba(0,0,0,0.5)] rounded-[32px]">
        <div className="flex flex-col h-[600px]">
          {/* Search Input Area */}
          <div className="relative p-6 border-b border-slate-100 dark:border-white/5">
            <div className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-400">
              {loading ? <Loader2 className="w-5 h-5 animate-spin text-indigo-600" /> : <Search className="w-5 h-5" />}
            </div>
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Bạn đang tìm siêu phẩm nào? (iPhone 16, MacBook...)"
              className="h-14 pl-14 pr-4 bg-transparent border-none text-lg font-bold placeholder:text-slate-400 focus-visible:ring-0"
            />
            <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center gap-2">
               <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-black text-slate-400">
                 <Command size={10} />
                 <span>ESC</span>
               </div>
               <button onClick={() => onOpenChange(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors text-slate-400 md:hidden">
                 <X size={20} />
               </button>
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <AnimatePresence mode="wait">
              {query.trim() === "" ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 p-4"
                >
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                       <Sparkles size={12} className="fill-indigo-600/30 text-indigo-600" /> Xu hướng tìm kiếm
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {["iPhone 16 Pro", "iPad Pro M4", "Galaxy S24", "MacBook Air", "Phụ kiện"].map((tag) => (
                        <button 
                          key={tag}
                          onClick={() => setQuery(tag)}
                          className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-xs font-bold hover:border-indigo-500/50 hover:text-indigo-600 transition-all active:scale-95"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-white/5">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Danh mục nổi bật</h4>
                    <div className="grid grid-cols-2 gap-3">
                       {["Smartphone", "Laptop", "Tablet", "Audio"].map((cat) => (
                         <button 
                           key={cat}
                           onClick={() => { router.push(`/products?category=${cat.toUpperCase()}`); onOpenChange(false); }}
                           className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 group hover:bg-indigo-600 transition-all"
                         >
                           <span className="text-sm font-black uppercase tracking-tight group-hover:text-white transition-colors">{cat}</span>
                           <ArrowRight size={14} className="text-slate-300 group-hover:text-white group-hover:translate-x-1 transition-all" />
                         </button>
                       ))}
                    </div>
                  </div>
                </motion.div>
              ) : results.length > 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2 p-2"
                >
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 ml-2">Kết quả phù hợp ({results.length})</h4>
                  {results.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelect(product.slug)}
                      className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all group border border-transparent hover:border-slate-100 dark:hover:border-white/5"
                    >
                      <div className="w-14 h-14 rounded-xl bg-white dark:bg-black/20 p-2 border border-slate-100 dark:border-white/5 group-hover:scale-105 transition-transform overflow-hidden">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{product.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-500">{product.category}</span>
                           <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-white/10" />
                           <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                             {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.base_price)}
                           </span>
                        </div>
                      </div>
                      <ArrowRight size={18} className="text-slate-200 dark:text-white/10 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </motion.div>
              ) : !loading ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 grayscale opacity-50 space-y-4">
                  <PackageSearch size={48} className="text-slate-300" />
                  <div>
                    <p className="text-sm font-black uppercase tracking-widest text-slate-400">Không tìm thấy sản phẩm</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mt-1">Thử từ khóa khác hoặc duyệt danh mục</p>
                  </div>
                </div>
              ) : null}
            </AnimatePresence>
          </div>

          {/* Footer bar */}
          <div className="p-4 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <div className="px-1.5 py-0.5 rounded bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10">ESC</div>
                  Đóng
               </div>
               <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <div className="px-1.5 py-0.5 rounded bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10">↑↓</div>
                  Di chuyển
               </div>
             </div>
             <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">FLASHTECH GLOBAL SEARCH</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
