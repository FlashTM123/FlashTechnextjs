"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full w-10 h-10 hover:bg-slate-100 dark:hover:bg-white/10 transition-all border border-transparent dark:hover:border-white/5 flex items-center justify-center">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl border-slate-200 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-xl p-1 shadow-2xl">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="rounded-xl font-bold text-xs py-2.5 cursor-pointer focus:bg-indigo-50 dark:focus:bg-white/10 flex items-center gap-2"
        >
          <Sun size={14} className="text-amber-500" />
          Sáng (Light)
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="rounded-xl font-bold text-xs py-2.5 cursor-pointer focus:bg-indigo-50 dark:focus:bg-white/10 flex items-center gap-2"
        >
          <Moon size={14} className="text-indigo-400" />
          Tối (Dark)
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="rounded-xl font-bold text-xs py-2.5 cursor-pointer focus:bg-indigo-50 dark:focus:bg-white/10 flex items-center gap-2"
        >
          <Monitor size={14} className="text-slate-400" />
          Hệ thống (System)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
