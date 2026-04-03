import { NextResponse } from "next/server";

// ĐÂY LÀ NƠI BẠN SẼ GẮN API KEY CỦA GEMINI HOẶC GPT
// (Tạm thời mình sẽ trả về mô tả mẫu vô cùng chuyên nghiệp dựa trên tên sản phẩm)

export async function POST(request: Request) {
  try {
    const { name, brand, category, type, variant } = await request.json();

    if (!name && type !== 'sku') return NextResponse.json({ error: "Product name is required" }, { status: 400 });

    // Giả lập độ trễ AI suy nghĩ
    await new Promise(resolve => setTimeout(resolve, 800));

    // DYNAMIC CONTENT GENERATOR (CATEGORY AWARE)
    const ram = variant?.ram || "8GB";
    const storage = variant?.storage || "256GB";
    const cpu = variant?.specs?.cpu || "";
    const gpu = variant?.specs?.gpu || "";
    const size = variant?.specs?.size || "";

    // SMART CATEGORY DETECTION (OVERRIDE IF NAME HAS KEYWORDS)
    let effectiveCategory = category;
    const lowerName = name.toLowerCase();
    
    const componentKeywords = ["ram", "ssd", "hdd", "cpu", "gpu", "mainboard", "vga", "psu", "nguồn", "ổ cứng", "bộ nhớ", "linh kiện"];
    const accessoryKeywords = ["chuột", "bàn phím", "mouse", "keyboard", "tai nghe", "headphone", "sạc", "charger", "cáp", "cable", "ốp lưng", "bao da"];

    if (componentKeywords.some(k => lowerName.includes(k))) effectiveCategory = "COMPONENT";
    else if (accessoryKeywords.some(k => lowerName.includes(k))) effectiveCategory = "ACCESSORIES";

    if (type === 'details') {
      let detailsText = "";
      if (effectiveCategory === 'LAPTOP') {
        detailsText = `
### ⚡ Hiệu năng chuyên nghiệp
${name} được trang bị cấu hình cực mạnh ${cpu ? `với vi xử lý ${cpu}` : ""} và ${ram} RAM. Bạn có thể dễ dàng xử lý mọi tác vụ từ render video 4K, lập trình đến chơi các tựa game AAA đỉnh cao ${gpu ? `nhờ sức mạnh của card đồ họa ${gpu}` : ""}.

### 🖥️ Màn hình & Đồ họa
Trải nghiệm không gian làm việc rộng lớn với độ bao phủ màu sắc cao, chuẩn xác cho các nhà thiết kế đồ họa chuyên nghiệp.

### 🔌 Kết nối & Tản nhiệt
Hệ thống tản nhiệt thông minh giúp máy luôn mát mẻ kể cả khi hoạt động dưới cường độ cao. Đầy đủ các cổng kết nối tốc độ cao cho mọi nhu cầu.
        `.trim();
      } else if (effectiveCategory === 'SMARTPHONE' || effectiveCategory === 'TABLET') {
        detailsText = `
### 📸 Hệ thống Camera đỉnh cao
Tự hào với cụm camera thế hệ mới, ${name} cho phép bạn ghi lại những thước phim điện ảnh và ảnh chân dung hoàn hảo trong mọi điều kiện ánh sáng.

### 🌈 Màn hình thực tế ảo
Công nghệ hiển thị tiên tiến với tần số quét cao mang lại sự mượt mà đến khó tin trong từng cú chạm và lướt.

### 🚀 Hiệu suất & 5G
Kết nối tương lai với tốc độ 5G siêu tốc, hỗ trợ đa nhiệm mạnh mẽ cùng viên pin dung lượng lớn cho cả ngày dài sáng tạo.
        `.trim();
      } else if (effectiveCategory === 'COMPONENT' || effectiveCategory === 'ACCESSORIES') {
        detailsText = `
### ⚙️ Độ ổn định tuyệt đối
${name} được kiểm thử nghiêm ngặt để đảm bảo khả năng tương thích hoàn hảo và hiệu suất ổn định trong mọi môi trường làm việc chuyên nghiệp.

### 🛠️ Chất lượng hoàn thiện
Sử dụng các bảng mạch và linh kiện cao cấp nhất, mang lại tuổi thọ kéo dài và khả năng vận hành bền bỉ theo thời gian.

### 🔌 Dễ dàng nâng cấp
Thiết kế chuẩn hóa giúp bạn dễ dàng lắp đặt và tối ưu hóa hệ thống hiện tại một cách nhanh chóng.
        `.trim();
      } else {
        detailsText = `
### 💪 Sức mạnh & Thiết kế
${name} là sự kết hợp hoàn hảo giữa vật liệu cao cấp và công nghệ tiên tiến nhất hiện nay, mang lại độ bền tuyệt đối và vẻ ngoài sang trọng.

### 🔋 Thời lượng pin & Tính năng
Khả năng quản lý năng lượng thông minh, đảm bảo bạn luôn sẵn sàng cho mọi thử thách. Tích hợp đầy đủ các tính năng thông minh hỗ trợ cuộc sống hàng ngày.
        `.trim();
      }
      return NextResponse.json({ details: detailsText });
    }

    if (type === 'sku') {
      const b = (brand || "TECH").substring(0, 3).toUpperCase();
      const n = (name || "PROD").substring(0, 3).toUpperCase();
      const r = (ram || "").replace(/GB/gi, "");
      const s = (storage || "").replace(/GB/gi, "");
      const c = (variant?.color || "COL").substring(0, 2).toUpperCase();

      // Extract key from specs (CPU, GPU, Size, etc.)
      const extraSpecRaw = Object.values(variant?.specs || {}).find(v => !!v) || "";
      const extraSpec = String(extraSpecRaw).substring(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, "");

      const random = Math.floor(1000 + Math.random() * 9000);
      
      const generatedSKU = `${b}-${n}-${extraSpec}${r}${s}-${c}-${random}`.replace(/--/g, "-");
      return NextResponse.json({ sku: generatedSKU });
    }

    // Default: Description
    let descTemplate = "";
    if (effectiveCategory === 'LAPTOP') {
      descTemplate = `
🚀 Tăng tốc hiệu suất làm việc cùng ${brand || ""} ${name}! 

Với trái tim là ${cpu || "vi xử lý thế hệ mới"}, bộ nhớ ${ram} và ổ cứng siêu tốc ${storage}, ${name} chính là "quái vật" hiệu năng dành cho dân chuyên nghiệp. ${gpu ? `Sức mạnh từ đồ họa ${gpu} giúp bạn chinh phục mọi giới hạn đầy ấn tượng.` : ""}

🌟 Điểm nổi bật:
- Cấu hình cực mạnh: ${cpu} | ${ram} | ${storage}
- Thiết kế tản nhiệt tối ưu, duy trì phong thái làm việc ổn định.
- Màn hình chuyên nghiệp, độ chuẩn màu sắc cao cấp.
- Thời lượng pin dẻo dai, hỗ trợ công nghệ sạc thần tốc.

Nâng cấp ngay trải nghiệm làm việc của bạn cùng ${name}!
      `.trim();
    } else if (effectiveCategory === 'SMARTPHONE') {
      descTemplate = `
📸 Làm chủ mọi khung hình cùng ${brand || ""} ${name}! 

${name} không chỉ là một chiếc điện thoại, mà là một tuyệt tác công nghệ trong lòng bàn tay. Với bộ nhớ lên đến ${storage} và RAM ${ram}, mọi ứng dụng và khoảnh khắc của bạn đều được vận hành mượt mà, lưu trữ trọn vẹn.

🌟 Điểm nổi bật:
- Hệ thống camera chuyên nghiệp, chế độ chụp đêm tuyệt đỉnh.
- Màn hình rực rỡ, độ sáng cao thách thức mọi điều kiện ánh sáng.
- Hiệu suất ${ram} RAM cho khả năng đa nhiệm không giới hạn.
- Pin dung lượng lớn, tích hợp sạc nhanh thông minh.

Khẳng định đẳng cấp cùng ${brand} ${name} ngay hôm nay!
      `.trim();
    } else if (effectiveCategory === 'COMPONENT') {
      descTemplate = `
⚡ Nâng tầm sức mạnh hệ thống cùng ${brand || ""} ${name}! 

${name} là linh kiện cốt lõi mang lại sự ổn định và tốc độ vượt trội cho dàn máy của bạn. Với các tiêu chuẩn kỹ thuật khắt khe nhất, đây là lựa chọn hàng đầu cho những ai yêu cầu sự bền bỉ.

🌟 Điểm nổi bật:
- Hiệu suất vận hành ấn tượng, tối ưu hóa tốc độ xử lý dữ liệu.
- Độ bền cao, hoạt động ổn định trong môi trường tải nặng.
- Khả năng tương thích rộng rãi với nhiều nền tảng phần cứng.
- Công nghệ mới nhất, tiết kiệm điện năng và tản nhiệt hiệu quả.

Nâng cấp ngay hôm nay để cảm nhận sự khác biệt từ ${name}!
      `.trim();
    } else if (effectiveCategory === 'ACCESSORIES') {
      descTemplate = `
✨ Hoàn thiện trải nghiệm công nghệ cùng ${brand || ""} ${name}! 

Thiết kế tinh tế, tính năng thông minh và sự bền bỉ là những gì ${name} mang lại. Đây là món phụ kiện không thể thiếu để tối ưu hóa hiệu suất và phong cách của bạn.

🌟 Điểm nổi bật:
- Thiết kế hiện đại, mang lại sự thoải mái khi sử dụng lâu dài.
- Tính tương thích cao, kết nối nhanh chóng và ổn định.
- Chất liệu cao cấp, chống bám bẩn và trầy xước hiệu quả.
- Nâng cao năng suất và cảm hứng sáng tạo mỗi ngày.

Trang bị ngay ${name} để cảm nhận sự tiện nghi vượt trội!
      `.trim();
    } else if (effectiveCategory === 'WATCH') {
      descTemplate = `
⌚ Người đồng hành sức khỏe hoàn hảo - ${brand || ""} ${name}! 

${name} phiên bản ${size || "mới nhất"} không chỉ là món trang sức cao cấp mà còn là chuyên gia theo dõi sức khỏe 24/7 của bạn. Với thiết kế tinh tế và các cảm biến chính xác, bạn sẽ luôn nắm bắt được nhịp đập của bản thân.

🌟 Điểm nổi bật:
- Theo dõi nhịp tim, giấc ngủ và nồng độ oxy trong máu chính xác.
- Hỗ trợ hàng trăm chế độ tập luyện thể thao chuyên nghiệp.
- Thiết kế sang trọng, ${size ? `kích thước ${size} vừa vặn` : "phù hợp mọi cổ tay"}.
- Chống nước vượt trội, pin dùng liên tục nhiều ngày.

Chăm sóc bản một cách thông minh cùng ${name}!
      `.trim();
    } else {
      descTemplate = `
🚀 Khám phá sức mạnh vượt trội của ${brand || ""} ${name}! 

${name} mang đến trải nghiệm đỉnh cao với ${ram} RAM và ${storage} bộ nhớ, cùng thiết kế tinh xảo và hiệu năng mạnh mẽ trong phân khúc ${category?.toLowerCase() || "công nghệ"}.

🌟 Điểm nổi bật:
- Thiết kế hiện đại, sang trọng với chất liệu cao cấp.
- Hiệu năng xử lý tối ưu, đa nhiệm mượt mà qua ${ram} RAM.
- Thời lượng pin ấn tượng, hỗ trợ sạc nhanh siêu tốc.
- Kết nối thông minh, khả năng tương thích tuyệt vời.

Nâng tầm cuộc sống của bạn cùng ${brand} ${name}!
      `.trim();
    }

    return NextResponse.json({ description: descTemplate });
  } catch (error) {
    return NextResponse.json({ error: "AI failed to generate content" }, { status: 500 });
  }
}
