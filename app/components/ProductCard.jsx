"use client";

import Link from "next/link";
import { useCartStore } from "../../lib/stores/cart-store";
import { useUserStore } from "../../lib/stores/user-store";
import { formatPrice } from "../../lib/format";
import Image from "next/image";

const tagColors = ["bg-pop-yellow", "bg-pop-red text-paper", "bg-pop-blue text-paper", "bg-paper"];
const rotations = ["rotate-1", "-rotate-1", "rotate-0", "-rotate-2"];

export default function ProductCard({ product, index = 0, cat = null }) {
    const tagColor = tagColors[index % tagColors.length];
    const rot = rotations[index % rotations.length];
    const addItem = useCartStore((state) => state.addItem);
    const toggleFavorite = useUserStore((state) => state.toggleFavorite);
    const isWished = useUserStore((state) => state.hasFavorite(product.id));

    const handleAdd = () => {
        addItem(product, 1);
    };

    const handleToggleWish = async () => {
        try {
            await toggleFavorite(product.id);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={`group relative bg-paper border-thicker border-ink p-4 shadow-block-sm transition-transform hover:-translate-y-1 hover:shadow-block ${rot}`}>


            <div className="absolute -top-3 -right-3 z-20 border-thick bg-ink text-paper px-3 py-1 font-mono-tag rotate-3">
                {formatPrice(product.price)}
            </div>

            <Link href={`/product/${product.id}`} className="block">
                <div className="aspect-square bg-pop-beige border-thick overflow-hidden relative">
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={0}
                        height={0}
                        loading="lazy"
                        unoptimized
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
            </Link>

            {cat && (
                <div className={`absolute -bottom-3 left-4 z-10 border-thick px-3 py-1 font-mono-tag -rotate-2 ${tagColor}`}>
                    {/* {product.category} */}
                    {cat}
                </div>
            )}

            <div className="pt-5 pb-1">
                <Link href={`/product/${product.id}`}>
                    <h3 className="font-display text-xl uppercase leading-tight tracking-tight">
                        {product.name}
                    </h3>
                </Link>
                <p className="mt-2 text-sm opacity-80">{product.description}</p>
                <div className="mt-3 flex items-center justify-between font-mono-tag text-[11px]">
                    <span>{product.stock > 0 ? `${product.stock} in stock` : "Sold out"}</span>
                    <span>{product.rating} / 5</span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleAdd}
                        className="flex-1 bg-ink text-paper px-3 py-2 font-mono-tag hover:bg-pop-red transition-colors"
                    >
                        Add +
                    </button>
                    <button
                        type="button"
                        aria-label="Wishlist"
                        onClick={handleToggleWish}
                        className="border-thick px-3 py-2 hover:bg-ink hover:text-paper transition-all"
                    >
                        {isWished ? "♥" : "♡"}
                    </button>
                </div>
            </div>
        </div>
    );
}
