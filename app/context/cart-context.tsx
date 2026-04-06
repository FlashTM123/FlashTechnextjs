"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { useCustomerAuth } from "./customer-auth-context";

export interface CartItem {
  id: string; // Composite ID: productId-variantId
  productId: string;
  variantId: string | null;
  name: string;
  variantName: string | null;
  image: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  isInitialized: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { customer, isInitialized: authInitialized } = useCustomerAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const prevCustomerId = useRef<string | null | undefined>(undefined);

  // Helper to get storage key
  const getStorageKey = useCallback((customerId?: string | null) => {
    return customerId ? `flashtech_cart_${customerId}` : "flashtech_cart_guest";
  }, []);

  // Load cart whenever customer ID changes
  useEffect(() => {
    if (!authInitialized) return;

    const currentId = customer?.id || null;
    const storageKey = getStorageKey(currentId);
    
    // Initial Load or User Switch
    const savedCart = localStorage.getItem(storageKey);
    let loadedItems: CartItem[] = [];
    
    if (savedCart) {
      try {
        loadedItems = JSON.parse(savedCart);
      } catch (e) {
        console.error("Failed to parse cart items", e);
      }
    }

    // SPECIAL CASE: Moving from Guest to User (Login)
    // We merge the guest cart into the user's cart
    if (prevCustomerId.current === null && currentId) {
       const guestCart = localStorage.getItem(getStorageKey(null));
       if (guestCart) {
         try {
           const guestItems: CartItem[] = JSON.parse(guestCart);
           if (guestItems.length > 0) {
             // Merge guest items into loadedItems
             guestItems.forEach(guestItem => {
                const existingIndex = loadedItems.findIndex(i => i.id === guestItem.id);
                if (existingIndex > -1) {
                  loadedItems[existingIndex].quantity += guestItem.quantity;
                } else {
                  loadedItems.push(guestItem);
                }
             });
             toast.success("Giỏ hàng khách của bạn đã được hợp nhất vào tài khoản!");
             // Clear guest cart after merge
             localStorage.removeItem(getStorageKey(null));
           }
         } catch (e) {}
       }
    }

    setCartItems(loadedItems);
    setIsInitialized(true);
    prevCustomerId.current = currentId;
  }, [customer?.id, authInitialized, getStorageKey]);

  // Save cart whenever it changes
  useEffect(() => {
    if (isInitialized && authInitialized) {
      const storageKey = getStorageKey(customer?.id);
      localStorage.setItem(storageKey, JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized, authInitialized, customer?.id, getStorageKey]);

  const addToCart = useCallback((newItem: CartItem) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.id === newItem.id);

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        toast.success(`Đã thêm ${newItem.name} vào giỏ hàng`);
        return updatedItems;
      }

      toast.success(`Đã thêm ${newItem.name} vào giỏ hàng`);
      return [...prevItems, newItem];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    toast.info("Đã xóa sản phẩm khỏi giỏ hàng");
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem("flashtech_cart");
  }, []);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
        isInitialized,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
