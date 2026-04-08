import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/product-card";
import { FilterSidebar } from "@/components/storefront/filter-sidebar";
import { Sparkles, PackageSearch } from "lucide-react";
import { CategoryType } from "@prisma/client";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const { category, brand, sort, minPrice, maxPrice, search } = params;

  // 1. Fetch filter options (Brands & Categories)
  const brands = await prisma.brands.findMany({
    select: { id: true, name: true }
  });

  const categories = Object.values(CategoryType);

  // 2. Build Prisma Query
  const where: any = { is_active: true };

  if (category) {
    where.category = category as CategoryType;
  }

  if (brand) {
    where.brand_id = brand;
  }

  if (minPrice || maxPrice) {
    where.base_price = {
      ...(minPrice && { gte: parseFloat(minPrice) }),
      ...(maxPrice && { lte: parseFloat(maxPrice) }),
    };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } }
    ];
  }

  // Sorting
  const orderBy: any = {};
  if (sort === "price-asc") {
    orderBy.base_price = "asc";
  } else if (sort === "price-desc") {
    orderBy.base_price = "desc";
  } else {
    orderBy.created_at = "desc";
  }

  // 3. Fetch Products
  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      brand: {
        select: { name: true }
      }
    }
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] transition-colors">
      {/* Header Section */}
      <section className="pt-32 pb-20 border-b border-slate-100 dark:border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(circle_at_20%_30%,#4f46e5_0,transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col gap-4 max-w-3xl">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 w-fit">
                <Sparkles size={12} className="fill-current" />
                Khám phá công nghệ mới
             </div>
             <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-4 duration-1000">
                Tất cả <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600 dark:from-indigo-400 dark:to-fuchsia-400">sản phẩm</span>.
             </h1>
             <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-4">
                Duyệt qua bộ sưu tập thiết bị cao cấp được FlashTech tuyển chọn kỹ lưỡng để nâng tầm cuộc sống số của bạn.
             </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
             <div className="sticky top-32">
                <FilterSidebar categories={categories} brands={brands} />
             </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
             {products.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {products.map((product) => (
                    <div key={product.id} className="animate-in fade-in zoom-in-95 duration-700">
                       <ProductCard product={product} />
                    </div>
                  ))}
               </div>
             ) : (
               <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 bg-slate-50 dark:bg-white/[0.02] rounded-[60px] border border-dashed border-slate-200 dark:border-white/10">
                  <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-300 dark:text-slate-700">
                     <PackageSearch size={40} />
                  </div>
                  <div className="max-w-xs">
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Không tìm thấy sản phẩm</h3>
                     <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                        Hiện không có sản phẩm nào phù hợp với bộ lọc của bạn. Thử thay đổi các tiêu chí lọc.
                     </p>
                  </div>
               </div>
             )}
          </div>
        </div>
      </section>
    </div>
  );
}
