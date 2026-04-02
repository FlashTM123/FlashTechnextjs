import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    const { base64, filename } = formData;

    if (!base64) {
      return NextResponse.json({ error: "No image data provided" }, { status: 400 });
    }

    // Xử lý dữ liệu Base64
    const buffer = Buffer.from(base64.split(",")[1], "base64");
    const ext = path.extname(filename) || ".png";
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const newFilename = `${uniqueSuffix}${ext}`;
    
    // Đảm bảo thư mục tồn tại
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, newFilename);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${newFilename}`;
    return NextResponse.json({ url: fileUrl });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Upload failed: " + error.message }, { status: 500 });
  }
}
