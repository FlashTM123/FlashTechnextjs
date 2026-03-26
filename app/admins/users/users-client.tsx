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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet";
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
const getRoleColor = (role: string) => {
  switch (role) {
    case "ADMIN":     return "bg-rose-100 text-rose-700 border-rose-200";
    case "MODERATOR": return "bg-sky-100 text-sky-700 border-sky-200";
    case "EMPLOYEE":  return "bg-indigo-100 text-indigo-700 border-indigo-200";
    default:          return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

const getStatusColor = (status: string) =>
  status === "active" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-red-100 text-red-700 border-red-200";

// ────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────
export default function UsersClient() {
  const [users, setUsers]           = useState<UserData[]>([]);
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(true);

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
      setUsers(data.users);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) { console.error(err); } finally { setLoading(false); }
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
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div><h1 className="text-4xl font-extrabold text-slate-900 leading-none">Cộng sự</h1><p className="mt-3 text-slate-500 font-medium italic opacity-80">Flash Tech Administrative Terminal</p></div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => fetchUsers()} className="h-11 w-11 rounded-2xl bg-white shadow-sm border-slate-100 hover:rotate-180 transition-transform duration-500"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></Button>
            <Button onClick={() => { setEditingUser(null); setFormData({ name: "", email: "", password: "", phone: "", address: "", role: "USER", status: "active" }); setIsSheetOpen(true); }} className="h-11 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-100 transition-all font-black flex items-center gap-2 active:scale-95"><Plus className="h-5 w-5" /> THÊM MỚI</Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-2 rounded-[28px] shadow-sm border border-slate-200 flex flex-col md:flex-row items-center gap-2">
           <div className="relative flex-1 w-full group">
             <Search className="absolute left-5 top-3.5 h-5 w-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
             <input className="w-full h-12 pl-14 pr-4 bg-transparent border-none focus:ring-0 text-slate-700 placeholder-slate-400 font-bold" placeholder="Tìm tên, email hoặc SĐT..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
           </div>
           <div className="flex items-center gap-2 p-1">
              <select className="h-10 px-4 rounded-xl bg-slate-50 border-none text-[10px] font-black uppercase tracking-widest text-slate-500 cursor-pointer" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                 <option value="all">Quyền hạn</option>
                 {ROLES.map(r => <option key={r.id} value={r.id}>{r.id}</option>)}
              </select>
              <select className="h-10 px-4 rounded-xl bg-slate-50 border-none text-[10px] font-black uppercase tracking-widest text-slate-500 cursor-pointer" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                 <option value="all">Trạng thái</option>
                 <option value="active">Active</option>
                 <option value="blocked">Locked</option>
              </select>
           </div>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto min-h-[400px]">
             <table className="w-full text-left">
               <thead>
                 <tr className="border-b border-slate-100 bg-slate-50/20">
                    {["Member", "Credential", "Role", "Status", "Created", ""].map((h, i) => (
                      <th key={h} className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ${i === 5 ? 'text-right' : ''}`}>{h}</th>
                    ))}
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {loading ? (
                   Array(5).fill(0).map((_, i) => <tr key={i}><td colSpan={6} className="px-8 py-8 animate-pulse"><div className="h-14 bg-slate-50 rounded-2xl" /></td></tr>)
                 ) : users.length > 0 ? (
                   users.map(u => (
                     <tr key={u.id} className="group hover:bg-slate-50/80 transition-all">
                        <td className="px-8 py-5">
                           <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12 rounded-[20px] ring-2 ring-white shadow-xl shadow-slate-200"><AvatarFallback className="bg-slate-900 text-white font-black text-xs uppercase">{u.name.substring(0, 2)}</AvatarFallback></Avatar>
                              <div><p className="font-bold text-slate-900 leading-tight">{u.name}</p><p className="text-[11px] font-bold text-slate-300 tracking-wider">#{u.id.slice(-6)}</p></div>
                           </div>
                        </td>
                        <td className="px-8 py-5 text-sm font-bold text-slate-600">{u.email}</td>
                        <td className="px-8 py-5"><Badge variant="outline" className={`rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-widest border-none text-white ${u.role === 'ADMIN' ? 'bg-rose-500' : u.role === 'MODERATOR' ? 'bg-sky-500' : u.role === 'EMPLOYEE' ? 'bg-indigo-500' : 'bg-slate-500'}`}>{u.role}</Badge></td>
                        <td className="px-8 py-5"><Badge variant="outline" className={`rounded-full px-3 py-1 text-[11px] font-black border-none shadow-sm ${getStatusColor(u.status)}`}>{u.status === 'active' ? '● ONLINE' : '● IDLE'}</Badge></td>
                        <td className="px-8 py-5 text-sm font-bold text-slate-400 font-mono italic">{u.joinDate}</td>
                        <td className="px-8 py-5 text-right flex justify-end gap-1 opacity-10 md:opacity-0 group-hover:opacity-100 transition-all duration-300">
                           <Button onClick={() => { setEditingUser(u.id); setFormData({ name: u.name, email: u.email, password: "", phone: u.phone, address: u.address, role: u.role, status: u.status }); setIsSheetOpen(true); }} variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl shadow-lg border-transparent hover:border-slate-100 transition-all"><PencilLine className="h-5 w-5" /></Button>
                           <Button onClick={() => { setDeletingUser(u); setIsDelModalOpen(true); }} variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 className="h-5 w-5" /></Button>
                           <DropdownMenu>
                              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-slate-900"><MoreVertical className="h-5 w-5" /></Button>} />
                              <DropdownMenuContent align="end" className="w-52 p-3 rounded-2xl shadow-2xl border-slate-100 bg-white/95 backdrop-blur-md">
                                 <DropdownMenuItem onSelect={() => handleBlockToggle(u)} className="rounded-xl font-bold text-slate-700 py-3 cursor-pointer hover:bg-slate-50 transition-colors uppercase text-[10px] tracking-widest">{u.status === 'active' ? <><Lock className="h-4 w-4 mr-3" /> Lock Signal</> : <><Unlock className="h-4 w-4 mr-3" /> Reconnect</>}</DropdownMenuItem>
                              </DropdownMenuContent>
                           </DropdownMenu>
                        </td>
                     </tr>
                   ))
                 ) : (<tr><td colSpan={6} className="py-24 text-center text-slate-300 font-black italic tracking-widest">NO DATA DETECTED</td></tr>)}
               </tbody>
             </table>
          </div>
          <div className="p-8 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Module Page <span className="text-indigo-600">{currentPage}</span> of {totalPages}</div>
             <div className="flex gap-3">
                <Button variant="outline" className="h-11 w-11 p-0 rounded-2xl bg-white shadow-sm hover:translate-x-[-2px] transition-transform" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft className="h-5 w-5" /></Button>
                <Button variant="outline" className="h-11 w-11 p-0 rounded-2xl bg-white shadow-sm hover:translate-x-[2px] transition-transform" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight className="h-5 w-5" /></Button>
             </div>
          </div>
        </div>

        {/* REUSABLE FORM SHEET */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="sm:max-w-[500px] p-0 border-l-0 shadow-2xl overflow-hidden focus:ring-0">
             <div className="h-full flex flex-col bg-slate-50">
                <div className="p-10 bg-indigo-600 text-white relative">
                   <div className="absolute top-0 right-0 h-40 w-40 bg-white/10 rounded-full blur-3xl -mt-10 -mr-10" />
                   <SheetHeader className="text-left relative z-10">
                      <SheetTitle className="text-3xl font-black text-white">{editingUser ? 'EDIT ACCESS' : 'NEW ACCESS'}</SheetTitle>
                      <SheetDescription className="text-indigo-100 font-bold opacity-80 uppercase tracking-[0.2em] text-[10px]">Administrative Privilege Manager</SheetDescription>
                   </SheetHeader>
                </div>
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-12">
                   <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">ACCOUNT CORE DATA</Label>
                      <div className="grid gap-5 bg-white p-6 rounded-[28px] shadow-sm border border-slate-100">
                         <div className="space-y-2"><Label className="text-slate-400 font-bold ml-1">Identity Name</Label><Input required className="h-12 bg-slate-50 border-none rounded-xl font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                         <div className="space-y-2"><Label className="text-slate-400 font-bold ml-1">Email Endpoint</Label><Input type="email" required disabled={!!editingUser} className="h-12 bg-slate-50 border-none rounded-xl font-bold disabled:opacity-50" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                         {!editingUser && <div className="space-y-2"><Label className="text-slate-400 font-bold ml-1">Master Password</Label><Input type="password" required className="h-12 bg-slate-50 border-none rounded-xl font-bold" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} /></div>}
                      </div>
                   </div>
                   <div className="space-y-6">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">ASSIGN PRIVILEGE</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {ROLES.map(({id, label, desc, icon: Icon, color}) => (
                           <button key={id} type="button" onClick={() => setFormData({...formData, role: id})} 
                             className={cn("p-5 rounded-[28px] border-2 text-left transition-all active:scale-95 group relative", formData.role === id ? `border-${color}-500 bg-${color}-50/30 ring-4 ring-${color}-500/10 shadow-lg shadow-${color}-500/5` : "border-transparent bg-white shadow-sm hover:border-slate-100")}>
                             <div className={cn("inline-flex p-3 rounded-[18px] mb-4 transition-all", formData.role === id ? `bg-${color}-500 text-white shadow-lg` : "bg-slate-50 text-slate-300 group-hover:text-slate-500")}><Icon className="h-5 w-5" /></div>
                             <p className={cn("text-[11px] font-black uppercase tracking-widest", formData.role === id ? `text-${color}-600` : "text-slate-400")}>{label}</p>
                             <p className="text-[10px] font-bold text-slate-300 line-clamp-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">{desc}</p>
                             {formData.role === id && <div className={`absolute top-4 right-4 h-2 w-2 rounded-full bg-${color}-500 animate-pulse`} />}
                           </button>
                        ))}
                      </div>
                   </div>
                   <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">EXTENDED METADATA</Label>
                      <div className="grid gap-5 bg-white p-6 rounded-[28px] shadow-sm border border-slate-100">
                         <div className="flex gap-4">
                            <div className="flex-1 space-y-2"><Label className="text-slate-400 font-bold ml-1">Phone</Label><Input className="h-12 bg-slate-50 border-none rounded-xl font-bold" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
                            <div className="w-1/3 space-y-2"><Label className="text-slate-400 font-bold ml-1">Status</Label><select className="w-full h-12 px-3 bg-slate-50 border-none rounded-xl text-xs font-black text-indigo-600 outline-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}><option value="active">ACTIVE</option><option value="blocked">LOCKED</option></select></div>
                         </div>
                         <div className="space-y-2"><Label className="text-slate-400 font-bold ml-1">Working Address</Label><Input className="h-12 bg-slate-50 border-none rounded-xl font-bold" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} /></div>
                      </div>
                   </div>
                </form>
                <div className="p-10 bg-white border-t border-slate-50">
                  <Button onClick={handleSubmit as any} className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-lg shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="animate-spin" /> : <><CheckCircle2 className="h-6 w-6" /> COMMENCE UPDATE</>}</Button>
                </div>
             </div>
          </SheetContent>
        </Sheet>

        {/* DELETE CONFIRMATION MODAL */}
        {isDelModalOpen && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in transition-all">
              <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                 <div className="p-10 text-center space-y-6">
                    <div className="mx-auto w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center shadow-inner">
                       <AlertTriangle className="h-10 w-10 animate-bounce" />
                    </div>
                    <div className="space-y-2">
                       <h2 className="text-2xl font-black text-slate-900 leading-tight">Xóa vĩnh viễn?</h2>
                       <p className="text-sm font-bold text-slate-400 px-4 leading-relaxed">Bạn đang chuẩn bị xóa định danh <span className="text-rose-500 font-black">{deletingUser?.name}</span>. Hành động này không thể hoàn tác.</p>
                    </div>
                    <div className="flex flex-col gap-3 pt-2">
                       <Button onClick={handleApplyDelete} className="h-14 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black shadow-xl shadow-rose-200" disabled={isSubmitting}>
                          {isSubmitting ? <Loader2 className="animate-spin" /> : 'XÁC NHẬN XÓA BỎ'}
                       </Button>
                       <Button onClick={() => setIsDelModalOpen(false)} variant="ghost" className="h-12 text-slate-400 font-black hover:bg-slate-50 rounded-2xl">
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
