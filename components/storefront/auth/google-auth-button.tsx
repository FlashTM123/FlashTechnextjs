import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCustomerAuth } from "@/app/context/customer-auth-context";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    google: any;
  }
}

export function GoogleAuthButton() {
  const router = useRouter();
  const { loginWithGoogle, loading } = useCustomerAuth();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
          callback: async (response: any) => {
            const success = await loginWithGoogle(response.credential);
            if (success) {
              router.push("/");
              router.refresh();
            }
          },
        });

        // Use a numeric width or leave it undefined for automatic sizing
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          width: 360,
          text: "continue_with",
          shape: "pill",
        });
      }
    };

    // 1. Check if the script is already loaded
    if (!document.getElementById("google-gsi-client")) {
      const script = document.createElement("script");
      script.id = "google-gsi-client";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.body.appendChild(script);
    } else {
      initializeGoogle();
    }

    // Cleanup is not strictly necessary for the script as we want it to persist,
    // but the button instance might behave better if we don't re-render it unnecessarily.
  }, [loginWithGoogle]);

  return (
    <div className="relative w-full flex justify-center">
      <div ref={googleButtonRef} className="w-full flex justify-center min-h-[44px]" />
      {loading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-full z-20">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
        </div>
      )}
    </div>
  );
}
