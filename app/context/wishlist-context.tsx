"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useCustomerAuth } from "./customer-auth-context";

export interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  isInitialized: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { customer, isInitialized: authInitialized } = useCustomerAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const getStorageKey = useCallback((customerId?: string | null) => {
    return customerId ? `flashtech_wishlist_${customerId}` : "flashtech_wishlist_guest";
  }, []);

  // Load wishlist
  useEffect(() => {
    if (!authInitialized) return;

    const currentId = customer?.id || null;
    const storageKey = getStorageKey(currentId);
    
    const savedWishlist = localStorage.getItem(storageKey);
    let loadedItems: WishlistItem[] = [];
    
    if (savedWishlist) {
      try {
        loadedItems = JSON.parse(savedWishlist);
      } catch (e) {
        console.error("Failed to parse wishlist items", e);
      }
    }

    setWishlistItems(loadedItems);
    setIsInitialized(true);
  }, [customer?.id, authInitialized, getStorageKey]);

  // Save wishlist
  useEffect(() => {
    if (isInitialized && authInitialized) {
      const storageKey = getStorageKey(customer?.id);
      localStorage.setItem(storageKey, JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isInitialized, authInitialized, customer?.id, getStorageKey]);

  const addToWishlist = useCallback((newItem: WishlistItem) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.id === newItem.id);
      if (exists) {
        return prev;
      }
      toast.success(`Đã thêm ${newItem.name} vào danh sách yêu thích`);
      return [...prev, newItem];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlistItems((prev) => {
        const item = prev.find(i => i.id === productId);
        if (item) {
            toast.info(`Đã xóa ${item.name} khỏi danh sách yêu thích`);
        }
        return prev.filter((item) => item.id !== productId);
    });
  }, []);

  const isInWishlist = useCallback((productId: string) => {
    return wishlistItems.some((item) => item.id === productId);
  }, [wishlistItems]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        isInitialized,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
