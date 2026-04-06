import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateCustomerId } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  try {
    const { full_name, email, password } = await request.json();

    // 1. Basic validation
    if (!full_name || !email || !password) {
      return NextResponse.json(
        { message: "Vui lòng nhập đầy đủ họ tên, email và mật khẩu" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Mật khẩu phải có ít nhất 6 ký tự" },
        { status: 400 }
      );
    }

    // 2. Check if customer already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { email },
    });

    if (existingCustomer) {
      return NextResponse.json(
        { message: "Email này đã được đăng ký. Vui lòng đăng nhập." },
        { status: 400 }
      );
    }

    // 3. Generate secure Customer ID & hash password
    const customerId = await generateCustomerId();
    const hashedPassword = await hashPassword(password);

    // 4. Create customer in DB
    const customer = await prisma.customer.create({
      data: {
        customer_id: customerId,
        full_name,
        email,
        password: hashedPassword,
        status: "ACTIVE",
        tier: "BRONZE",
        points: 0,
      },
    });

    // 5. Success response (exclude password)
    const { password: _, ...customerWithoutPassword } = customer;

    return NextResponse.json({
      message: "Đăng ký tài khoản thành công!",
      customer: customerWithoutPassword,
    });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
