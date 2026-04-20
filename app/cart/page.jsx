"use client";

import Link from "next/link";
import { useMemo } from "react";
import { formatPrice } from "../../lib/format";
import { getCartTotals, useCartStore } from "../../lib/stores/cart-store";

export default function CartPage() {
    const lines = useCartStore((state) => state.items);
    const setQuantity = useCartStore((state) => state.setQuantity);
    const remove = useCartStore((state) => state.removeItem);
    const totals = useMemo(() => getCartTotals(lines), [lines]);

    return (
        <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-10">
            <div className="border-thicker border-ink bg-paper p-8 shadow-block-sm flex items-end justify-between flex-wrap gap-4">
                <div>
                    <div className="font-mono-tag">Bag</div>
                    <h1 className="mt-2 font-display text-6xl uppercase tracking-tighter">Your cart</h1>
                </div>
                <div className="bg-pop-red text-paper border-thick px-4 py-2 font-mono-tag rotate-2 shadow-block-sm">
                    {lines.length} item{lines.length === 1 ? "" : "s"}
                </div>
            </div>

            {lines.length === 0 ? (
                <div className="mt-12 border-thicker border-dashed border-ink bg-paper p-16 text-center">
                    <div className="font-display text-3xl uppercase">Your bag is empty</div>
                    <Link href="/shop" className="mt-6 inline-block bg-ink text-paper border-thick px-6 py-3 font-mono-tag shadow-block-sm hover-pop">
                        Browse the shop →
                    </Link>
                </div>
            ) : (
                <div className="mt-8 grid gap-8 md:grid-cols-12">

                    <div className="md:col-span-8 space-y-4">
                        {lines.map((l) => (
                            <div key={l.product.id} className="bg-paper border-thicker border-ink p-4 shadow-block-sm flex gap-4">
                                <img src={l.product.image} alt={l.product.name} className="h-28 w-28 object-cover border-thick" />

                                <div className="flex flex-1 flex-col">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="font-mono-tag opacity-70 text-sm">{l.product.category}</div>
                                            <Link href={`/product/${l.product.id}`} className="mt-1 font-display text-xl uppercase hover:underline">
                                                {l.product.name}
                                            </Link>
                                            <div className="mt-2 text-sm opacity-70">{l.product.description}</div>
                                        </div>
                                        <div className="bg-pop-yellow border-thick px-3 py-1 font-mono-tag">
                                            {formatPrice(l.product.price * l.quantity)}
                                        </div>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex border-thick bg-paper">
                                            <button
                                                onClick={() => setQuantity(l.product.id, Math.max(1, l.quantity - 1))}
                                                className="px-3 py-1 hover:bg-ink hover:text-paper transition-colors"
                                            >
                                                −
                                            </button>
                                            <span className="border-x-thick px-4 py-1 font-mono-tag">{l.quantity}</span>
                                            <button
                                                onClick={() => setQuantity(l.product.id, l.quantity + 1)}
                                                className="px-3 py-1 hover:bg-ink hover:text-paper transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => remove(l.product.id)}
                                            className="font-mono-tag underline text-sm hover:text-pop-red"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>


                    <aside className="md:col-span-4">
                        <div className="bg-pop-yellow border-thicker border-ink p-6 shadow-block sticky top-28">
                            <div className="font-display text-2xl uppercase border-b-thick border-ink pb-3">Summary</div>

                            <dl className="mt-4 space-y-2 text-sm">
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

                            <Link href="/checkout" className="mt-6 block bg-ink text-paper border-thick px-6 py-4 text-center font-display text-lg uppercase tracking-wider shadow-block-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                Checkout →
                            </Link>

                            <Link href="/shop" className="mt-3 block text-center font-mono-tag underline text-sm">
                                Continue shopping
                            </Link>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}
