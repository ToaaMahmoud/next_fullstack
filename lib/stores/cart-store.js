"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const SHIPPING_THRESHOLD = 200;
const DEFAULT_SHIPPING = 12;

export function getCartCount(items) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotals(items) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal === 0 || subtotal >= SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING;
  const tax = Number((subtotal * 0.1).toFixed(2));
  const total = Number((subtotal + shipping + tax).toFixed(2));
  return { subtotal, shipping, tax, total };
}

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock || 99) }
                  : item
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        })),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.product.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
            )
            .filter((item) => item.quantity > 0),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "monolith-cart-state",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
