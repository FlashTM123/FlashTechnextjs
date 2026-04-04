import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. LẤY DANH SÁCH SẢN PHẨM (Category đã là Enum)
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        brand: true,
        variants: true,
      },
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(products);
  } catch (error: any) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// 2. THÊM SẢN PHẨM MỚI (Dùng Category dưới dạng Enum)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, slug, description, details, base_price, original_price, images, 
      brand_id, category, specs, variants, is_active, is_featured 
    } = body;

    if (!name || !slug || !brand_id || !category) {
      return NextResponse.json({ error: "Missing required fields (name, slug, brand, category)" }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        details,
        base_price: parseFloat(base_price),
        original_price: original_price ? parseFloat(original_price) : null,
        images,
        brand_id,
        category, // Gán trực tiếp giá trị Enum như 'SMARTPHONE'
        specs: specs || {},
        is_active: is_active !== undefined ? is_active : true,
        is_featured: is_featured !== undefined ? is_featured : false,
        variants: {
          create: variants.map((v: any) => ({
            name: v.name,
            sku: v.sku,
            color: v.color,
            storage: v.storage,
            ram: v.ram,
            price: parseFloat(v.price),
            original_price: v.original_price ? parseFloat(v.original_price) : null,
            stock: parseInt(v.stock),
            images: v.images || [],
            specs: v.specs || {},
          }))
        }
      },
      include: {
        variants: true
      }
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: "Failed to create product: " + error.message }, { status: 500 });
  }
}
