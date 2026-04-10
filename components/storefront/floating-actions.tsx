"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Phone, ChevronUp, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function FloatingActions() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4">
      {/* Contact Options */}
      <div className="flex flex-col gap-3">
         <ActionButton 
            icon={MessageSquare} 
            color="bg-blue-500" 
            label="Zalo" 
            href="https://zalo.me" 
            delay={0.1}
         />
         <ActionButton 
            icon={Phone} 
            color="bg-emerald-500" 
            label="Gọi điện" 
            href="tel:0123456789" 
            delay={0.2}
         />
      </div>

      {/* Back to top button */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={scrollToTop}
            className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl flex items-center justify-center hover:bg-slate-800 dark:hover:bg-slate-100 transition-all active:scale-90"
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActionButton({ icon: Icon, color, label, href, delay }: { icon: any, color: string, label: string, href: string, delay: number }) {
    return (
        <motion.a
            href={href}
            target="_blank"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
            className="group relative flex items-center justify-end"
        >
            <span className="absolute right-full mr-4 px-3 py-1 rounded-lg bg-white dark:bg-slate-800 shadow-lg text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-100 dark:border-white/5 pointer-events-none">
                {label}
            </span>
            <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all hover:scale-110 active:scale-95",
                color
            )}>
                <Icon size={24} />
            </div>
        </motion.a>
    );
}
