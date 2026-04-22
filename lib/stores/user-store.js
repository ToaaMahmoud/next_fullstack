"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

async function requestJSON(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }
  return data;
}

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      favorites: [],
      isGuestCheckout: false,
      setGuestCheckout: (value) => set({ isGuestCheckout: value }),
      hydrateUser: async () => {
        try {
          const data = await requestJSON("/api/auth/me", { method: "GET" });
          set({
            user: data.user,
            favorites: data.user?.favorites || [],
          });
        } catch {
          set({ user: null, favorites: [] });
        }
      },
      login: async (credentials) => {
        const data = await requestJSON("/api/auth/login", {
          method: "POST",
          body: JSON.stringify(credentials),
        });
        const user = data.user;
        set({ user, favorites: user.favorites || [], isGuestCheckout: false });
        return user;
      },
      register: async (payload) => {
        const data = await requestJSON("/api/auth/register", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        const user = data.user;
        set({ user, favorites: [], isGuestCheckout: false });
        return user;
      },
      logout: async () => {
        try {
          await requestJSON("/api/auth/logout", { method: "POST" });
        } finally {
          set({ user: null, favorites: [], isGuestCheckout: false });
        }
      },
      updateProfile: (updates) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                ...updates,
                paymentDetails: {
                  ...state.user.paymentDetails,
                  ...(updates.paymentDetails || {}),
                },
              }
            : null,
        })),
      toggleFavorite: (productId) =>
        set((state) => {
          const hasItem = state.favorites.includes(productId);
          const favorites = hasItem
            ? state.favorites.filter((id) => id !== productId)
            : [...state.favorites, productId];

          return {
            favorites,
            user: state.user ? { ...state.user, favorites } : state.user,
          };
        }),
      hasFavorite: (productId) => get().favorites.includes(productId),
    }),
    {
      name: "monolith-user-state",
      partialize: (state) => ({
        user: state.user,
        favorites: state.favorites,
        isGuestCheckout: state.isGuestCheckout,
      }),
    }
  )
);
