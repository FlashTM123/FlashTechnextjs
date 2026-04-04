import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/storefront/product-details";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) return { title: "Không tìm thấy sản phẩm" };
  
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, description: true }
  });

  if (!product) return { title: "Không tìm thấy sản phẩm" };

  return {
    title: `${product.name} | FlashTechStore`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  if (!slug) notFound();

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      variants: {
        orderBy: {
          price: "asc"
        }
      }
    }
  });

  if (!product || !product.is_active) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] pb-32">
      {/* Breadcrumbs Navigation */}
      <div className="bg-slate-50/50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5 py-3 mb-12">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <Link href="/" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5 group">
              <Home size={12} className="group-hover:scale-110 transition-transform" />
              Trang chủ
            </Link>
            <ChevronRight size={10} className="opacity-50" />
            <Link href="/products" className="hover:text-indigo-600 transition-colors">
              Sản phẩm
            </Link>
            <ChevronRight size={10} className="opacity-50" />
            <div className="text-indigo-600 dark:text-indigo-400 max-w-[200px] truncate">
              {product.name}
            </div>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <ProductDetails product={product} />
      </div>
    </div>
  );
}
