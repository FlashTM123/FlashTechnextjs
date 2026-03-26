import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/auth-context";

// Cấu hình font Inter làm font chính duy nhất để đảm bảo đồng bộ Windows/Linux
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "FlashTech - Hệ thống quản trị Premium",
  description: "Trình quản lý dữ liệu tập trung thế hệ mới của FlashTech",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className={`min-h-full flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
