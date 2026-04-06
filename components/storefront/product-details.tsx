"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  ShoppingCart, 
  Sparkles, 
  Star, 
  Heart, 
  ShieldCheck, 
  RotateCcw, 
  Truck, 
  Zap, 
  Cpu, 
  Smartphone, 
  CheckCircle2, 
  Package, 
  ArrowRight,
  Globe,
  Layers,
  Box,
  ChevronRight,
  Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SpecsTable } from "./specs-table";
import { useRouter } from "next/navigation";
import { useCart, CartItem } from "@/app/context/cart-context";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Variant {
  id: string;
  name: string;
  sku: string;
  price: number;
  original_price: number | null;
  stock: number;
  color: string | null;
  storage: string | null;
  ram: string | null;
  images: string[];
  specs: any;
}

interface ProductDetailsProps {
  product: any;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants?.length > 0 ? product.variants[0] : null
  );
  
  const [activeImage, setActiveImage] = useState(
    selectedVariant?.images?.[0] || product.images?.[0] || ""
  );

  const [quantity, setQuantity] = useState(1);
  const [isLiking, setIsLiking] = useState(false);
  const buyBoxRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);

  // Scroll detection for sticky bar
  useEffect(() => {
    const handleScroll = () => {
      if (buyBoxRef.current) {
        const rect = buyBoxRef.current.getBoundingClientRect();
        setShowSticky(rect.top + rect.height < 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync active image when variant changes
  useEffect(() => {
    if (selectedVariant?.images?.[0]) {
      setActiveImage(selectedVariant.images[0]);
    } else if (product.images?.[0]) {
       setActiveImage(product.images[0]);
    }
  }, [selectedVariant, product.images]);

  const currentPrice = selectedVariant ? selectedVariant.price : product.base_price;
  const originalPrice = selectedVariant ? selectedVariant.original_price : product.original_price;
  const hasDiscount = originalPrice && originalPrice > currentPrice;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  const formatPrice = (price: number) => 
    new Intl.NumberFormat("vi-VN", {
      style : "currency",
      currency : "VND",
    }).format(price);

  const variantsByColor = useMemo(() => {
    const map = new Map<string, Variant[]>();
    product.variants?.forEach((v: Variant) => {
      const color = v.color || "Default";
      if (!map.has(color)) map.set(color, []);
      map.get(color)!.push(v);
    });
    return map;
  }, [product.variants]);

  const colors = Array.from(variantsByColor.keys());
  
  const currentAvailableStorages = useMemo(() => {
    if (!selectedVariant) return [];
    // Note: if color is null, we treat as "Default"
    const groupKey = selectedVariant.color || "Default";
    return (variantsByColor.get(groupKey) || []).sort((a,b) => a.price - b.price);
  }, [selectedVariant, variantsByColor]);

  // Robust Labeling Helper
  const getVariantLabel = (v: Variant) => {
     if (v.storage && v.ram) return `${v.storage} / ${v.ram} RAM`;
     if (v.storage) return v.storage;
     if (v.ram) return `${v.ram} RAM`;
     // Fallback to name but remove the product name prefix if possible
     return v.name;
  };

  // Robust Specs Fetching (fallback handle for {})
  const activeSpecs = useMemo(() => {
    const vSpecs = selectedVariant?.specs;
    if (vSpecs && Object.keys(vSpecs).length > 0) return vSpecs;
    const pSpecs = product.specs;
    if (pSpecs && Object.keys(pSpecs).length > 0) return pSpecs;
    return {};
  }, [selectedVariant, product.specs]);

  // Extract Top 4 highlights
  const highlights = useMemo(() => {
    if (!activeSpecs || Object.keys(activeSpecs).length === 0) return [];
    const keys = Object.keys(activeSpecs);
    const priorities = ["Vi xử lý", "CPU", "RAM", "Màn hình", "Dung lượng", "Camera"];
    const found = priorities.filter(p => keys.some(k => k.toLowerCase().includes(p.toLowerCase())));
    const finalKeys = Array.from(new Set([...found, ...keys])).slice(0, 4);
    
    return finalKeys.map(k => {
       const keyInSpecs = keys.find(specKey => specKey === k || specKey.toLowerCase().includes(k.toLowerCase()));
       return { 
          label: keyInSpecs, 
          value: activeSpecs[keyInSpecs!] 
       };
    }).filter(h => h.value);
  }, [activeSpecs]);

  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    if (!selectedVariant && product.variants?.length > 0) {
      toast.error("Vui lòng chọn phiên bản sản phẩm");
      return;
    }

    const cartItem: CartItem = {
      id: `${product.id}-${selectedVariant?.id || 'base'}`,
      productId: product.id,
      variantId: selectedVariant?.id || null,
      name: product.name,
      variantName: selectedVariant ? getVariantLabel(selectedVariant) : null,
      image: activeImage,
      price: currentPrice,
      quantity: quantity
    };

    addToCart(cartItem);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart"); // Redirect to cart first to review, or /checkout directly
  };

  return (
    <div className="relative">
      
      {/* 🏙️ Luxury Sticky Bar */}
      <AnimatePresence>
        {showSticky && (
          <motion.div 
             initial={{ y: -100, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             exit={{ y: -100, opacity: 0 }}
             className="fixed top-[70px] inset-x-0 z-[49] bg-white/90 dark:bg-black/90 backdrop-blur-3xl border-b border-slate-100 dark:border-white/5 hidden md:block"
          >
             <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                      <Image src={activeImage} alt="sticky-thumb" fill sizes="40px" className="object-contain" />
                   </div>
                   <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{product.name}</h4>
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{selectedVariant?.storage || "Tiêu chuẩn"}</p>
                   </div>
                </div>

                <div className="flex items-center gap-8">
                   <p className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">{formatPrice(currentPrice)}</p>
                   <Button onClick={handleAddToCart} size="sm" className="rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-6">
                      Thêm vào giỏ
                   </Button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-32 pb-32">
        
        {/* --- Main Section: Balanced 60/40 Split --- */}
        <div ref={buyBoxRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start pt-8">
          
          {/* Professional Gallery (Left) */}
          <div className="space-y-6 lg:sticky lg:top-32">
             <div className="aspect-square relative rounded-[40px] bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/10 overflow-hidden flex items-center justify-center p-8 md:p-12">
                <AnimatePresence mode="wait">
                   <motion.div
                      key={activeImage}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="relative w-full h-full"
                   >
                      <Image
                        src={activeImage || "/placeholder.png"}
                        alt={product.name}
                        fill
                        priority
                        className="object-contain drop-shadow-xl"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                   </motion.div>
                </AnimatePresence>

                {/* Overlays */}
                <div className="absolute top-8 left-8 flex flex-col gap-2">
                   {hasDiscount && (
                      <Badge className="bg-rose-500 text-white font-black px-3 py-1 rounded-lg">-{discountPercent}%</Badge>
                   )}
                   {product.is_featured && (
                      <Badge className="bg-amber-400 text-slate-900 font-black px-3 py-1 rounded-lg flex items-center gap-1.5"><Sparkles size={12} /> Hot</Badge>
                   )}
                </div>

                <Button 
                   onClick={() => setIsLiking(!isLiking)}
                   variant="ghost" 
                   size="icon" 
                   className={cn(
                      "absolute top-8 right-8 w-12 h-12 rounded-full border bg-white/50 dark:bg-black/50 backdrop-blur-md transition-all active:scale-95",
                      isLiking ? "text-rose-500 border-rose-500/20 bg-rose-500/10" : "border-white/20 text-slate-400"
                   )}
                >
                   <Heart size={20} fill={isLiking ? "currentColor" : "none"} />
                </Button>
             </div>

             {/* Discrete Thumbnails */}
             <div className="flex flex-wrap gap-4 justify-center">
                {(selectedVariant?.images || product.images || []).map((img : string, i : number) => (
                   <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={cn(
                         "relative w-20 h-20 rounded-2xl border-2 overflow-hidden bg-slate-50 dark:bg-white/5 transition-all p-1",
                         activeImage === img ? "border-slate-900 dark:border-white scale-105" : "border-transparent opacity-60 hover:opacity-100"
                      )}
                   >
                      <Image src={img} alt="thumb" fill sizes="80px" className="object-contain p-2" />
                   </button>
                ))}
             </div>
          </div>

          {/* High-End Information Area (Right) */}
          <div className="space-y-12">
             
             {/* Product Brand & Rating */}
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">{product.brand?.name}</span>
                   <div className="h-3 w-px bg-slate-200 dark:bg-white/10" />
                   <div className="flex items-center gap-1 text-amber-500">
                      <Star size={14} fill="currentColor" />
                      <span className="text-xs font-black text-slate-900 dark:text-white">4.9 / 5.0</span>
                   </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                   {product.name}
                </h1>
                
                <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                   {product.description}
                </p>
             </div>

             {/* Pricing & Stock Card */}
             <div className="p-8 rounded-[32px] bg-white dark:bg-white/[0.03] border border-slate-100 dark:border-white/10 shadow-lg shadow-black/[0.02]">
                <div className="flex flex-wrap items-end justify-between gap-6">
                   <div className="space-y-1">
                      {hasDiscount && (
                         <div className="flex items-center gap-3">
                            <span className="text-lg text-slate-400 line-through decoration-rose-500/30">{formatPrice(originalPrice!)}</span>
                         </div>
                      )}
                      <div className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter flex items-baseline gap-2">
                         {formatPrice(currentPrice)}
                         <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">vnd</span>
                      </div>
                   </div>

                   <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      <CheckCircle2 size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest leading-none">Sẵn kho: {selectedVariant?.stock || 0} SP</span>
                   </div>
                </div>
             </div>

             {/* Data-Driven Key Highlights --- */}
             {highlights.length > 0 && (
                <div className="grid grid-cols-2 gap-4 p-6 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                   {highlights.map((h, i) => (
                      <div key={i} className="flex gap-4 items-start group">
                         <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                            {h.label?.toLowerCase().includes('vi xử lý') || h.label?.toLowerCase().includes('chip') ? <Cpu size={18} /> : <Settings size={18} />}
                         </div>
                         <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{h.label}</p>
                            <p className="text-[11px] font-black text-slate-900 dark:text-white leading-tight line-clamp-2">{h.value}</p>
                         </div>
                      </div>
                   ))}
                </div>
             )}

             {/* Clean Configuration Sections */}
             <div className="space-y-10">
                {colors.length > 0 && colors[0] !== "Default" && (
                   <div className="space-y-5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Màu sắc thịnh hành</label>
                      <div className="flex flex-wrap gap-4">
                         {colors.map(color => (
                            <button
                               key={color}
                               onClick={() => setSelectedVariant(variantsByColor.get(color)![0])}
                               className={cn(
                                  "group relative w-12 h-12 rounded-full p-1 border-2 transition-all hover:scale-110",
                                  selectedVariant?.color === color ? "border-slate-900 dark:border-white ring-4 ring-slate-900/5 dark:ring-white/5" : "border-slate-100 dark:border-white/10"
                               )}
                            >
                               <div className="w-full h-full rounded-full shadow-inner" style={{ backgroundColor: color.toLowerCase() }} />
                               {selectedVariant?.color === color && (
                                  <motion.div layoutId="lux-color" className="absolute -bottom-3 left-1/2 -px-1 bg-slate-900 dark:bg-white w-1 h-1 rounded-full" />
                               )}
                            </button>
                         ))}
                      </div>
                   </div>
                )}

                <div className="space-y-5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tùy chọn cấu hình</label>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentAvailableStorages.map(v => {
                         const isActive = selectedVariant?.id === v.id;
                         return (
                            <button
                               key={v.id}
                               onClick={() => setSelectedVariant(v)}
                               className={cn(
                                  "flex items-center justify-between p-5 rounded-2xl border-2 transition-all group",
                                  isActive ? "border-slate-900 dark:border-white bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl" : "border-slate-100 dark:border-white/5 hover:border-slate-200"
                               )}
                            >
                               <div className="text-left">
                                  <p className="text-sm font-black tracking-tight">{getVariantLabel(v)}</p>
                                  <p className={cn("text-[10px] font-bold uppercase tracking-wider", isActive ? "opacity-70" : "text-slate-400")}>{formatPrice(v.price)}</p>
                               </div>
                               {isActive && <CheckCircle2 size={16} />}
                            </button>
                         )
                      })}
                   </div>
                </div>
             </div>

             {/* Direct Action Stack */}
             <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-100 dark:border-white/10">
                <div className="flex items-center bg-slate-50 dark:bg-white/5 rounded-2xl h-14 px-3 border border-slate-100 dark:border-white/10 min-w-[130px] justify-between">
                   <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-lg hover:bg-white dark:hover:bg-white/5 flex items-center justify-center font-bold text-xl transition-all">-</button>
                   <span className="text-lg font-black">{quantity}</span>
                   <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-lg hover:bg-white dark:hover:bg-white/5 flex items-center justify-center font-bold text-xl transition-all">+</button>
                </div>
                
                <Button onClick={handleAddToCart} className="flex-1 h-14 rounded-2xl bg-white dark:bg-black border-2 border-slate-900 dark:border-white text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                   <ShoppingCart size={18} className="mr-3" /> Thêm vào giỏ
                </Button>
                
                <Button onClick={handleBuyNow} className="flex-1 h-14 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs uppercase tracking-widest hover:opacity-90 shadow-xl transition-all">
                   Mua ngay <ArrowRight size={18} className="ml-3" />
                </Button>
             </div>

             {/* Small Trust Matrix */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
                {[
                   { icon: ShieldCheck, label: "Bảo hành 12th" },
                   { icon: RotateCcw, label: "Đổi trả 1-1" },
                   { icon: Truck, label: "Miễn phí ship" },
                   { icon: Zap, label: "Hàng chuẩn" },
                ].map((item, i) => (
                   <div key={i} className="flex flex-col items-center gap-2">
                      <div className="text-slate-400 group-hover:text-slate-900 transition-colors"><item.icon size={18} /></div>
                      <span className="text-[10px] font-bold uppercase tracking-tight text-slate-400">{item.label}</span>
                   </div>
                ))}
             </div>
          </div>
        </div>

        {/* --- Content Area: Defined Clarity --- */}
        <div className="space-y-32">
           
           {/* Section 1: Detailed Storytelling */}
           <section className="space-y-12">
              <div className="flex flex-col items-center text-center space-y-4">
                 <div className="flex items-center gap-2 text-indigo-500 font-black text-[10px] uppercase tracking-[0.3em]">
                    <Sparkles size={14} /> Expert Analysis
                 </div>
                 <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Trải nghiệm đỉnh cao</h2>
                 <div className="h-1.5 w-12 bg-slate-900 dark:bg-white rounded-full" />
              </div>

              <div className="max-w-4xl mx-auto rounded-[40px] bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 p-8 md:p-16 shadow-xl shadow-black/[0.02]">
                 {product.details ? (
                   <div className="prose prose-slate dark:prose-invert max-w-none 
                      prose-h2 : text-3xl prose-h2 : font-black prose-h2 : tracking-tight prose-h2 : mb-8
                      prose-h3 : text-xl prose-h3 : font-black prose-h3 : mt-12
                      prose-p : text-base prose-p : font-medium prose-p : leading-relaxed prose-p : text-slate-600 dark:prose-p : text-slate-400
                      prose-strong : text-slate-900 dark:prose-strong : text-white prose-strong : font-black
                      prose-img : rounded-3xl prose-img : shadow-xl prose-img : border prose-img : border-slate-100 dark:prose-img : border-white/5">
                      <div dangerouslySetInnerHTML={{ __html: product.details }} />
                   </div>
                 ) : (
                   <div className="py-24 flex flex-col items-center justify-center gap-6 text-slate-200 dark:text-white/5">
                      <Box size={80} strokeWidth={1} className="animate-pulse" />
                      <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Dữ liệu đánh giá đang được cập nhật</p>
                   </div>
                 )}
              </div>
           </section>

           {/* Section 2: Technical Specifications Bento Grid (Standardized) */}
           <section className="space-y-12">
              <div className="flex items-end justify-between border-b border-slate-100 dark:border-white/10 pb-8">
                 <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">
                       <Layers size={14} /> Complete Specs
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Thông số kỹ thuật</h2>
                 </div>
                 <div className="hidden sm:flex text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 py-1.5 rounded-lg border border-slate-100 dark:border-white/5">
                    {product.category} PRO Series
                 </div>
              </div>

              <div className="relative">
                 <SpecsTable specs={activeSpecs} />
              </div>
           </section>

           {/* Section 3: Clean User Reviews Block */}
           <section className="space-y-12">
              <div className="flex items-center gap-6">
                 <h3 className="text-lg font-black tracking-widest text-slate-900 dark:text-white uppercase">Cộng đồng FlashTech</h3>
                 <div className="h-px bg-slate-100 dark:bg-white/10 flex-1" />
              </div>

              <div className="py-24 rounded-[40px] bg-slate-50 dark:bg-white/[0.01] border border-dashed border-slate-200 dark:border-white/5 flex flex-col items-center justify-center gap-8">
                 <div className="w-20 h-20 rounded-3xl bg-white dark:bg-white/5 shadow-sm flex items-center justify-center text-slate-300 dark:text-white/10">
                    <Star size={32} />
                 </div>
                 <p className="text-sm font-black uppercase tracking-widest text-slate-400">Chia sẻ niềm vui sở hữu siêu phẩm này</p>
                 <Button variant="outline" className="h-12 px-10 rounded-xl border-slate-900 dark:border-white font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all">Gửi nhận xét</Button>
              </div>
           </section>

        </div>
      </div>
    </div>
  );
}
