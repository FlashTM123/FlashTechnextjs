import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/storefront/hero";
import { CategoryBar } from "@/components/storefront/category-bar";
import { ProductGrid } from "@/components/storefront/product-grid";

export default async function StorefrontHome() {
  // Fetch latest products from Prisma
  const latestProducts = await prisma.product.findMany({
    where: { is_active: true },
    include: {
      brand: {
        select: { name: true }
      }
    },
    orderBy: { created_at: "desc" },
    take: 8
  });

  // Fetch featured products (those marked as is_featured)
  const featuredProducts = await prisma.product.findMany({
    where: { 
      is_active: true,
      is_featured: true
    },
    include: {
      brand: {
        select: { name: true }
      }
    },
    take: 4
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <CategoryBar />
      
      {/* Featured Selection */}
      <ProductGrid 
        title="Bộ Sưu Tập Tiêu Điểm"
        subtitle="Những thiết bị được các chuyên gia của chúng tôi đánh giá cao nhất về hiệu năng và thiết kế."
        products={featuredProducts.length > 0 ? featuredProducts : latestProducts.slice(4, 8)}
        limit={4}
      />

      {/* New Arrivals */}
      <ProductGrid 
        title="Sản Phẩm Mới"
        subtitle="Cập nhật những công nghệ mới nhất vừa cập bến tại FlashTech."
        products={latestProducts}
        limit={8}
      />

      {/* Extra Marketing Section */}
      <section className="py-24 bg-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl space-y-6">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
              Sẵn Sàng Cho Bước Nhảy Vọt Về Công Nghệ?
            </h2>
            <p className="text-indigo-100 text-lg font-medium">
              Đăng ký nhận bản tin để không bỏ lỡ những đợt giảm giá độc quyền và thông báo về các sản phẩm giới hạn.
            </p>
          </div>
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
             <input 
               type="email" 
               placeholder="Địa chỉ email của bạn" 
               className="h-14 px-8 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50 min-w-[300px]"
             />
             <button className="h-14 px-10 rounded-full bg-white text-indigo-600 font-bold hover:bg-slate-100 transition-all active:scale-95 shadow-xl">
               Đăng Ký Ngay
             </button>
          </div>
        </div>
      </section>
    </div>
  );
}
