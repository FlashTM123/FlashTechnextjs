import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Manual ID extraction fallback
    const url = new URL(request.url);
    const manualId = url.pathname.split('/').pop();
    const id = (params.id && params.id !== "undefined") ? params.id : manualId;
    
    console.log("Extracted PATCH ID:", id);

    const json = await request.json();
    const { name, slug, logo, description, website, is_active, social_links } = json;

    if (!id || id === "undefined") {
      return NextResponse.json({ error: "No valid ID found in request" }, { status: 400 });
    }

    const brand = await prisma.brands.update({
      where: { id },
      data: {
        name,
        slug,
        logo: logo || "https://github.com/shadcn.png",
        description: description || "",
        website: website || "",
        social_links: social_links || "",
        is_active: is_active ?? true,
      },
    });

    return NextResponse.json(brand);
  } catch (error: any) {
    console.error("PATCH /api/brands/[id] error:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A brand with this slug already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error: " + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Manual ID extraction fallback
    const url = new URL(request.url);
    const manualId = url.pathname.split('/').pop();
    const id = (params.id && params.id !== "undefined") ? params.id : manualId;

    console.log("Extracted DELETE ID:", id);

    if (!id || id === "undefined" || id === "") {
      return NextResponse.json({ error: "Invalid Brand ID provided" }, { status: 400 });
    }

    await prisma.brands.delete({
      where: { id },
    });

    console.log("Successfully deleted brand:", id);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("DELETE /api/brands/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete from database: " + error.message },
      { status: 500 }
    );
  }
}
