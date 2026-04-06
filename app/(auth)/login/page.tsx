import { LoginForm } from "@/components/storefront/auth/login-form";

export const metadata = {
  title: "Đăng Nhập | FlashTech Classic Luxury",
  description: "Đăng nhập vào không gian công nghệ cá nhân của bạn. Trải nghiệm dịch vụ mua sắm đẳng cấp thế giới.",
};

export default function LoginPage() {
  return (
    <div className="relative min-h-[calc(100vh-112px)] flex items-center justify-center px-6 py-12 overflow-hidden bg-white dark:bg-[#020617]">
      {/* Decorative Dark Luxury Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(30,41,59,0.1),transparent_70%)] pointer-events-none" />
      
      {/* Subtle Grid Pattern for Classic feel */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] pointer-events-none" />

      <div className="w-full flex justify-center relative z-10">
        <LoginForm />
      </div>

      <div className="absolute top-1/2 left-12 -translate-y-1/2 hidden xl:block pointer-events-none">
        <div className="flex flex-col gap-1">
          <span className="text-[10vw] font-black leading-none text-slate-100 dark:text-white/5 uppercase select-none tracking-tighter">CLASSIC</span>
          <span className="text-[10vw] font-black leading-none text-slate-100 dark:text-white/5 uppercase select-none tracking-tighter -mt-10">LEGACY</span>
        </div>
      </div>
    </div>
  );
}
