"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { normalizeProduct, requestJSON } from "../../lib/api-client";
import { formatPrice } from "../../lib/format";
import { useUserStore } from "../../lib/stores/user-store";

export default function SellerPage() {
  const user = useUserStore((state) => state.user);
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function load() {
      if (!user) return;

      try {
        setErrorMessage("");
        const data = await requestJSON("/api/seller/products", { method: "GET" });
        setProducts((data.products || []).map(normalizeProduct));
      } catch (error) {
        setErrorMessage(error.message || "Failed to load seller products.");
      }
    }
    load();
  }, [user]);

  if (!user) {
    return null;
  }

  // if (products.length === 0 && !errorMessage) {
  //   return <div className="mx-auto max-w-[1200px] px-4 md:px-8 py-10 font-mono-tag">Loading seller studio...</div>;
  // }

  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-10">
      <header className="border-thicker border-ink bg-paper p-8 shadow-block-sm flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono-tag opacity-70">Seller management</div>
          <h1 className="mt-2 font-display text-6xl uppercase tracking-tighter">{user.storeName || user.name}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/add_product"
            className="border-thick bg-pop-red px-4 py-2 font-mono-tag text-paper shadow-block-sm hover-pop"
          >
            Add product
          </Link>
          <div className={`border-thick px-4 py-2 font-mono-tag shadow-block-sm ${user.status === "active" ? "bg-pop-lime" : "bg-pop-yellow"}`}>
            {user.status} seller
          </div>
        </div>
      </header>

      {errorMessage ? (
        <div className="mt-8 border-thick bg-pop-pink p-4 font-mono-tag">
          {errorMessage}
        </div>
      ) : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <section className="lg:col-span-4 space-y-6">
          <div className="border-thicker border-ink bg-paper p-6 shadow-block-sm">
            <div className="font-display text-2xl uppercase">Profile setup</div>
            <div className="mt-4 space-y-2 text-sm">
              <div>Name: {user.name}</div>
              <div>Email: {user.email}</div>
              <div>Phone: {user.phone}</div>
              <div>Address: {user.address}</div>
            </div>
          </div>

          <div className="border-thicker border-ink bg-pop-yellow p-6 shadow-block-sm">
            <div className="font-display text-2xl uppercase">Inventory health</div>
            <div className="mt-3 font-mono-tag">
              {products.some((product) => product.stock === 0)
                ? "Some products are out of stock"
                : "Stock levels look healthy"}
            </div>
            <div className="mt-4 grid gap-3">
              <div className="border-thick bg-paper p-4">
                <div className="font-mono-tag opacity-70">Listed products</div>
                <div className="mt-2 font-display text-3xl uppercase">{products.length}</div>
              </div>
              <div className="border-thick bg-paper p-4">
                <div className="font-mono-tag opacity-70">Out of stock</div>
                <div className="mt-2 font-display text-3xl uppercase">
                  {products.filter((product) => product.stock === 0).length}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="lg:col-span-8 space-y-6">
          <div className="border-thicker border-ink bg-paper p-6 shadow-block-sm">
            <div className="font-display text-2xl uppercase">Product listings</div>
            <div className="mt-4 space-y-3">
              {products.map((product) => (
                <div key={product.id} className="border-thick p-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-display text-xl uppercase">{product.name}</div>
                    <div className="font-mono-tag opacity-70">
                      {product.category} · {product.isActive ? "Active" : "Archived"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono-tag">{formatPrice(product.price)}</div>
                    <div className="text-sm">{product.stock} units in stock</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
