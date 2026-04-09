"use client";

import { useState, useEffect } from "react";
import { 
  Plus, Search, Edit, Trash2, Zap, Ticket, 
  AlertCircle, Loader2, CheckCircle2, Calendar, 
  Percent, Coins, UserCheck, Timer, Sparkles, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { useLanguage } from "@/app/context/language-context";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";

interface Coupon {
  id: string;
  code: string;
  description: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  min_order_amount: number;
  max_discount: number | null;
  start_date: string;
  end_date: string | null;
  usage_limit: number | null;
  used_count: number;
  is_active: boolean;
  createdAt: string;
}

export default function CouponsPage() {
  const { t } = useLanguage();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  const initialForm = {
    id: "",
    code: "",
    description: "",
    type: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
    value: "",
    min_order_amount: "0",
    max_discount: "",
    start_date: format(new Date(), "yyyy-MM-dd"),
    end_date: "",
    usage_limit: "",
    is_active: true
  };
  const [formData, setFormData] = useState(initialForm);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/coupons");
      if (res.ok) {
        const data = await res.json();
        setCoupons(data.coupons);
      }
    } catch (err) {
      toast.error("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const url = isEditMode ? `/api/admin/coupons/${formData.id}` : "/api/admin/coupons";
      const method = isEditMode ? "PATCH" : "POST";
      
      const payload = {
          ...formData,
          value: Number(formData.value),
          min_order_amount: Number(formData.min_order_amount),
          max_discount: formData.max_discount ? Number(formData.max_discount) : null,
          usage_limit: formData.usage_limit ? Number(formData.usage_limit) : null,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success(isEditMode ? "Cập nhật mã thành công" : "Đã tạo mã KM mới", {
          icon: <CheckCircle2 className="text-emerald-500" />
        });
        setIsModalOpen(false);
        fetchCoupons();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to process coupon");
      }
    } catch (err) {
      toast.error("Connection error");
    } finally {
      setFormLoading(false);
    }
  };

  const openEdit = (cp: Coupon) => {
    setIsEditMode(true);
    setFormData({
      id: cp.id,
      code: cp.code,
      description: cp.description || "",
      type: cp.type,
      value: cp.value.toString(),
      min_order_amount: cp.min_order_amount.toString(),
      max_discount: cp.max_discount?.toString() || "",
      start_date: cp.start_date ? cp.start_date.split('T')[0] : "",
      end_date: cp.end_date ? cp.end_date.split('T')[0] : "",
      usage_limit: cp.usage_limit?.toString() || "",
      is_active: cp.is_active
    });
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!couponToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/coupons/${couponToDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Đã xóa mã giảm giá", {
          description: `Mã "${couponToDelete.code}" đã được gỡ bỏ khỏi hệ thống.`
        });
        fetchCoupons();
        setDeleteConfirmOpen(false);
      }
    } catch (err) {
      toast.error("Lỗi khi xóa mã");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (cp: Coupon) => {
    const now = new Date();
    const expiry = cp.end_date ? new Date(cp.end_date) : null;
    const isExpired = expiry && now > expiry;
    const isLimitReached = cp.usage_limit && cp.used_count >= cp.usage_limit;

    if (!cp.is_active) return <Badge variant="secondary" className="bg-slate-400 text-white border-0">Suspended</Badge>;
    if (isExpired) return <Badge variant="destructive" className="bg-rose-500 text-white border-0">Expired</Badge>;
    if (isLimitReached) return <Badge variant="warning" className="bg-amber-500 text-white border-0">Limit Reached</Badge>;
    return <Badge className="bg-emerald-500 text-white border-0">Active</Badge>;
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Zap className="text-indigo-600 h-10 w-10" />
            {t("couponManagement")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium ml-1">
            {t("couponDescription")}
          </p>
        </div>

        <Button
          onClick={() => { setIsEditMode(false); setFormData(initialForm); setIsModalOpen(true); }}
          className="h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/20 active:scale-95 transition-all gap-2"
        >
          <Plus size={20} className="stroke-[3]" />
          <span className="font-bold uppercase tracking-widest text-xs">{t("addCoupon")}</span>
        </Button>
      </div>

      <div className="relative group max-w-md">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
          <Search size={20} />
        </div>
        <Input
          className="h-14 pl-12 pr-6 rounded-[24px] bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-base font-medium"
          placeholder={t("couponCode") + "..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {loading ? (
          Array(2).fill(0).map((_, i) => (
            <div key={i} className="h-48 rounded-[32px] bg-slate-100 dark:bg-white/5 animate-pulse" />
          ))
        ) : filteredCoupons.map((coupon) => (
          <div key={coupon.id} className="group relative bg-white dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-[32px] overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500">
            {/* Left Edge Indicator */}
            <div className={`absolute left-0 inset-y-0 w-2 ${coupon.is_active ? "bg-indigo-500" : "bg-slate-400"}`} />
            
            <div className="flex flex-col md:flex-row h-full">
              {/* Main Info Section */}
              <div className="flex-1 p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                       <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-widest uppercase">{coupon.code}</h3>
                       {getStatusBadge(coupon)}
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-sm line-clamp-1">
                      {coupon.description || "No description provided."}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => openEdit(coupon)}
                      className="h-10 w-10 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-600"
                    >
                      <Edit size={18} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => { setCouponToDelete(coupon); setDeleteConfirmOpen(true); }}
                      className="h-10 w-10 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100 dark:border-white/5">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Percent size={10} className="text-indigo-500" /> Value
                    </p>
                    <p className="font-black text-slate-900 dark:text-white">
                        {coupon.type === "PERCENTAGE" ? `${coupon.value}%` : `${coupon.value.toLocaleString()} VND`}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Coins size={10} className="text-emerald-500" /> Min Order
                    </p>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">
                        {coupon.min_order_amount.toLocaleString()} VND
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <UserCheck size={10} className="text-indigo-500" /> Usage
                    </p>
                    <p className="font-black text-indigo-600 dark:text-indigo-400">
                        {coupon.used_count}{coupon.usage_limit ? ` / ${coupon.usage_limit}` : " / ∞"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar size={10} className="text-rose-500" /> Expiry
                    </p>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">
                        {coupon.end_date ? format(new Date(coupon.end_date), "MMM dd, yyyy") : "No Limit"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative Coupon Notch Section */}
              <div className="relative w-full md:w-32 bg-slate-50 dark:bg-white/[0.02] border-l border-slate-100 dark:border-white/5 flex flex-col items-center justify-center p-6 gap-2">
                 {/* CSS Notches */}
                 <div className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white dark:bg-[#070709] border border-slate-200 dark:border-white/10" />
                 
                 <div className="text-[10px] font-black text-indigo-500 uppercase vertical-text hidden md:block tracking-[0.3em]">FLASHTECH</div>
                 <div className="h-10 w-10 rounded-full bg-white dark:bg-white/5 flex items-center justify-center text-slate-400">
                    <Ticket size={20} />
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        variant="danger"
        title="Xóa mã giảm giá?"
        description={`Mã khuyến mãi "${couponToDelete?.code}" sẽ bị gỡ bỏ vĩnh viễn. Khách hàng sẽ không thể sử dụng mã này được nữa.`}
        confirmText="Xác nhận xóa"
        cancelText="Để tôi xem lại"
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl rounded-[40px] border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0B] p-0 shadow-2xl overflow-hidden">
          <div className="bg-slate-50/50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5 p-8">
            <DialogHeader>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
                  {isEditMode ? <Edit size={24} /> : <Zap size={24} strokeWidth={3} />}
                </div>
                <div className="space-y-0.5">
                  <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    {isEditMode ? "Update Promotion" : "Initialize New Offer"}
                  </DialogTitle>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Promotion Engine Configuration</p>
                </div>
              </div>
            </DialogHeader>
          </div>

          <form onSubmit={handleCreateOrUpdate} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label className="uppercase text-[10px] font-black tracking-widest text-slate-500">PROMO CODE</Label>
                <Input 
                  value={formData.code}
                  onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="h-14 rounded-xl bg-slate-50/50 dark:bg-white/[0.02] border-slate-100 dark:border-white/10 font-black text-indigo-600 text-lg uppercase tracking-widest"
                  placeholder="e.g. SUMMER2024"
                  required
                />
              </div>
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label className="uppercase text-[10px] font-black tracking-widest text-slate-500">DISCOUNT TYPE</Label>
                <Select value={formData.type} onValueChange={(v: "PERCENTAGE" | "FIXED") => setFormData({ ...formData, type: v })}>
                  <SelectTrigger className="h-14 rounded-xl bg-slate-50/50 dark:bg-white/[0.02] border-slate-100 dark:border-white/10 font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="PERCENTAGE" className="font-bold">Percentage (%)</SelectItem>
                    <SelectItem value="FIXED" className="font-bold">Fixed Amount (VND)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-2">
                <Label className="uppercase text-[10px] font-black tracking-widest text-slate-500">{t("description")}</Label>
                <Input 
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="h-12 rounded-xl bg-slate-50/50 dark:bg-white/[0.02] border-slate-100 dark:border-white/10 font-medium"
                  placeholder="e.g. Free shipping on orders over 500k"
                />
              </div>

              <div className="space-y-2">
                <Label className="uppercase text-[10px] font-black tracking-widest text-slate-500">{t("discountValue")}</Label>
                <div className="relative">
                   <Input 
                    type="number"
                    value={formData.value}
                    onChange={e => setFormData({ ...formData, value: e.target.value })}
                    className="h-12 rounded-xl bg-indigo-50/30 dark:bg-indigo-500/5 border-indigo-100 dark:border-indigo-500/20 font-black text-indigo-600"
                    placeholder={formData.type === "PERCENTAGE" ? "20" : "50000"}
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-indigo-400">
                    {formData.type === "PERCENTAGE" ? "%" : "VND"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="uppercase text-[10px] font-black tracking-widest text-slate-500">Min Order Amount</Label>
                <div className="relative">
                   <Input 
                    type="number"
                    value={formData.min_order_amount}
                    onChange={e => setFormData({ ...formData, min_order_amount: e.target.value })}
                    className="h-12 rounded-xl bg-slate-50/50 dark:bg-white/[0.02] border-slate-100 dark:border-white/10 font-bold"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">VND</span>
                </div>
              </div>

              {formData.type === "PERCENTAGE" && (
                <div className="space-y-2 col-span-2">
                  <Label className="uppercase text-[10px] font-black tracking-widest text-slate-500 font-black text-indigo-500">Max Discount Cape (Optional)</Label>
                  <div className="relative">
                     <Input 
                      type="number"
                      value={formData.max_discount}
                      onChange={e => setFormData({ ...formData, max_discount: e.target.value })}
                      className="h-12 rounded-xl bg-slate-50/50 dark:bg-white/[0.02] border-slate-100 dark:border-white/10 font-bold"
                      placeholder="e.g. 100000"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">VND</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="uppercase text-[10px] font-black tracking-widest text-slate-500">Start Date</Label>
                <Input 
                  type="date"
                  value={formData.start_date}
                  onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                  className="h-12 rounded-xl bg-slate-50/50 dark:bg-white/[0.02] border-slate-100 dark:border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label className="uppercase text-[10px] font-black tracking-widest text-slate-500">End Date (Optional)</Label>
                <Input 
                  type="date"
                  value={formData.end_date}
                  onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                  className="h-12 rounded-xl bg-slate-50/50 dark:bg-white/[0.02] border-slate-100 dark:border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label className="uppercase text-[10px] font-black tracking-widest text-slate-500">Usage Limit (Null = Unlimited)</Label>
                <Input 
                  type="number"
                  value={formData.usage_limit}
                  onChange={e => setFormData({ ...formData, usage_limit: e.target.value })}
                  className="h-12 rounded-xl bg-slate-50/50 dark:bg-white/[0.02] border-slate-100 dark:border-white/10"
                  placeholder="e.g. 500"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-2xl border border-indigo-100 dark:border-indigo-500/10 self-end">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Active Status</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-tight">Enable this promotion</p>
                </div>
                <Switch 
                  checked={formData.is_active}
                  onCheckedChange={checked => setFormData({ ...formData, is_active: checked })}
                />
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-100 dark:border-white/5">
              <Button
                type="submit"
                disabled={formLoading}
                className="w-full h-14 rounded-2xl bg-[#0A0A0B] dark:bg-white hover:bg-slate-900 dark:hover:bg-slate-100 text-white dark:text-black font-black uppercase tracking-widest text-xs shadow-xl transition-all gap-2"
              >
                {formLoading ? <Loader2 className="animate-spin text-indigo-500" /> : <Sparkles size={18} className="text-indigo-500" />}
                {isEditMode ? "Propagate Changes" : "Create Master Coupon"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
