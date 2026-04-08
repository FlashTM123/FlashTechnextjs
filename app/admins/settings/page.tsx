"use client";

import { useState } from "react";
import { 
  Settings, Globe, Shield, Bell, CreditCard, Mail, 
  MapPin, Phone, MessageSquare, Save, RotateCcw,
  Zap, Eye, EyeOff, Smartphone, Laptop, Sparkles,
  Palette, User, Database, Lock, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Đã cập nhật cấu hình hệ thống thành công!");
    }, 1000);
  };

  const tabs = [
    { id: "general", label: "Tổng quan", icon: Settings },
    { id: "store", label: "Cửa hàng", icon: Globe },
    { id: "notifications", label: "Thông báo", icon: Bell },
    { id: "payments", label: "Thanh toán", icon: CreditCard },
    { id: "security", label: "Bảo mật", icon: Shield },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-4">
             <div className="p-3 rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
               <Settings size={28} />
             </div>
             Cấu hình hệ thống
           </h1>
           <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Quản lý các thông số vận hành và nhận diện thương hiệu FlashTech.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 border-slate-200 dark:border-white/10 rounded-2xl px-6 font-bold text-[11px] uppercase tracking-widest gap-2">
            <RotateCcw size={16} /> Hoàn tác
          </Button>
          <Button 
            onClick={handleSave}
            disabled={loading}
            className="h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-8 font-black text-[11px] uppercase tracking-widest gap-2 shadow-xl shadow-indigo-600/20"
          >
            {loading ? <RotateCcw className="animate-spin" size={16} /> : <Save size={16} />}
            Lưu thay đổi
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={cn(
                 "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all text-left group",
                 activeTab === tab.id 
                  ? "bg-white dark:bg-white/10 text-indigo-600 dark:text-white shadow-sm border border-slate-200 dark:border-white/10" 
                  : "text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
               )}
             >
                <tab.icon size={18} className={cn("transition-transform group-hover:scale-110", activeTab === tab.id ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400")} />
                {tab.label}
             </button>
           ))}
        </div>

        {/* Form Content */}
        <div className="lg:col-span-9 space-y-8 pb-20">
           {/* Section 1: Basic Info */}
           <div className="p-8 lg:p-10 rounded-[40px] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-10">
              <div className="flex items-center gap-4">
                 <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                 <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Thông tin cơ bản</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tên cửa hàng</Label>
                   <Input defaultValue="FlashTech Store" className="h-12 rounded-2xl border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-black/20 px-5 font-bold" />
                 </div>
                 <div className="space-y-3">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Slug cửa hàng</Label>
                   <Input defaultValue="flashtech-vn" className="h-12 rounded-2xl border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-black/20 px-5 font-bold" />
                 </div>
                 <div className="space-y-3 md:col-span-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mô tả ngắn (SEO Meta)</Label>
                   <Input defaultValue="FlashTech - Hệ thống bán lẻ công nghệ hàng đầu, chuyên iPhone, MacBook, iPad và phụ kiện cao cấp." className="h-12 rounded-2xl border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-black/20 px-5 font-bold" />
                 </div>
              </div>

              <Separator className="opacity-50" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email hỗ trợ</Label>
                   <Input defaultValue="support@flashtech.vn" className="h-12 rounded-2xl border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-black/20 px-5 font-bold" />
                 </div>
                 <div className="space-y-3">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Hotline CSKH</Label>
                   <Input defaultValue="1900 8888" className="h-12 rounded-2xl border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-black/20 px-5 font-bold" />
                 </div>
              </div>
           </div>

           {/* Section 2: Localization */}
           <div className="p-8 lg:p-10 rounded-[40px] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-10">
              <div className="flex items-center gap-4">
                 <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
                 <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Khu vực & Ngôn ngữ</h3>
              </div>

              <div className="space-y-6">
                 <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-50/50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-4">
                       <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600">
                         <Globe size={20} />
                       </div>
                       <div>
                          <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Ngôn ngữ mặc định</p>
                          <p className="text-xs text-slate-500 font-medium">Hệ thống sẽ ưu tiên hiển thị ngôn ngữ này.</p>
                       </div>
                    </div>
                    <Badge className="bg-white dark:bg-white/10 text-slate-900 dark:text-white border-slate-200 uppercase font-black tracking-widest py-1.5 px-4 rounded-xl">Tiếng Việt (VI)</Badge>
                 </div>

                 <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-50/50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-4">
                       <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600">
                         <CreditCard size={20} />
                       </div>
                       <div>
                          <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Đơn vị tiền tệ</p>
                          <p className="text-xs text-slate-500 font-medium">Tự động định dạng giá bán trên toàn hệ thống.</p>
                       </div>
                    </div>
                    <Badge className="bg-white dark:bg-white/10 text-slate-900 dark:text-white border-slate-200 uppercase font-black tracking-widest py-1.5 px-4 rounded-xl">VNĐ (₫)</Badge>
                 </div>
              </div>
           </div>

           {/* Section 3: Feature Toggles */}
           <div className="p-8 lg:p-10 rounded-[40px] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-10">
              <div className="flex items-center gap-4">
                 <div className="w-1.5 h-6 bg-pink-500 rounded-full" />
                 <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Tính năng hệ thống</h3>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center justify-between p-6 hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors rounded-3xl">
                    <div className="flex flex-col">
                       <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Chế độ bảo trì</span>
                       <span className="text-xs text-slate-500 font-medium mt-1">Khóa truy cập Storefront, chỉ cho phép quản trị viên xem.</span>
                    </div>
                    <Switch />
                 </div>
                 <div className="flex items-center justify-between p-6 hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors rounded-3xl">
                    <div className="flex flex-col">
                       <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Cho phép đánh giá khách</span>
                       <span className="text-xs text-slate-500 font-medium mt-1">Người dùng chưa mua hàng có được viết nhận xét hay không.</span>
                    </div>
                    <Switch defaultChecked />
                 </div>
                 <div className="flex items-center justify-between p-6 hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors rounded-3xl">
                    <div className="flex flex-col">
                       <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Thông báo đơn hàng mới</span>
                       <span className="text-xs text-slate-500 font-medium mt-1">Gửi email thông báo cho Admin khi có đơn hàng thành công.</span>
                    </div>
                    <Switch defaultChecked />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
