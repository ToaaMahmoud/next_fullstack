"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  normalizeOrder,
  normalizeProduct,
  requestJSON,
} from "../../lib/api-client";
import { formatPrice } from "../../lib/format";
import { useUserStore } from "../../lib/stores/user-store";

export default function AccountPage() {
  const user = useUserStore((state) => state.user);
  const favorites = useUserStore((state) => state.favorites);
  const updateProfile = useUserStore((state) => state.updateProfile);
  const [orders, setOrders] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [profileMessage, setProfileMessage] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function load() {
      if (!user) return;

      try {
        setLoadError("");
        const [ordersResponse, productsResponse] = await Promise.all([
          requestJSON("/api/orders", { method: "GET" }),
          requestJSON("/api/products?limit=1000", { method: "GET" }),
        ]);

        const catalog = (productsResponse.products || []).map(normalizeProduct);
        setOrders((ordersResponse.orders || []).map(normalizeOrder));
        setFavoriteProducts(catalog.filter((product) => favorites.includes(product.id)));
      } catch (error) {
        setLoadError(error.message || "Failed to load account data");
      }
    }

    load();
  }, [favorites, user]);

  async function handleProfileBlur(field, value) {
    try {
      setProfileMessage("");
      await updateProfile({ [field]: value });
      setProfileMessage("Profile saved.");
    } catch (error) {
      setProfileMessage(error.message || "Failed to save profile.");
    }
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-[1100px] px-4 md:px-8 py-16">
        <div className="border-thicker border-ink bg-paper p-10 shadow-block text-center">
          <div className="font-display text-4xl uppercase">Account preview</div>
          <p className="mt-4 max-w-lg mx-auto">
            Sign in to view profile details, order history, saved favorites, and review activity.
          </p>
          <Link href="/signin" className="mt-6 inline-block bg-ink text-paper border-thick px-6 py-3 font-mono-tag shadow-block-sm hover-pop">
            Sign in →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-10">
      <header className="border-thicker border-ink bg-paper p-8 shadow-block-sm flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono-tag opacity-70">Profile management</div>
          <h1 className="mt-2 font-display text-6xl uppercase tracking-tighter">{user.name}</h1>
        </div>
        <div className={`border-thick px-4 py-2 font-mono-tag shadow-block-sm ${user.emailConfirmed ? "bg-pop-lime" : "bg-pop-pink"}`}>
          {user.emailConfirmed ? "Email confirmed" : "Confirmation pending"}
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <section className="lg:col-span-5 space-y-6">
          <div className="border-thicker border-ink bg-paper p-6 shadow-block-sm">
            <div className="font-display text-2xl uppercase">Details</div>
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="font-mono-tag block mb-1">Full name</span>
                <input
                  defaultValue={user.name}
                  onBlur={(event) => handleProfileBlur("name", event.target.value)}
                  className="w-full border-thick bg-background px-3 py-2 outline-none"
                />
              </label>
              <label className="block">
                <span className="font-mono-tag block mb-1">Address</span>
                <input
                  defaultValue={user.address}
                  onBlur={(event) => handleProfileBlur("address", event.target.value)}
                  className="w-full border-thick bg-background px-3 py-2 outline-none"
                />
              </label>
            </div>
            {profileMessage ? (
              <div className="mt-4 font-mono-tag text-sm">{profileMessage}</div>
            ) : null}
          </div>

          <div className="border-thicker border-ink bg-pop-yellow p-6 shadow-block-sm">
            <div className="font-display text-2xl uppercase">Saved payment + wallet</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="border-thick bg-paper p-4">
                <div className="font-mono-tag opacity-70">Default method</div>
                <div className="mt-2 font-display text-xl uppercase">{user.paymentDetails?.method}</div>
              </div>
              <div className="border-thick bg-paper p-4">
                <div className="font-mono-tag opacity-70">Wallet balance</div>
                <div className="mt-2 font-display text-xl uppercase">{formatPrice(user.paymentDetails?.walletBalance || 0)}</div>
              </div>
            </div>
          </div>

          {loadError ? (
            <div className="border-thick bg-pop-pink p-4 font-mono-tag text-sm">
              {loadError}
            </div>
          ) : null}
        </section>

        <section className="lg:col-span-7 space-y-6">
          <div className="border-thicker border-ink bg-paper p-6 shadow-block-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="font-display text-2xl uppercase">Wishlist & favorites</div>
              <div className="font-mono-tag">{favoriteProducts.length} saved</div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {favoriteProducts.length === 0 ? (
                <div className="border-thick border-dashed p-6 font-mono-tag text-sm">No favorites yet.</div>
              ) : (
                favoriteProducts.map((product) => (
                  <Link key={product.id} href={`/product/${product.id}`} className="border-thick bg-pop-beige p-4 shadow-block-sm hover-pop">
                    <div className="font-display text-xl uppercase">{product.name}</div>
                    <div className="mt-2 text-sm">{product.description}</div>
                    <div className="mt-3 font-mono-tag">{formatPrice(product.price)}</div>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="border-thicker border-ink bg-paper p-6 shadow-block-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="font-display text-2xl uppercase">Order history</div>
              <Link href="/account/orders" className="font-mono-tag underline">Track all orders</Link>
            </div>
            <div className="mt-4 space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border-thick p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-display text-xl uppercase">{order.id}</div>
                      <div className="font-mono-tag opacity-70">{order.createdAt}</div>
                    </div>
                    <div className="bg-pop-lime border-thick px-3 py-1 font-mono-tag">{order.status}</div>
                  </div>
                  <div className="mt-3 text-sm">Payment: {order.paymentMethod} · Total: {formatPrice(order.total)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
