import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const body = await request.json();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const customer = await Customer.findByIdAndUpdate(
      id,
      {
        $set: {
          full_name: body.full_name,
          phone_number: body.phone_number,
          address: body.address,
          city: body.city,
          status: body.status,
          tier: body.tier,
          gender: body.gender,
          adminNote: body.adminNote,
        },
      },
      { new: true, runValidators: true },
    ).lean();

    if (!customer) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

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
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const deleted = await Customer.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error deleting" }, { status: 500 });
  }
}
