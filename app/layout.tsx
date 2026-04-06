import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/auth-context";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "./context/language-context";
import { CustomerAuthProvider } from "./context/customer-auth-context";
import { Toaster } from "sonner";

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "FlashTech - Siêu thị Công nghệ & Phụ kiện cao cấp",
  description: "Trải nghiệm mua sắm thiết bị công nghệ đỉnh cao và hiện đại nhất tại FlashTech",
};

import { CartProvider } from "./context/cart-context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="vi" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <AuthProvider>
              <CustomerAuthProvider>
                <CartProvider>
                  {children}
                  <Toaster position="top-right" richColors />
                </CartProvider>
              </CustomerAuthProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
