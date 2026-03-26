import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const role   = searchParams.get("role")   || "all";
    const status = searchParams.get("status") || "all";
    const page   = parseInt(searchParams.get("page")  || "1",  10);
    const limit  = parseInt(searchParams.get("limit") || "10", 10);

    // Build Prisma query
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name:  { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role !== "all") {
      where.role = role;
    }

    if (status === "active")  where.isBlocked = false;
    if (status === "blocked") where.isBlocked = true;

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // Map Prisma Model sang Frontend data format
    const serialized = users.map((u) => ({
      id:       u.id,
      name:     u.name,
      email:    u.email,
      phone:    u.phone_number || "",
      address:  u.address || "",
      role:     u.role,
      status:   u.isBlocked ? "blocked" : "active",
      avatar:   "", // Bạn có thể thêm avatar vào schema sau nếu cần
      joinDate: new Date(u.createdAt).toISOString().split("T")[0],
    }));

    return NextResponse.json({
      users: serialized,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone, address, role, status } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email and password are required" }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password, // Lưu ý: Nên hash password trước khi lưu
        phone_number: phone || "",
        address: address || "",
        role: role || "USER",
        isBlocked: status === "blocked",
      },
    });

    return NextResponse.json({
      id:       user.id,
      name:     user.name,
      email:    user.email,
      role:     user.role,
      status:   user.isBlocked ? "blocked" : "active",
      joinDate: user.createdAt.toISOString().split("T")[0],
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/users error:", error);
    return NextResponse.json({ message: "Error creating user" }, { status: 500 });
  }
}
