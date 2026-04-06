import { RegisterForm } from "@/components/storefront/auth/register-form";

export const metadata = {
  title: "Gia Nhập Cộng Đồng | FlashTech Modern Experience",
  description: "Trở thành thành viên của FlashTech để hưởng ưu đãi đặc quyền và trải nghiệm công nghệ tương lai.",
};

export default function RegisterPage() {
  return (
    <div className="relative min-h-[calc(100vh-112px)] flex items-center justify-center px-6 py-12 overflow-hidden bg-white dark:bg-[#000000]">
      {/* Modern Tech Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(79,70,229,0.15),transparent_60%)] pointer-events-none animate-pulse" />
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(192,38,211,0.1),transparent_60%)] pointer-events-none" />
      
      {/* Floating Animated Orbs for Modern Tech feel */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full animate-bounce duration-[10s]" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-fuchsia-500/10 blur-[120px] rounded-full animate-pulse" />

      <div className="w-full flex justify-center relative z-10">
        <RegisterForm />
      </div>

      <div className="absolute bottom-12 right-12 hidden xl:block pointer-events-none">
        <div className="flex flex-col gap-1 items-end">
          <span className="text-[10vw] font-black leading-none text-slate-100 dark:text-white/5 uppercase select-none tracking-tighter">FUTURE</span>
          <span className="text-[10vw] font-black leading-none text-slate-100 dark:text-white/5 uppercase select-none tracking-tighter -mt-10 italic">IS NOW</span>
        </div>
      </div>
    </div>
  );
}
