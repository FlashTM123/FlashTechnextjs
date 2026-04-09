import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, icon, description, is_active } = body;

    if (!id) {
        return NextResponse.json({ message: "Missing ID" }, { status: 400 });
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        icon,
        description,
        is_active,
      },
    });

    return NextResponse.json({ category });
  } catch (error: any) {
    console.error("Update Category Error:", error);
    return NextResponse.json({ message: "Server error: " + error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
        return NextResponse.json({ message: "Missing ID" }, { status: 400 });
    }

    // Check if category has products
    const productCount = await prisma.product.count({
      where: { category_id: id }
    });

    if (productCount > 0) {
      return NextResponse.json({ 
        message: "Cannot delete category with associated products. Move the products first." 
      }, { status: 400 });
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error: any) {
    console.error("Delete Category Error:", error);
    return NextResponse.json({ message: "Server error: " + error.message }, { status: 500 });
  }
}
