"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  MapPin, 
  Phone, 
  User as UserIcon, 
  CreditCard, 
  ShieldCheck, 
  ArrowRight,
  Truck,
  CheckCircle2,
  Lock,
  Wallet,
  Building
} from "lucide-react";
import { useCart } from "@/app/context/cart-context";
import { useCustomerAuth } from "@/app/context/customer-auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, totalAmount, clearCart, isInitialized } = useCart();
  const { customer, loading: authLoading } = useCustomerAuth();

  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    shipping_address: "",
    payment_method: "COD"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData(prev => ({
        ...prev,
        full_name: customer.full_name || "",
        phone_number: customer.phone_number || "",
        shipping_address: customer.address || ""
      }));
    }
  }, [customer]);

  useEffect(() => {
    if (isInitialized && cartItems.length === 0) {
      router.push("/cart");
    }
  }, [isInitialized, cartItems, router]);

  // Handle forcing login if not authenticated
  useEffect(() => {
    if (!authLoading && !customer) {
      toast.error("Vui lòng đăng nhập để tiếp tục thanh toán");
      router.push("/login?redirect=/checkout");
    }
  }, [authLoading, customer, router]);

  if (authLoading || !isInitialized) {
      return <div className="h-[70vh] flex items-center justify-center">Loading Secure Checkout...</div>;
  }

  const formatPrice = (price: number) => 
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.phone_number || !formData.shipping_address) {
      toast.error("Vui lòng điền đầy đủ thông tin giao hàng");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          customer_id: customer?.id,
          items: cartItems,
          total_amount: totalAmount,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Đặt hàng thành công!");
        clearCart();
        router.push(`/checkout/success/${data.orderId}`);
      } else {
        toast.error(data.message || "Có lỗi xảy ra, vui lòng thử lại sau");
      }
    } catch (error) {
      toast.error("Lỗi kết nối máy chủ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0B] pb-32">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-12">
            <button onClick={() => router.back()} className="h-12 w-12 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-all">
                <ChevronLeft size={20} />
            </button>
            <div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Checkout</h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 italic">SECURE CRYPTO-ENCRYPTED SETTLEMENT</p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Shipping & Payment Info */}
          <div className="space-y-12">
             {/* Shipping Section */}
             <div className="bg-white dark:bg-white/[0.02] rounded-[40px] border border-slate-200 dark:border-white/5 p-10 shadow-sm space-y-10">
                <div className="flex items-center gap-3 text-indigo-600">
                    <MapPin size={24} />
                    <h2 className="text-lg font-black uppercase tracking-widest">Shipping Meta</h2>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Recipient Legal Name</label>
                        <div className="relative group">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <Input 
                                value={formData.full_name}
                                onChange={e => setFormData({...formData, full_name: e.target.value})}
                                placeholder="Full name" 
                                className="h-14 pl-12 rounded-2xl bg-slate-50 dark:bg-white/5 border-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 font-bold" 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Secure Contact Link (Phone)</label>
                        <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <Input 
                                value={formData.phone_number}
                                onChange={e => setFormData({...formData, phone_number: e.target.value})}
                                placeholder="Phone number" 
                                className="h-14 pl-12 rounded-2xl bg-slate-50 dark:bg-white/5 border-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 font-bold" 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Delivery Coordinates (Address)</label>
                        <div className="relative group">
                            <MapPin className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <textarea 
                                value={formData.shipping_address}
                                onChange={e => setFormData({...formData, shipping_address: e.target.value})}
                                placeholder="Full shipping address (Detailed)" 
                                className="w-full h-32 pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 font-bold text-sm outline-none resize-none"
                            />
                        </div>
                    </div>
                </div>
             </div>

             {/* Payment Selection */}
             <div className="bg-white dark:bg-white/[0.02] rounded-[40px] border border-slate-200 dark:border-white/5 p-10 shadow-sm space-y-10">
                <div className="flex items-center gap-3 text-emerald-600">
                    <Wallet size={24} />
                    <h2 className="text-lg font-black uppercase tracking-widest">Protocol Selector</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { id: "COD", label: "Cash on Delivery", desc: "Pay upon safe arrival", icon: Truck },
                        { id: "BANK", label: "Bank Transfer", desc: "Swift manual clearance", icon: Building },
                    ].map((method) => (
                        <button
                            key={method.id}
                            type="button"
                            onClick={() => setFormData({...formData, payment_method: method.id})}
                            className={cn(
                                "p-6 rounded-3xl border-2 flex flex-col gap-4 text-left transition-all active:scale-95 group",
                                formData.payment_method === method.id 
                                    ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-500/20" 
                                    : "bg-slate-50 dark:bg-white/5 border-transparent hover:border-indigo-500/20"
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", formData.payment_method === method.id ? "bg-white/10" : "bg-white dark:bg-white/5 text-slate-400 group-hover:text-indigo-500 transition-colors")}>
                                    <method.icon size={24} />
                                </div>
                                {formData.payment_method === method.id && <CheckCircle2 size={20} />}
                            </div>
                            <div>
                                <p className="font-black text-sm uppercase tracking-tight">{method.label}</p>
                                <p className={cn("text-[10px] font-bold uppercase tracking-widest", formData.payment_method === method.id ? "text-white/70" : "text-slate-400")}>{method.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
             </div>
          </div>

          {/* Right: Summary Area */}
          <div className="lg:sticky lg:top-32 space-y-8">
             <div className="bg-slate-900 rounded-[50px] p-12 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/10 to-transparent pointer-events-none" />
                
                <div className="relative space-y-10">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">ORDER ENTITY BUNDLE</h3>
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold text-white uppercase tracking-widest">
                            <Lock size={10} /> Encrypted
                        </div>
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center p-2 shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-black text-xs uppercase tracking-tight truncate">{item.name}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{item.variantName || "Standard"}</p>
                                    <p className="text-[10px] font-black text-indigo-400 mt-1">QTY: {item.quantity}</p>
                                </div>
                                <div className="text-right font-black text-sm tabular-nums">
                                    {formatPrice(item.price * item.quantity)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4 pt-6 border-t border-white/10">
                        <div className="flex justify-between items-center text-slate-400">
                            <span className="text-[10px] font-bold uppercase tracking-widest">SUBSET TOTAL</span>
                            <span className="font-black text-white tabular-nums">{formatPrice(totalAmount)}</span>
                        </div>
                         <div className="flex justify-between items-center text-slate-400">
                            <span className="text-[10px] font-bold uppercase tracking-widest">LOGISTICS FEE</span>
                            <span className="font-black text-emerald-400 uppercase tracking-widest text-[10px]">WAIVED</span>
                        </div>
                        <Separator className="bg-white/10" />
                        <div className="flex justify-between items-end pt-2">
                             <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400">FINAL CLEARANCE</span>
                             <div className="text-5xl font-black tracking-tighter italic tabular-nums">
                                {formatPrice(totalAmount)}
                             </div>
                        </div>
                    </div>

                    <Button 
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full h-20 rounded-[32px] bg-white text-slate-900 hover:bg-slate-100 font-black text-sm uppercase tracking-[0.3em] transition-all shadow-xl shadow-indigo-600/20 group overflow-hidden" 
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                                COMMENCING...
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-3">
                                AUTHORIZE SETTLEMENT
                                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                            </div>
                        )}
                    </Button>
                </div>
             </div>

             {/* Trust Signals */}
             <div className="flex items-center justify-center gap-6 py-4">
                <div className="flex items-center gap-2 text-slate-400 grayscale opacity-50">
                    <ShieldCheck size={20} />
                    <span className="text-[9px] font-black uppercase tracking-widest">PCI-DSS COMPLIANT</span>
                </div>
                <div className="w-px h-4 bg-slate-200 dark:bg-white/10" />
                <div className="flex items-center gap-2 text-slate-400 grayscale opacity-50">
                    <Lock size={18} />
                    <span className="text-[9px] font-black uppercase tracking-widest">256-BIT AES MAPPING</span>
                </div>
             </div>
          </div>
        </form>
      </div>
    </div>
  );
}
