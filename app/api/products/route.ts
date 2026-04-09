import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. LẤY DANH SÁCH SẢN PHẨM (Hỗ trợ Search & Limit)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    const where: any = { is_active: true };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        brand: true,
        variants: true,
      },
      orderBy: { created_at: "desc" },
      take: limit,
    });
    return NextResponse.json(products);
  } catch (error: any) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// 2. THÊM SẢN PHẨM MỚI (Sử dụng category_id ObjectID)
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { 
      name, slug, description, details, base_price, original_price, images, 
      brand_id, category_id, specs, variants, is_active, is_featured 
    } = data;

    if (!name || !slug || !brand_id || !category_id) {
      return NextResponse.json({ error: "Missing required fields (name, slug, brand, category_id)" }, { status: 400 });
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
        category_id,
        specs: specs || {},
        is_active: is_active !== undefined ? is_active : true,
        is_featured: is_featured !== undefined ? is_featured : false,
        variants: {
          create: (variants || []).map((v: any) => ({
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
