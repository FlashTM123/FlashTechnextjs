"use client";

import { useState, useEffect } from "react";
import { 
  Star, 
  Search, 
  Trash2, 
  MessageSquare, 
  Filter, 
  ArrowUpDown, 
  Loader2, 
  User, 
  Package, 
  Calendar,
  AlertCircle,
  MoreVertical,
  ThumbsUp,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  customer: {
    id: string;
    full_name: string;
    avatar: string;
    email: string;
  };
  product: {
    id: string;
    name: string;
    images: string[];
    slug: string;
  };
}

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [search]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/reviews?search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách đánh giá");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/reviews?id=${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Đã xóa đánh giá thành công");
        setReviews(reviews.filter(r => r.id !== deleteId));
      } else {
        toast.error("Lỗi khi xóa đánh giá");
      }
    } catch (err) {
      toast.error("Lỗi hệ thống khi xóa");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="p-6 lg:p-10 space-y-8">
      {/* Header section with Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Quản lý đánh giá</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Theo dõi và kiểm duyệt phản hồi từ khách hàng về sản phẩm.</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end px-6 py-4 rounded-[24px] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm">
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Điểm trung bình</span>
             <div className="flex items-center gap-2 mt-1">
               <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{averageRating}</span>
               <div className="flex items-center">
                 {[1, 2, 3, 4, 5].map((s) => (
                   <Star key={s} size={14} className={cn(s <= Math.round(Number(averageRating)) ? "text-amber-400 fill-amber-400" : "text-slate-200 dark:text-white/10")} />
                 ))}
               </div>
             </div>
           </div>
           
           <div className="flex flex-col items-end px-6 py-4 rounded-[24px] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm">
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tổng đánh giá</span>
             <span className="text-2xl font-black text-slate-900 dark:text-white mt-1">{reviews.length}</span>
           </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-96 relative group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <Input 
            placeholder="Tìm tên sản phẩm, email khách..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 pl-12 rounded-2xl bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 focus-visible:ring-4 focus-visible:ring-indigo-500/10 font-bold"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="h-12 rounded-2xl border-slate-200 dark:border-white/10 font-bold gap-2 flex-1 md:flex-none">
            <Filter size={18} /> Lọc
          </Button>
          <Button variant="outline" className="h-12 rounded-2xl border-slate-200 dark:border-white/10 font-bold gap-2 flex-1 md:flex-none">
            <ArrowUpDown size={18} /> Sắp xếp
          </Button>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[32px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Khách hàng</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Sản phẩm</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Đánh giá</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Phản hồi</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse border-b border-slate-100 dark:border-white/5 last:border-none">
                      <td colSpan={5} className="px-6 py-8">
                        <div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-full" />
                      </td>
                    </tr>
                  ))
                ) : reviews.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3 opacity-50">
                        <MessageSquare size={48} className="text-slate-300" />
                        <p className="font-bold text-slate-400 uppercase tracking-widest text-sm">Không tìm thấy đánh giá nào</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  reviews.map((review) => (
                    <motion.tr 
                      key={review.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group border-b border-slate-100 dark:border-white/5 last:border-none hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-slate-100 dark:border-white/10 group-hover:scale-105 transition-transform">
                            <AvatarImage src={review.customer.avatar} />
                            <AvatarFallback className="bg-slate-100 dark:bg-white/5 text-[10px] font-black">{review.customer.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                             <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{review.customer.full_name}</span>
                             <span className="text-[10px] text-slate-400 font-medium">{review.customer.email}</span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-6 max-w-[200px]">
                        <div className="flex flex-col gap-1">
                           <span className="text-sm font-bold text-slate-900 dark:text-white truncate" title={review.product.name}>{review.product.name}</span>
                           <Link href={`/admins/products?search=${encodeURIComponent(review.product.name)}`} className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1 hover:underline">
                             Quản lý sản phẩm <ExternalLink size={10} />
                           </Link>
                        </div>
                      </td>

                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={14} className={cn(s <= review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200 dark:text-white/10")} />
                          ))}
                        </div>
                      </td>

                      <td className="px-6 py-6">
                         <div className="max-w-md">
                           <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium line-clamp-2 italic">
                             "{review.comment}"
                           </p>
                           <div className="flex items-center gap-2 mt-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                             <Calendar size={12} /> {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                           </div>
                         </div>
                      </td>

                      <td className="px-6 py-6 text-right">
                         <div className="flex items-center justify-end gap-2">
                           <Button 
                             onClick={() => setDeleteId(review.id)}
                             variant="ghost" 
                             size="icon" 
                             className="h-10 w-10 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                           >
                             <Trash2 size={18} />
                           </Button>
                         </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="px-6 py-4 bg-slate-50/50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          <span>Hiển thị {reviews.length} đánh giá</span>
          <div className="flex items-center gap-1">
             <Button variant="ghost" size="sm" disabled className="h-8 px-4 rounded-lg">Trước</Button>
             <Button variant="ghost" size="sm" disabled className="h-8 px-4 rounded-lg">Sau</Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Xác nhận xóa đánh giá"
        description="Hành động này sẽ xóa vĩnh viễn đánh giá của khách hàng khỏi hệ thống. Bạn có chắc chắn muốn tiếp tục?"
        confirmText="Xác nhận xóa"
        variant="destructive"
        loading={isDeleting}
      />
    </div>
  );
}
