import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, phone, address, role, status } = body;

    const update: any = {};
    if (name     !== undefined) update.name         = name;
    if (phone    !== undefined) update.phone_number = phone;
    if (address  !== undefined) update.address      = address;
    if (role     !== undefined) update.role         = role;
    if (status   !== undefined) update.isBlocked    = status === "blocked";

    const user = await prisma.user.update({
      where: { id },
      data: update,
    });

    return NextResponse.json({
      id:       user.id,
      name:     user.name,
      email:    user.email,
      phone:    user.phone_number || "",
      address:  user.address || "",
      role:     user.role,
      status:   user.isBlocked ? "blocked" : "active",
      joinDate: new Date(user.createdAt).toISOString().split("T")[0],
    });
  } catch (error) {
    console.error("PATCH /api/admin/users/[id] error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/admin/users/[id] error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
