"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
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
  X,
  LogOut,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/app/context/auth-context";

const menuItems = [
  { name: "Dashboard", href: "/admins", icon: LayoutDashboard },
  { name: "Users", href: "/admins/users", icon: Users },
  { name: "Products", href: "/admins/products", icon: Package },
  { name: "Orders", href: "/admins/orders", icon: ShoppingCart },
  { name: "Analytics", href: "/admins/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admins/settings", icon: Settings },
];

function NavSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    console.log("NavSidebar: Logging out...");
    logout();
    router.push("/login");
  };

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-r border-slate-800">
      {/* Logo */}
      <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-400 text-white font-bold shadow-lg shadow-indigo-500/20">
          ⚡
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-black text-white tracking-tight">FlashTech</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Admin Control</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-8">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <Icon
                size={20}
                className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110 group-hover:rotate-6"}`}
              />
              <span>{item.name}</span>
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Interactive User Section with Integrated Logout */}
      <div className="border-t border-slate-800 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <button className="w-full flex items-center gap-3 rounded-[20px] p-3 hover:bg-slate-800 transition-all cursor-pointer group border border-transparent hover:border-slate-700 shadow-inner text-left outline-none">
               <Avatar className="h-10 w-10 ring-2 ring-transparent group-hover:ring-indigo-500 transition-all">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-indigo-600 text-white font-black text-xs">
                    {user?.name?.substring(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
               </Avatar>
               <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-white leading-tight truncate">{user?.name || "User"}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter truncate opacity-60">Admin Terminal</p>
               </div>
               <ChevronUp size={16} className="text-slate-600 group-hover:text-white transition-colors" />
            </button>
          }/>
          <DropdownMenuContent align="start" side="top" className="w-56 p-2 rounded-2xl bg-slate-900 border-slate-800 shadow-2xl mb-2">
             <div className="px-2 py-3 mb-2 bg-slate-800/50 rounded-xl">
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Signed in as</p>
                <p className="text-sm font-bold text-indigo-400 truncate">{user?.email}</p>
             </div>
             <DropdownMenuItem className="rounded-xl py-3 font-bold text-slate-300 focus:bg-slate-800 focus:text-white cursor-pointer">
                <User size={16} className="mr-3 text-indigo-500" /> Hồ sơ cá nhân
             </DropdownMenuItem>
             <DropdownMenuSeparator className="bg-slate-800" />
             <DropdownMenuItem 
                onClick={handleLogout}
                className="rounded-xl py-3 font-black text-rose-500 focus:bg-rose-500 focus:text-white cursor-pointer transition-colors"
             >
                <LogOut size={16} className="mr-3" /> Đăng xuất máy chủ
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
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    if (isInitialized && !isAuthChecked) {
      if (!user) {
        router.push("/login");
      }
      setIsAuthChecked(true);
    }
  }, [isInitialized, user, isAuthChecked, router]);

  const handleLogout = () => {
    console.log("AdminLayout: Logging out...");
    logout();
    router.push("/login");
  };

  if (!isAuthChecked || !isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
             <div className="w-16 h-16 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin" />
             <div className="absolute inset-0 flex items-center justify-center text-xl">⚡</div>
          </div>
          <p className="text-slate-500 font-black tracking-widest uppercase text-xs animate-pulse font-mono">Xác thực hệ thống...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col bg-slate-950 transition-all text-white">
        <NavSidebar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Modern Header */}
        <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
          <div className="flex h-20 items-center justify-between gap-4 px-6 lg:px-10">
            <div className="flex items-center gap-6">
              {/* Mobile Menu */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger render={
                  <Button variant="ghost" size="icon" className="lg:hidden text-slate-900 bg-slate-50 rounded-xl">
                    <Menu size={20} />
                  </Button>
                }/>
                <SheetContent side="left" className="w-72 p-0 border-r-0">
                  <NavSidebar />
                </SheetContent>
              </Sheet>

              {/* Breadcrumb replacement or label */}
              <div className="hidden sm:flex items-center gap-2">
                 <div className="h-6 w-1 bg-indigo-600 rounded-full" />
                 <span className="text-lg font-black text-slate-900 tracking-tight">Trạm điều hành</span>
              </div>
            </div>

            {/* Right Header Section */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex relative group">
                  <Search size={16} className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <Input placeholder="Lệnh tìm kiếm nhanh..." className="h-11 w-64 pl-10 bg-slate-50 border-none rounded-xl font-bold text-xs ring-offset-0 focus-visible:ring-indigo-600/10 placeholder:text-slate-400" />
              </div>

              <Button variant="ghost" size="icon" className="h-11 w-11 text-slate-500 hover:bg-slate-50 rounded-xl relative">
                  <Bell size={20} />
                  <span className="absolute top-3 right-3 h-2 w-2 bg-rose-500 rounded-full ring-2 ring-white" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <Button variant="ghost" className="h-11 p-1 pr-3 flex items-center gap-3 hover:bg-slate-50 rounded-xl transition-all">
                    <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-indigo-600 text-white font-black text-[10px]">{user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <ChevronDown size={14} className="text-slate-400" />
                  </Button>
                }/>
                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-slate-100">
                  <DropdownMenuItem onClick={handleLogout} className="rounded-xl py-3 font-bold text-rose-500 focus:bg-rose-50 shadow-sm cursor-pointer">
                    <LogOut size={16} className="mr-3" /> Thoát hệ thống
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-slate-50/50">
          <div className="min-h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
