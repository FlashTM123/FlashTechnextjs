"use client";

import { useState, useEffect, useMemo } from "react";
import { Star, CheckCircle2, User, MessageCircle, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewForm } from "./review-form";
import { useCustomerAuth } from "@/app/context/customer-auth-context";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  customer: {
    name: string;
    avatar: string | null;
    isVerified: boolean;
  };
}

interface ReviewSectionProps {
  productId: string;
  productName: string;
}

export function ReviewSection({ productId, productName }: ReviewSectionProps) {
  const { customer } = useCustomerAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const resp = await fetch(`/api/reviews?productId=${productId}`);
        if (resp.ok) {
          const data = await resp.json();
          setReviews(data);
        }
      } catch (error) {
        console.error("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [productId]);

  const stats = useMemo(() => {
    if (reviews.length === 0) return { avg: 0, count: 0 };
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return {
      avg: (sum / reviews.length).toFixed(1),
      count: reviews.length
    };
  }, [reviews]);

  const userReview = useMemo(() => {
    if (!customer) return null;
    return reviews.find(r => r.customer.name === customer.full_name); // Matching by name as a proxy for simplicity since customer.id might not be in the review object depending on API
  }, [reviews, customer]);

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Header & Stats Overview */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 p-10 md:p-14 rounded-[40px]">
        <div className="space-y-4 text-center md:text-left">
           <div className="flex items-center justify-center md:justify-start gap-4">
              <h3 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.avg}</h3>
              <div className="space-y-1">
                 <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        size={16} 
                        className={cn(
                          Number(stats.avg) >= s ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-800"
                        )} 
                      />
                    ))}
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stats.count} lượt đánh giá</p>
              </div>
           </div>
           <p className="text-sm font-medium text-slate-500 max-w-sm">
             Đánh giá trung bình từ cộng đồng người dùng FlashTech.
           </p>
        </div>

        <div className="flex flex-col items-center gap-4">
           {customer ? (
              !showForm && (
                <Button 
                  onClick={() => setShowForm(true)}
                  className="h-14 px-10 rounded-[20px] bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-[11px] uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                  {userReview ? "Sửa nhận xét của bạn" : "Viết nhận xét của bạn"}
                </Button>
              )
           ) : (
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-6 py-3 rounded-full border border-indigo-100 dark:border-indigo-500/20">
                Đăng nhập để viết nhận xét
              </p>
           )}
        </div>
      </div>

      {showForm && customer && (
        <ReviewForm 
          productId={productId} 
          customerId={customer.id} 
          initialRating={userReview?.rating}
          initialComment={userReview?.comment}
          onCancel={() => setShowForm(false)}
          onSuccess={(newReview) => {
            if (userReview) {
              setReviews(reviews.map(r => r.id === newReview.id ? newReview : r));
            } else {
              setReviews([newReview, ...reviews]);
            }
            setShowForm(false);
          }}
        />
      )}

      {/* Reviews List */}
      <div className="space-y-8">
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className="p-8 rounded-[32px] bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 space-y-6 hover:border-slate-200 dark:hover:border-white/10 transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center font-black text-indigo-600 dark:text-indigo-400 shadow-sm">
                      {review.customer.avatar ? (
                        <img src={review.customer.avatar} className="w-full h-full object-cover rounded-2xl" alt="avatar" />
                      ) : (
                        review.customer.name.substring(0, 1)
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{review.customer.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400">
                        {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: vi })}
                      </p>
                    </div>
                  </div>
                  
                  {review.customer.isVerified && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 shadow-sm animate-in fade-in zoom-in">
                       <CheckCircle2 size={12} />
                       <span className="text-[9px] font-black uppercase tracking-widest">Đã mua hàng</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        size={12} 
                        className={cn(review.rating >= s ? "fill-amber-400 text-amber-400" : "text-slate-100 dark:text-white/5")} 
                      />
                    ))}
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-6 bg-slate-50 dark:bg-white/[0.02] rounded-[40px] border border-dashed border-slate-200 dark:border-white/10 grayscale opacity-60">
             <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-300 dark:text-slate-700">
                <MessageCircle size={32} />
             </div>
             <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Chưa có nhận xét nào</h4>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Trở thành người đầu tiên chia sẻ trải nghiệm</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
