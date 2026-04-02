import { NextResponse } from "next/server";

// ĐÂY LÀ NƠI BẠN SẼ GẮN API KEY CỦA GEMINI HOẶC GPT
// (Tạm thời mình sẽ trả về mô tả mẫu vô cùng chuyên nghiệp dựa trên tên sản phẩm)

export async function POST(request: Request) {
  try {
    const { name, brand, category, type, variant } = await request.json();

    if (!name && type !== 'sku') return NextResponse.json({ error: "Product name is required" }, { status: 400 });

    // Giả lập độ trễ AI suy nghĩ
    await new Promise(resolve => setTimeout(resolve, 800));

    if (type === 'details') {
      const mockAIDetails = `
### 🧠 Hiệu năng đột phá
${name} được trang bị vi xử lý thế hệ mới, tối ưu hóa cho mọi tác vụ từ làm việc chuyên nghiệp đến giải trí đỉnh cao. Khả năng đa nhiệm mượt mà nhờ sự kết hợp hoàn hảo giữa phần cứng và phần mềm.

### 📱 Màn hình rực rỡ
Trải nghiệm thị giác sống động với độ phân giải siêu nét, dải màu rộng và độ sáng ấn tượng. Công nghệ bảo vệ mắt giúp bạn thoải mái sử dụng trong thời gian dài.

### 🔋 Năng lượng bền bỉ
Hệ thống quản lý điện năng thông minh cho phép bạn duy trì kết nối suốt cả ngày dài. Tích hợp sạc nhanh tiên tiến, tiết kiệm tối đa thời gian chờ đợi.

### 🛡️ Độ bền & Thiết kế
Chế tác từ vật liệu cao cấp, ${name} không chỉ đẹp mắt mà còn vô cùng bền bỉ, chống trầy xước và va đập hiệu quả.
      `.trim();
      return NextResponse.json({ details: mockAIDetails });
    }

    if (type === 'sku') {
      const b = (brand || "TECH").substring(0, 3).toUpperCase();
      const n = (name || "PROD").substring(0, 3).toUpperCase();
      const r = (variant?.ram || "X").replace(/GB/gi, "");
      const s = (variant?.storage || "Y").replace(/GB/gi, "");
      const c = (variant?.color || "COL").substring(0, 2).toUpperCase();
      const random = Math.floor(1000 + Math.random() * 9000);
      
      const generatedSKU = `${b}-${n}-${r}${s}-${c}-${random}`;
      return NextResponse.json({ sku: generatedSKU });
    }

    // Default: Description
    const mockAIDescription = `
🚀 Khám phá sức mạnh vượt trội của ${brand || ""} ${name}! 

${name} mang đến trải nghiệm đỉnh cao với thiết kế tinh xảo và hiệu năng mạnh mẽ. 
Sở hữu những công nghệ tiên tiến nhất trong phân khúc ${category?.toLowerCase() || "công nghệ"}, 
đây là sự lựa chọn hoàn hảo cho người dùng yêu thích sự sáng tạo và năng suất.

🌟 Điểm nổi bật:
- Thiết kế hiện đại, sang trọng với chất liệu cao cấp.
- Hiệu năng xử lý tối ưu, đa nhiệm mượt mà.
- Thời lượng pin ấn tượng, hỗ trợ sạc nhanh siêu tốc.
- Hệ thống camera chuyên nghiệp, lưu giữ mọi khoảnh khắc sắc nét.

Nâng tầm cuộc sống của bạn ngay hôm nay cùng ${name}!
    `.trim();

    return NextResponse.json({ description: mockAIDescription });
  } catch (error) {
    return NextResponse.json({ error: "AI failed to generate content" }, { status: 500 });
  }
}
