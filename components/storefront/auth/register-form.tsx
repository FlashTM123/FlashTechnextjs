"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCustomerAuth } from "@/app/context/customer-auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, ArrowRight, Loader2, Sparkles, CheckCircle2, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { GoogleAuthButton } from "./google-auth-button";

export function RegisterForm() {
  const router = useRouter();
  const { register, loading } = useCustomerAuth();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirm_password) {
      return;
    }

    const success = await register(formData.full_name, formData.email, formData.password);
    if (success) {
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[500px] space-y-8 p-10 rounded-[3rem] bg-indigo-600/5 dark:bg-indigo-500/5 backdrop-blur-3xl border border-indigo-100 dark:border-indigo-500/10 shadow-2xl relative overflow-hidden"
    >
      {/* Back to Home Link */}
      <Link 
        href="/" 
        className="absolute top-6 right-6 flex items-center justify-center p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-indigo-600 transition-all group z-20"
      >
        <span className="mr-2 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">Về trang chủ</span>
        <Home size={18} className="group-hover:scale-110 transition-transform" />
      </Link>

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="register-form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2 relative z-10 pt-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 mb-4 shadow-xl shadow-indigo-500/20">
                <Sparkles className="text-white w-8 h-8" />
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase transition-colors">
                Gia Nhập <span className="text-indigo-600">FlashTech</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-300 font-bold tracking-tight">
                Mở khóa tương lai công nghệ của bạn ngay hôm nay.
              </p>
            </div>

            <div className="space-y-6 relative z-10">
              <GoogleAuthButton />
              
              <div className="relative flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Hoặc đăng ký thủ công</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="space-y-2 group">
                  <Label htmlFor="full_name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Danh Tính Của Bạn
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <Input
                      id="full_name"
                      placeholder="Nguyen Van A"
                      required
                      value={formData.full_name}
                      onChange={handleChange}
                      className="h-14 pl-12 rounded-2xl bg-white dark:bg-black/20 border-slate-200 dark:border-white/10 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Hòm Thư Liên Lạc
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="contact@flashtech.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="h-14 pl-12 rounded-2xl bg-white dark:bg-black/20 border-slate-200 dark:border-white/10 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 group">
                    <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Mật Mã
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="h-14 px-6 rounded-2xl bg-white dark:bg-black/20 border-slate-200 dark:border-white/10 focus-visible:ring-indigo-500 transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-2 group">
                    <Label htmlFor="confirm_password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Xác Nhận
                    </Label>
                    <Input
                      id="confirm_password"
                      type="password"
                      required
                      value={formData.confirm_password}
                      onChange={handleChange}
                      className="h-14 px-6 rounded-2xl bg-white dark:bg-black/20 border-slate-200 dark:border-white/10 focus-visible:ring-indigo-500 transition-all font-bold"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg shadow-xl shadow-indigo-500/20 active:scale-[0.98] transition-all group overflow-hidden relative"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <span className="relative z-10 flex items-center gap-2 uppercase tracking-[0.2em]">
                    KÍCH HOẠT TÀI KHOẢN <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>

            <div className="text-center relative z-10 pt-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Đã là thành viên?{" "}
                <Link href="/login" className="text-indigo-600 hover:text-indigo-500 transition-colors underline underline-offset-4">
                  Quay lại đăng nhập
                </Link>
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success-message"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 space-y-6 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
              <CheckCircle2 size={48} />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">Tuyệt Vời!</h2>
              <p className="text-slate-500 font-bold tracking-tight">Cộng đồng FlashTech đang chào đón bạn...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
