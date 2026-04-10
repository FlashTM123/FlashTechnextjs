"use client";

import { Star, Quote, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Nguyễn Minh Anh",
    role: "Graphic Designer",
    content: "Tôi đã mua chiếc MacBook M3 tại FlashTech. Giao hàng cực nhanh, máy được đóng gói rất cẩn thận. Chắc chắn sẽ ủng hộ tiếp!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Annie",
    rating: 5,
  },
  {
    name: "Trần Hoàng Nam",
    role: "Software Engineer",
    content: "Dịch vụ bảo hành ở đây rất chuyên nghiệp. Nhân viên kỹ thuật tư vấn rất tận tâm và am hiểu sản phẩm. 10 điểm cho FlashTech!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    rating: 5,
  },
  {
    name: "Lê Thu Thảo",
    role: "Content Creator",
    content: "Rất thích cách FlashTech trình bày website, dễ dàng tìm kiếm và so sánh sản phẩm. Quy trình thanh toán cũng rất mượt mà.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    rating: 5,
  },
];

interface TestimonialsProps {
  reviews: any[];
}

export function Testimonials({ reviews }: TestimonialsProps) {
  // Use DB reviews if available, otherwise fallback to curated testimonials
  const displayData = reviews.length > 0 
    ? reviews.map(r => ({
        name: r.customer.full_name,
        role: r.customer.tier === "GOLD" || r.customer.tier === "DIAMOND" ? "Khách hàng thân thiết" : "Khách hàng",
        content: r.comment,
        avatar: r.customer.avatar || "https://github.com/shadcn.png",
        rating: r.rating
      }))
    : testimonials;

  return (
    <section className="py-24 bg-white dark:bg-[#0A0A0B] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400">
              Đánh Giá Khách Hàng
            </h2>
            <p className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
              Lắng nghe những trải nghiệm <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">thực tế nhất</span>.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
             <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200" />
                ))}
             </div>
             <p className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-2">
                +2,500 khách hàng tin dùng
             </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayData.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-[40px] bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 hover:border-indigo-500/30 transition-all duration-500 group relative"
            >
              <Quote className="absolute top-8 right-8 text-indigo-500/10 w-12 h-12 group-hover:text-indigo-500/20 transition-colors" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-8">
                "{item.content}"
              </p>

              <div className="flex items-center gap-4">
                <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-2xl bg-white shadow-sm object-cover" />
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1">
                    {item.name}
                    <CheckCircle2 size={12} className="text-indigo-500" />
                  </h4>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
