"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu, X, Smartphone, Laptop, Tablet, Headphones, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/context/language-context";
import { ModeToggle } from "@/components/mode-toggle";

export function Navbar() {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t("Smartphone"), href: "/category/SMARTPHONE", icon: Smartphone },
    { name: t("Laptop"), href: "/category/LAPTOP", icon: Laptop },
    { name: t("Tablet"), href: "/category/TABLET", icon: Tablet },
    { name: t("Audio"), href: "/category/AUDIO", icon: Headphones },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500 border-b",
        isScrolled 
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-xl border-slate-200 dark:border-white/10 py-3 shadow-sm" 
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase transition-colors">
            Flash<span className="text-indigo-600">Tech</span>
          </span>
        </Link>

        {/* Global Navigation - Desktop */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="px-4 py-2 rounded-full text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <link.icon size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              {link.name}
            </Link>
          ))}
        </div>

        {/* Search & Actions */}
        <div className="flex-1 max-w-md hidden md:block relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
            <Search size={18} />
          </div>
          <Input 
            className="h-10 pl-10 rounded-full bg-slate-100 dark:bg-white/5 border-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 transition-all text-sm font-medium"
            placeholder={t("searchProduct") + "..."}
          />
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all">
            <User size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full relative hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all">
            <ShoppingCart size={20} />
            <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-black">
              0
            </span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden rounded-full"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full inset-x-0 bg-white dark:bg-[#0A0A0B] border-b border-slate-200 dark:border-white/10 p-6 space-y-4 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 font-bold text-slate-900 dark:text-white flex items-center justify-between group active:scale-95 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
                <ChevronRight size={18} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

function ChevronRight({ size, className }: { size: number; className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
