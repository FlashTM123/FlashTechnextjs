"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight, Play, Sparkles, Zap, Smartphone, Laptop } from "lucide-react";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden bg-white dark:bg-[#0A0A0B] transition-colors">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 dark:bg-indigo-600/20 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-fuchsia-600/10 dark:bg-fuchsia-600/20 blur-[150px] rounded-full animate-float" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Text Content */}
        <div className="space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Trải nghiệm kỷ nguyên số mới
          </motion.div>

          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-7xl xl:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.95]"
            >
              Nâng Tầm <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-600 dark:from-indigo-400 dark:via-fuchsia-400 dark:to-rose-400">
                Cuộc Sống Kỹ Thuật Số.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg md:text-xl font-medium text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl"
            >
              FlashTech mang đến những thiết bị tối tân nhất, được tuyển chọn kỹ lưỡng để hỗ trợ tối đa cho công việc và phong cách sống của bạn.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center gap-6"
          >
            <Button className="h-14 px-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white font-bold text-sm shadow-xl shadow-indigo-600/20 group transition-all duration-300">
              Mua Sắm Ngay
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="ghost" className="h-14 px-8 rounded-full font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all flex items-center gap-3 active:scale-95">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Play fill="currentColor" size={14} className="ml-0.5" />
              </div>
              Xem Video
            </Button>
          </motion.div>

          {/* Stats Segment */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center gap-12 pt-10 border-t border-slate-100 dark:border-white/5"
          >
            <div>
              <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">50K+</p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">Khách hàng</p>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">99.9%</p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">Hài lòng</p>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">24H</p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">Giao hàng nhanh</p>
            </div>
          </motion.div>
        </div>

        {/* Visual Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative hidden lg:block h-[600px]"
        >
          {/* Main Floating Image Placeholder/Card */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Glossy Card Effect */}
            <div className="w-[500px] h-[550px] bg-gradient-to-br from-white/40 to-white/10 dark:from-white/10 dark:to-white/5 backdrop-blur-3xl rounded-[60px] border border-white/40 dark:border-white/10 shadow-2xl relative group overflow-hidden transition-all duration-700 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-fuchsia-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Product Badge */}
              <div className="absolute top-10 right-10 z-20 bg-black text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest animate-bounce">
                Hotsale 2026
              </div>

              {/* Central Content */}
              <div className="flex flex-col items-center justify-center h-full p-12 text-center space-y-8">
                <div className="w-64 h-64 bg-slate-200 dark:bg-white/5 rounded-full flex items-center justify-center relative shadow-inner">
                   <Zap size={80} className="text-indigo-600 dark:text-indigo-400 animate-pulse" />
                   {/* Sub-floating elements */}
                   <div className="absolute -top-4 -right-4 w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center animate-float">
                      <Smartphone size={24} className="text-fuchsia-500" />
                   </div>
                   <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center animate-float-delayed">
                      <Laptop size={32} className="text-indigo-500" />
                   </div>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-widest uppercase">Vortex AI Pro</h3>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Coming Soon - Summer 2026</p>
                </div>
              </div>
            </div>

            {/* Secondary Floating Elements */}
            <div className="absolute -top-12 -left-12 w-48 bg-white/80 dark:bg-black/80 backdrop-blur-xl p-5 rounded-3xl border border-white/20 dark:border-white/5 shadow-2xl animate-float">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Live Orders</span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Marcus đã mua iPhone 16 Pro Max</p>
              <p className="text-[10px] text-slate-400 mt-1">2 phút trước</p>
            </div>
            
            <div className="absolute -bottom-8 right-0 w-56 bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-[32px] text-white shadow-2xl shadow-indigo-600/40 animate-float-delayed">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">Ưu đãi độc quyền</p>
              <p className="text-lg font-black leading-tight">Giảm ngay 2.000.000đ khi đặt trước</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-indigo-700 bg-slate-300 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-slate-400 to-slate-600" />
                    </div>
                  ))}
                </div>
                <span className="text-[10px] font-bold">+1.2k đặt trước</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
