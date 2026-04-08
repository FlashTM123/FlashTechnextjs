import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. LẤY TẤT CẢ ĐÁNH GIÁ (Admin Only)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const reviews = await prisma.review.findMany({
      where: {
        OR: [
          { product: { name: { contains: search, mode: "insensitive" } } },
          { customer: { full_name: { contains: search, mode: "insensitive" } } },
          { customer: { email: { contains: search, mode: "insensitive" } } },
        ]
      },
      include: {
        customer: {
          select: {
            id: true,
            full_name: true,
            avatar: true,
            email: true,
          }
        },
        product: {
          select: {
            id: true,
            name: true,
            images: true,
            slug: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(reviews);
  } catch (error: any) {
    console.error("GET /api/admin/reviews error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// 2. XÓA ĐÁNH GIÁ (Admin Moderation)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    await prisma.review.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/admin/reviews error:", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
