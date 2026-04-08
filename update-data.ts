import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  
  const specs = {
    "Vi xử lý": "Apple A19 Pro Bionic (3nm Next-gen)",
    "Màn hình": "6.9\" LTPO OLED, 3000 nits Peak Brightness",
    "Camera": "108MP Main + 48MP Zoom 10x + 48MP Wide",
    "RAM": "12GB LPDDR5X (Lực lượng mới)",
    "Pin": "5,400 mAh, Pin Graphene bền bỉ",
    "GPU": "8-core GPU with Hardware Ray Tracing",
    "Truyền dữ liệu": "USB-C 4.0 40Gbps, WiFi 7, BT 5.4",
    "Cấu trúc": "Titanium Grade 5 (Aerospace Grade)",
    "Hệ điều hành": "iOS 19 Premium Edition",
    "Trọng lượng": "221g (Nhẹ hơn 15% so với bản trước)"
  };

  const details = `
    <h2 style="color: #6366f1; font-weight: 900; font-size: 3rem; margin-bottom: 2rem;">Vượt Ngưỡng Giới Hạn</h2>
    <p>iPhone 17 Pro Max là tuyên ngôn của sự đột phá. Với chip <strong>A19 Pro Bionic</strong>, mọi giới hạn về hiệu năng đều bị phá bỏ. Đây không chỉ là một chiếc smartphone, đây là một cỗ máy tương lai trong tầm tay bạn.</p>
    
    <div style="margin: 3rem 0; padding: 2rem; border-radius: 3rem; background: rgba(99, 102, 241, 0.03); border: 1px solid rgba(99, 102, 241, 0.1);">
       <h3 style="font-weight: 800; color: #4f46e5; margin-bottom: 1rem;">Nhiếp Ảnh Điện Ảnh</h3>
       <p>Hệ thống Camera 108MP cùng zoom quang học 10x định nghĩa lại chuẩn mực điện ảnh di động. Mọi chi tiết, mọi sắc thái đều sống động như thật.</p>
    </div>
  `;

  try {
    const p = await prisma.product.findUnique({ where: { slug: 'iphone-17-pro-max' } });
    if (p) {
        await prisma.product.update({
          where: { id: p.id },
          data: {
            details: details.trim(),
            specs: specs
          }
        });
        console.log("SUCCESS: iPhone 17 Pro Max has been upgraded in the database.");
    }
  } catch (err) {
    console.error("FAILED to update DB:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
