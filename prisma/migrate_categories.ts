import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORY_DATA = [
  { name: "Smartphone", slug: "smartphone", icon: "Smartphone", description: "Điện thoại thông minh các loại" },
  { name: "Laptop", slug: "laptop", icon: "Laptop", description: "Máy tính xách tay, Macbook, Laptop Gaming" },
  { name: "Tablet", slug: "tablet", icon: "Tablet", description: "Máy tính bảng, iPad" },
  { name: "Watch", slug: "watch", icon: "Watch", description: "Đồng hồ thông minh, Apple Watch" },
  { name: "Audio", slug: "audio", icon: "Headphones", description: "Tai nghe, Loa, Thiết bị âm thanh" },
  { name: "Accessories", slug: "accessories", icon: "Package", description: "Phụ kiện, Củ cáp, Ốp lưng" },
  { name: "Component", slug: "component", icon: "Cpu", description: "Linh kiện máy tính, RAM, SSD" },
  { name: "Other", slug: "other", icon: "Layers", description: "Các sản phẩm khác" },
];

async function main() {
  console.log("Starting category migration...");

  // 1. Create or Find Categories
  const createdCategories: Record<string, string> = {};
  
  for (const cat of CATEGORY_DATA) {
    const existing = await prisma.category.findUnique({
      where: { slug: cat.slug }
    });

    if (existing) {
      console.log(`Category ${cat.name} already exists.`);
      createdCategories[cat.slug.toUpperCase()] = existing.id;
    } else {
      const newCat = await prisma.category.create({
        data: cat
      });
      console.log(`Created category: ${cat.name}`);
      createdCategories[cat.slug.toUpperCase()] = newCat.id;
    }
  }

  // 2. Map old categories to new category_id if they exist
  // Note: We might need to use raw MongoDB commands if Prisma doesn't allow accessing deleted fields
  // In our case, 'category' is gone from schema, so we use raw access.
  
  const db = (prisma as any)._activeProvider === 'mongodb' ? (prisma as any).$extends({
      model: {
          product: {
              async findManyRaw() {
                  return (prisma as any).product.findMany({});
              }
          }
      }
  }) : prisma;

  const products = await prisma.product.findMany();
  console.log(`Found ${products.length} products to migrate.`);

  for (const product of products) {
    // We try to guess the category from the product if it was there
    // Since we just updated the schema, Prisma won't see the old 'category' field
    // But we can check if it already has category_id
    if ((product as any).category_id) {
        continue;
    }

    // Default to 'OTHER' if we can't determine
    const categoryId = createdCategories["OTHER"];
    
    await prisma.product.update({
      where: { id: product.id },
      data: {
        category_id: categoryId
      }
    });
  }

  // 3. Create demo coupons
  await prisma.coupon.createMany({
      data: [
          {
              code: "FLASHTECH2026",
              description: "Giảm 20% cho đơn hàng đầu tiên",
              type: "PERCENTAGE",
              value: 20,
              min_order_amount: 500000,
              max_discount: 200000,
              usage_limit: 100,
              is_active: true
          },
          {
              code: "HELLOADMIN",
              description: "Giảm 50.000đ cho mọi đơn hàng",
              type: "FIXED",
              value: 50000,
              min_order_amount: 100000,
              is_active: true
          }
      ]
  });

  console.log("Migration completed successfully!");
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
