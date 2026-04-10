"use client";

import { Truck, ShieldCheck, Headphones, CreditCard, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    icon: Truck,
    title: "Giao Hàng Siêu Tốc",
    description: "Nhận hàng ngay trong 2 giờ tại nội thành. Miễn phí vận chuyển đơn từ 2tr.",
    color: "bg-blue-500",
  },
  {
    icon: ShieldCheck,
    title: "Bảo Hành Toàn Diện",
    description: "Cam kết 100% hàng chính hãng. Đổi trả 1-1 trong 30 ngày nếu có lỗi.",
    color: "bg-emerald-500",
  },
  {
    icon: Headphones,
    title: "Hỗ Trợ Chuyên Gia",
    description: "Đội ngũ kỹ thuật viên sẵn sàng giải đáp thắc mắc của bạn 24/7.",
    color: "bg-indigo-600",
  },
  {
    icon: CreditCard,
    title: "Thanh Toán Linh Hoạt",
    description: "Hỗ trợ trả góp 0%, thanh toán qua thẻ, ví điện tử cực kỳ bảo mật.",
    color: "bg-rose-500",
  },
];

export function ServiceHighlights() {
  return (
    <section className="py-20 bg-white dark:bg-[#0A0A0B] transition-colors relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="group p-8 rounded-[32px] bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 hover:bg-white dark:hover:bg-white/[0.05] hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500"
            >
              <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center mb-6 shadow-lg shadow-${service.color.split('-')[1]}-500/20 group-hover:scale-110 transition-transform duration-500`}>
                <service.icon className="text-white w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                {service.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Decorative Gradient Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-30 dark:opacity-20 blur-[120px] z-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-fuchsia-500/20 rounded-full" />
      </div>
    </section>
  );
}
