"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/60 dark:border-white/10 dark:bg-white/5 bg-white shadow-sm hover:bg-slate-50 dark:hover:bg-white/10 transition-all relative outline-none cursor-pointer">
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-slate-600 dark:text-white" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-slate-600 dark:text-white" />
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl dark:bg-[#0A0A0B] dark:border-white/10 dark:text-white bg-white">
        <DropdownMenuItem onClick={() => setTheme("light")} className="rounded-xl cursor-pointer dark:focus:bg-white/10 transition-colors">
          Light Mode
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="rounded-xl cursor-pointer dark:focus:bg-white/10 transition-colors">
          Dark Mode
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="rounded-xl cursor-pointer dark:focus:bg-white/10 transition-colors">
          System Theme
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
