import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // 1. Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { message: "Vui lòng nhập đầy đủ email và mật khẩu" },
        { status: 400 }
      );
    }

    // 2. Find customer in DB
    const customer = await prisma.customer.findUnique({
      where: { email },
    });

    // 3. Verify existence and match password
    if (!customer || !(await comparePassword(password, customer.password))) {
      return NextResponse.json(
        { message: "Thông tin đăng nhập không chính xác. Vui lòng thử lại." },
        { status: 401 }
      );
    }

    // 4. Check account status
    if (customer.status === "BLOCKED") {
      return NextResponse.json(
        { message: "Tài khoản của bạn đã bị tạm khóa. Vui lòng liên hệ hỗ trợ." },
        { status: 403 }
      );
    }

    // 5. Update last login
    await prisma.customer.update({
      where: { id: customer.id },
      data: { lastLogin: new Date() }
    });

    // 6. Success response (exclude password)
    const { password: _, ...customerWithoutPassword } = customer;

    // We use a simplified session token for now (localStorage strategy)
    return NextResponse.json({
      message: "Đăng nhập thành công!",
      customer: customerWithoutPassword,
      token: "flashtech-customer-active",
    });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Lỗi kết nối cơ sở dữ liệu. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
