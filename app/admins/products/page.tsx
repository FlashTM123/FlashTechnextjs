"use client";

import { useState, useEffect } from "react";
import { Plus, Search, MoreVertical, Edit, Trash2, Package, Globe, Tag, Layers, AlertCircle, Loader2, Coins, Archive, Smartphone, Laptop, Tablet, Headphones, Watch, Cpu, Sparkles, Upload, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/app/context/language-context";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface Brand {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Variant {
  id?: string;
  name: string;
  sku: string;
  price: string;
  original_price: string;
  stock: string;
  color: string;
  storage: string;
  ram: string;
  images: string[];
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  details?: string;
  base_price: number;
  original_price?: number;
  images: string[];
  brand_id: string;
  category: string;
  specs?: Record<string, string>;
  is_active: boolean;
  brand: Brand;
  variants: Variant[];
}

export default function ProductsPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [isGeneratingDetails, setIsGeneratingDetails] = useState(false);
  const [generatingSKUIndex, setGeneratingSKUIndex] = useState<number | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const CATEGORY_TYPES = [
    { label: "Smartphone", value: "SMARTPHONE", icon: Smartphone },
    { label: "Laptop", value: "LAPTOP", icon: Laptop },
    { label: "Tablet", value: "TABLET", icon: Tablet },
    { label: "Watch", value: "SMARTWATCH", icon: Watch },
    { label: "Audio", value: "AUDIO", icon: Headphones },
    { label: "Accessories", value: "ACCESSORIES", icon: Package },
    { label: "Component", value: "COMPONENT", icon: Cpu },
    { label: "Other", value: "OTHER", icon: Layers },
  ];

  const initialFormData = {
    id: "",
    name: "",
    slug: "",
    description: "",
    details: "",
    base_price: "",
    original_price: "",
    images: [] as string[],
    brand_id: "",
    category: "SMARTPHONE",
    specs: {} as Record<string, string>,
    is_active: true,
    variants: [{
      name: "", sku: "", price: "", original_price: "", stock: "0",
      color: "", storage: "", ram: "", images: []
    }] as Variant[]
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pRes, bRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/brands")
      ]);

      if (pRes.ok) setProducts(await pRes.json());
      if (bRes.ok) setBrands(await bRes.json());
    } finally {
      setLoading(false);
    }
  };

  const handleAddVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { name: "", sku: "", price: "", original_price: "", stock: "0", color: "", storage: "", ram: "", images: [] }]
    });
  };

  const handleRemoveVariant = (index: number) => {
    const list = [...formData.variants];
    list.splice(index, 1);
    setFormData({ ...formData, variants: list });
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: any) => {
    const list = [...formData.variants];
    list[index] = { ...list[index], [field]: value };

    if (field === 'storage' || field === 'ram' || field === 'color') {
      const parts = [];
      if (list[index].ram) parts.push(list[index].ram);
      if (list[index].storage) parts.push(list[index].storage);
      const configStr = parts.join('/');
      list[index].name = `${configStr}${list[index].color ? ` - ${list[index].color}` : ""}`;
    }

    setFormData({ ...formData, variants: list });
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");

    try {
      const url = isEditMode ? `/api/products/${formData.id}` : "/api/products";
      const method = isEditMode ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(isEditMode ? "Cập nhật sản phẩm thành công!" : "Tạo sản phẩm thành công!", {
          description: isEditMode 
            ? `Dữ liệu sản phẩm "${formData.name}" đã được đồng bộ hóa.` 
            : `Sản phẩm "${formData.name}" đã sẵn sàng trên hệ thống.`,
          icon: <Package size={18} className="text-emerald-500" />,
        });
        setIsModalOpen(false);
        fetchData();
      } else {
        const data = await res.json();
        toast.error("Lỗi: " + (data.error || "Không thể xử lý sản phẩm"), {
          description: "Vui lòng kiểm tra lại thông tin biểu mẫu.",
          icon: <AlertCircle size={18} className="text-rose-500" />,
        });
      }
    } catch (err: any) {
      toast.error("Lỗi hệ thống: " + err.message);
      console.error("Submit Error:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    setProductToDelete({ id, name });
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${productToDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Đã gỡ bỏ sản phẩm", {
          description: `Sản phẩm "${productToDelete.name}" đã được xóa hoàn toàn khỏi hệ thống.`,
          icon: <Trash2 size={18} className="text-rose-500" />,
        });
        fetchData();
        setDeleteConfirmOpen(false);
      } else {
        toast.error("Lỗi khi xóa sản phẩm", {
          description: "Yêu cầu xóa không thể hoàn thành, vui lòng thử lại sau.",
        });
      }
    } catch (err) {
      toast.error("Lỗi kết nối máy chủ");
    } finally {
      setIsDeleting(false);
    }
  };

  const openEdit = (product: Product) => {
    setIsEditMode(true);
    setFormData({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      details: product.details || "",
      base_price: product.base_price.toString(),
      original_price: product.original_price?.toString() || "",
      images: product.images,
      brand_id: product.brand_id,
      category: (product as any).category || "SMARTPHONE",
      is_active: product.is_active,
      specs: product.specs || {},
      variants: product.variants.map(v => ({
        ...v,
        price: v.price.toString(),
        original_price: v.original_price?.toString() || "",
        stock: v.stock.toString()
      }))
    });
    setIsModalOpen(true);
  };

  const handleAddSpec = () => {
    setFormData({ ...formData, specs: { ...formData.specs, "": "" } });
  };

  const handleUpdateSpec = (oldKey: string, newKey: string, value: string) => {
    const newSpecs = { ...formData.specs };
    if (oldKey !== newKey) {
      delete newSpecs[oldKey];
    }
    newSpecs[newKey] = value;
    setFormData({ ...formData, specs: newSpecs });
  };

  const handleRemoveSpec = (key: string) => {
    const newSpecs = { ...formData.specs };
    delete newSpecs[key];
    setFormData({ ...formData, specs: newSpecs });
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [newImageUrl, setNewImageUrl] = useState("");

  const handleAddImage = () => {
    if (!newImageUrl) return;
    setFormData({ ...formData, images: [...formData.images, newImageUrl] });
    setNewImageUrl("");
  };

  const handleRemoveImage = (index: number) => {
    const list = [...formData.images];
    list.splice(index, 1);
    setFormData({ ...formData, images: list });
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'variant', index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result as string;
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64, filename: file.name })
        });

        if (res.ok) {
          const { url } = await res.json();
          if (type === 'main') {
            setFormData({ ...formData, images: [...formData.images, url] });
          } else if (type === 'variant' && typeof index === 'number') {
            const list = [...formData.variants];
            list[index].images = [url];
            setFormData({ ...formData, variants: list });
          }
        }
      };
    } finally {
      setIsUploading(false);
    }
  };

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleGenerateAI = async (type: 'description' | 'details' = 'description') => {
    if (!formData.name) {
      toast.warning("Thiếu thông tin", {
        description: "Vui lòng nhập tên sản phẩm trước khi sử dụng AI."
      });
      return;
    }

    if (type === 'description') setIsGeneratingAI(true);
    else setIsGeneratingDetails(true);

    try {
      const brandName = brands.find(b => b.id === formData.brand_id)?.name || "";
      const res = await fetch("/api/ai/description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          brand: brandName,
          category: formData.category,
          type
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (type === 'description') {
          setFormData({ ...formData, description: data.description });
          toast.success("Sáng tạo nội dung hoàn tất", {
            description: `Mô tả cho "${formData.name}" đã được AI tối ưu hóa.`,
            icon: <Sparkles size={18} className="text-indigo-500" />,
          });
        } else {
          setFormData({ ...formData, details: data.details });
          toast.success("Bản đánh giá sẵn sàng", {
            description: `Tech Insight chi tiết đã được tạo bởi AI.`,
            icon: <Globe size={18} className="text-emerald-500" />,
          });
        }
      }
    } catch (err) {
      toast.error("AI không phản hồi");
    } finally {
      setIsGeneratingAI(false);
      setIsGeneratingDetails(false);
    }
  };

  const handleGenerateSKU = async (index: number) => {
    setGeneratingSKUIndex(index);
    try {
      const variant = formData.variants[index];
      const brandName = brands.find(b => b.id === formData.brand_id)?.name || "";
      const res = await fetch("/api/ai/description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          brand: brandName,
          type: 'sku',
          variant
        })
      });

      if (res.ok) {
        const data = await res.json();
        const list = [...formData.variants];
        list[index].sku = data.sku;
        setFormData({ ...formData, variants: list });
      }
    } finally {
      setGeneratingSKUIndex(null);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Package className="text-indigo-600 h-10 w-10" />
            {t("productManagement")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium ml-1">
            {t("manageTechDevices")}
          </p>
        </div>

        <Button
          onClick={() => { setIsEditMode(false); setFormData(initialFormData); setIsModalOpen(true); }}
          className="h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/20 active:scale-95 transition-all gap-2"
        >
          <Plus size={20} className="stroke-[3]" />
          <span className="font-bold uppercase tracking-widest text-xs">{t("addProduct")}</span>
        </Button>
      </div>

      <div className="relative group max-w-2xl">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
          <Search size={20} />
        </div>
        <Input
          className="h-14 pl-12 pr-6 rounded-[24px] bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-base"
          placeholder={t("searchProduct")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-64 rounded-[32px] bg-slate-100 dark:bg-white/5 animate-pulse" />
          ))
        ) : filteredProducts.map((product) => (
          <div key={product.id} className="group relative bg-white dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-[32px] overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-500">
            <div className="aspect-[4/3] bg-slate-100 dark:bg-white/5 relative overflow-hidden">
              {product.images[0] ? (
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <Smartphone size={48} />
                </div>
              )}
              {product.original_price && product.original_price > product.base_price && (
                <div className="absolute top-4 left-4 bg-rose-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black shadow-xl shadow-rose-500/20 z-10 animate-in zoom-in duration-300">
                  -{Math.round(((product.original_price - product.base_price) / product.original_price) * 100)}%
                </div>
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge className="bg-white/90 dark:bg-black/60 backdrop-blur-md text-slate-900 dark:text-white border-0 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">
                  {product.brand?.name || "No Brand"}
                </Badge>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-black tracking-widest text-indigo-500">
                  {t((product as any).category)}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate">{product.name}</h3>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-xl font-black text-slate-900 dark:text-white">
                    {product.base_price.toLocaleString()} VND
                  </div>
                  {product.original_price && product.original_price > product.base_price && (
                    <div className="text-sm font-bold text-slate-400 line-through decoration-rose-500/50">
                      {product.original_price.toLocaleString()} VND
                    </div>
                  )}
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] bg-slate-50 dark:bg-white/5 px-2.5 py-1 rounded-full border border-slate-100 dark:border-white/5">
                  {product.variants?.length || 0} {t("variantTitle")}s
                </div>
              </div>

              <div className="pt-4 flex items-center gap-2 border-t border-slate-100 dark:border-white/5">
                <Button
                  onClick={() => { setPreviewProduct(product); setIsPreviewOpen(true); }}
                  variant="ghost"
                  className="h-11 w-11 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 p-0 transition-all"
                >
                  <Eye size={18} />
                </Button>
                <Button
                  onClick={() => openEdit(product)}
                  className="flex-1 h-11 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white font-bold text-xs gap-2 transition-all"
                >
                  <Edit size={16} /> {t("edit")}
                </Button>
                <Button
                  onClick={() => handleDelete(product.id, product.name)}
                  variant="ghost"
                  className="h-11 w-11 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 p-0 transition-all"
                >
                  <Trash2 size={18} />
                </Button>
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
        title="Xóa vĩnh viễn sản phẩm?"
        description={`Hành động này không thể hoàn tác. Sản phẩm "${productToDelete?.name}" và tất cả biến thể liên quan sẽ bị loại bỏ hoàn toàn khỏi cơ sở dữ liệu.`}
        confirmText="Xác nhận xóa"
        cancelText="Để tôi xem lại"
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[90vw] md:max-w-6xl max-h-[92vh] overflow-y-auto rounded-[40px] border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0B] p-0 shadow-2xl">
          <div className="sticky top-0 z-20 bg-white/80 dark:bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 p-8">
            <DialogHeader>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                  {isEditMode ? <Edit size={24} /> : <Plus size={24} strokeWidth={3} />}
                </div>
                <div className="space-y-0.5">
                  <DialogTitle className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    {isEditMode ? t("editProduct") : t("newProduct")}
                  </DialogTitle>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Synchronization Active</p>
                </div>
              </div>
            </DialogHeader>
          </div>

          <form onSubmit={handleCreateOrUpdate} className="p-8 space-y-12">
            {error && (
              <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-2xl flex items-center gap-3">
                <AlertCircle className="text-rose-600 h-5 w-5" />
                <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
                <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Tag size={18} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight">Basic Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="uppercase text-[10px] font-black tracking-widest text-slate-500">{t("name")}</Label>
                      <Input
                        value={formData.name}
                        onChange={e => setFormData({
                          ...formData,
                          name: e.target.value,
                          slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                        })}
                        className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10 focus:ring-4 focus:ring-indigo-500/10 font-bold transition-all"
                        placeholder="e.g. iPhone 16 Pro Max"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="uppercase text-[10px] font-black tracking-widest text-slate-500">{t("slug")}</Label>
                      {!isEditMode ? (
                        <Input
                          value={formData.slug}
                          onChange={e => setFormData({ ...formData, slug: e.target.value })}
                          className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10 font-medium"
                          placeholder="iphone-16-pro-max"
                          required
                        />
                      ) : (
                        <div className="h-12 flex items-center px-4 bg-slate-100 dark:bg-white/5 rounded-xl text-slate-500 font-mono text-xs">{formData.slug}</div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="uppercase text-[10px] font-black tracking-widest text-slate-500">{t("brand")}</Label>
                      <Select
                        value={formData.brand_id}
                        onValueChange={(v: string | null) => v && setFormData({ ...formData, brand_id: v })}
                      >
                        <SelectTrigger className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10">
                          <SelectValue placeholder={t("selectBrand")}>
                            {brands.find(b => b.id === formData.brand_id)?.name || ""}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100 dark:border-white/10 shadow-2xl">
                          {brands.map(b => (
                            <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="uppercase text-[10px] font-black tracking-widest text-slate-500">{t("category")}</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(v: string | null) => v && setFormData({ ...formData, category: v })}
                      >
                        <SelectTrigger className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10">
                          <SelectValue placeholder={t("selectCategory")}>
                            {t(formData.category) || ""}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100 dark:border-white/10 shadow-2xl">
                          {CATEGORY_TYPES.map(c => (
                            <SelectItem key={c.value} value={c.value}>
                              <div className="flex items-center gap-2">
                                <c.icon size={14} className="text-indigo-500" />
                                {t(c.value)}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2 sm:col-span-1 grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="uppercase text-[10px] font-black tracking-widest text-indigo-500">{t("price")}</Label>
                        <div className="relative">
                          <Coins className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-indigo-500" />
                          <Input
                            type="number"
                            value={formData.base_price}
                            onChange={e => setFormData({ ...formData, base_price: e.target.value })}
                            className="h-12 pl-7 rounded-xl bg-indigo-50 dark:bg-indigo-500/5 border-indigo-100 dark:border-indigo-500/20 text-sm font-black text-indigo-600 dark:text-indigo-400"
                            placeholder="999.000"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2 text-right">
                        <Label className="uppercase text-[10px] font-black tracking-widest text-slate-400">{t("originalPrice")}</Label>
                        <Input
                          type="number"
                          value={formData.original_price}
                          onChange={e => setFormData({ ...formData, original_price: e.target.value })}
                          className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10 text-sm font-bold text-slate-400 line-through opacity-70"
                          placeholder="1299"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="uppercase text-[10px] font-black tracking-widest text-slate-500 flex items-center gap-2">
                      <Archive size={12} /> {t("description")}
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleGenerateAI('description')}
                      disabled={isGeneratingAI || !formData.name}
                      className="h-7 px-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all gap-1.5"
                    >
                      {isGeneratingAI ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                      {isGeneratingAI ? "AI Writing..." : t("autoWriteAI")}
                    </Button>
                  </div>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full h-[156px] p-4 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10 focus:ring-4 focus:ring-indigo-500/10 font-medium text-sm outline-none transition-all resize-none shadow-inner"
                    placeholder="Full tech specs or device highlight..."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Cpu size={18} />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight">{t("technicalSpecs")}</h3>
                </div>
                <Button
                  type="button"
                  onClick={handleAddSpec}
                  className="h-9 px-3 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 text-xs font-bold gap-2 transition-all shadow-sm shadow-black/5 text-slate-700 dark:text-slate-300"
                >
                  <Plus size={14} /> {t("addSpec")}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="col-span-full py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] opacity-50 border-2 border-dashed border-slate-50 dark:border-white/5 rounded-[24px]">
                    {t("noSpecsAdded")}
                  </div>
                {Object.entries(formData.specs).map(([key, value], idx) => (
                  <div key={idx} className="group relative flex items-center gap-3 bg-slate-50/50 dark:bg-white/[0.02] p-4 rounded-[24px] border border-slate-100 dark:border-white/5 hover:border-indigo-500/30 transition-all shadow-sm shadow-indigo-500/5">
                    <div className="flex-1 space-y-1">
                      <Input
                        value={key}
                        onChange={(e) => handleUpdateSpec(key, e.target.value, value)}
                        placeholder={t("specName")}
                        className="h-8 text-[9px] font-black uppercase tracking-[0.1em] bg-transparent border-0 border-b border-transparent focus:border-indigo-500 rounded-none p-0 focus:ring-0 text-slate-400 focus:text-indigo-500"
                      />
                      <Input
                        value={value}
                        onChange={(e) => handleUpdateSpec(key, key, e.target.value)}
                        placeholder={t("specValue")}
                        className="h-8 text-xs font-bold bg-transparent border-0 p-0 focus:ring-0 text-slate-900 dark:text-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(key)}
                      className="h-8 w-8 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Smartphone size={18} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight">{t("detailsReview")}</h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <Label className="uppercase text-[10px] font-black tracking-widest text-slate-500 opacity-60">Deep Dive Evaluation & Advanced Tech Insights</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleGenerateAI('details')}
                    disabled={isGeneratingDetails || !formData.name}
                    className="h-7 px-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all gap-1.5"
                  >
                    {isGeneratingDetails ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    AI Review
                  </Button>
                </div>
                <textarea
                  value={formData.details}
                  onChange={e => setFormData({ ...formData, details: e.target.value })}
                  className="w-full min-h-[220px] p-6 rounded-[32px] bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/10 focus:ring-4 focus:ring-indigo-500/10 font-medium text-sm outline-none transition-all shadow-inner leading-relaxed"
                  placeholder="Go deeper... benchmarks, build quality, camera sensor details, or user experience highlights..."
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <Globe size={18} />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight">Product Media / Images</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-4 text-left">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label className="uppercase text-[10px] font-black tracking-widest text-slate-500">Add via URL</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newImageUrl}
                          onChange={e => setNewImageUrl(e.target.value)}
                          className="h-11 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10"
                          placeholder="https://..."
                        />
                        <Button type="button" onClick={handleAddImage} className="h-11 px-4 rounded-xl bg-indigo-600 text-white">
                          <Plus size={20} />
                        </Button>
                      </div>
                    </div>

                    <div className="relative group">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-24 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col gap-2 bg-slate-50/50 hover:bg-indigo-50/50 hover:border-indigo-500/50 transition-all text-slate-400 hover:text-indigo-600"
                      >
                        <Upload size={24} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{isUploading ? "Uploading..." : t("uploadImage")}</span>
                      </Button>
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'main')}
                      />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {formData.images.length === 0 && (
                      <div className="col-span-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-white/5 rounded-2xl text-slate-300">
                        <Smartphone size={32} className="mb-2 opacity-50" />
                        <span className="text-xs font-bold uppercase tracking-widest">No Media Found</span>
                      </div>
                    )}
                    {formData.images.map((url, idx) => (
                      <div key={idx} className="group relative aspect-square rounded-2xl bg-slate-100 dark:bg-white/5 overflow-hidden border border-slate-200 dark:border-white/10">
                        <img src={url} alt={`img-${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="h-8 w-8 rounded-full bg-rose-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        {idx === 0 && (
                          <Badge className="absolute top-2 left-2 bg-indigo-600 text-[8px] font-black border-0 rounded-full h-4 px-1.5 uppercase">Main</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <Layers size={18} />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight">{t("configurationsAndPricing")}</h3>
                </div>
                <Button
                  type="button"
                  onClick={handleAddVariant}
                  className="h-10 px-4 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-indigo-600 hover:text-white text-slate-700 dark:text-slate-300 transition-all font-bold text-xs gap-2"
                >
                  <Plus size={16} /> {t("addVariant")}
                </Button>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {formData.variants.map((variant, index) => (
                  <div key={index} className="group relative p-6 rounded-[32px] border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] hover:border-indigo-500/30 transition-all space-y-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="h-8 px-4 flex items-center bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-indigo-500/20">
                          {t("variantTitle")} {index + 1}
                        </span>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter max-w-[120px] truncate">
                          {variant.name || "UNNAMED CONFIG"}
                        </div>
                      </div>
                      {formData.variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(index)}
                          className="h-8 w-8 rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400">{t("ram")}</Label>
                        <Input
                          value={variant.ram}
                          onChange={(e) => handleVariantChange(index, 'ram', e.target.value)}
                          placeholder="8GB"
                          className="h-10 bg-white dark:bg-black rounded-xl border-slate-200 dark:border-white/10 text-xs font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400">{t("storage")}</Label>
                        <Input
                          value={variant.storage}
                          onChange={(e) => handleVariantChange(index, 'storage', e.target.value)}
                          placeholder="256GB"
                          className="h-10 bg-white dark:bg-black rounded-xl border-slate-200 dark:border-white/10 text-xs font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400">{t("color")}</Label>
                        <Input
                          value={variant.color}
                          onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                          placeholder="Black"
                          className="h-10 bg-white dark:bg-black rounded-xl border-slate-200 dark:border-white/10 text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-indigo-500">{t("price")}</Label>
                        <div className="relative">
                          <Coins className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-indigo-500" />
                          <Input
                            type="number"
                            value={variant.price}
                            onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                            className="h-10 pl-7 bg-indigo-50/50 dark:bg-indigo-500/5 border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-black text-xs"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400">{t("originalPrice")}</Label>
                        <Input
                          type="number"
                          value={variant.original_price}
                          onChange={(e) => handleVariantChange(index, 'original_price', e.target.value)}
                          className="h-10 bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10 text-slate-400 line-through text-xs p-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400">{t("stock")}</Label>
                        <Input
                          type="number"
                          value={variant.stock}
                          onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                          className="h-10 bg-white dark:bg-black rounded-xl border-slate-200 dark:border-white/10 text-sm font-bold"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400">{t("sku")}</Label>
                        <div className="flex gap-2">
                          <Input
                            value={variant.sku}
                            onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                            placeholder="SKU-..."
                            className="h-10 bg-white dark:bg-black rounded-xl border-slate-200 dark:border-white/10 text-xs font-bold flex-1"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => handleGenerateSKU(index)}
                            disabled={generatingSKUIndex === index || !formData.name}
                            className="h-10 w-10 p-0 rounded-xl bg-slate-50 dark:bg-white/5 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all"
                          >
                            {generatingSKUIndex === index ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-indigo-500">{t("colorImage")}</Label>
                        <div className="relative h-10 group overflow-hidden bg-indigo-50/10 border-indigo-200 border-dashed border rounded-xl flex items-center justify-center">
                          {variant.images?.[0] ? (
                            <img src={variant.images[0]} className="h-full w-full object-cover" alt="Preview" />
                          ) : (
                            <Upload size={14} className="text-indigo-500" />
                          )}
                          <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'variant', index)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 dark:border-white/5 sticky bottom-0 bg-white/80 dark:bg-[#0A0A0B]/80 backdrop-blur-xl z-20 pb-8 mt-12">
              <Button
                type="submit"
                disabled={formLoading}
                className={`w-full h-16 rounded-3xl text-white shadow-2xl text-lg font-black uppercase tracking-widest disabled:opacity-50 transition-all flex items-center justify-center gap-3 ${isEditMode
                    ? "bg-gradient-to-r from-emerald-600 to-teal-700 shadow-emerald-500/20"
                    : "bg-gradient-to-r from-indigo-600 to-purple-700 shadow-indigo-500/20"
                  }`}
              >
                {formLoading ? (
                  <Loader2 className="animate-spin h-6 w-6" />
                ) : isEditMode ? (
                  t("saveChanges")
                ) : (
                  t("createProduct")
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-[90vw] md:max-w-4xl max-h-[90vh] overflow-y-auto rounded-[40px] border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0B] p-0 shadow-2xl">
          {previewProduct && (
            <div className="flex flex-col">
              {/* Header Image Section */}
              <div className="relative aspect-video bg-slate-100 dark:bg-white/5 overflow-hidden">
                {previewProduct.images[0] ? (
                  <img src={previewProduct.images[0]} className="w-full h-full object-cover" alt={previewProduct.name} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Smartphone size={120} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
                  <Badge className="bg-indigo-600 border-0 text-[10px] font-black uppercase mb-2">
                    {previewProduct.brand?.name}
                  </Badge>
                  <h2 className="text-4xl font-black tracking-tight">{previewProduct.name}</h2>
                  <div className="flex items-center gap-4 pt-2">
                    <div className="text-2xl font-black">{previewProduct.base_price.toLocaleString()} VND</div>
                    {previewProduct.original_price && (
                      <div className="text-lg font-bold opacity-50 line-through">{previewProduct.original_price.toLocaleString()} VND</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Content Grid */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-12">
                <div className="md:col-span-12 lg:col-span-8 space-y-12">
                  {/* Description */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500">Overview</h3>
                    <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400 font-medium whitespace-pre-wrap">
                      {previewProduct.description}
                    </p>
                  </div>

                  {/* Details / Review */}
                  {previewProduct.details && (
                    <div className="space-y-6 bg-slate-50 dark:bg-white/[0.02] p-8 rounded-[32px] border border-slate-100 dark:border-white/5">
                      <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500">Deep Dive Details</h3>
                      <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {previewProduct.details}
                      </div>
                    </div>
                  )}

                  {/* Variants Grid */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-orange-500">Available Configurations</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {previewProduct.variants.map((v, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 shadow-sm flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="text-xs font-black uppercase tracking-tighter text-slate-400">{v.sku}</div>
                            <div className="font-bold">{v.name}</div>
                            <div className="text-[10px] uppercase font-bold text-slate-500">{v.ram} RAM / {v.storage} Storage</div>
                          </div>
                          <div className="text-right">
                            <div className="font-black text-indigo-500">{Number(v.price).toLocaleString()} VND</div>
                            <div className="text-[10px] font-bold text-emerald-500">{v.stock} in stock</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar Specs */}
                <div className="md:col-span-12 lg:col-span-4 space-y-8">
                  <div className="bg-indigo-600 rounded-[32px] p-6 text-white shadow-xl shadow-indigo-500/20">
                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-80">Tech Specifications</h4>
                    <div className="space-y-4">
                      {Object.entries(previewProduct.specs || {}).map(([k, v], i) => (
                        <div key={i} className="flex flex-col border-b border-white/10 pb-2 last:border-0">
                          <span className="text-[9px] font-bold uppercase opacity-60">{k}</span>
                          <span className="font-black text-sm">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 rounded-[32px] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-center">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Category</p>
                    <Badge className="bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white border-0 px-4 py-1.5 rounded-full uppercase text-[10px] font-black tracking-widest">
                      {t(previewProduct.category)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
