"use client";

import { motion } from "framer-motion";
import { Cpu, Smartphone, Monitor, Battery, Camera, MemoryStick as Memory, HardDrive, Wifi, ShieldCheck, Layers, Award, Zap, Globe, Package, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpecsTableProps {
  specs: any;
}

const formatKey = (key: string) => {
  // Remove underscores and replace with space
  let formatted = key.replace(/_/g, ' ');
  // Split by space and capitalize
  return formatted.split(' ').map(word => {
     // Keep full uppercase for short tech terms
     const techTerms = ['CPU', 'RAM', 'GPU', 'SSD', 'HDD', 'IP', 'OS', 'UI', 'ID', 'SIM', 'WI-FI', 'GPS', 'NFC'];
     if (techTerms.includes(word.toUpperCase())) return word.toUpperCase();
     return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
}

const getSpecIcon = (key: string) => {
  const k = key.toLowerCase();
  if (k.includes('cpu') || k.includes('chip') || k.includes('vi xử lý')) return <Cpu size={20} />;
  if (k.includes('ram') || k.includes('bộ nhớ')) return <Memory size={20} />;
  if (k.includes('storage') || k.includes('dung lượng') || k.includes('ổ cứng')) return <HardDrive size={20} />;
  if (k.includes('màn hình') || k.includes('display') || k.includes('screen')) return <Monitor size={20} />;
  if (k.includes('camera')) return <Camera size={20} />;
  if (k.includes('pin') || k.includes('battery')) return <Battery size={20} />;
  if (k.includes('mạng') || k.includes('wifi') || k.includes('bluetooth')) return <Wifi size={20} />;
  if (k.includes('bảo mật') || k.includes('kháng nước')) return <ShieldCheck size={20} />;
  return <Settings size={20} />;
}

export function SpecsTable({ specs }: SpecsTableProps) {
  if (!specs || Object.keys(specs).length === 0) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-6 bg-slate-50 dark:bg-white/[0.01] rounded-[40px] border border-dashed border-slate-200 dark:border-white/5 opacity-50">
        <Package size={40} strokeWidth={1} className="text-slate-300" />
        <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 font-mono">Dữ liệu kỹ thuật đang đồng bộ...</p>
      </div>
    );
  }

  const entries = Object.entries(specs).filter(([_, value]) => value !== null && value !== undefined && value !== "");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 shadow-2xl shadow-indigo-500/[0.02] rounded-[32px] overflow-hidden border border-slate-100 dark:border-white/10 bg-slate-100 dark:bg-white/10">
      {entries.map(([key, value], i) => (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05, duration: 0.4 }}
          key={key}
          className="flex items-start gap-5 p-10 bg-white dark:bg-[#0A0A0B] group transition-all hover:bg-slate-50 dark:hover:bg-white/[0.03]"
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-400 group-hover:text-indigo-500 group-hover:bg-indigo-500/10 flex items-center justify-center shrink-0 transition-all duration-300">
             {getSpecIcon(key)}
          </div>
          <div className="space-y-1.5 flex-grow">
             <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-indigo-500 transition-colors">
               {formatKey(key)}
             </div>
             <div className="text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
               {typeof value === 'object' ? JSON.stringify(value) : String(value)}
             </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
