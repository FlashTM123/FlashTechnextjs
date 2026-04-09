import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { name, slug, icon, description, is_active } = body;

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
  } catch (error) {
    console.error("Update Category Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

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
  } catch (error) {
    console.error("Delete Category Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
