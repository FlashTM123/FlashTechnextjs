import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * A simple GET endpoint to verify current customer session.
 * In a real production environment with JWT/NextAuth, this would 
 * decode the cookie/token. For this localStorage strategy, 
 * this serves as a data refresh endpoint.
 */
export async function GET(request: NextRequest) {
  try {
    const customerId = request.nextUrl.searchParams.get("id");

    if (!customerId) {
      return NextResponse.json({ message: "No session found" }, { status: 401 });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer || customer.status === "BLOCKED") {
      return NextResponse.json({ message: "Invalid session" }, { status: 401 });
    }

    const { password: _, ...customerWithoutPassword } = customer;

    return NextResponse.json({
      customer: customerWithoutPassword,
    });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, full_name, phone_number, address, city, gender, avatar } = body;

    if (!id) {
       return NextResponse.json({ message: "No ID provided" }, { status: 400 });
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        ...(full_name && { full_name }),
        ...(phone_number !== undefined && { phone_number }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(gender && { gender }),
        ...(avatar !== undefined && { avatar }),
      }
    });

    const { password: _, ...customerWithoutPassword } = updatedCustomer;

    return NextResponse.json({
      message: "Cập nhật thành công",
      customer: customerWithoutPassword,
    });

  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
