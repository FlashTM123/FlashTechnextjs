"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCustomerAuth } from "@/app/context/customer-auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight, Loader2, Sparkles, Home } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { GoogleAuthButton } from "./google-auth-button";

export function LoginForm() {
  const router = useRouter();
  const { login, loading } = useCustomerAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-[460px] space-y-10 p-12 rounded-[2.5rem] bg-white dark:bg-slate-950/60 backdrop-blur-3xl border border-slate-200/60 dark:border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] relative overflow-hidden"
    >
      {/* Back to Home Link */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center justify-center p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-indigo-600 transition-all group z-20"
      >
        <Home size={18} className="group-hover:scale-110 transition-transform" />
        <span className="ml-2 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">Về trang chủ</span>
      </Link>
      
      <div className="text-center space-y-3 relative z-10 pt-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 mb-6 shadow-2xl transition-transform hover:scale-105 rotate-3">
          <Sparkles className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-[0.9]">
          Flash<span className="text-indigo-600 italic">Tech</span> <br/>
          <span className="text-2xl font-black opacity-30 tracking-widest uppercase mt-2 block font-sans">SIGN IN</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">
          Hoàn thiện trải nghiệm công nghệ của riêng bạn.
        </p>
      </div>

      <div className="space-y-6 relative z-10 text-center">
        <GoogleAuthButton />
        
        <div className="relative flex items-center gap-4 py-2">
          <div className="flex-1 h-px bg-slate-100 dark:bg-white/5" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Hoặc tiếp tục với</span>
          <div className="flex-1 h-px bg-slate-100 dark:bg-white/5" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
              Email Định Danh
            </Label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                <Mail size={18} />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="vip.customer@flashtech.vn"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-16 pl-14 rounded-2xl bg-slate-50/50 dark:bg-white/5 border-slate-100 dark:border-white/5 focus-visible:ring-4 focus-visible:ring-indigo-500/10 transition-all font-semibold text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Khóa Bảo Mật
              </Label>
              <Link
                href="/forgot-password"
                className="text-[10px] font-black text-indigo-600 hover:text-indigo-500 transition-colors uppercase tracking-widest"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                <Lock size={18} />
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-16 pl-14 rounded-2xl bg-slate-50/50 dark:bg-white/5 border-slate-100 dark:border-white/5 focus-visible:ring-4 focus-visible:ring-indigo-500/10 transition-all font-semibold"
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-16 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xl shadow-2xl active:scale-[0.98] transition-all group overflow-hidden relative"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <span className="relative z-10 flex items-center gap-2 uppercase tracking-widest">
                ĐĂNG NHẬP <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 dark:via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </>
          )}
        </Button>
      </form>

      <div className="text-center relative z-10">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
          Chưa là thành viên? <br/>
          <Link href="/register" className="text-indigo-600 hover:text-indigo-500 transition-colors">
            THAM GIA CỘNG ĐỒNG FLASHTECH
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
