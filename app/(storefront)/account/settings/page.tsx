"use client";

import { useState, useEffect } from "react";
import { useCustomerAuth } from "@/app/context/customer-auth-context";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  ShieldCheck, 
  ChevronRight, 
  Save, 
  Loader2, 
  Building2,
  Users
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SettingsPage() {
  const { customer, refreshProfile } = useCustomerAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    address: "",
    city: "",
    gender: "",
    avatar: ""
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        full_name: customer.full_name || "",
        phone_number: customer.phone_number || "",
        address: customer.address || "",
        city: customer.city || "",
        gender: customer.gender || "HIDDEN",
        avatar: customer.avatar || ""
      });
    }
  }, [customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;

    setLoading(true);
    try {
      const resp = await fetch("/api/auth/customer/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: customer.id,
          ...formData
        }),
      });

      const data = await resp.json();
      if (resp.ok) {
        toast.success("Cập nhật thông tin thành công!");
        await refreshProfile();
      } else {
        toast.error(data.message || "Cập nhật thất bại");
      }
    } catch (error) {
      toast.error("Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  if (!customer) return null;

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      {/* Header */}
      <div className="mb-12 space-y-2">
        <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
            <ShieldCheck size={14} />
            Thông tin cá nhân
        </div>
        <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
          Cài đặt <span className="text-indigo-600 italic">tài khoản</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium italic">
          Quản lý thông tin định danh và bảo mật cho hành trình công nghệ của bạn.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Avatar & Summary */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white dark:bg-slate-950/40 rounded-[3rem] border border-slate-200 dark:border-white/5 p-8 text-center space-y-6 shadow-2xl shadow-slate-200/10 dark:shadow-none relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white rotate-12">
                   <User size={20} />
                </div>
             </div>

             <div className="relative inline-block group">
                <Avatar className="w-32 h-32 border-4 border-white dark:border-slate-900 shadow-2xl ring-4 ring-indigo-500/20">
                    <AvatarImage src={formData.avatar} className="object-cover" />
                    <AvatarFallback className="bg-indigo-600 text-white font-black text-2xl uppercase">
                        {formData.full_name?.substring(0, 2)}
                    </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-all">
                    <Camera size={16} />
                </div>
             </div>

             <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">
                    {customer.full_name}
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{customer.email}</p>
             </div>

             <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-around">
                <div className="text-center">
                    <div className="text-lg font-black text-indigo-600 italic">{customer.points || 0}</div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Points</div>
                </div>
                <div className="w-px h-8 bg-slate-100 dark:bg-white/5" />
                <div className="text-center">
                    <div className="text-lg font-black text-indigo-600 italic">{customer.tier || "BRONZE"}</div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Class</div>
                </div>
             </div>
          </div>

          <div className="p-6 rounded-[2rem] bg-indigo-600 text-white space-y-4">
             <h4 className="text-xs font-black uppercase tracking-[0.2em] opacity-80 flex items-center gap-2">
                <ShieldCheck size={14} /> Security Status
             </h4>
             <p className="text-sm font-bold leading-relaxed">
                Tài khoản của bạn được mã hóa 256-bit và bảo mật bởi hệ thống xác thực FlashTech.
             </p>
          </div>
        </div>

        {/* Right Column: Form Inputs */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-950/40 rounded-[3rem] border border-slate-200 dark:border-white/5 p-10 shadow-2xl shadow-slate-200/5 dark:shadow-none">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Full Name */}
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Họ và tên</Label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <Input 
                                disabled={loading}
                                value={formData.full_name}
                                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                className="h-14 pl-12 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold focus-visible:ring-2 focus-visible:ring-indigo-500/50" 
                                placeholder="Nhập họ và tên"
                            />
                        </div>
                    </div>

                    {/* Email - Read Only */}
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email (Không thể đổi)</Label>
                        <div className="relative opacity-60">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <Input 
                                value={customer.email}
                                readOnly
                                className="h-14 pl-12 rounded-2xl bg-slate-100 dark:bg-white/10 border-none font-bold" 
                            />
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Số điện thoại</Label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <Input 
                                disabled={loading}
                                value={formData.phone_number}
                                onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                                className="h-14 pl-12 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold focus-visible:ring-2 focus-visible:ring-indigo-500/50" 
                                placeholder="Nhập số điện thoại"
                            />
                        </div>
                    </div>

                    {/* Gender */}
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Giới tính</Label>
                        <div className="relative">
                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={18} />
                            <Select 
                                disabled={loading}
                                value={formData.gender} 
                                onValueChange={(val) => setFormData({...formData, gender: val || "HIDDEN"})}
                            >
                                <SelectTrigger className="h-14 pl-12 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold focus:ring-2 focus:ring-indigo-500/50">
                                    <SelectValue placeholder="Chọn giới tính" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-slate-100 dark:border-white/5">
                                    <SelectItem value="MALE" className="rounded-xl font-bold">Nam</SelectItem>
                                    <SelectItem value="FEMALE" className="rounded-xl font-bold">Nữ</SelectItem>
                                    <SelectItem value="OTHER" className="rounded-xl font-bold">Khác</SelectItem>
                                    <SelectItem value="HIDDEN" className="rounded-xl font-bold">Bảo mật</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Avatar URL */}
                    <div className="md:col-span-2 space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Đường dẫn ảnh đại diện (Avatar URL)</Label>
                        <div className="relative">
                            <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <Input 
                                disabled={loading}
                                value={formData.avatar}
                                onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                                className="h-14 pl-12 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold focus-visible:ring-2 focus-visible:ring-indigo-500/50" 
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    {/* City */}
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Thành phố / Tỉnh</Label>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <Input 
                                disabled={loading}
                                value={formData.city}
                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                                className="h-14 pl-12 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold focus-visible:ring-2 focus-visible:ring-indigo-500/50" 
                                placeholder="Ví dụ: TP. Hồ Chí Minh"
                            />
                        </div>
                    </div>

                    {/* Address Detail */}
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Địa chỉ chi tiết</Label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <Input 
                                disabled={loading}
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                                className="h-14 pl-12 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold focus-visible:ring-2 focus-visible:ring-indigo-500/50" 
                                placeholder="Số nhà, tên đường..."
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex items-center justify-end border-t border-slate-100 dark:border-white/5 pt-8">
                    <Button 
                        type="submit"
                        disabled={loading}
                        className="h-16 px-10 rounded-[2rem] bg-indigo-600 hover:bg-indigo-500 font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/30 text-white transition-all active:scale-95 flex items-center gap-3"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={20} />}
                        Lưu Thay Đổi
                    </Button>
                </div>
            </div>
        </div>
      </form>
    </div>
  );
}
