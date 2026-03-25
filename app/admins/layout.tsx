"use client";

import { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-r border-slate-800">
      {/* Logo */}
      <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white font-bold shadow-lg">
          ⚡
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-white">FlashTech</span>
          <span className="text-xs text-slate-400">Admin Panel</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
              }`}
            >
              <Icon
                size={20}
                className={`transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`}
              />
              <span>{item.name}</span>
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 rounded-lg p-3 hover:bg-slate-800/50 transition-colors cursor-pointer">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white font-bold">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">Admin User</p>
            <p className="text-xs text-slate-400 truncate">admin@flashtech.com</p>
          </div>
          <ChevronDown size={16} className="text-slate-400" />
        </div>
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

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-slate-950">
        <NavSidebar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
          <div className="flex h-20 items-center justify-between gap-4 px-4 lg:px-8">
            {/* Left */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden text-slate-600"
                  >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Navigation</SheetTitle>
                  </SheetHeader>
                  <NavSidebar />
                </SheetContent>
              </Sheet>

              {/* Search Bar */}
              <div className="hidden md:flex flex-1 max-w-sm">
                <div className="relative w-full">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <Input
                    placeholder="Search users, orders..."
                    className="pl-10 pr-4 bg-slate-100 border-0 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3 lg:gap-4">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-slate-600 hover:text-slate-900"
                  >
                    <Bell size={20} />
                    <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-600">
                      5
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="text-base">
                    Notifications
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {[
                    "New order #12345 from John Doe",
                    "Product review pending approval",
                    "Server maintenance scheduled",
                    "New user registration",
                    "Payment processing failed",
                  ].map((notif, i) => (
                    <DropdownMenuItem key={i} className="py-2">
                      <div className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                        <div className="text-sm text-slate-600">{notif}</div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="gap-2 px-2 lg:px-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white text-xs font-bold">
                        AD
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline text-sm font-medium">
                      Admin
                    </span>
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold">Admin User</p>
                      <p className="text-xs text-slate-500">
                        admin@flashtech.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <User size={16} className="mr-2" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings size={16} className="mr-2" />
                    <span>Preferences</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-red-600">
                    <LogOut size={16} className="mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-slate-50">
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
