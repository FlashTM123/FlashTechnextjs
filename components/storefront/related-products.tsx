import { ProductCard } from "./product-card";

interface RelatedProductsProps {
  products: any[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-24 border-t border-slate-100 dark:border-white/5">
      <div className="space-y-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
            Sản phẩm <span className="text-indigo-600">tương tự</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
            Khám phá những lựa chọn công nghệ khác cùng phân khúc có thể bạn sẽ quan tâm.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
