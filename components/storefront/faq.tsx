"use client";

import { Plus, Minus, HelpCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Chính sách bảo hành của FlashTech như thế nào?",
    answer: "Tất cả sản phẩm tại FlashTech đều được bảo hành chính hãng từ 12-24 tháng. Chúng tôi hỗ trợ lỗi 1 đổi 1 trong vòng 30 ngày đầu tiên nếu phát sinh lỗi từ nhà sản xuất.",
  },
  {
    question: "Tôi có thể mua trả góp tại FlashTech không?",
    answer: "Có, FlashTech hỗ trợ mua trả góp 0% lãi suất thông qua thẻ tín dụng của hơn 20 ngân hàng hoặc qua các công ty tài chính như HD Saison, Home Credit với thủ tục đơn giản.",
  },
  {
    question: "Thời gian giao hàng mất bao lâu?",
    answer: "Với đơn hàng nội thành, chúng tôi hỗ trợ giao nhanh trong 2 giờ qua dịch vụ FlashExpress. Các khu vực khác sẽ nhận hàng từ 2-4 ngày làm việc.",
  },
  {
    question: "Làm thế nào để kiểm tra đơn hàng của tôi?",
    answer: "Bạn có thể vào mục 'Theo dõi đơn hàng' trong tài khoản cá nhân hoặc nhập mã vận đơn vào trang tra cứu của đơn vị vận chuyển đối tác.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-slate-50 dark:bg-white/[0.01] relative">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <HelpCircle size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Trung tâm giải đáp</span>
           </div>
           <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
             Câu hỏi thường gặp
           </h2>
           <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto">
             Tìm nhanh câu trả lời cho các vấn đề bạn đang quan tâm về dịch vụ của chúng tôi.
           </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="group rounded-[24px] bg-white dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 overflow-hidden transition-all duration-300 hover:border-indigo-500/40"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4"
              >
                <span className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {faq.question}
                </span>
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${openIndex === idx ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
                  {openIndex === idx ? <Minus size={16} /> : <Plus size={16} />}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-slate-500 dark:text-slate-400 font-medium leading-relaxed border-t border-slate-100 dark:border-white/5 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
