"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Search, MoreVertical, Edit, Trash2, Globe, Link as LinkIcon, AlertCircle, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/app/context/language-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  website: string;
  is_active: boolean;
  social_links: any;
  created_at: string;
}

export default function BrandsPage() {
  const { t } = useLanguage();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    slug: "",
    logo: "",
    description: "",
    website: "",
    is_active: true,
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/brands");
      if (res.ok) {
        const data = await res.json();
        console.log("Raw Brands Data from DB:", data); // Kiểm tra chính xác ID từ MongoDB
        
        const mappedData = data.map((b: any) => {
          // Lấy ID từ id hoặc _id (xử lý cả trường hợp _id là object $oid)
          const finalId = b.id || b._id?.toString() || (typeof b._id === 'object' ? b._id.$oid : b._id) || "";
          return {
            ...b,
            id: finalId
          };
        });
        setBrands(mappedData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");

    try {
      const url = isEditMode ? `/api/brands/${formData.id}` : "/api/brands";
      const method = isEditMode ? "PATCH" : "POST";

      // Re-structure body to remove id/is_active on POST
      const body = isEditMode 
        ? formData 
        : { 
            name: formData.name, 
            slug: formData.slug, 
            logo: formData.logo, 
            description: formData.description, 
            website: formData.website 
          };

      console.log("Submitting Brand Data:", { url, method, body });

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      console.log("Response Status:", res.status);

      const data = await res.json();

      if (res.ok) {
        setIsAddSheetOpen(false);
        setFormData({ id: "", name: "", slug: "", logo: "", description: "", website: "", is_active: true });
        setIsEditMode(false);
        fetchBrands();
      } else {
        const errorMsg = data.error || "Failed to process brand";
        setError(errorMsg);
        alert(errorMsg);
      }
    } catch (err: any) {
      setError("An unexpected error occurred");
      alert("Error: " + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditClick = (brand: Brand) => {
    setIsEditMode(true);
    setFormData({
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      logo: brand.logo || "",
      description: brand.description || "",
      website: brand.website || "",
      is_active: brand.is_active,
    });
    setIsAddSheetOpen(true);
  };

  const handleDeleteClick = async (id: string, name: string) => {
    console.log("Clicked Delete for ID:", id, "Name:", name);
    if (!confirm(`Are you sure you want to permanently delete brand: ${name}?`)) return;

    try {
      const res = await fetch(`/api/brands/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchBrands();
      } else {
        const errorData = await res.json();
        alert("Failed to delete brand: " + (errorData.error || "Unknown Error"));
      }
    } catch (err: any) {
      alert("Error deleting brand: " + err.message);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    try {
      setFormLoading(true);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        const { url } = await res.json();
        setFormData(prev => ({ ...prev, logo: url }));
      } else {
        alert("Failed to upload image");
      }
    } catch (err) {
      alert("Error uploading image");
    } finally {
      setFormLoading(false);
    }
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    brand.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
            {t("brandManagement")}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Manage your product brands, vendors, and their details.
          </p>
        </div>

        <Button 
          id="add-brand-trigger" 
          onClick={() => {
            setIsEditMode(false);
            setFormData({ id: "", name: "", slug: "", logo: "", description: "", website: "", is_active: true });
            setIsAddSheetOpen(true);
          }}
          className="h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/20 active:scale-95 transition-all gap-2"
        >
          <Plus size={20} strokeWidth={2.5} />
          <span className="font-bold uppercase tracking-widest text-xs hidden sm:inline-block">
            {t("addBrand")}
          </span>
        </Button>

        <Dialog open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
          <DialogContent className="w-full sm:max-w-md border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0B] overflow-y-auto rounded-[32px]">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-2xl font-black">{isEditMode ? "Edit Brand" : t("addBrand")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateOrUpdate} className="space-y-6">
              {error && (
                <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl flex items-center gap-3">
                  <AlertCircle className="text-rose-500 h-5 w-5" />
                  <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{error}</p>
                </div>
              )}
              <div className="space-y-2">
                <Label className="uppercase text-[10px] font-black tracking-widest text-slate-500">{t("name")}</Label>
                <Input 
                  value={formData.name}
                  onChange={e => {
                    const newName = e.target.value;
                    const newSlug = isEditMode ? formData.slug : newName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    setFormData({...formData, name: newName, slug: newSlug});
                  }}
                  className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 focus-visible:ring-indigo-500" 
                  placeholder="e.g. Apple"
                  required
                />
              </div>
              {!isEditMode && (
                <div className="space-y-2">
                  <Label className="uppercase text-[10px] font-black tracking-widest text-slate-500">{t("slug")}</Label>
                  <Input 
                    value={formData.slug}
                    onChange={e => setFormData({...formData, slug: e.target.value})}
                    className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 focus-visible:ring-indigo-500" 
                    placeholder="e.g. apple"
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label className="uppercase text-[10px] font-black tracking-widest text-slate-500">Website</Label>
                <Input 
                  value={formData.website}
                  onChange={e => setFormData({...formData, website: e.target.value})}
                  className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 focus-visible:ring-indigo-500" 
                  placeholder="https://apple.com"
                />
              </div>
              <div className="space-y-2">
                <Label className="uppercase text-[10px] font-black tracking-widest text-slate-500">Logo URL or Upload</Label>
                <div className="flex gap-4 items-center">
                  <div className="flex-1 flex gap-2">
                    <Input 
                      value={formData.logo}
                      onChange={e => setFormData({...formData, logo: e.target.value})}
                      className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 focus-visible:ring-indigo-500 flex-1" 
                      placeholder="https://example.com/logo.png"
                    />
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                    <Button type="button" onClick={() => fileInputRef.current?.click()} variant="outline" className="h-12 w-12 rounded-xl border-slate-200 dark:border-white/10 shrink-0 p-0 text-slate-600 dark:text-slate-300">
                      <Upload size={18} />
                    </Button>
                  </div>
                  {formData.logo && (
                    <div className="h-12 w-12 rounded-xl border border-slate-200 dark:border-white/10 p-1 flex items-center justify-center bg-white dark:bg-black/20 shrink-0">
                      <img src={formData.logo} alt="Preview" className="max-h-full max-w-full object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    </div>
                  )}
                </div>
              </div>
              
              {isEditMode && (
                <div className="space-y-2">
                  <Label className="uppercase text-[10px] font-black tracking-widest text-slate-500">Status</Label>
                  <select
                    className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus-visible:ring-indigo-500 font-medium text-slate-900 dark:text-white"
                    value={formData.is_active ? "true" : "false"}
                    onChange={e => setFormData({...formData, is_active: e.target.value === "true"})}
                  >
                    <option value="true">{t("active")}</option>
                    <option value="false">{t("inactive")}</option>
                  </select>
                </div>
              )}
              <div className="space-y-2">
                <Label className="uppercase text-[10px] font-black tracking-widest text-slate-500">Description</Label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full min-h-[120px] p-4 text-sm rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-medium text-slate-900 dark:text-white"
                  placeholder="Write a short description..."
                ></textarea>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-200 dark:border-white/10">
                <Button 
                  type="submit"
                  disabled={formLoading} 
                  className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/20 text-sm font-black uppercase tracking-widest disabled:opacity-70"
                >
                  {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {formLoading ? "Saving..." : isEditMode ? "Update Brand" : "Save Brand"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-8 max-w-md group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
        <Input 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("searchBrands")}
          className="h-14 pl-12 pr-4 w-full bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-2xl shadow-sm focus-visible:ring-4 focus-visible:ring-indigo-500/10 font-bold text-slate-900 dark:text-white"
        />
      </div>

      <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#0A0A0B]/50 backdrop-blur-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
                <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px] text-slate-500">{t("name")}</th>
                <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px] text-slate-500">Links</th>
                <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px] text-slate-500">{t("status")}</th>
                <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px] text-slate-500 text-right">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-slate-500 font-bold">
                    <div className="h-6 w-6 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                    Loading brands...
                  </td>
                </tr>
              ) : filteredBrands.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-slate-500 font-bold">
                    No brands found matching your search.
                  </td>
                </tr>
              ) : (
                filteredBrands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black p-2 shadow-sm flex items-center justify-center relative overflow-hidden group-hover:shadow-md transition-all">
                          {brand.logo ? (
                            <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                          ) : (
                            <span className="font-bold text-slate-300">N/A</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-base">{brand.name}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><LinkIcon size={12}/>{brand.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {brand.website ? (
                        <a href={brand.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-500 hover:text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-colors">
                          <Globe size={14} /> View Web
                        </a>
                      ) : (
                        <span className="text-slate-400 text-xs">No Site</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {brand.is_active ? (
                        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-full font-bold px-3 py-1">
                          {t("active")}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 rounded-full font-bold px-3 py-1">
                          {t("inactive")}
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-100 group-hover:opacity-100 transition-opacity">
                        <Button onClick={() => handleEditClick(brand)} variant="ghost" size="icon" className="h-9 w-9 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl text-slate-600 dark:text-slate-300">
                          <Edit size={16} />
                        </Button>
                        <Button onClick={() => handleDeleteClick(brand.id, brand.name)} variant="ghost" size="icon" className="h-9 w-9 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 rounded-xl text-rose-600 dark:text-rose-400">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
