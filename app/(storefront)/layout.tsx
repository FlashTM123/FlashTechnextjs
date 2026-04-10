import { Navbar } from "@/components/storefront/navbar";
import { Footer } from "@/components/storefront/footer";
import { FloatingActions } from "@/components/storefront/floating-actions";
import { TopLoadingBar } from "@/components/storefront/top-loading-bar";
import { PageTransition } from "@/components/storefront/page-transition";
import { CustomerAuthProvider } from "@/app/context/customer-auth-context";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopLoadingBar />
      <Navbar />
      <main className="flex-grow pt-28">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
