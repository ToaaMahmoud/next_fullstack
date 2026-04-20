"use client";

import { useEffect, useState } from "react";
import { getSellerDashboardData } from "../../lib/mock-api";
import { formatPrice } from "../../lib/format";
import { useUserStore } from "../../lib/stores/user-store";

export default function SellerPage() {
  const user = useUserStore((state) => state.user);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const sellerId = user?.role === "seller" ? user.id : "seller-01";
      setData(await getSellerDashboardData(sellerId));
    }
    load();
  }, [user]);

  if (!data) {
    return <div className="mx-auto max-w-[1200px] px-4 md:px-8 py-10 font-mono-tag">Loading seller studio...</div>;
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-10">
      <header className="border-thicker border-ink bg-paper p-8 shadow-block-sm flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono-tag opacity-70">Seller management</div>
          <h1 className="mt-2 font-display text-6xl uppercase tracking-tighter">{data.seller.storeName}</h1>
        </div>
        <div className={`border-thick px-4 py-2 font-mono-tag shadow-block-sm ${data.seller.status === "approved" ? "bg-pop-lime" : "bg-pop-yellow"}`}>
          {data.seller.status} seller
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <section className="lg:col-span-4 space-y-6">
          <div className="border-thicker border-ink bg-paper p-6 shadow-block-sm">
            <div className="font-display text-2xl uppercase">Profile setup</div>
            <div className="mt-4 space-y-2 text-sm">
              <div>Name: {data.seller.name}</div>
              <div>Email: {data.seller.email}</div>
              <div>Phone: {data.seller.phone}</div>
              <div>Address: {data.seller.address}</div>
            </div>
          </div>

          <div className="border-thicker border-ink bg-pop-yellow p-6 shadow-block-sm">
            <div className="font-display text-2xl uppercase">Inventory health</div>
            <div className="mt-3 font-mono-tag">{data.seller.inventoryHealth}</div>
            <div className="mt-4 grid gap-3">
              <div className="border-thick bg-paper p-4">
                <div className="font-mono-tag opacity-70">Listed products</div>
                <div className="mt-2 font-display text-3xl uppercase">{data.products.length}</div>
              </div>
              <div className="border-thick bg-paper p-4">
                <div className="font-mono-tag opacity-70">Orders requiring action</div>
                <div className="mt-2 font-display text-3xl uppercase">{data.orders.length}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="lg:col-span-8 space-y-6">
          <div className="border-thicker border-ink bg-paper p-6 shadow-block-sm">
            <div className="font-display text-2xl uppercase">Product listings</div>
            <div className="mt-4 space-y-3">
              {data.products.map((product) => (
                <div key={product.id} className="border-thick p-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-display text-xl uppercase">{product.name}</div>
                    <div className="font-mono-tag opacity-70">{product.sku} · {product.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono-tag">{formatPrice(product.price)}</div>
                    <div className="text-sm">{product.stock} units in stock</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-thicker border-ink bg-pop-blue text-paper p-6 shadow-block-sm">
            <div className="font-display text-2xl uppercase">Order & fulfillment queue</div>
            <div className="mt-4 space-y-3">
              {data.orders.map((order) => (
                <div key={order.id} className="border-thick border-paper p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-display text-xl uppercase">{order.id}</div>
                      <div className="font-mono-tag text-pop-yellow">{order.customerName}</div>
                    </div>
                    <div className="border-thick border-paper px-3 py-1 font-mono-tag">{order.status}</div>
                  </div>
                  <div className="mt-3 text-sm">
                    Shipping to {order.shippingAddress} · {order.paymentMethod}
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
