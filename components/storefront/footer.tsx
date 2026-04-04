import Link from "next/link";
import { MessageCircle, Camera, Send, Play, Sparkles, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-white dark:bg-[#0A0A0B] border-t border-slate-200 dark:border-white/5 pt-24 pb-12 overflow-hidden transition-colors">
      {/* Decorative background elements */}
      <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-indigo-600/5 dark:bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-fuchsia-600/5 dark:bg-fuchsia-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">
        {/* Brand Section */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
              Flash<span className="text-indigo-600">Tech</span>
            </span>
          </Link>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed max-w-xs">
            Nền tảng công nghệ hàng đầu cung cấp những thiết bị tối tân và trải nghiệm mua sắm kỹ thuật số đẳng cấp thế giới.
          </p>
          <div className="flex items-center gap-4">
            <SocialLink href="#" icon={MessageCircle} />
            <SocialLink href="#" icon={Camera} />
            <SocialLink href="#" icon={Send} />
            <SocialLink href="#" icon={Play} />
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">Danh mục</h4>
          <ul className="space-y-4">
            <FooterLink href="/category/LAPTOP" label="Laptops & Gaming" />
            <FooterLink href="/category/SMARTPHONE" label="Smartphones & AI Phones" />
            <FooterLink href="/category/TABLET" label="Tablets & Creative Tools" />
            <FooterLink href="/category/AUDIO" label="Audio & Sound Systems" />
          </ul>
        </div>

        {/* Support Links */}
        <div className="space-y-6">
          <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">Hỗ trợ</h4>
          <ul className="space-y-4">
            <FooterLink href="#" label="Trung tâm bảo hành" />
            <FooterLink href="#" label="Chính sách đổi trả" />
            <FooterLink href="#" label="Theo dõi đơn hàng" />
            <FooterLink href="#" label="Tuyển dụng" />
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">Liên hệ</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400 font-medium group cursor-default">
              <MapPin size={18} className="text-indigo-600 group-hover:scale-125 transition-transform" />
              <span>123 Technology Park, Ho Chi Minh City, Vietnam</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 font-medium group cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <Phone size={18} className="text-indigo-600 group-hover:scale-125 transition-transform" />
              <span>+84 123 456 789</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 font-medium group cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <Mail size={18} className="text-indigo-600 group-hover:scale-125 transition-transform" />
              <span>support@flashtech.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20 pt-12 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          © 2026 FLASHTECH NEURAL SYSTEMS. ALL RIGHTS RESERVED.
        </p>
        <div className="flex items-center gap-6">
          <Link href="#" className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">Privacy Policy</Link>
          <Link href="#" className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon: Icon }: { href: string; icon: any }) {
  return (
    <a 
      href={href} 
      className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all duration-300"
    >
      <Icon size={18} />
    </a>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link 
        href={href} 
        className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:translate-x-1 transition-all flex items-center gap-2 group"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-indigo-600 transition-colors" />
        {label}
      </Link>
    </li>
  );
}
