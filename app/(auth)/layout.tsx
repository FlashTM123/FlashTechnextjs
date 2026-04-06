import { Inter } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.variable} font-sans min-h-screen relative flex items-center justify-center overflow-hidden bg-[#020617]`}>
      {/* Immersive Auth Space Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent_50%)]" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      
      {/* Animated light leaks for premium feel */}
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse pointer-events-none" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-fuchsia-500/10 blur-[120px] rounded-full animate-pulse pointer-events-none" />

      <main className="relative z-10 w-full h-full flex items-center justify-center py-12 px-6">
        {children}
      </main>

      {/* Decorative Brand Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.02]">
        <h2 className="text-[25vw] font-black tracking-tighter uppercase leading-none">FLASHTECH</h2>
      </div>
    </div>
  );
}
