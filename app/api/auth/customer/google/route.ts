import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "@/lib/prisma";
import { generateCustomerId, hashPassword } from "@/lib/auth-utils";
import crypto from "crypto";

// Change this to your real Client ID in .env
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function POST(request: NextRequest) {
  try {
    const { credential } = await request.json();

    if (!credential) {
      return NextResponse.json({ message: "No credential provided" }, { status: 400 });
    }

    // 1. Verify Google ID Token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return NextResponse.json({ message: "Invalid token payload" }, { status: 400 });
    }

    const { email, name, picture, sub: googleId } = payload;

    // 2. Find or Create Customer
    let customer = await prisma.customer.findUnique({
      where: { email },
    });

    if (!customer) {
      // Create new customer for Google Login
      const customerId = await generateCustomerId();
      
      // Generate a random high-entropy password since it's required by schema
      const randomPassword = crypto.randomBytes(32).toString("hex");
      const hashedPassword = await hashPassword(randomPassword);

      customer = await prisma.customer.create({
        data: {
          customer_id: customerId,
          full_name: name || "Google User",
          email: email,
          password: hashedPassword,
          avatar: picture || "https://github.com/shadcn.png",
          status: "ACTIVE",
          isVerified: true, // Google accounts are pre-verified
          tier: "BRONZE",
          points: 0,
        },
      });
    } else {
      // Update existing customer info from Google if necessary
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          lastLogin: new Date(),
          // Don't overwrite existing avatar if user uploaded their own, 
          // but if it's the default, we can sync with Google.
          avatar: customer.avatar?.includes("github.com/shadcn.png") ? picture : customer.avatar,
        }
      });
    }

    // 3. Success response
    const { password: _, ...customerWithoutPassword } = customer;

    return NextResponse.json({
      message: "Đăng nhập Google thành công!",
      customer: customerWithoutPassword,
      token: "flashtech-google-session-active",
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    return NextResponse.json(
      { message: "Xác thực Google thất bại. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
