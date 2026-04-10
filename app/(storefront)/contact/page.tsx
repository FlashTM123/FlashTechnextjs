"use client";

import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Send, 
  Clock, 
  ShieldCheck, 
  Globe,
  Camera,
  MessageCircle,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] pb-32">
      <div className="max-w-7xl mx-auto px-6 pt-24 space-y-32">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
           <motion.div 
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             className="px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20"
           >
             Get In Touch
           </motion.div>
           <h1 className="text-6xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
              Kết nối với <br /> <span className="text-indigo-600 italic">FlashTech</span>
           </h1>
           <p className="text-slate-500 font-medium text-lg leading-relaxed">
              Chúng tôi luôn ở đây để lắng nghe và giải đáp mọi thắc mắc của bạn về sản phẩm và dịch vụ công nghệ.
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Contact Info (Left - 5 Cols) */}
            <div className="lg:col-span-5 space-y-8">
                <div className="grid grid-cols-1 gap-4">
                    <InfoCard 
                        icon={Mail} 
                        label="Email hỗ trợ" 
                        value="support@flashtech.com" 
                        desc="Phản hồi trong vòng 24h"
                    />
                    <InfoCard 
                        icon={Phone} 
                        label="Hotline 24/7" 
                        value="1900 6868" 
                        desc="Hỗ trợ kỹ thuật & mua hàng"
                    />
                    <InfoCard 
                        icon={MapPin} 
                        label="Trụ sở chính" 
                        value="256 Nguyễn Trãi, Thanh Xuân, Hà Nội" 
                        desc="Xem đường đi trên Google Maps"
                    />
                </div>

                {/* Social Bento */}
                <div className="p-8 rounded-[40px] bg-slate-900 text-white space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[60px]" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Social Networks</h4>
                    <div className="flex gap-4">
                        {[Camera, MessageCircle, Send, Globe].map((Icon, i) => (
                            <button key={i} className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white hover:text-slate-900 flex items-center justify-center transition-all active:scale-90">
                                <Icon size={20} />
                            </button>
                        ))}
                    </div>
                    <p className="text-xs font-medium text-slate-400">Theo dõi chúng tôi để cập nhật những siêu phẩm công nghệ mới nhất hàng ngày.</p>
                </div>
            </div>

            {/* Contact Form (Right - 7 Cols) */}
            <div className="lg:col-span-7">
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="p-10 md:p-16 rounded-[60px] bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 space-y-12"
                >
                    <div className="space-y-2">
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Gửi tin nhắn</h3>
                        <p className="text-slate-500 text-sm font-medium">Hoặc để lại số điện thoại, chúng tôi sẽ gọi lại ngay!</p>
                    </div>

                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Họ và tên</label>
                                <Input placeholder="Nguyễn Văn A" className="h-14 rounded-2xl border-slate-200 dark:border-white/10 bg-white dark:bg-black p-6 font-bold focus:ring-2 focus:ring-indigo-600 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Số điện thoại</label>
                                <Input placeholder="09xx xxx xxx" className="h-14 rounded-2xl border-slate-200 dark:border-white/10 bg-white dark:bg-black p-6 font-bold" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Chủ đề quan tâm</label>
                            <Input placeholder="Tư vấn mua iPhone 16 Pro Max..." className="h-14 rounded-2xl border-slate-200 dark:border-white/10 bg-white dark:bg-black p-6 font-bold" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nội dung chi tiết</label>
                            <Textarea placeholder="Tôi cần hỗ trợ về..." className="min-h-[150px] rounded-3xl border-slate-200 dark:border-white/10 bg-white dark:bg-black p-6 font-bold resize-none" />
                        </div>
                        <Button className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 group uppercase">
                            Gửi yêu cầu ngay <Send size={18} className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Button>
                    </form>
                </motion.div>
            </div>
        </div>

        {/* Feature Bento Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureSmall icon={Clock} title="Hỗ trợ 24/7" desc="Luôn sẵn sàng khi bạn cần" />
            <FeatureSmall icon={ShieldCheck} title="Bảo mật tin nhắn" desc="Dữ liệu được mã hóa SSL" />
            <FeatureSmall icon={Globe} title="Giao hàng toàn quốc" desc="Miễn phí ship cho đơn > 2M" />
            <FeatureSmall icon={MessageSquare} title="Tư vấn chuyên gia" desc="Am hiểu sâu sắc về Tech" />
        </div>

      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value, desc }: { icon: any, label: string, value: string, desc: string }) {
    return (
        <div className="p-8 rounded-[40px] bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 flex gap-6 hover:border-indigo-500/30 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-white/5 shadow-sm border border-slate-100 dark:border-white/5 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                <Icon size={24} />
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
                <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{value}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{desc}</p>
            </div>
        </div>
    );
}

function FeatureSmall({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="flex items-center gap-4 p-6 rounded-3xl bg-slate-50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/5">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center text-indigo-500">
                <Icon size={18} />
            </div>
            <div>
                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white leading-none">{title}</h4>
                <p className="text-[10px] font-bold text-slate-400 mt-1">{desc}</p>
            </div>
        </div>
    );
}
