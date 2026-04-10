"use client";

import { Star, MessageSquare, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface ProductReviewsProps {
  reviews: any[];
}

export function ProductReviews({ reviews }: ProductReviewsProps) {
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  return (
    <section className="py-24 border-t border-slate-100 dark:border-white/5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
        
        {/* Review Summary */}
        <div className="space-y-8 sticky top-32">
          <div className="space-y-4">
             <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
               Đánh giá từ <span className="text-indigo-600">người dùng</span>
             </h2>
             <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">
               Phản hồi chân thực từ những khách hàng đã trực tiếp trải nghiệm sản phẩm này.
             </p>
          </div>

          <div className="p-8 rounded-[40px] bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 space-y-6">
             <div className="flex items-center gap-6">
                <div className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">{averageRating.toFixed(1)}</div>
                <div className="space-y-1">
                   <div className="flex gap-1">
                      {[1,2,3,4,5].map((i) => (
                        <Star key={i} size={18} className={i <= Math.round(averageRating) ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-800"} />
                      ))}
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Dựa trên {reviews.length} nhận xét</p>
                </div>
             </div>

             <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviews.filter(r => r.rating === star).length;
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-4">
                      <span className="text-[10px] font-bold text-slate-500 w-4">{star}★</span>
                      <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-white/5 overflow-hidden">
                        <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${percentage}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 w-8">{percentage.toFixed(0)}%</span>
                    </div>
                  );
                })}
             </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-8">
          {reviews.length > 0 ? (
            <div className="space-y-8">
              {reviews.map((review) => (
                <div key={review.id} className="group p-8 rounded-[32px] bg-white dark:bg-white/[0.01] border border-slate-50 dark:border-white/[0.02] hover:border-indigo-500/20 transition-all duration-300">
                  <div className="flex justify-between items-start gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <img 
                        src={review.customer.avatar || "https://github.com/shadcn.png"} 
                        alt={review.customer.full_name} 
                        className="w-12 h-12 rounded-2xl object-cover bg-slate-100"
                      />
                      <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1">
                          {review.customer.full_name}
                          <CheckCircle2 size={12} className="text-indigo-500" />
                        </h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                           {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: vi })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-800"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 bg-slate-50 dark:bg-white/[0.01] rounded-[60px] border border-dashed border-slate-200 dark:border-white/10">
               <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-300">
                 <MessageSquare size={32} />
               </div>
               <div className="max-w-xs">
                 <h3 className="text-lg font-bold text-slate-900 dark:text-white">Chưa có đánh giá nào</h3>
                 <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Hãy là người đầu tiên sở hữu và để lại nhận xét cho sản phẩm tuyệt vời này!</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
