import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const brands = await prisma.brands.findMany({
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(brands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, logo, description, website, social_links } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and Slug are required" },
        { status: 400 }
      );
    }

    const newBrand = await prisma.brands.create({
      data: {
        name,
        slug,
        logo: logo || "https://github.com/shadcn.png",
        description: description || "",
        website: website || "",
        social_links: social_links || "",
      },
    });

    return NextResponse.json(newBrand, { status: 201 });
  } catch (error: any) {
    console.error("Error creating brand:", error);
    return NextResponse.json(
      { error: "Failed to create brand: " + error.message },
      { status: 500 }
    );
  }
}
