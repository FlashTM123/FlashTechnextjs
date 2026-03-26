import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // 1. Kiểm tra đầu vào cơ bản
    if (!email || !password) {
      return NextResponse.json(
        { message: "Vui lòng nhập đầy đủ Email và Mật khẩu" },
        { status: 400 }
      );
    }

    // 2. Tìm kiếm người dùng trong MongoDB bằng Prisma
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 3. Kiểm tra sự tồn tại và so khớp mật khẩu
    // Lưu ý: Hiện tại đang dùng so sánh chuỗi trực tiếp (Plain text), 
    // trong thực tế bạn nên dùng bcrypt để mã hóa mật khẩu.
    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: "Tài khoản hoặc mật khẩu không chính xác" },
        { status: 401 }
      );
    }

    // 4. Kiểm tra trạng thái tài khoản (Có bị Admin khóa hay không)
    if (user.isBlocked) {
      return NextResponse.json(
        { message: "Tài khoản của bạn đã bị tạm khóa. Vui lòng liên hệ quản trị viên." },
        { status: 403 }
      );
    }

    // 5. Chuẩn bị dữ liệu trả về (Loại bỏ mật khẩu để an toàn)
    const { password: _, ...userWithoutPassword } = user;

    // 6. Trả về thông tin đăng nhập thành công
    return NextResponse.json({
      user: {
        id: userWithoutPassword.id,
        name: userWithoutPassword.name,
        email: userWithoutPassword.email,
        role: userWithoutPassword.role,
        avatar: userWithoutPassword.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${userWithoutPassword.name}`,
      },
      token: "realbase-session-active", // Có thể thay bằng JWT thực nếu cần
    });

  } catch (error) {
    console.error("Critical Login error:", error);
    return NextResponse.json(
      { message: "Lỗi kết nối cơ sở dữ liệu. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
