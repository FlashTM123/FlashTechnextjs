"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Loader2,
  RefreshCw,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  PencilLine,
  UserCircle,
  AlertTriangle,
  X,
  CreditCard,
  Gem,
  Award,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────
export interface CustomerData {
  id: string;
  customer_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  city: string;
  gender: "MALE" | "FEMALE" | "OTHER" | "HIDDEN";
  status: "ACTIVE" | "BLOCKED" | "PENDING" | "INACTIVE";
  tier: "BRONZE" | "SILVER" | "GOLD" | "DIAMOND";
  points: number;
  isVerified: boolean;
  adminNote: string;
  joinDate: string;
}

const TIERS = [
  { id: "BRONZE", label: "Bronze", icon: Award, color: "orange" },
  { id: "SILVER", label: "Silver", icon: ShieldCheck, color: "slate" },
  { id: "GOLD", label: "Gold", icon: Crown, color: "yellow" },
  { id: "DIAMOND", label: "Diamond", icon: Gem, color: "sky" },
];

const getTierColor = (tier: string) => {
  switch (tier) {
    case "SILVER":  return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    case "GOLD":    return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "DIAMOND": return "bg-sky-500/10 text-sky-500 border-sky-500/20";
    default:        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    case "BLOCKED": return "text-rose-500 bg-rose-500/10 border-rose-500/20";
    case "PENDING": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    case "INACTIVE": return "text-slate-500 bg-slate-500/10 border-slate-500/20";
    default: return "text-slate-500 bg-slate-500/10 border-slate-500/20";
  }
};

// ────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────
export default function CustomersClient() {
  const [customers, setCustomers]   = useState<CustomerData[]>([]);
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm]   = useState("");
  const [tierFilter, setTierFilter]   = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingCustomer, setEditingCustomer] = useState<CustomerData | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<CustomerData | null>(null);

  const [formData, setFormData] = useState({
    full_name: "", phone_number: "", address: "", city: "", 
    tier: "BRONZE", status: "ACTIVE", gender: "MALE", adminNote: ""
  });

  // ── Fetch ────────────────────────────────────
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search: searchTerm, tier: tierFilter, status: statusFilter, page: String(currentPage), limit: String(itemsPerPage) });
      const res = await fetch(`/api/admin/customers?${params}`);
      const data = await res.json();
      if (!res.ok) {
        setFetchError(data.message || `Lỗi ${res.status}`);
        setCustomers([]);
        setTotal(0);
        setTotalPages(1);
        return;
      }
      setFetchError(null);
      setCustomers(data.customers || []);
      setTotal(data.total ?? 0);
      setTotalPages(
        data.totalPages ?? Math.max(1, Math.ceil((data.total ?? 0) / itemsPerPage)),
      );
    } catch (err) {
      console.error(err);
      setFetchError("Không kết nối được API.");
      setCustomers([]);
      setTotal(0);
      setTotalPages(1);
    } finally { setLoading(false); }
  }, [searchTerm, tierFilter, statusFilter, currentPage, itemsPerPage]);

  useEffect(() => {
    const t = setTimeout(fetchCustomers, searchTerm ? 500 : 0);
    return () => clearTimeout(t);
  }, [fetchCustomers, searchTerm]);

  // ── Handlers ────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/customers/${editingCustomer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) { setIsModalOpen(false); fetchCustomers(); }
    } catch { alert("Error saving"); } finally { setIsSubmitting(false); }
  };

  const handleApplyDelete = async () => {
    if (!deletingCustomer) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/customers/${deletingCustomer.id}`, { method: "DELETE" });
      if (res.ok) {
        setCustomers(prev => prev.filter(c => c.id !== deletingCustomer.id));
        setTotal(t => t - 1);
        setIsDelModalOpen(false);
      }
    } catch { alert("Failed to delete"); } finally { setIsSubmitting(false); }
  };

  const openEditModal = (customer: CustomerData) => {
    setEditingCustomer(customer);
    setFormData({
      full_name: customer.full_name,
      phone_number: customer.phone_number || "",
      address: customer.address || "",
      city: customer.city || "",
      tier: customer.tier,
      status: customer.status,
      gender: customer.gender,
      adminNote: customer.adminNote || ""
    });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-transparent dark:bg-[url('/noise.svg')] dark:bg-blend-multiply text-slate-800 dark:text-slate-200 p-4 md:p-8 animate-in fade-in duration-1000 relative transition-colors">
      <div className="mx-auto max-w-[1400px] space-y-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 font-extrabold leading-none tracking-tight">Customer Network</h1>
            <p className="mt-3 text-slate-500 dark:text-slate-400 font-medium italic opacity-80 uppercase tracking-widest text-[11px]">Database Synchronization Node</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => fetchCustomers()} className="h-11 w-11 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/10 hover:rotate-180 transition-all duration-500 shadow-sm dark:shadow-xl">
               <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            {/* Note: No 'Add' button as requested */}
          </div>
        </div>

        {fetchError && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-700 dark:text-rose-300">
            {fetchError}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-white/5 p-2 rounded-[28px] shadow-sm dark:shadow-2xl backdrop-blur-xl border border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center gap-2 transition-colors">
           <div className="relative flex-1 w-full group">
             <Search className="absolute left-5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" />
             <input className="w-full h-12 pl-14 pr-4 bg-transparent border-none focus:ring-0 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 font-bold outline-none transition-colors" placeholder="Search by name, email, ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
           </div>
           <div className="flex items-center gap-2 p-1">
              <select className="h-10 px-4 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 cursor-pointer outline-none shadow-inner" value={tierFilter} onChange={e => setTierFilter(e.target.value)}>
                 <option value="all" className="dark:bg-[#0A0A0B] bg-white text-slate-800 dark:text-white">All Tiers</option>
                 {TIERS.map(r => <option key={r.id} value={r.id} className="dark:bg-[#0A0A0B] bg-white text-slate-800 dark:text-white">{r.label}</option>)}
              </select>
              <select className="h-10 px-4 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 cursor-pointer outline-none shadow-inner" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                 <option value="all" className="dark:bg-[#0A0A0B] bg-white text-slate-800 dark:text-white">Status</option>
                 <option value="ACTIVE" className="dark:bg-[#0A0A0B] bg-white text-slate-800 dark:text-white">Active</option>
                 <option value="PENDING" className="dark:bg-[#0A0A0B] bg-white text-slate-800 dark:text-white">Pending</option>
                 <option value="BLOCKED" className="dark:bg-[#0A0A0B] bg-white text-slate-800 dark:text-white">Blocked</option>
              </select>
           </div>
        </div>

        {/* Table Area */}
        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-2xl rounded-[32px] shadow-sm dark:shadow-[0_0_50px_rgb(0,0,0,0.5)] border border-slate-200 dark:border-white/5 overflow-hidden transition-colors">
          <div className="overflow-x-auto min-h-[400px]">
             <table className="w-full text-left">
               <thead>
                 <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] transition-colors">
                    {["Customer ID", "Profile", "Tier Level", "Status", "Joined", "Manage"].map((h, i) => (
                      <th key={h} className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ${i === 5 ? 'text-right' : ''}`}>{h}</th>
                    ))}
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-white/5 transition-colors">
                 {loading ? (
                   Array(5).fill(0).map((_, i) => <tr key={i}><td colSpan={6} className="px-8 py-8 animate-pulse"><div className="h-14 bg-slate-100 dark:bg-white/5 rounded-2xl" /></td></tr>)
                 ) : customers.length > 0 ? (
                   customers.map(c => (
                     <tr key={c.id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-all duration-300">
                        <td className="px-8 py-6">
                           <span className="font-mono text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-500/20">{c.customer_id}</span>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12 rounded-[18px] ring-2 ring-slate-100 dark:ring-white/10 shadow-sm dark:shadow-xl"><AvatarFallback className="bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black text-sm uppercase">{c.full_name.substring(0, 2)}</AvatarFallback></Avatar>
                              <div>
                                <p className="font-bold text-slate-900 dark:text-slate-200 leading-tight transition-colors">{c.full_name}</p>
                                <p className="text-[11px] font-medium text-slate-500">{c.email}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <Badge variant="outline" className={cn("rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest", getTierColor(c.tier))}>
                              {c.tier}
                           </Badge>
                        </td>
                        <td className="px-8 py-6">
                           <Badge variant="outline" className={cn("rounded-[10px] px-3 py-1 text-[10px] font-black shrink-0 tracking-widest shadow-inner shadow-black/20", getStatusColor(c.status))}>
                              {c.status}
                           </Badge>
                        </td>
                        <td className="px-8 py-6 text-sm font-bold text-slate-500 font-mono italic">{c.joinDate}</td>
                        <td className="px-8 py-6 text-right flex justify-end gap-2 opacity-30 md:opacity-100 group-hover:opacity-100 transition-all duration-300">
                           <Button onClick={() => openEditModal(c)} variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-black/20 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl shadow-sm border border-transparent hover:border-indigo-200 dark:hover:border-indigo-500/20 transition-all">
                              <PencilLine className="h-[18px] w-[18px]" />
                           </Button>
                           <Button onClick={() => { setDeletingCustomer(c); setIsDelModalOpen(true); }} variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-100 dark:bg-black/20 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20 transition-all">
                              <Trash2 className="h-[18px] w-[18px]" />
                           </Button>
                        </td>
                     </tr>
                   ))
                 ) : (<tr><td colSpan={6} className="py-24 text-center text-slate-500 font-black italic tracking-widest uppercase">No Records Tracked</td></tr>)}
               </tbody>
             </table>
          </div>
          {/* Pagination */}
          <div className="px-8 py-6 bg-slate-50/50 dark:bg-white/[0.01] border-t border-slate-100 dark:border-white/5 flex items-center justify-between transition-colors">
             <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Data Volume <span className="text-indigo-600 dark:text-indigo-400">{currentPage}</span> / {totalPages}</div>
             <div className="flex gap-3">
                <Button variant="outline" className="h-10 w-10 p-0 rounded-xl bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/10 hover:translate-x-[-2px] transition-all" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft className="h-5 w-5" /></Button>
                <Button variant="outline" className="h-10 w-10 p-0 rounded-xl bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/10 hover:translate-x-[2px] transition-all" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight className="h-5 w-5" /></Button>
             </div>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#070709]/85 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-[#0A0A0B] rounded-[32px] overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.65)] w-full max-w-[420px] flex flex-col max-h-[90vh] animate-in zoom-in-[0.98] duration-300 relative border border-white/10">
              <button type="button" onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 z-20 rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                <X size={20} strokeWidth={2.5} />
              </button>

              <div className="relative shrink-0 border-b border-white/10 bg-[#0f0f12] px-8 pt-10 pb-8 text-center overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.07] mix-blend-overlay pointer-events-none" />
                <h2 className="text-2xl font-black text-white tracking-tight leading-none mb-2 uppercase relative z-10">
                  EDIT CUSTOMER
                </h2>
                <p className="text-indigo-400/90 font-bold uppercase tracking-[0.2em] text-[9px] relative z-10">
                  Client Relationship Modification
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10 custom-scrollbar relative text-slate-200">
                 <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 ml-2">DATA IDENTITY</Label>
                    <div className="space-y-5 bg-white/[0.04] p-6 rounded-[28px] border border-white/10">
                       <div className="space-y-1.5">
                         <Label className="text-slate-400 font-bold ml-1 text-[11px]">Identity Name</Label>
                         <Input required className="h-12 bg-white/5 border-white/10 text-white rounded-[14px] font-bold focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/50" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
                       </div>
                       <div className="flex gap-4">
                         <div className="flex-1 space-y-1.5">
                           <Label className="text-slate-400 font-bold ml-1 text-[11px]">Phone Endpoint</Label>
                           <Input className="h-12 bg-white/5 border-white/10 text-white rounded-[14px] font-bold text-sm focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/50" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} />
                         </div>
                         <div className="w-2/5 space-y-1.5">
                           <Label className="text-slate-400 font-bold ml-1 text-[11px]">Gender</Label>
                           <select className="w-full h-12 px-3 bg-white/5 border border-white/10 rounded-[14px] text-[10px] uppercase font-black text-indigo-200 outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500/40" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as CustomerData["gender"]})}>
                             <option value="MALE" className="bg-[#0A0A0B]">MALE</option>
                             <option value="FEMALE" className="bg-[#0A0A0B]">FEMALE</option>
                             <option value="OTHER" className="bg-[#0A0A0B]">OTHER</option>
                             <option value="HIDDEN" className="bg-[#0A0A0B]">HIDDEN</option>
                           </select>
                         </div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 ml-2">TIER UPGRADE</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {TIERS.map(({id, label, icon: Icon}) => {
                         const isSelected = formData.tier === id;
                         return (
                           <button key={id} type="button" onClick={() => setFormData({...formData, tier: id as CustomerData["tier"]})}
                             className={cn(
                               "p-6 rounded-[28px] border-2 flex flex-col items-center justify-center gap-4 transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50",
                               isSelected
                                 ? "border-indigo-500/70 bg-indigo-500/15 shadow-[0_0_24px_rgba(99,102,241,0.2)]"
                                 : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                             )}>
                             <div className={cn(
                               "inline-flex p-3 rounded-full transition-all",
                               isSelected ? "bg-indigo-500/25 text-indigo-300" : "bg-white/5 text-slate-500"
                             )}>
                               <Icon className="h-6 w-6" strokeWidth={isSelected ? 2.5 : 2} />
                             </div>
                             <p className={cn(
                               "text-[12px] font-black uppercase tracking-widest",
                               isSelected ? "text-indigo-200" : "text-slate-500"
                             )}>
                               {label}
                             </p>
                           </button>
                         );
                      })}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 ml-2">LOCATION & FLAGS</Label>
                    <div className="space-y-5 bg-white/[0.04] p-6 rounded-[28px] border border-white/10">
                       <div className="flex gap-4">
                          <div className="flex-1 space-y-1.5">
                            <Label className="text-slate-400 font-bold ml-1 text-[11px]">City</Label>
                            <Input className="h-12 bg-white/5 border-white/10 text-white rounded-[14px] font-bold focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/50" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                          </div>
                          <div className="w-1/3 space-y-1.5">
                            <Label className="text-slate-400 font-bold ml-1 text-[11px]">System Status</Label>
                            <select className="w-full h-12 px-3 bg-white/5 border border-white/10 rounded-[14px] text-[10px] uppercase font-black text-indigo-200 outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500/40" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as CustomerData["status"]})}>
                              <option value="ACTIVE" className="bg-[#0A0A0B]">ACTIVE</option>
                              <option value="PENDING" className="bg-[#0A0A0B]">PENDING</option>
                              <option value="BLOCKED" className="bg-[#0A0A0B]">BLOCKED</option>
                              <option value="INACTIVE" className="bg-[#0A0A0B]">INACTIVE</option>
                            </select>
                          </div>
                       </div>
                       <div className="space-y-1.5">
                          <Label className="text-slate-400 font-bold ml-1 text-[11px]">Detailed Address</Label>
                          <Input className="h-12 bg-white/5 border-white/10 text-white rounded-[14px] font-bold focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/50" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-6 md:px-8 md:pb-8 shrink-0 border-t border-white/10 bg-[#080809]">
                 <Button type="button" onClick={(e) => { e.preventDefault(); void handleSubmit(e as unknown as React.FormEvent); }} disabled={isSubmitting} className="w-full h-14 rounded-[20px] font-black text-sm uppercase tracking-widest bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border border-white/10 shadow-lg shadow-indigo-950/50 transition-all flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99]">
                   {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : <><CheckCircle2 className="h-5 w-5" /> APPLY CHANGES</>}
                 </Button>
              </div>
            </div>
          </div>
        )}

        {isDelModalOpen && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#070709]/85 backdrop-blur-md animate-in fade-in transition-all">
              <div className="bg-[#0A0A0B] border border-white/10 rounded-[32px] shadow-[0_0_60px_rgba(0,0,0,0.65)] w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 relative">
                 <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-rose-500/80 via-rose-400/50 to-rose-500/80" />
                 <div className="p-10 text-center space-y-6">
                    <div className="mx-auto w-20 h-20 bg-rose-500/10 text-rose-400 border border-rose-500/25 rounded-3xl flex items-center justify-center">
                       <AlertTriangle className="h-10 w-10" />
                    </div>
                    <div className="space-y-2">
                       <h2 className="text-2xl font-black text-white leading-tight">Permanent Deletion</h2>
                       <p className="text-sm font-bold text-slate-400 px-4 leading-relaxed">You are about to delete <span className="text-rose-400 font-black">{deletingCustomer?.full_name}</span>. This irreversible action destroys all data records.</p>
                    </div>
                    <div className="flex flex-col gap-3 pt-4">
                       <Button onClick={handleApplyDelete} className="h-14 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white rounded-[20px] font-black tracking-widest border border-rose-400/20 shadow-lg shadow-rose-950/40" disabled={isSubmitting}>
                          {isSubmitting ? <Loader2 className="animate-spin" /> : "CONFIRM PURGE"}
                       </Button>
                       <Button onClick={() => setIsDelModalOpen(false)} variant="ghost" className="h-14 text-slate-400 font-black hover:bg-white/5 hover:text-white rounded-[20px] transition-colors">
                          CANCEL SEQUENCE
                       </Button>
                    </div>
                 </div>
              </div>
           </div>
        )}

      </div>
    </div>
  );
}
