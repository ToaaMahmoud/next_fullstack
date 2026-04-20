"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginUser, registerUser } from "../mock-api";

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      favorites: [],
      isGuestCheckout: false,
      setGuestCheckout: (value) => set({ isGuestCheckout: value }),
      login: async (credentials) => {
        const user = await loginUser(credentials);
        set({ user, favorites: user.favorites || [], isGuestCheckout: false });
        return user;
      },
      register: async (payload) => {
        const user = await registerUser(payload);
        set({ user, favorites: [], isGuestCheckout: false });
        return user;
      },
      logout: () => set({ user: null, favorites: [], isGuestCheckout: false }),
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
