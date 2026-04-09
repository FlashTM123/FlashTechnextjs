import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Fetch Categories Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, icon, description, is_active } = body;

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        icon: icon || "Package",
        description,
        is_active: is_active ?? true,
      },
    });

    return NextResponse.json({ category });
  } catch (error: any) {
    console.error("Create Category Error:", error);
    if (error.code === 'P2002') {
        return NextResponse.json({ message: "Slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
