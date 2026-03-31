"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Eye, 
  EyeOff, 
  LogIn, 
  AlertCircle, 
  CheckCircle2, 
  Mail, 
  Lock, 
  ArrowRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/app/context/auth-context";
import { useLanguage } from "@/app/context/language-context";
import { cn } from "@/lib/utils";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const { setLanguage } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email.trim() || !password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
      setSuccess("Xác thực thành công!");
      setTimeout(() => {
        setShowLanguageSelect(true);
      }, 500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Email hoặc mật khẩu không đúng";
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md perspective-1000">
      <div className="relative overflow-hidden rounded-[32px] border border-white dark:border-white/10 bg-white/80 p-10 shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:shadow-indigo-500/10 dark:bg-slate-900/80">
        
        {/* Animated Background Glow */}
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl animate-pulse" />

        {/* Brand Header */}
        <div className="relative mb-10 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-500/30 rotate-3 hover:rotate-0 transition-transform duration-300">
            <Zap className="h-8 w-8 fill-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">FlashTech Admin</h1>
          <p className="mt-2 text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest opacity-60">Terminal Authentication</p>
        </div>

        {/* Feedback Messages */}
        <div className="space-y-4 mb-8">
          {error && (
            <div className="flex items-center gap-3 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 p-4 animate-in slide-in-from-top-2">
              <AlertCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />
              <p className="text-xs font-bold text-rose-700 dark:text-rose-400">{error}</p>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-4 animate-in slide-in-from-top-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{success}</p>
            </div>
          )}
        </div>

        {showLanguageSelect ? (
          <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-500">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Chọn ngôn ngữ / Select Language</h2>
              <p className="text-sm text-slate-500 mt-2">Vui lòng chọn ngôn ngữ giao diện của bạn.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                onClick={() => {
                  setLanguage("vi");
                  router.push("/admins");
                }}
                className="h-24 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white transition-all"
                variant="outline"
              >
                <span className="text-3xl">🇻🇳</span>
                <span className="font-bold">Tiếng Việt</span>
              </Button>
              
              <Button
                type="button"
                onClick={() => {
                  setLanguage("en");
                  router.push("/admins");
                }}
                className="h-24 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white transition-all"
                variant="outline"
              >
                <span className="text-3xl">🇬🇧</span>
                <span className="font-bold">English</span>
              </Button>
            </div>
          </div>
        ) : (
          /* Form Body */
          <form onSubmit={handleSubmit} className="space-y-6 relative animate-in fade-in zoom-in-95 duration-300">
            <div className="space-y-2 group">
            <Label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">Địa chỉ Email</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-300 dark:text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <Input
                type="email"
                placeholder="admin@flashtech.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="h-12 w-full rounded-xl border-none bg-slate-100/50 dark:bg-slate-800/50 pl-12 pr-4 font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2 group">
             <div className="flex justify-between items-center px-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">Mật khẩu</Label>
                <Link href="#" className="text-[10px] font-black text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 uppercase tracking-widest transition-colors">Quên mật khẩu?</Link>
             </div>
             <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-300 dark:text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="h-12 w-full rounded-xl border-none bg-slate-100/50 dark:bg-slate-800/50 pl-12 pr-12 font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-300 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 px-1">
             <input type="checkbox" id="remember" className="h-4 w-4 rounded border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-indigo-600 focus:ring-indigo-500" />
             <label htmlFor="remember" className="text-xs font-bold text-slate-400 dark:text-slate-500 select-none">Duy trì đăng nhập</label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="group h-14 w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white shadow-2xl shadow-indigo-500/30 dark:shadow-indigo-500/10 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span className="font-black uppercase tracking-widest text-sm text-indigo-100">Đang nhận diện...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span className="font-black uppercase tracking-[0.2em] text-sm">Đăng nhập máy chủ</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </div>
            )}
          </Button>
        </form>
        )}

        {/* Support Link */}
        <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
           <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500 dark:text-emerald-400" /> Secure Terminal Session
           </p>
        </div>
      </div>
    </div>
  );
}
