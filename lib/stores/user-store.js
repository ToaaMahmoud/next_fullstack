"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { normalizeUser, requestJSON } from "../api-client";

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
            user: data.user ? normalizeUser(data.user) : null,
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
        const user = normalizeUser(data.user);
        set({ user, favorites: user.favorites || [], isGuestCheckout: false });
        return user;
      },
      register: async (payload) => {
        const data = await requestJSON("/api/auth/register", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        const user = normalizeUser(data.user);
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
      updateProfile: async (updates) => {
        const data = await requestJSON("/api/auth/me", {
          method: "PUT",
          body: JSON.stringify(updates),
        });

        const user = normalizeUser(data.user);
        set({ user, favorites: user.favorites || [] });
        return user;
      },
      toggleFavorite: async (productId) => {
        const { user, favorites } = get();

        if (!user) {
          const hasItem = favorites.includes(productId);
          const nextFavorites = hasItem
            ? favorites.filter((id) => id !== productId)
            : [...favorites, productId];

          set({ favorites: nextFavorites });
          return nextFavorites;
        }

        const hasItem = favorites.includes(productId);
        const url = hasItem
          ? `/api/auth/favorites?productId=${encodeURIComponent(productId)}`
          : "/api/auth/favorites";
        const data = await requestJSON(url, {
          method: hasItem ? "DELETE" : "POST",
          body: hasItem ? undefined : JSON.stringify({ productId }),
        });

        set((state) => ({
          favorites: data.favorites,
          user: state.user
            ? normalizeUser({ ...state.user, favorites: data.favorites })
            : state.user,
        }));

        return data.favorites;
      },
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
