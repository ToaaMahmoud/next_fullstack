"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const formatPrice = (price) => `$${price.toFixed(2)}`;

const tagColors = ["bg-pop-yellow", "bg-pop-red text-paper", "bg-pop-blue text-paper", "bg-paper"];
const rotations = ["rotate-1", "-rotate-1", "rotate-0", "-rotate-2"];

export default function ProductCard({ product, index = 0 }) {
    // Mocking cart/wishlist state until connecting to actual store
    const [isWished, setIsWished] = useState(false);

    const tagColor = tagColors[index % tagColors.length];
    const rot = rotations[index % rotations.length];

    const handleAdd = () => {
        console.log("Added to cart:", product.id);
    };

    const handleToggleWish = () => {
        setIsWished(!isWished);
    };

    return (
        <div className={`group relative bg-paper border-thicker border-ink p-4 shadow-block-sm transition-transform hover:-translate-y-1 hover:shadow-block ${rot}`}>


            <div className="absolute -top-3 -right-3 z-20 border-thick bg-ink text-paper px-3 py-1 font-mono-tag rotate-3">
                {formatPrice(product.price)}
            </div>

            <Link href={`/product/${product.id}`} className="block">
                <div className="aspect-square bg-pop-beige border-thick overflow-hidden relative">
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
            </Link>

            <div className={`absolute -bottom-3 left-4 z-10 border-thick px-3 py-1 font-mono-tag -rotate-2 ${tagColor}`}>
                {product.category}
            </div>

            <div className="pt-5 pb-1">
                <Link href={`/product/${product.id}`}>
                    <h3 className="font-display text-xl uppercase leading-tight tracking-tight">
                        {product.name}
                    </h3>
                </Link>

                <div className="mt-3 flex items-center gap-2">
                    <button
                        onClick={handleAdd}
                        className="flex-1 bg-ink text-paper px-3 py-2 font-mono-tag hover:bg-pop-red transition-colors"
                    >
                        Add +
                    </button>
                    <button
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