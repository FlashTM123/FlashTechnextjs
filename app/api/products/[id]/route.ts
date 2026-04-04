import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. SỬA SẢN PHẨM & BIẾN THỂ (Category là Enum)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id: routeId } = resolvedParams;

    // Phân tích URL nếu params bị lỗi
    const url = new URL(request.url);
    const manualId = url.pathname.split('/').pop();
    const id = (routeId && routeId !== "undefined") ? routeId : manualId;

    const body = await request.json();
    const { 
      name, slug, description, details, base_price, original_price, images, 
      brand_id, category, specs, variants, is_active, is_featured
    } = body;

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
        category, // Trực tiếp lưu giá trị Enum
        specs: specs || {},
        is_active: is_active !== undefined ? is_active : true,
        is_featured: is_featured !== undefined ? is_featured : false,
        variants: {
          deleteMany: {}, // Đồng bộ danh sách biến thể
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
    const resolvedParams = await params;
    const id = resolvedParams.id;

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
