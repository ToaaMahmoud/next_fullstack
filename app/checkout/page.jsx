"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getPaymentMethods, placeMockOrder } from "../../lib/mock-api";
import { formatPrice } from "../../lib/format";
import { getCartTotals, useCartStore } from "../../lib/stores/cart-store";
import { useUserStore } from "../../lib/stores/user-store";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useUserStore((state) => state.user);
  const isGuestCheckout = useUserStore((state) => state.isGuestCheckout);
  const setGuestCheckout = useUserStore((state) => state.setGuestCheckout);
  const totals = useMemo(() => getCartTotals(items), [items]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Credit card");
  const [shippingMethod, setShippingMethod] = useState("Express");
  const [statusMessage, setStatusMessage] = useState("");
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  useEffect(() => {
    async function load() {
      setPaymentMethods(await getPaymentMethods());
    }
    load();
  }, []);

  async function handlePlaceOrder(event) {
    event.preventDefault();
    const result = await placeMockOrder({
      items,
      paymentMethod,
      shippingMethod,
      guest: !user || isGuestCheckout,
      ...form,
    });
    setStatusMessage(`${result.id} placed. ${result.emailNotification}`);
    clearCart();
    setGuestCheckout(false);
    setTimeout(() => router.push("/account/orders"), 900);
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-10">
      <header className="border-thicker border-ink bg-paper p-8 shadow-block-sm flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono-tag opacity-70">Checkout</div>
          <h1 className="mt-2 font-display text-6xl uppercase tracking-tighter">Finish the order</h1>
        </div>
        <button
          type="button"
          onClick={() => setGuestCheckout(!isGuestCheckout)}
          className={`border-thick px-4 py-2 font-mono-tag shadow-block-sm ${isGuestCheckout || !user ? "bg-pop-pink" : "bg-pop-lime"}`}
        >
          {isGuestCheckout || !user ? "Guest checkout" : "Signed-in checkout"}
        </button>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-6">
          <div className="border-thicker border-ink bg-paper p-6 shadow-block-sm">
            <div className="font-display text-2xl uppercase">Contact & shipping</div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {["name", "email", "phone", "address"].map((field) => (
                <label key={field} className={`block ${field === "address" ? "md:col-span-2" : ""}`}>
                  <span className="font-mono-tag block mb-1">{field}</span>
                  <input
                    value={form[field]}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, [field]: event.target.value }))
                    }
                    className="w-full border-thick bg-background px-3 py-2 outline-none"
                    required
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="border-thicker border-ink bg-paper p-6 shadow-block-sm">
            <div className="font-display text-2xl uppercase">Payment method</div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {paymentMethods.map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`border-thick p-4 text-left font-mono-tag shadow-block-sm ${paymentMethod === method ? "bg-ink text-paper" : "bg-pop-beige"}`}
                >
                  {method}
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm opacity-70">
              Secure gateway integration is intentionally mocked right now.
            </p>
          </div>

          <div className="border-thicker border-ink bg-pop-blue text-paper p-6 shadow-block-sm">
            <div className="font-display text-2xl uppercase">Delivery preferences</div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {["Express", "Standard"].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setShippingMethod(method)}
                  className={`border-thick border-paper p-4 text-left font-mono-tag ${shippingMethod === method ? "bg-paper text-ink" : ""}`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={items.length === 0}
            className="w-full bg-ink text-paper border-thick py-4 font-display text-xl uppercase tracking-wider shadow-block hover-press transition-all disabled:opacity-40"
          >
            Place mock order →
          </button>

          {statusMessage ? <div className="border-thick bg-pop-lime p-4 font-mono-tag">{statusMessage}</div> : null}
        </form>

        <aside className="lg:col-span-5">
          <div className="border-thicker border-ink bg-pop-yellow p-6 shadow-block sticky top-28">
            <div className="font-display text-2xl uppercase border-b-thick border-ink pb-3">Order summary</div>
            <div className="mt-4 space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="border-thick bg-paper p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-display text-xl uppercase">{item.product.name}</div>
                      <div className="font-mono-tag opacity-70">
                        Qty {item.quantity} · {item.product.stock} in stock
                      </div>
                    </div>
                    <div className="font-mono-tag">{formatPrice(item.product.price * item.quantity)}</div>
                  </div>
                </div>
              ))}
            </div>

            <dl className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="font-mono-tag">{formatPrice(totals.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd className="font-mono-tag">{totals.shipping === 0 ? "FREE" : formatPrice(totals.shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Tax</dt>
                <dd className="font-mono-tag">{formatPrice(totals.tax)}</dd>
              </div>
            </dl>

            <div className="mt-6 flex justify-between border-t-thick border-ink pt-4">
              <span className="font-display text-2xl uppercase">Total</span>
              <span className="font-display text-2xl">{formatPrice(totals.total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
