"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
  Bell,
  Search,
  Menu,
  LogOut,
  User,
  ChevronDown,
  Zap,
  Globe,
  Star
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/app/context/auth-context";
import { ModeToggle } from "@/components/theme-toggle";
import { useLanguage } from "@/app/context/language-context";

const menuItems = [
  { name: "dashboard", href: "/admins", icon: LayoutDashboard },
  { name: "staffs", href: "/admins/users", icon: Users },
  { name: "customers", href: "/admins/customers", icon: Users },
  { name: "brands", href: "/admins/brands", icon: Package },
  { name: "categories", href: "/admins/categories", icon: Package },
  { name: "products", href: "/admins/products", icon: Package },
  { name: "orders", href: "/admins/orders", icon: ShoppingCart },
  { name: "coupons", href: "/admins/coupons", icon: Zap },
  { name: "reviews", href: "/admins/reviews", icon: Star },
  { name: "analytics", href: "/admins/analytics", icon: BarChart3 },
  { name: "settings", href: "/admins/settings", icon: Settings },
];

function NavSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const handleLogout = () => {
    logout();
    router.push("/admins/login");
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#0A0A0B] border-r border-slate-200 dark:border-white/5 relative overflow-hidden transition-colors">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
      <div className="absolute -left-24 top-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="flex h-24 items-center gap-4 px-8 relative z-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_20px_rgba(99,102,241,0.3)] border border-slate-200 dark:border-white/10">
          <Zap size={24} className="text-white fill-white/20" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-white/70 tracking-tight">FlashTech</span>
          <span className="text-[11px] font-medium text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.2em] mt-0.5">Workspace</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6 relative z-10 custom-scrollbar">
        {menuItems.map((item) => {
          // Hide "Staffs" menu for non-admins
          if (item.name === "staffs" && user?.role !== "ADMIN") {
            return null;
          }

          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                isActive
                  ? "text-indigo-700 dark:text-white"
                  : "text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 dark:from-indigo-600/20 to-purple-600/5 border border-indigo-500/20 rounded-2xl transition-colors" />
              )}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
              )}
              <Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 2}
                className={`relative z-10 transition-transform duration-300 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "group-hover:scale-110 group-hover:rotate-3 group-hover:text-indigo-500 dark:group-hover:text-indigo-400"}`}
              />
              <span className="relative z-10">{t(item.name)}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 relative z-10 border-t border-slate-100 dark:border-white/5 transition-colors">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full text-left p-4 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-xl relative overflow-hidden group hover:bg-slate-100 dark:hover:bg-white/[0.07] transition-all duration-300 cursor-pointer outline-none block">
            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
            <div className="flex items-center gap-3 relative z-10 w-full">
              <Avatar className="h-10 w-10 ring-2 ring-slate-200 dark:ring-white/10 group-hover:ring-indigo-500/50 transition-all shrink-0">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs shrink-0">
                  {user?.name?.substring(0, 2).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate transition-colors">{user?.name || "Admin User"}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate transition-colors">{user?.email || "admin@flashtech.com"}</p>
              </div>
              <ChevronDown size={16} className="text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors shrink-0" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" className="w-56 p-2 rounded-2xl bg-white dark:bg-[#0A0A0B] border-slate-200 dark:border-white/10 shadow-2xl mb-2 text-slate-700 dark:text-slate-300">
            <div className="px-2 py-3 mb-2 bg-slate-50 dark:bg-white/5 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Signed in as</p>
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 truncate">{user?.email}</p>
            </div>
            <DropdownMenuItem className="rounded-xl py-3 font-medium focus:bg-slate-100 dark:focus:bg-white/10 dark:focus:text-white cursor-pointer transition-all">
              <User size={16} className="mr-3 text-indigo-500 dark:text-indigo-400" /> My Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-100 dark:bg-white/10" />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="rounded-xl py-3 font-semibold text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-500/10 focus:text-rose-700 dark:focus:text-rose-400 cursor-pointer transition-colors"
            >
              <LogOut size={16} className="mr-3" /> Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const { user, logout, isInitialized } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    if (isInitialized && !isAuthChecked) {
      if (!user) {
        router.push("/admins/login");
      }
      setIsAuthChecked(true);
    }
  }, [isInitialized, user, isAuthChecked, router]);

  const handleLogout = () => {
    logout();
    router.push("/admins/login");
  };

  if (!isAuthChecked || !isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-[#070709] transition-colors">
        <div className="flex flex-col items-center gap-8">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-100 dark:border-white/5 border-t-indigo-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap size={24} className="text-indigo-500 animate-pulse" />
            </div>
          </div>
          <p className="text-slate-400 dark:text-slate-500 font-medium tracking-[0.2em] uppercase text-xs animate-pulse">Initializing System...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#FAFAFA] dark:bg-[#070709] overflow-hidden font-sans transition-colors">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col transition-all z-40 shadow-2xl">
        <NavSidebar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[400px] bg-gradient-to-bl from-indigo-50 dark:from-indigo-900/10 via-purple-50 dark:via-purple-900/10 to-transparent -z-10 blur-3xl opacity-60 pointer-events-none" />

        {/* Header */}
        <header className="sticky top-0 z-30 px-6 py-4 lg:px-10 bg-white/70 dark:bg-[#070709]/70 backdrop-blur-2xl border-b border-slate-200/60 dark:border-white/5 transition-colors">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Mobile Menu */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger className="lg:hidden text-slate-900 dark:text-white bg-white dark:bg-white/5 shadow-sm border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 flex items-center justify-center w-10 h-10 transition-colors">
                  <Menu size={20} />
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0 border-r-0 dark:border-white/10">
                  <NavSidebar />
                </SheetContent>
              </Sheet>

              {/* Breadcrumb / Title */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/10 shadow-sm transition-colors">
                <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest transition-colors">{t("adminControl")}</span>
              </div>
            </div>

            {/* Right Header Section */}
            <div className="flex items-center gap-3 md:gap-4">
              <div className="hidden lg:flex relative group">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <Input 
                  placeholder={t("searchAnything")} 
                  className="h-11 w-72 pl-12 bg-white dark:bg-[#0A0A0B] border-slate-200/60 dark:border-white/10 rounded-full text-sm font-medium shadow-sm ring-offset-0 focus-visible:ring-4 focus-visible:ring-indigo-500/10 focus-visible:border-indigo-500 transition-all placeholder:text-slate-400 dark:text-white" 
                />
              </div>

              <div className="h-8 w-px bg-slate-200 dark:bg-white/10 hidden sm:block mx-1 transition-colors" />
              
              <DropdownMenu>
                <DropdownMenuTrigger className="h-11 w-11 flex items-center justify-center rounded-full border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm hover:bg-slate-50 dark:hover:bg-white/10 hover:scale-105 active:scale-95 transition-all outline-none">
                  <Globe size={18} className="text-slate-600 dark:text-slate-300 transition-colors" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 rounded-2xl bg-white dark:bg-[#0A0A0B] border-slate-200 dark:border-white/10 shadow-xl text-slate-700 dark:text-slate-300">
                  <DropdownMenuItem onClick={() => setLanguage("en")} className={`font-bold py-2.5 px-3 cursor-pointer focus:bg-slate-50 dark:focus:bg-white/10 outline-none rounded-xl ${language === "en" ? "text-indigo-600 dark:text-indigo-400" : ""}`}>
                    English (EN)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage("vi")} className={`font-bold py-2.5 px-3 cursor-pointer focus:bg-slate-50 dark:focus:bg-white/10 outline-none rounded-xl mt-1 ${language === "vi" ? "text-indigo-600 dark:text-indigo-400" : ""}`}>
                    Tiếng Việt (VI)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <ModeToggle />

              <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full border border-slate-200/60 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm hover:bg-slate-50 dark:hover:bg-white/10 hover:scale-105 active:scale-95 transition-all relative">
                <Bell size={18} className="text-slate-600 dark:text-slate-300 transition-colors" />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-sm transition-colors" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger className="h-11 p-1 pr-4 flex items-center gap-3 bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 rounded-full shadow-sm transition-all focus-visible:ring-4 focus-visible:ring-indigo-500/10 active:scale-95 outline-none cursor-pointer group">
                  <Avatar className="h-9 w-9 border-2 border-white dark:border-slate-800 shadow-sm transition-colors">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold text-[10px]">{user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <ChevronDown size={14} className="text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-slate-100 dark:border-white/10 bg-white dark:bg-[#0A0A0B] transition-colors">
                  <div className="px-3 py-2 mb-2">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">{t("signedIn")}</p>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate transition-colors">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-slate-100 dark:bg-white/10 transition-colors" />
                  <DropdownMenuItem onClick={handleLogout} className="rounded-xl py-3 px-3 font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-700 dark:hover:text-rose-400 focus:bg-rose-50 dark:focus:bg-rose-500/10 cursor-pointer transition-colors mt-1">
                    <LogOut size={16} className="mr-3" /> {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto w-full">
          <div className="min-h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
