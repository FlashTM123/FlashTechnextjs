"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = "Xác nhận",
  cancelText = "Hủy bỏ",
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-[32px] border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0B] p-0 overflow-hidden shadow-2xl">
        <div className="p-8 space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 300 }}
              className={cn(
                "h-20 w-20 rounded-3xl flex items-center justify-center shadow-lg",
                variant === "danger" && "bg-rose-50 dark:bg-rose-500/10 text-rose-500 shadow-rose-500/20",
                variant === "warning" && "bg-amber-50 dark:bg-amber-500/10 text-amber-500 shadow-amber-500/20",
                variant === "info" && "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 shadow-indigo-500/20"
              )}
            >
              <AlertTriangle size={40} strokeWidth={2.5} className="animate-pulse" />
            </motion.div>
            
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {title}
              </DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {description}
              </DialogDescription>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-white/5 mx-0 bg-slate-50/50 dark:bg-white/5 p-6 -mx-8 -mb-8">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 rounded-2xl font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-all uppercase tracking-widest text-xs"
            >
              {cancelText}
            </Button>
            <Button
              type="button"
              disabled={isLoading}
              onClick={(e) => {
                e.preventDefault();
                onConfirm();
              }}
              className={cn(
                "flex-1 h-12 rounded-2xl font-black text-white shadow-xl transition-all uppercase tracking-widest text-xs active:scale-95 gap-2",
                variant === "danger" && "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20",
                variant === "warning" && "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20",
                variant === "info" && "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20"
              )}
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : null}
              {confirmText}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
