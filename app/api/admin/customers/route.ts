import { NextRequest, NextResponse } from "next/server";
import { $Enums, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const tier = searchParams.get("tier") || "all";
    const status = searchParams.get("status") || "all";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const where: Prisma.CustomerWhereInput = {};
    if (search) {
      where.OR = [
        { full_name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { customer_id: { contains: search, mode: "insensitive" } },
      ];
    }
    if (tier !== "all") where.tier = tier as $Enums.CustomerTier;
    if (status !== "all") where.status = status as $Enums.CustomerStatus;

    const [total, customers] = await Promise.all([
      prisma.customer.count({ where }),
      prisma.customer.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const serialized = customers.map((c) => ({
      id: c.id,
      customer_id: c.customer_id,
      full_name: c.full_name,
      email: c.email,
      phone_number: c.phone_number || "",
      address: c.address || "",
      city: c.city || "",
      gender: c.gender,
      tier: c.tier,
      status: c.status,
      points: c.points,
      isVerified: c.isVerified,
      adminNote: c.adminNote || "",
      joinDate: new Date(c.createdAt).toISOString().split("T")[0],
    }));

    return NextResponse.json({
      customers: serialized,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
