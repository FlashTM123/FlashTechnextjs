"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Filter, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FilterSidebarProps {
  categories: { id: string; name: string }[];
  brands: { id: string; name: string }[];
}

const SORT_OPTIONS = [
  { label: "Mới nhất", value: "newest" },
  { label: "Giá: Thấp đến Cao", value: "price-asc" },
  { label: "Giá: Cao đến Thấp", value: "price-desc" },
];

const PRICE_RANGES = [
  { label: "Dưới 5tr", min: 0, max: 5000000 },
  { label: "5tr - 15tr", min: 5000000, max: 15000000 },
  { label: "15tr - 30tr", min: 15000000, max: 30000000 },
  { label: "Trên 30tr", min: 30000000, max: 1000000000 },
];

export function FilterSidebar({ categories, brands }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams.get("category");
  const currentBrand = searchParams.get("brand");
  const currentSort = searchParams.get("sort") || "newest";
  const currentMinPrice = searchParams.get("minPrice");
  const currentMaxPrice = searchParams.get("maxPrice");

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.push(`/products?${params.toString()}`, { scroll: false });
    });
  };

  const clearFilters = () => {
    router.push("/products");
  };

  return (
    <div className="space-y-10">
      {/* Active Filters Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
          <Filter size={14} /> Bộ lọc
        </h3>
        {(currentCategory || currentBrand || currentMinPrice) && (
          <button 
            onClick={clearFilters}
            className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {/* Sorting Dropdown (Mobile visible / Desktop Integrated) */}
      <div className="space-y-4">
        <Label>Sắp xếp theo</Label>
        <DropdownMenu>
          <DropdownMenuTrigger className={cn(buttonVariants({ variant: "outline" }), "w-full justify-between h-12 rounded-2xl border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 font-bold")}>
            {SORT_OPTIONS.find(o => o.value === currentSort)?.label}
            <ChevronDown size={14} className="opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 rounded-2xl border-slate-100 dark:border-white/5 shadow-xl">
            {SORT_OPTIONS.map((opt) => (
              <DropdownMenuItem 
                key={opt.value}
                onClick={() => updateFilters({ sort: opt.value })}
                className="rounded-xl font-bold text-xs py-3 flex justify-between items-center"
              >
                {opt.label}
                {currentSort === opt.value && <Check size={14} className="text-indigo-600" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Categories */}
      <div className="space-y-5">
        <Label>Danh mục</Label>
        <div className="flex flex-wrap lg:flex-col gap-2">
          {categories.map((cat) => (
            <FilterButton
              key={cat.id}
              active={currentCategory === cat.id}
              onClick={() => updateFilters({ category: currentCategory === cat.id ? null : cat.id })}
            >
              {cat.name}
            </FilterButton>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="space-y-5">
        <Label>Thương hiệu</Label>
        <div className="flex flex-wrap lg:flex-col gap-2">
          {brands.map((brand) => (
            <FilterButton
              key={brand.id}
              active={currentBrand === brand.id}
              onClick={() => updateFilters({ brand: currentBrand === brand.id ? null : brand.id })}
            >
              {brand.name}
            </FilterButton>
          ))}
        </div>
      </div>

      {/* Price Ranges */}
      <div className="space-y-5">
        <Label>Khoảng giá</Label>
        <div className="flex flex-wrap lg:flex-col gap-2">
          {PRICE_RANGES.map((range) => {
            const isActive = currentMinPrice === range.min.toString() && currentMaxPrice === range.max.toString();
            return (
              <FilterButton
                key={range.label}
                active={isActive}
                onClick={() => updateFilters({ 
                  minPrice: isActive ? null : range.min.toString(),
                  maxPrice: isActive ? null : range.max.toString()
                })}
              >
                {range.label}
              </FilterButton>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 ml-1">
      {children}
    </h4>
  );
}

function FilterButton({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-between group",
        active 
          ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
          : "bg-white dark:bg-white/[0.02] border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-indigo-600/30 dark:hover:border-indigo-400/30"
      )}
    >
      {children}
      {active && <X size={12} className="ml-2" />}
    </button>
  );
}
