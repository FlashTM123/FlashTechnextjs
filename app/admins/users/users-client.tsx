"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Trash2,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Loader2,
  RefreshCw,
  User,
  Mail,
  KeyRound,
  Phone,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  PencilLine,
  UserCircle,
  ShieldAlert,
  Settings2,
  Briefcase,
  AlertTriangle,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
export interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: "USER" | "ADMIN" | "MODERATOR" | "EMPLOYEE";
  status: "active" | "blocked";
  joinDate: string;
  avatar?: string;
}

const ROLES = [
  { id: "USER", label: "Member", desc: "Basic member", icon: UserCircle, color: "blue" },
  { id: "ADMIN", label: "Admin", desc: "Full terminal control", icon: ShieldAlert, color: "rose" },
  { id: "MODERATOR", label: "Mod", desc: "Content operator", icon: Settings2, color: "sky" },
  { id: "EMPLOYEE", label: "Staff", desc: "System staff", icon: Briefcase, color: "indigo" },
];

// ────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────
const getRoleBadgeClass = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
    case "MODERATOR":
      return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20";
    case "EMPLOYEE":
      return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
    default:
      return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
  }
};

const getStatusBadgeClass = (status: string) =>
  status === "active"
    ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    : "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20";

// ────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────
export default function UsersClient() {
  const [users, setUsers]           = useState<UserData[]>([]);
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm]   = useState("");
  const [roleFilter, setRoleFilter]   = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals & States
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserData | null>(null);

  const [formData, setFormData] = useState({
    name: "", email: "", password: "", phone: "", address: "", role: "USER" as any, status: "active" as any,
  });

  // ── Fetch ────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search: searchTerm, role: roleFilter, status: statusFilter, page: String(currentPage), limit: String(itemsPerPage) });
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      if (!res.ok) {
        setFetchError(data.message || `Lỗi ${res.status}`);
        setUsers([]);
        setTotal(0);
        setTotalPages(1);
        return;
      }
      setFetchError(null);
      setUsers(data.users || []);
      setTotal(data.total ?? 0);
      setTotalPages(
        data.totalPages ?? Math.max(1, Math.ceil((data.total ?? 0) / itemsPerPage)),
      );
    } catch (err) {
      console.error(err);
      setFetchError("Không tải được danh sách.");
      setUsers([]);
      setTotal(0);
      setTotalPages(1);
    } finally { setLoading(false); }
  }, [searchTerm, roleFilter, statusFilter, currentPage, itemsPerPage]);

  useEffect(() => {
    const t = setTimeout(fetchUsers, searchTerm ? 500 : 0);
    return () => clearTimeout(t);
  }, [fetchUsers, searchTerm]);

  // ── Handlers ────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const isEdit = !!editingUser;
      const res = await fetch(isEdit ? `/api/admin/users/${editingUser}` : "/api/admin/users", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) { setIsSheetOpen(false); fetchUsers(); }
    } catch { alert("Error saving user"); } finally { setIsSubmitting(false); }
  };

  const handleApplyDelete = async () => {
    if (!deletingUser) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/users/${deletingUser.id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== deletingUser.id));
        setTotal(t => t - 1);
        setIsDelModalOpen(false);
      }
    } catch { alert("Failed to delete"); } finally { setIsSubmitting(false); }
  };

  const handleBlockToggle = async (u: UserData) => {
    const next = u.status === "active" ? "blocked" : "active";
    await fetch(`/api/admin/users/${u.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: next }) });
    setUsers(prev => prev.map(item => item.id === u.id ? { ...item, status: next } : item));
  };

  return (
    <div className="min-h-screen bg-transparent dark:bg-[url('/noise.svg')] dark:bg-blend-multiply text-slate-800 dark:text-slate-200 p-4 md:p-8 animate-in fade-in duration-1000 relative transition-colors">
      <div className="mx-auto max-w-[1400px] space-y-8 relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 font-extrabold leading-none tracking-tight">
              Cộng sự
            </h1>
            <p className="mt-3 text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest text-[11px]">
              Flash Tech Administrative Terminal
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => fetchUsers()}
              className="h-11 w-11 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 hover:rotate-180 transition-all duration-500 shadow-sm dark:shadow-xl"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button
              onClick={() => {
                setEditingUser(null);
                setFormData({
                  name: "",
                  email: "",
                  password: "",
                  phone: "",
                  address: "",
                  role: "USER",
                  status: "active",
                });
                setIsSheetOpen(true);
              }}
              className="h-11 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black flex items-center gap-2 shadow-md shadow-indigo-500/20 dark:shadow-indigo-900/40 border border-indigo-500/20 transition-all active:scale-[0.98]"
            >
              <Plus className="h-5 w-5" /> THÊM MỚI
            </Button>
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
             <input
               className="w-full h-12 pl-14 pr-4 bg-transparent border-none focus:ring-0 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 font-bold outline-none transition-colors"
               placeholder="Tìm tên, email hoặc SĐT..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           <div className="flex items-center gap-2 p-1">
              <select
                className="h-10 px-4 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 cursor-pointer outline-none shadow-inner transition-colors"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                 <option value="all" className="bg-white dark:bg-[#0A0A0B]">Quyền hạn</option>
                 {ROLES.map((r) => (
                   <option key={r.id} value={r.id} className="bg-white dark:bg-[#0A0A0B]">
                     {r.id}
                   </option>
                 ))}
              </select>
              <select
                className="h-10 px-4 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 cursor-pointer outline-none shadow-inner transition-colors"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                 <option value="all" className="bg-white dark:bg-[#0A0A0B]">Trạng thái</option>
                 <option value="active" className="bg-white dark:bg-[#0A0A0B]">Active</option>
                 <option value="blocked" className="bg-white dark:bg-[#0A0A0B]">Locked</option>
              </select>
           </div>
        </div>

        {/* User Table */}
        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-2xl rounded-[32px] shadow-sm dark:shadow-[0_0_50px_rgb(0,0,0,0.5)] border border-slate-200 dark:border-white/5 overflow-hidden transition-colors">
          <div className="overflow-x-auto min-h-[400px]">
             <table className="w-full text-left">
               <thead>
                 <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] transition-colors">
                    {["Member", "Credential", "Role", "Status", "Created", ""].map((h, i) => (
                      <th key={h} className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ${i === 5 ? "text-right" : ""}`}>{h}</th>
                    ))}
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-white/5 transition-colors">
                 {loading ? (
                   Array(5).fill(0).map((_, i) => (
                     <tr key={i}>
                       <td colSpan={6} className="px-8 py-8 animate-pulse">
                         <div className="h-14 bg-slate-100 dark:bg-white/5 rounded-2xl" />
                       </td>
                     </tr>
                   ))
                 ) : users.length > 0 ? (
                   users.map(u => (
                     <tr key={u.id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-all duration-300">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12 rounded-[18px] ring-2 ring-slate-100 dark:ring-white/10 shadow-sm dark:shadow-xl">
                                <AvatarFallback className="bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black text-xs uppercase">
                                  {u.name.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-bold text-slate-900 dark:text-slate-200 leading-tight">{u.name}</p>
                                <p className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-500">#{u.id.slice(-6)}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-sm font-medium text-slate-600 dark:text-slate-300">{u.email}</td>
                        <td className="px-8 py-6">
                          <Badge variant="outline" className={cn("rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border", getRoleBadgeClass(u.role))}>
                            {u.role}
                          </Badge>
                        </td>
                        <td className="px-8 py-6">
                          <Badge variant="outline" className={cn("rounded-[10px] px-3 py-1 text-[10px] font-black tracking-widest border", getStatusBadgeClass(u.status))}>
                            {u.status === "active" ? "● ONLINE" : "● LOCKED"}
                          </Badge>
                        </td>
                        <td className="px-8 py-6 text-sm font-bold text-slate-500 dark:text-slate-400 font-mono">{u.joinDate}</td>
                        <td className="px-8 py-6 text-right flex justify-end gap-2 opacity-30 md:opacity-100 group-hover:opacity-100 transition-all duration-300">
                           <Button onClick={() => { setEditingUser(u.id); setFormData({ name: u.name, email: u.email, password: "", phone: u.phone, address: u.address, role: u.role, status: u.status }); setIsSheetOpen(true); }} variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-black/20 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl border border-transparent hover:border-indigo-200 dark:hover:border-indigo-500/20 transition-all"><PencilLine className="h-[18px] w-[18px]" /></Button>
                           <Button onClick={() => { setDeletingUser(u); setIsDelModalOpen(true); }} variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-100 dark:bg-black/20 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20 transition-all"><Trash2 className="h-[18px] w-[18px]" /></Button>
                           <DropdownMenu>
                              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-slate-900 dark:hover:text-white"><MoreVertical className="h-[18px] w-[18px]" /></Button>} />
                              <DropdownMenuContent align="end" className="w-52 p-3 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0B] backdrop-blur-md">
                                 <DropdownMenuItem onSelect={() => handleBlockToggle(u)} className="rounded-xl font-bold text-slate-700 dark:text-slate-200 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/10 transition-colors uppercase text-[10px] tracking-widest">{u.status === 'active' ? <><Lock className="h-4 w-4 mr-3" /> Lock Signal</> : <><Unlock className="h-4 w-4 mr-3" /> Reconnect</>}</DropdownMenuItem>
                              </DropdownMenuContent>
                           </DropdownMenu>
                        </td>
                     </tr>
                   ))
                 ) : (
                   <tr>
                     <td colSpan={6} className="py-24 text-center text-slate-500 dark:text-slate-400 font-black italic tracking-widest uppercase">
                       No records tracked
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
          </div>
          <div className="px-8 py-6 bg-slate-50/50 dark:bg-white/[0.01] border-t border-slate-100 dark:border-white/5 flex items-center justify-between transition-colors">
             <div className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em]">
               Data volume <span className="text-indigo-600 dark:text-indigo-400">{currentPage}</span> / {totalPages}
             </div>
             <div className="flex gap-3">
                <Button variant="outline" className="h-10 w-10 p-0 rounded-xl bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 hover:translate-x-[-2px] transition-all" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft className="h-5 w-5" /></Button>
                <Button variant="outline" className="h-10 w-10 p-0 rounded-xl bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 hover:translate-x-[2px] transition-all" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight className="h-5 w-5" /></Button>
             </div>
          </div>
        </div>

        {/* Form modal — palette đồng bộ workspace (#0A0A0B + indigo/violet) */}
        {isSheetOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#070709]/85 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-[#0A0A0B] rounded-[32px] overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.65)] w-full max-w-[420px] flex flex-col max-h-[90vh] animate-in zoom-in-[0.98] duration-300 relative border border-white/10">
              <button type="button" onClick={() => setIsSheetOpen(false)} className="absolute top-4 right-4 z-20 rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                <X size={20} strokeWidth={2.5} />
              </button>

              <div className="relative shrink-0 border-b border-white/10 bg-[#0f0f12] px-8 pt-10 pb-8 text-center overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.07] mix-blend-overlay pointer-events-none" />
                <h2 className="text-2xl font-black text-white tracking-tight leading-none mb-2 uppercase relative z-10">
                  {editingUser ? "EDIT ACCESS" : "NEW ACCESS"}
                </h2>
                <p className="text-indigo-400/90 font-bold uppercase tracking-[0.2em] text-[9px] relative z-10">
                  Administrative Privilege Manager
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10 custom-scrollbar relative text-slate-200">
                 <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 ml-2">ACCOUNT CORE DATA</Label>
                    <div className="space-y-5 bg-white/[0.04] p-6 rounded-[28px] border border-white/10">
                       <div className="space-y-1.5">
                         <Label className="text-slate-400 font-bold ml-1 text-[11px]">Identity Name</Label>
                         <Input required className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-[14px] font-bold focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/50" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                       </div>
                       <div className="space-y-1.5">
                         <Label className="text-slate-400 font-bold ml-1 text-[11px]">Email Endpoint</Label>
                         <Input type="email" required disabled={!!editingUser} className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-[14px] font-bold focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                       </div>
                       {!editingUser && (
                       <div className="space-y-1.5">
                         <Label className="text-slate-400 font-bold ml-1 text-[11px]">Master Password</Label>
                         <Input type="password" required className="h-12 bg-white/5 border-white/10 text-white rounded-[14px] font-bold tracking-[0.15em] focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/50" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                       </div>
                       )}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 ml-2">ASSIGN PRIVILEGE</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {ROLES.map(({id, label, icon: Icon}) => {
                         const isSelected = formData.role === id;
                         return (
                           <button key={id} type="button" onClick={() => setFormData({...formData, role: id})}
                             className={cn(
                               "p-6 rounded-[28px] border-2 flex flex-col items-center justify-center gap-4 transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50",
                               isSelected
                                 ? "border-indigo-500/70 bg-indigo-500/15 shadow-[0_0_24px_rgba(99,102,241,0.2)]"
                                 : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                             )}>
                             <div className={cn(
                               "inline-flex p-3 rounded-full transition-all",
                               isSelected ? "bg-indigo-500/25 text-indigo-300" : "bg-white/5 text-slate-500 group-hover:text-slate-400"
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
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 ml-2">EXTENDED METADATA</Label>
                    <div className="space-y-5 bg-white/[0.04] p-6 rounded-[28px] border border-white/10">
                       <div className="flex gap-4">
                          <div className="flex-1 space-y-1.5">
                            <Label className="text-slate-400 font-bold ml-1 text-[11px]">Phone</Label>
                            <Input className="h-12 bg-white/5 border-white/10 text-white rounded-[14px] font-bold focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/50" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                          </div>
                          <div className="w-1/3 space-y-1.5">
                            <Label className="text-slate-400 font-bold ml-1 text-[11px]">Status</Label>
                            <select className="w-full h-12 px-3 bg-white/5 border border-white/10 rounded-[14px] text-[10px] uppercase font-black text-indigo-300 outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500/40" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as "active" | "blocked"})}>
                              <option value="active" className="bg-[#0A0A0B] text-white">ACTIVE</option>
                              <option value="blocked" className="bg-[#0A0A0B] text-white">LOCKED</option>
                            </select>
                          </div>
                       </div>
                       <div className="space-y-1.5">
                          <Label className="text-slate-400 font-bold ml-1 text-[11px]">Working Address</Label>
                          <Input className="h-12 bg-white/5 border-white/10 text-white rounded-[14px] font-bold focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/50" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-6 md:px-8 md:pb-8 shrink-0 border-t border-white/10 bg-[#080809]">
                 <Button type="button" onClick={(e) => { e.preventDefault(); void handleSubmit(e as unknown as React.FormEvent); }} disabled={isSubmitting} className="w-full h-14 rounded-[20px] font-black text-sm uppercase tracking-widest bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border border-white/10 shadow-lg shadow-indigo-950/50 transition-all flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99]">
                   {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : <><CheckCircle2 className="h-5 w-5" /> COMMENCE UPDATE</>}
                 </Button>
              </div>
            </div>
          </div>
        )}

        {isDelModalOpen && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#070709]/85 backdrop-blur-md animate-in fade-in transition-all">
              <div className="bg-[#0A0A0B] border border-white/10 rounded-[32px] shadow-[0_0_60px_rgba(0,0,0,0.65)] w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                 <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-rose-500/80 via-rose-400/50 to-rose-500/80" />
                 <div className="p-10 text-center space-y-6">
                    <div className="mx-auto w-20 h-20 bg-rose-500/10 text-rose-400 border border-rose-500/25 rounded-3xl flex items-center justify-center">
                       <AlertTriangle className="h-10 w-10" />
                    </div>
                    <div className="space-y-2">
                       <h2 className="text-2xl font-black text-white leading-tight">Xóa vĩnh viễn?</h2>
                       <p className="text-sm font-bold text-slate-400 px-4 leading-relaxed">Bạn đang chuẩn bị xóa định danh <span className="text-rose-400 font-black">{deletingUser?.name}</span>. Hành động này không thể hoàn tác.</p>
                    </div>
                    <div className="flex flex-col gap-3 pt-2">
                       <Button onClick={handleApplyDelete} className="h-14 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white rounded-2xl font-black border border-rose-400/20 shadow-lg shadow-rose-950/40" disabled={isSubmitting}>
                          {isSubmitting ? <Loader2 className="animate-spin" /> : "XÁC NHẬN XÓA BỎ"}
                       </Button>
                       <Button onClick={() => setIsDelModalOpen(false)} variant="ghost" className="h-12 text-slate-400 font-black hover:bg-white/5 hover:text-white rounded-2xl">
                          QUAY LẠI
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
