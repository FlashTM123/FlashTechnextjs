# FlashTech - Modern Admin Dashboard

Một nền tảng quản lý doanh nghiệp hiện đại được xây dựng bằng **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS 4**, và **Shadcn/ui**.

## 🎯 Tính Năng

### Frontend (my-app/)
- ⚡ **Modern Admin Dashboard** - Giao diện đẹp, responsive
- 🔐 **Authentication System** - Login/Logout với Context API
- 👤 **User Management** - Hiển thị thông tin user đang login
- 🎨 **Shadcn/ui Components** - UI components chất lượng cao
- 🎭 **Dark Mode Support** - Hỗ trợ chế độ tối
- 📱 **Mobile Responsive** - Hoạt động tốt trên mọi thiết bị
- 🔔 **Real-time Notifications** - Thông báo real-time
- 📊 **Dashboard Analytics** - Biểu đồ và thống kê
- 👥 **User Management** - Quản lý người dùng
- 📦 **Product Management** - Quản lý sản phẩm
- 🛒 **Order Management** - Quản lý đơn hàng

### Backend (Prisma + MongoDB)
- 🗄️ **MongoDB Integration** - Cơ sở dữ liệu NoSQL
- 🔐 **User Authentication** - Xác thực người dùng
- 👨‍💼 **Role-Based Access Control** - Phân quyền (User, Admin, Moderator, Employee)
- 🛡️ **Account Blocking** - Khóa tài khoản
- 📝 **Database Seeding** - Dữ liệu khởi tạo

## 📋 Yêu Cầu

- **Node.js**: v18 hoặc cao hơn
- **npm**: v9 hoặc cao hơn (hoặc yarn, pnpm)
- **MongoDB**: Cloud (Atlas) hoặc Local

## 🚀 Hướng Dẫn Cài Đặt

### 1. Clone Repository
```bash
git clone <repository-url>
cd FlashTechNextjs
```

### 2. Cài Đặt Dependencies
```bash
cd my-app
npm install
```

### 3. Cấu Hình Environment
Tạo file `.env.local` trong thư mục `my-app`:
```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/flashtech_nextjs?retryWrites=true&w=majority"
```

### 4. Khởi Tạo Prisma
```bash
npx prisma generate
npx prisma db seed
```

### 5. Chạy Development Server
```bash
npm run dev
```

Truy cập: **http://localhost:3000**

## 📁 Cấu Trúc Dự Án

```
FlashTechNextjs/
├── my-app/                          # Next.js App
│   ├── app/
│   │   ├── login/
│   │   │   ├── page.tsx            # Login Page
│   │   │   └── components/
│   │   │       └── login-form.tsx   # Login Form Component
│   │   ├── admins/
│   │   │   ├── layout.tsx          # Admin Layout (Protected)
│   │   │   ├── page.tsx            # Dashboard
│   │   │   ├── users/              # Users Management
│   │   │   ├── products/           # Products Management
│   │   │   ├── orders/             # Orders Management
│   │   │   ├── analytics/          # Analytics
│   │   │   └── settings/           # Settings
│   │   ├── context/
│   │   │   └── auth-context.tsx    # Authentication Context
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── login/
│   │   │           └── route.ts    # Login API Endpoint
│   │   ├── globals.css             # Global Styles
│   │   └── layout.tsx              # Root Layout
│   ├── components/
│   │   └── ui/                     # Shadcn UI Components
│   ├── lib/
│   │   └── utils.ts                # Utilities
│   ├── public/                      # Static Files
│   ├── package.json
│   └── tailwind.config.ts
├── prisma/
│   ├── schema.prisma               # Database Schema
│   ├── seed.ts                     # Database Seeding
│   └── migrations/                 # Database Migrations
├── generated/
│   └── prisma/                     # Prisma Client (Generated)
├── prisma.config.ts                # Prisma Config
├── .env.local                      # Environment Variables
└── README.md
```

## 🗄️ Database Schema

### User Model
```prisma
model User {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  name         String
  email        String   @unique
  password     String
  phone_number String   @unique
  address      String
  role         Role     @default(USER)    // USER, ADMIN, MODERATOR, EMPLOYEE
  isBlocked    Boolean  @default(false)   // Account lock status
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

enum Role {
  USER
  ADMIN
  MODERATOR
  EMPLOYEE
}
```

## 🛠️ Công Nghệ Sử Dụng

| Công Nghệ | Phiên Bản | Mục Đích |
|-----------|----------|---------|
| **Next.js** | 16.2.1 | Framework React |
| **React** | 19.2.4 | UI Library |
| **TypeScript** | 5 | Type Safety |
| **Tailwind CSS** | 4 | Styling |
| **Shadcn/ui** | Latest | UI Components |
| **Prisma** | 6 | ORM |
| **MongoDB** | Latest | Database |
| **Lucide React** | 1.6.0 | Icons |
| **React Context** | 19 | State Management |
| **Next.js App Router** | 16.2.1 | Routing |

## 📦 Scripts

```bash
# Development
npm run dev              # Start dev server (port 3000)

# Production
npm run build           # Build for production
npm start               # Start production server

# Database
npx prisma generate    # Generate Prisma Client
npx prisma db seed     # Seed database
npx prisma studio      # Open Prisma Studio

# Linting
npm run lint            # Run ESLint
```

## 🔐 Xác Thực & Phân Quyền

### Authentication Flow
- **Login Page** (`/login`) - Form đăng nhập với validation
- **API Route** (`/api/auth/login`) - Xử lý xác thực
- **AuthContext** - Lưu user state + localStorage
- **Protected Routes** - Admin routes yêu cầu đăng nhập
- **Logout** - Xóa session + redirect về login

### Demo Credentials
```
Email: admin@flashtech.com
Password: password

Permissions:
✓ Full access to all features and settings
✓ Manage users & roles
✓ View analytics & reports
✓ Configure products & orders
✓ Access system settings
```

### Roles & Permissions
- **USER**: Người dùng thường
- **ADMIN**: Quản trị viên (Toàn quyền)
- **MODERATOR**: Người kiểm duyệt (Quyền hạn)
- **EMPLOYEE**: Nhân viên (Quyền giới hạn)

### Account Lock
- Admin có thể khóa/mở khóa tài khoản bằng cột `isBlocked`
- Tài khoản bị khóa không thể đăng nhập

## 🎯 Hướng Dẫn Sử Dụng

### Login & Access Admin
1. Truy cập: **http://localhost:3000/login**
2. Nhập demo credentials:
   - Email: `admin@flashtech.com`
   - Password: `password`
3. Click "Sign In" → Tự động redirect về Dashboard
4. Dashboard hiển thị thông tin user đang login
5. Click avatar → Dropdown menu → Click "Logout" để đăng xuất

### Protected Routes
- Login page (`/login`) - Public, không cần đăng nhập
- Admin pages (`/admins/*`) - Protected, yêu cầu đăng nhập
- Nếu truy cập `/admins` chưa login → Tự động redirect về `/login`

### User Info Display
- Sidebar: Hiển thị avatar + tên user
- Header: Hiển thị user menu với email
- Responsive: Tên user ẩn trên mobile, hiện trên desktop

## 🎨 Customization

### Thay Đổi Màu
Chỉnh sửa gradient colors trong `app/admins/layout.tsx`:
```tsx
className="bg-gradient-to-r from-blue-600 to-cyan-500"
```

### Thay Đổi Font
Sửa trong `app/globals.css`:
```css
--font-sans: 'Your Font', sans-serif;
```

## 🐛 Troubleshooting

### Lỗi Module Not Found
```bash
rm -rf node_modules .next
npm install
npm run dev
```

### Lỗi Prisma Client
```bash
npx prisma generate
```

### Lỗi Database Connection
```bash
# Kiểm tra DATABASE_URL trong .env.local
# Đảm bảo MongoDB đang chạy
# Kiểm tra network access trong MongoDB Atlas
```

## 📚 Tài Liệu

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [MongoDB Documentation](https://docs.mongodb.com)

## 🤝 Contribution

Contributions are welcome! Vui lòng:
1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - xem file [LICENSE](LICENSE)

## 👨‍💻 Authors

- **FlashTech Team** - Initial work

## 📞 Support

- Email: support@flashtech.com
- Issues: [GitHub Issues](https://github.com/flashtech/issues)
- Documentation: [Wiki](https://github.com/flashtech/wiki)

---

**Last Updated**: March 26, 2026
**Status**: Active Development
**Recent Features**: Login/Logout System, Authentication Context, Protected Routes
