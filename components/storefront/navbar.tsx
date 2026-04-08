"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu, X, Smartphone, Laptop, Tablet, Headphones, Sparkles, LogOut, Settings, Package, Heart, ChevronRight, Command } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/context/language-context";
import { useCustomerAuth } from "@/app/context/customer-auth-context";
import { useCart } from "@/app/context/cart-context";
import { ModeToggle } from "@/components/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchOverlay } from "./search-overlay";

export function Navbar() {
  const router = useRouter();
  const { t } = useLanguage();
  const { customer, logout } = useCustomerAuth();
  const { totalItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const navLinks = [
    { name: t("Smartphone"), href: "/products?category=SMARTPHONE", icon: Smartphone },
    { name: t("Laptop"), href: "/products?category=LAPTOP", icon: Laptop },
    { name: t("Tablet"), href: "/products?category=TABLET", icon: Tablet },
    { name: t("Audio"), href: "/products?category=AUDIO", icon: Headphones },
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
              className="px-4 py-2 rounded-full text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all flex items-center gap-2 group"
            >
              <link.icon size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
              {link.name}
            </Link>
          ))}
        </div>

        {/* Search Trigger - Professional Command Palette style */}
        <div className="flex-1 max-w-md hidden md:block">
           <button 
             onClick={() => setIsSearchOpen(true)}
             className="w-full h-11 px-4 rounded-full bg-slate-100 dark:bg-white/5 border border-transparent hover:border-indigo-500/30 flex items-center justify-between group transition-all"
           >
              <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-500">
                <Search size={18} />
                <span className="text-sm font-medium">{t("searchProduct")}...</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 text-[10px] font-black text-slate-400 group-hover:text-indigo-600 transition-colors">
                 <Command size={10} />
                 <span>K</span>
              </div>
           </button>
        </div>

        <SearchOverlay open={isSearchOpen} onOpenChange={setIsSearchOpen} />

        <div className="flex items-center gap-2">
          <ModeToggle />
          
          {customer ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full w-10 h-10 p-0 overflow-hidden border border-transparent hover:border-indigo-500/50 transition-all outline-none focus:ring-2 focus:ring-indigo-500/50">
                <Avatar className="w-full h-full">
                  <AvatarImage src={customer.avatar} />
                  <AvatarFallback className="bg-indigo-600 text-white font-black text-xs uppercase">
                    {customer.full_name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl bg-white/90 dark:bg-black/90 backdrop-blur-xl border-slate-200 dark:border-white/10 shadow-2xl animate-in fade-in zoom-in duration-200">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-3 py-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">
                        {customer.full_name}
                      </p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">
                        {customer.email}
                      </p>
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-[9px] font-black text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 self-start uppercase">
                        <Sparkles size={10} /> {customer.tier || "BRONZE"} Member
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-white/5" />
                <Link href="/account/orders">
                  <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl focus:bg-indigo-50 dark:focus:bg-white/5 focus:text-indigo-600 cursor-pointer transition-colors group">
                    <Package size={18} className="text-slate-400 group-focus:text-indigo-600 transition-colors" />
                    <span className="text-sm font-bold">Đơn hàng của tôi</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/account/wishlist">
                  <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl focus:bg-indigo-50 dark:focus:bg-white/5 focus:text-indigo-600 cursor-pointer transition-colors group">
                    <Heart size={18} className="text-slate-400 group-focus:text-indigo-600 transition-colors" />
                    <span className="text-sm font-bold">Danh sách yêu thích</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/account/settings">
                  <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl focus:bg-indigo-50 dark:focus:bg-white/5 focus:text-indigo-600 cursor-pointer transition-colors group">
                    <Settings size={18} className="text-slate-400 group-focus:text-indigo-600 transition-colors" />
                    <span className="text-sm font-bold">Cài đặt tài khoản</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-white/5" />
                <DropdownMenuItem 
                  onClick={logout}
                  className="flex items-center gap-3 p-3 rounded-xl focus:bg-red-50 dark:focus:bg-red-500/10 focus:text-red-600 cursor-pointer transition-colors group"
                >
                  <LogOut size={18} className="text-slate-400 group-focus:text-red-600 transition-colors" />
                  <span className="text-sm font-bold">Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all">
                <User size={20} />
              </Button>
            </Link>
          )}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="rounded-full relative hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-black">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
          
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
        <div className="lg:hidden absolute top-full inset-x-0 bg-white/95 dark:bg-[#0A0A0B]/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 p-6 space-y-6 animate-in slide-in-from-top duration-300">
          {/* Mobile User Section */}
          <div className="pb-6 border-b border-slate-100 dark:border-white/5">
            {customer ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 border-2 border-indigo-500/20">
                    <AvatarImage src={customer.avatar} />
                    <AvatarFallback className="bg-indigo-600 text-white font-black">
                      {customer.full_name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      {customer.full_name}
                    </p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      {customer.tier || "BRONZE"} MEMBER
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link 
                    href="/account" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-xl border-slate-200 dark:border-white/10 font-bold")}
                  >
                    Hồ sơ
                  </Link>
                  <Button variant="outline" size="sm" className="rounded-xl border-slate-200 dark:border-white/10 font-bold text-red-500 hover:text-red-600" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                    Đăng xuất
                  </Button>
                </div>
              </div>
            ) : (
              <Link 
                href="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full h-12 rounded-2xl bg-indigo-600 font-black text-sm uppercase tracking-widest shadow-lg shadow-indigo-500/20 text-white")}
              >
                Đăng Nhập Ngay
              </Link>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 font-bold text-slate-900 dark:text-white flex items-center justify-between group active:scale-95 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <link.icon size={20} className="text-indigo-600" />
                  {link.name}
                </div>
                <ChevronRight size={18} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
