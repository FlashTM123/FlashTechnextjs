"use client";

import { 
  Sparkles, 
  Rocket, 
  ShieldCheck, 
  Heart, 
  Target, 
  Users, 
  Award,
  ArrowRight,
  Monitor,
  Zap,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] pb-32 overflow-hidden">
      
      {/* 🚀 Hero Storytelling Section */}
      <section className="relative pt-32 pb-48">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20"
                >
                    <Rocket size={12} fill="currentColor" /> Our Story
                </motion.div>
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-7xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.9]"
                >
                    Định hình <br /> <span className="text-indigo-600 italic">Tương lai</span> <br /> Công nghệ.
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-500 font-medium text-lg leading-relaxed max-w-xl"
                >
                    Tại FlashTech, chúng tôi không chỉ bán thiết bị. Chúng tôi cung cấp những công cụ tối tân để bạn kiến tạo thế giới, làm việc hiệu quả và kết nối đam mê.
                </motion.p>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap gap-6 pt-6"
                >
                    <Link href="/products">
                        <Button className="h-16 px-10 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
                           Khám phá ngay <ArrowRight size={18} className="ml-3" />
                        </Button>
                    </Link>
                    <div className="flex -space-x-3 items-center">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-900 bg-slate-100 overflow-hidden shadow-lg">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=User${i}`} alt="user" className="w-full h-full object-cover" />
                            </div>
                        ))}
                        <p className="ml-6 text-xs font-black uppercase tracking-widest text-slate-400">+10k Khách hàng tin dùng</p>
                    </div>
                </motion.div>
            </div>

            <div className="relative">
                <motion.div 
                   initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                   animate={{ opacity: 1, scale: 1, rotate: 0 }}
                   transition={{ duration: 1 }}
                   className="relative aspect-square rounded-[60px] overflow-hidden border-8 border-slate-50 dark:border-white/5 shadow-2xl"
                >
                    <Image 
                        src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop" 
                        alt="Tech Experience" 
                        fill 
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/20 to-transparent" />
                </motion.div>
                
                {/* Floating Bento Stats */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -bottom-10 -left-10 p-8 rounded-[40px] bg-white/90 dark:bg-black/90 backdrop-blur-2xl border border-slate-100 dark:border-white/10 shadow-2xl space-y-2 hidden md:block"
                >
                    <p className="text-4xl font-black text-indigo-600 tracking-tighter">99.9%</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Sản phẩm chính hãng</p>
                </motion.div>
            </div>
        </div>
      </section>

      {/* 💎 Vision & Values Grid */}
      <section className="max-w-7xl mx-auto px-6 space-y-20 py-32 border-t border-slate-100 dark:border-white/5">
         <div className="text-center space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Core Values</h2>
            <p className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                Giá trị <span className="text-indigo-600">FlashTech</span> theo đuổi
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard 
                icon={ShieldCheck}
                title="Sự Chính Trực"
                desc="Mọi sản phẩm tại FlashTech đều được cam kết chính hãng 100%, nguồn gốc minh bạch và rõ ràng."
                color="text-emerald-500"
            />
            <ValueCard 
                icon={Zap}
                title="Tốc Độ"
                desc="Từ khâu đặt hàng, xác nhận đến giao hỏa tốc 2h. Chúng tôi trân trọng từng giây phút của khách hàng."
                color="text-amber-500"
            />
            <ValueCard 
                icon={Heart}
                title="Tận Tâm"
                desc="Chúng tôi tư vấn sản phẩm dựa trên nhu cầu thực tế của khách, không chạy theo lợi nhuận đơn thuần."
                color="text-rose-500"
            />
         </div>
      </section>

      {/* 🏢 Infrastructure & Mission */}
      <section className="bg-slate-900 py-32">
         <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center space-y-12">
            <div className="w-20 h-20 rounded-[32px] bg-indigo-600 flex items-center justify-center text-white rotate-12 shadow-2xl shadow-indigo-500/50">
                <Target size={40} />
            </div>
            <div className="space-y-6 max-w-4xl">
                <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-tight italic">
                    Sứ mệnh của chúng tôi là kết nối cuộc sống của bạn với <span className="text-indigo-500 underline decoration-indigo-500 underline-offset-8">Những Siêu Phẩm</span> công nghệ hàng đầu thế giới.
                </h2>
                <p className="text-slate-400 text-lg font-medium leading-relaxed">
                    Được thành lập từ năm 2026 bởi những "Tech-Enthusiasts", FlashTech đã nhanh chóng chuyển mình từ một cửa hàng nhỏ thành chuỗi hệ thống trải nghiệm công nghệ cao cấp tại Việt Nam.
                </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full pt-12 border-t border-white/5">
                {[
                    { val: "50k+", label: "Đơn hàng hoàn tất" },
                    { val: "20+", label: "Thương hiệu đối tác" },
                    { val: "15", label: "Showroom toàn quốc" },
                    { val: "4.9/5", label: "Đánh giá từ khách" },
                ].map((stat, i) => (
                    <div key={i} className="space-y-1">
                        <p className="text-3xl font-black text-white tracking-tighter">{stat.val}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">{stat.label}</p>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* 🎁 Join Section */}
      <section className="max-w-5xl mx-auto px-6 py-32 text-center">
         <div className="p-16 rounded-[60px] bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 space-y-10 relative overflow-hidden group">
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-500/10 blur-[120px]" />
            <Award className="w-16 h-16 text-indigo-500 mx-auto" />
            <div className="space-y-4">
                <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Bạn đã sẵn sàng nâng tầm trải nghiệm?</h3>
                <p className="text-slate-500 font-medium">Hãy gia nhập cộng đồng hơn 50,000 khách hàng tinh hoa của FlashTech ngay hôm nay.</p>
            </div>
            <Link href="/products" className="inline-block">
                <Button className="h-16 px-12 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/20 group">
                    Bắt đầu mua sắm <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </Link>
         </div>
      </section>

    </div>
  );
}

function ValueCard({ icon: Icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
    return (
        <div className="p-10 rounded-[40px] bg-white dark:bg-white/[0.01] border border-slate-100 dark:border-white/5 hover:border-indigo-500/20 transition-all group">
            <div className={`w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform ${color}`}>
                <Icon size={28} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{desc}</p>
        </div>
    );
}
