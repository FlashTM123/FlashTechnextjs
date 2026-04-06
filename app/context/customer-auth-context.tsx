"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { toast } from "sonner";

export interface Customer {
  id: string;
  customer_id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  address?: string;
  avatar?: string;
  tier?: string;
  points?: number;
}

interface CustomerAuthContextType {
  customer: Customer | null;
  loading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (credential: string) => Promise<boolean>;
  register: (full_name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initial session recovery & Status Check
  useEffect(() => {
    const savedCustomer = localStorage.getItem("flashtech_customer");
    if (savedCustomer) {
      try {
        const parsed = JSON.parse(savedCustomer);
        setCustomer(parsed);
        // Verify status immediately on load
        fetch(`/api/auth/customer/me?id=${parsed.id}`).then(resp => {
          if (resp.status === 401) {
            logout("Tài khoản của bạn đã bị khóa hoặc không còn hiệu lực.");
          }
        });
      } catch (error) {
        localStorage.removeItem("flashtech_customer");
      }
    }
    setIsInitialized(true);
  }, []);

  // Periodic heartbeat to check for block status
  useEffect(() => {
    if (!customer) return;

    const interval = setInterval(() => {
      refreshProfile();
    }, 15000); // Check every 15 seconds

    return () => clearInterval(interval);
  }, [customer]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const resp = await fetch("/api/auth/customer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        toast.error(data.message || "Đăng nhập thất bại");
        return false;
      }

      setCustomer(data.customer);
      localStorage.setItem("flashtech_customer", JSON.stringify(data.customer));
      toast.success("Chào mừng bạn quay trở lại!");
      return true;
    } catch (error) {
      toast.error("Lỗi kết nối. Vui lòng thử lại sau.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async (credential: string) => {
    setLoading(true);
    try {
      const resp = await fetch("/api/auth/customer/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        toast.error(data.message || "Đăng nhập Google thất bại");
        return false;
      }

      setCustomer(data.customer);
      localStorage.setItem("flashtech_customer", JSON.stringify(data.customer));
      toast.success("Chào mừng bạn! Đăng nhập bằng Google thành công.");
      return true;
    } catch (error) {
      toast.error("Lỗi kết nối khi đăng nhập Google.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (full_name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const resp = await fetch("/api/auth/customer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name, email, password }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        toast.error(data.message || "Đăng ký thất bại");
        return false;
      }

      toast.success("Đăng ký thành công! Hãy đăng nhập nhé.");
      return true;
    } catch (error) {
      toast.error("Lỗi kết nối. Vui lòng thử lại sau.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback((message?: any) => {
    setCustomer(null);
    localStorage.removeItem("flashtech_customer");
    if (typeof message === "string") {
      toast.error(message, { duration: 5000 });
    } else {
      toast.success("Hẹn gặp lại bạn sớm!");
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!customer) return;
    try {
      const resp = await fetch(`/api/auth/customer/me?id=${customer.id}`);
      if (resp.ok) {
        const data = await resp.json();
        setCustomer(data.customer);
        localStorage.setItem("flashtech_customer", JSON.stringify(data.customer));
      } else if (resp.status === 401) {
        // Account might be blocked
        logout("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin.");
      }
    } catch (e) {
      console.error("Profile refresh failed");
    }
  }, [customer, logout]);

  return (
    <CustomerAuthContext.Provider value={{ 
      customer, 
      loading, 
      isInitialized, 
      login, 
      loginWithGoogle,
      register, 
      logout,
      refreshProfile
    }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (context === undefined) {
    throw new Error("useCustomerAuth must be used within a CustomerAuthProvider");
  }
  return context;
}
