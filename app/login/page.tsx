import LoginForm from "./components/login-form";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "Login - FlashTech",
  description: "Admin login page for FlashTech",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-cyan-100/20 rounded-full blur-3xl"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md flex justify-center flex-col">
        <LoginForm />

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>🔒 Secure connection with SSL encryption</p>
        </div>
      </div>
    </div>
  );
}
