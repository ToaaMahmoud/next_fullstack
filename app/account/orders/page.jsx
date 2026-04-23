"use client";

import { useEffect, useState } from "react";
import { normalizeOrder, requestJSON } from "../../../lib/api-client";
import { formatPrice } from "../../../lib/format";
import { useUserStore } from "../../../lib/stores/user-store";

export default function OrdersPage() {
  const user = useUserStore((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function load() {
      if (!user) return;

      try {
        setErrorMessage("");
        const data = await requestJSON("/api/orders", { method: "GET" });
        setOrders((data.orders || []).map(normalizeOrder));
      } catch (error) {
        setErrorMessage(error.message || "Failed to load orders.");
      }
    }
    load();
  }, [user]);

  return (
    <div className="mx-auto max-w-[1200px] px-4 md:px-8 py-10">
      <header className="border-thicker border-ink bg-paper p-8 shadow-block-sm">
        <div className="font-mono-tag opacity-70">Order tracking</div>
        <h1 className="mt-2 font-display text-6xl uppercase tracking-tighter">Orders</h1>
      </header>

      <div className="mt-8 space-y-6">
        {errorMessage ? (
          <div className="border-thick bg-pop-pink p-4 font-mono-tag">
            {errorMessage}
          </div>
        ) : null}
        {orders.length === 0 ? (
          <div className="border-thicker border-dashed border-ink bg-paper p-10 font-mono-tag">
            No orders yet for this account.
          </div>
        ) : (
          orders.map((order) => (
            <article key={order.id} className="border-thicker border-ink bg-paper p-6 shadow-block-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="font-display text-3xl uppercase">{order.id}</div>
                  <div className="mt-2 font-mono-tag opacity-70">
                    {order.createdAt} · ETA {order.eta}
                  </div>
                </div>
                <div className="bg-pop-yellow border-thick px-4 py-2 font-mono-tag">
                  {order.status}
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-5 border-thick p-4">
                  <div className="font-mono-tag opacity-70">Order summary</div>
                  <div className="mt-3 space-y-2 text-sm">
                    <div>Total: {formatPrice(order.total)}</div>
                    <div>Payment: {order.paymentMethod}</div>
                    <div>Shipping address: {order.shippingAddress}</div>
                    <div>Tracking: {order.trackingNumber || "Not assigned yet"}</div>
                  </div>
                </div>
                <div className="lg:col-span-7 border-thick p-4">
                  <div className="font-mono-tag opacity-70">Items</div>
                  <div className="mt-4 space-y-4">
                    {order.items.map((item) => (
                      <div key={`${order.id}-${item.product?._id || item.product?.id || item.product || item.price}`} className="flex gap-4">
                        <div className="mt-1 size-4 border-thick bg-pop-yellow" />
                        <div>
                          <div className="font-display text-xl uppercase">
                            {item.product?.name || "Product"}
                          </div>
                          <div className="font-mono-tag opacity-70">
                            Qty {item.quantity}
                          </div>
                          <p className="mt-1 text-sm">
                            Line total: {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
