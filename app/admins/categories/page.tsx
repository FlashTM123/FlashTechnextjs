"use client";

import { useState, useEffect } from "react";
import { 
  Plus, Search, Edit, Trash2, Package, Layers, 
  AlertCircle, Loader2, CheckCircle2, Globe, Tag,
  Smartphone, Laptop, Tablet, Headphones, Watch, Cpu, Sparkles, LayoutGrid
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/app/context/language-context";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Switch } from "@/components/ui/switch";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  is_active: boolean;
  _count?: {
    products: number;
  };
}

export default function CategoriesPage() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  const initialForm = {
    id: "",
    name: "",
    slug: "",
    icon: "Package",
    description: "",
    is_active: true
  };
  const [formData, setFormData] = useState(initialForm);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories);
      }
    } catch (err) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const url = isEditMode ? `/api/admin/categories/${formData.id}` : "/api/admin/categories";
      const method = isEditMode ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success(isEditMode ? "Tải lại danh mục thành công" : "Đã tạo danh mục mới", {
          icon: <CheckCircle2 className="text-emerald-500" />
        });
        setIsModalOpen(false);
        fetchCategories();
      } else {
        const data = await res.json();
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Connection error");
    } finally {
      setFormLoading(false);
    }
  };

  const openEdit = (cat: Category) => {
    setIsEditMode(true);
    setFormData({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || "Package",
      description: cat.description || "",
      is_active: cat.is_active
    });
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/categories/${categoryToDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Đã xóa danh mục", {
          description: `Danh mục "${categoryToDelete.name}" đã được gỡ bỏ.`
        });
        fetchCategories();
        setDeleteConfirmOpen(false);
      } else {
        const data = await res.json();
        toast.error("Không thể xóa", { description: data.message });
      }
    } catch (err) {
      toast.error("Lỗi hệ thống khi xóa");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName] || Package;
    return <Icon size={20} />;
  };

  const PRESET_ICONS = ["Smartphone", "Laptop", "Tablet", "Watch", "Headphones", "Package", "Cpu", "Layers", "LayoutGrid", "Monitor", "Mouse", "Speaker", "Camera", "Tv", "HardDrive", "Gamepad2"];

  return (
    <div className="p-6 sm:p-10 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Layers className="text-indigo-600 h-10 w-10" />
            {t("categoryManagement")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium ml-1">
            {t("categoryDescription")}
          </p>
        </div>

        <Button
          onClick={() => { setIsEditMode(false); setFormData(initialForm); setIsModalOpen(true); }}
          className="h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/20 active:scale-95 transition-all gap-2"
        >
          <Plus size={20} className="stroke-[3]" />
          <span className="font-bold uppercase tracking-widest text-xs">{t("addCategory")}</span>
        </Button>
      </div>

      <div className="relative group max-w-md">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
          <Search size={20} />
        </div>
        <Input
          className="h-14 pl-12 pr-6 rounded-[24px] bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-base font-medium"
          placeholder={t("searchProduct")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-48 rounded-[32px] bg-slate-100 dark:bg-white/5 animate-pulse" />
          ))
        ) : filteredCategories.map((category) => (
          <div key={category.id} className="group relative bg-white dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-[32px] p-8 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-500">
            <div className="flex items-start justify-between mb-6">
              <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner group-hover:scale-110 transition-transform">
                {getIcon(category.icon)}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => openEdit(category)}
                  className="h-10 w-10 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-600"
                >
                  <Edit size={18} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => { setCategoryToDelete(category); setDeleteConfirmOpen(true); }}
                  className="h-10 w-10 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 uppercase tracking-tight">{category.name}</h3>
                <div className="flex items-center gap-3">
                  <code className="text-[10px] font-mono bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded text-slate-500">{category.slug}</code>
                  <Badge variant={category.is_active ? "default" : "secondary"} className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full ${category.is_active ? "bg-emerald-500" : "bg-slate-400"}`}>
                    {category.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[2.5rem]">
                {category.description || "No description provided."}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                  <Package size={14} />
                  {category._count?.products || 0} Products
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">
                  ID: ...{category.id.slice(-6)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        variant="danger"
        title={t("permanentlyDelete")}
        description={`Bạn đang chuẩn bị xóa danh mục "${categoryToDelete?.name}". Hành động này không thể hoàn tác và chỉ có thể thực hiện nếu không còn sản phẩm nào thuộc danh mục này.`}
        confirmText={t("confirmDelete")}
        cancelText={t("goBack")}
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl rounded-[40px] border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0B] p-0 shadow-2xl overflow-hidden">
          <div className="bg-slate-50/50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5 p-8">
            <DialogHeader>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                  {isEditMode ? <Edit size={24} /> : <Plus size={24} strokeWidth={3} />}
                </div>
                <div className="space-y-0.5">
                  <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    {isEditMode ? t("editCategory") : t("addCategory")}
                  </DialogTitle>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Database Record Configuration</p>
                </div>
              </div>
            </DialogHeader>
          </div>

          <form onSubmit={handleCreateOrUpdate} className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="uppercase text-[10px] font-black tracking-widest text-slate-500">{t("name")}</Label>
                  <Input 
                    value={formData.name}
                    onChange={e => setFormData({ 
                      ...formData, 
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
                    })}
                    className="h-12 rounded-xl bg-slate-50/50 dark:bg-white/[0.02] border-slate-100 dark:border-white/10 font-bold"
                    placeholder="e.g. Smartphone"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-[10px] font-black tracking-widest text-slate-500">{t("slug")}</Label>
                  <Input 
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    className="h-12 rounded-xl bg-slate-50/50 dark:bg-white/[0.02] border-slate-100 dark:border-white/10 font-mono text-xs"
                    placeholder="smartphone-devices"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="uppercase text-[10px] font-black tracking-widest text-slate-500 flex justify-between">
                  <span>Icon Selection</span>
                  <span className="text-indigo-500 lowercase font-medium">{formData.icon}</span>
                </Label>
                <div className="grid grid-cols-8 gap-2 p-4 bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-slate-100 dark:border-white/10 h-32 overflow-y-auto custom-scrollbar">
                  {PRESET_ICONS.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`h-10 w-10 flex items-center justify-center rounded-lg transition-all ${
                        formData.icon === icon 
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 scale-110" 
                        : "hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-slate-400"
                      }`}
                    >
                      {(LucideIcons as any)[icon] ? (LucideIcons as any)[icon]({ size: 18 }) : <Package size={18} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="uppercase text-[10px] font-black tracking-widest text-slate-500">{t("description")}</Label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full h-24 p-4 rounded-xl bg-slate-50/50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/10 focus:ring-4 focus:ring-indigo-500/10 font-medium text-sm transition-all outline-none resize-none"
                  placeholder="Short description of this category..."
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-2xl border border-indigo-100 dark:border-indigo-500/10">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{t("active")}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-tight">Show category on storefront</p>
                </div>
                <Switch 
                  checked={formData.is_active}
                  onCheckedChange={checked => setFormData({ ...formData, is_active: checked })}
                />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="submit"
                disabled={formLoading}
                className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-500/20 transition-all gap-2"
              >
                {formLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                {isEditMode ? t("saveChanges") : t("addCategory")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
