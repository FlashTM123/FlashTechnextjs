import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await request.json();
    const { id } = await params;

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        full_name: body.full_name,
        phone_number: body.phone_number,
        address: body.address,
        city: body.city,
        status: body.status,
        tier: body.tier,
        gender: body.gender,
        adminNote: body.adminNote,
      },
    });

    return NextResponse.json({ message: "Updated", customer });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error updating" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.customer.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error deleting" }, { status: 500 });
  }
}
