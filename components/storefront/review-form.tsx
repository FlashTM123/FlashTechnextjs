"use client";

import { useState } from "react";
import { Star, CheckCircle2, User, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  productId: string;
  customerId: string;
  onSuccess: (newReview: any) => void;
  onCancel: () => void;
}

export function ReviewForm({ productId, customerId, onSuccess, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Vui lòng chọn số sao đánh giá");
      return;
    }

    setIsSubmitting(true);
    try {
      const resp = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          customerId,
          rating,
          comment
        })
      });

      if (!resp.ok) throw new Error("Thất bại");

      const newReview = await resp.json();
      toast.success("Cảm ơn bạn đã gửi đánh giá!");
      onSuccess(newReview);
    } catch (error) {
      toast.error("Không thể gửi đánh giá lúc này");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-white/[0.03] border border-slate-100 dark:border-white/10 rounded-[32px] p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="space-y-2">
        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Viết nhận xét của bạn</h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chia sẻ trải nghiệm sử dụng thực tế của bạn</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating Selection */}
        <div className="flex flex-col gap-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mức độ hài lòng</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="transition-all hover:scale-125 focus:outline-none"
              >
                <Star 
                  size={28} 
                  className={cn(
                    "transition-colors",
                    (hoveredRating || rating) >= star 
                      ? "fill-amber-400 text-amber-400" 
                      : "text-slate-200 dark:text-slate-800"
                  )} 
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment Textarea */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nội dung nhận xét</label>
          <Textarea 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isSubmitting}
            placeholder="Sản phẩm dùng rất tốt, đóng gói kỹ càng..."
            className="min-h-[120px] rounded-2xl bg-slate-50 dark:bg-black/20 border-slate-100 dark:border-white/5 font-medium focus:ring-indigo-600 focus:border-indigo-600 p-4"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-50 dark:border-white/5">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            Hủy bỏ
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="h-12 px-8 rounded-xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-lg shadow-indigo-600/20"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send size={14} />
            )}
            Gửi đánh giá
          </Button>
        </div>
      </form>
    </div>
  );
}
