import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** customer_id bắt đầu bằng prefix — xóa và tạo lại khi chạy lại seed */
const DEMO_PREFIX = "KH-DEMO-";

const DEMO_PASSWORD_HASH =
  "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi";

async function main() {
  await prisma.customer.deleteMany({
    where: { customer_id: { startsWith: DEMO_PREFIX } },
  });

  await prisma.customer.createMany({
    data: [
      {
        customer_id: `${DEMO_PREFIX}001`,
        full_name: "Nguyễn Minh Anh",
        email: "minhanh.demo@example.com",
        password: DEMO_PASSWORD_HASH,
        phone_number: "0901234567",
        avatar: "https://github.com/shadcn.png",
        gender: "FEMALE",
        date_of_birth: new Date("1995-03-15"),
        address: "123 Lê Lợi",
        city: "TP.HCM",
        status: "ACTIVE",
        tier: "GOLD",
        points: 1250,
        isVerified: true,
        lastLogin: new Date(),
        adminNote: "Khách VIP, ưu tiên giao nhanh.",
      },
      {
        customer_id: `${DEMO_PREFIX}002`,
        full_name: "Trần Đức Thịnh",
        email: "ducthinh.demo@example.com",
        password: DEMO_PASSWORD_HASH,
        phone_number: "0912345678",
        avatar: "https://github.com/shadcn.png",
        gender: "MALE",
        address: "45 Trần Hưng Đạo",
        city: "Hà Nội",
        status: "PENDING",
        tier: "BRONZE",
        points: 50,
        isVerified: false,
        adminNote: "",
      },
      {
        customer_id: `${DEMO_PREFIX}003`,
        full_name: "Lê Thu Hà",
        email: "thuha.demo@example.com",
        password: DEMO_PASSWORD_HASH,
        phone_number: "0923456789",
        avatar: "https://github.com/shadcn.png",
        gender: "FEMALE",
        city: "Đà Nẵng",
        status: "ACTIVE",
        tier: "SILVER",
        points: 420,
        isVerified: true,
      },
      {
        customer_id: `${DEMO_PREFIX}004`,
        full_name: "Phạm Quốc Bảo",
        email: "quocbao.demo@example.com",
        password: DEMO_PASSWORD_HASH,
        phone_number: "0934567890",
        avatar: "https://github.com/shadcn.png",
        gender: "MALE",
        address: "8 Nguyễn Huệ",
        city: "Cần Thơ",
        status: "BLOCKED",
        tier: "BRONZE",
        points: 0,
        isVerified: true,
        adminNote: "Cảnh báo: lịch sử boom hàng.",
      },
      {
        customer_id: `${DEMO_PREFIX}005`,
        full_name: "Hoàng Mai Linh",
        email: "mailinh.demo@example.com",
        password: DEMO_PASSWORD_HASH,
        phone_number: "0945678901",
        avatar: "https://github.com/shadcn.png",
        gender: "OTHER",
        city: "TP.HCM",
        status: "INACTIVE",
        tier: "DIAMOND",
        points: 8900,
        isVerified: true,
        adminNote: "Tự đóng tài khoản tạm thời.",
      },
    ],
  });

  console.log(`Đã seed 5 khách hàng (${DEMO_PREFIX}*) vào collection customer (Prisma).`);
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
