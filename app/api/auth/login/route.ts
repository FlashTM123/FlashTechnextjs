import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Mock user database - Replace with real authentication
    const mockUsers: Record<
      string,
      { id: string; email: string; name: string; password: string; avatar?: string }
    > = {
      "admin@flashtech.com": {
        id: "1",
        email: "admin@flashtech.com",
        name: "Admin User",
        password: "password",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
      },
    };

    const user = mockUsers[email];

    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Remove password before sending to client
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      token: "mock-jwt-token", // In production, generate a real JWT
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
