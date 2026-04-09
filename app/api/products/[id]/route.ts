import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. SỬA SẢN PHẨM & BIẾN THỂ (Sử dụng category_id ObjectID)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const { 
      name, slug, description, details, base_price, original_price, images, 
      brand_id, category_id, specs, variants, is_active, is_featured
    } = data;

    if (!id || id === "undefined") {
      return NextResponse.json({ error: "No valid ID found" }, { status: 400 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
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
          deleteMany: {}, // Đồng bộ danh sách biến thể
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
      include: { variants: true }
    });

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error("PATCH /api/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to update product: " + error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete: " + error.message }, { status: 500 });
  }
}
