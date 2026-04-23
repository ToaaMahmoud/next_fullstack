"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { requestJSON } from "../../lib/api-client";
import { formatPrice } from "../../lib/format";
import { getCartTotals, useCartStore } from "../../lib/stores/cart-store";
import { useUserStore } from "../../lib/stores/user-store";

const PAYMENT_METHODS = [
  { label: "Credit card", value: "credit_card" },
  { label: "PayPal", value: "paypal" },
  { label: "Cash on Delivery", value: "cash_on_delivery" },
  { label: "Wallet", value: "wallet" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useUserStore((state) => state.user);
  const totals = useMemo(() => getCartTotals(items), [items]);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].value);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formOverrides, setFormOverrides] = useState({});
  const form = {
    name: formOverrides.name ?? user?.name ?? "",
    email: formOverrides.email ?? user?.email ?? "",
    phone: formOverrides.phone ?? user?.phone ?? "",
    address: formOverrides.address ?? user?.address ?? "",
  };

  async function handlePlaceOrder(event) {
    event.preventDefault();

    if (!user) {
      setErrorMessage("Please sign in to place an order.");
      return;
    }

    try {
      setErrorMessage("");
      setStatusMessage("");

      await requestJSON("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          items: items.map((item) => ({
            product: item.product.id,
            quantity: item.quantity,
          })),
          shippingAddress: form.address,
          paymentMethod,
        }),
      });

      setStatusMessage("Order placed successfully.");
      clearCart();
      setTimeout(() => router.push("/account/orders"), 900);
    } catch (error) {
      setErrorMessage(error.message || "Failed to place order.");
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-10">
      <header className="border-thicker border-ink bg-paper p-8 shadow-block-sm flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono-tag opacity-70">Checkout</div>
          <h1 className="mt-2 font-display text-6xl uppercase tracking-tighter">Finish the order</h1>
        </div>
        <div className={`border-thick px-4 py-2 font-mono-tag shadow-block-sm ${user ? "bg-pop-lime" : "bg-pop-pink"}`}>
          {user ? "Signed-in checkout" : "Sign in required"}
        </div>
      </header>

      {!user ? (
        <div className="mt-8 border-thicker border-ink bg-paper p-8 shadow-block-sm">
          <div className="font-display text-3xl uppercase">Sign in to continue</div>
          <p className="mt-3 max-w-xl">
            Order creation is connected to the real API now, and guest checkout
            does not have a backend route yet.
          </p>
          <Link
            href="/signin"
            className="mt-6 inline-block bg-ink text-paper border-thick px-6 py-3 font-mono-tag shadow-block-sm hover-pop"
          >
            Sign in →
          </Link>
        </div>
      ) : null}

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
                      setFormOverrides((current) => ({
                        ...current,
                        [field]: event.target.value,
                      }))
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
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setPaymentMethod(method.value)}
                  className={`border-thick p-4 text-left font-mono-tag shadow-block-sm ${paymentMethod === method.value ? "bg-ink text-paper" : "bg-pop-beige"}`}
                >
                  {method.label}
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm opacity-70">
              Payment capture is still out of scope, but order creation now uses
              the real orders API.
            </p>
          </div>

          <button
            type="submit"
            disabled={items.length === 0 || !user}
            className="w-full bg-ink text-paper border-thick py-4 font-display text-xl uppercase tracking-wider shadow-block hover-press transition-all disabled:opacity-40"
          >
            Place order →
          </button>

          {statusMessage ? <div className="border-thick bg-pop-lime p-4 font-mono-tag">{statusMessage}</div> : null}
          {errorMessage ? <div className="border-thick bg-pop-pink p-4 font-mono-tag">{errorMessage}</div> : null}
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
