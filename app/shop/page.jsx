"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
    normalizeCategory,
    normalizeProduct,
    requestJSON,
} from "../../lib/api-client";
import ProductCard from "../components/ProductCard";

export default function ShopPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [catalog, setCatalog] = useState({ products: [], categories: [] });

    // --- URL STATE ---
    const currentCategory = searchParams.get("category");
    const initialQuery = searchParams.get("q") || "";
    const stockFilter = searchParams.get("stock") === "in";

    // --- COMPONENT STATE ---
    const [query, setQuery] = useState(initialQuery);
    const [maxPrice, setMaxPrice] = useState(500);
    const [sort, setSort] = useState("featured");

    useEffect(() => {
        async function load() {
            try {
                const [productsResponse, categoriesResponse] = await Promise.all([
                    requestJSON("/api/products?limit=1000", { method: "GET" }),
                    requestJSON("/api/categories", { method: "GET" }),
                ]);

                const products = (productsResponse.products || []).map(normalizeProduct);
                const categories = (categoriesResponse.categories || []).map((category) =>
                    normalizeCategory(category, products)
                );

                setCatalog({ products, categories });
            } catch (error) {
                setCatalog({ products: [], categories: [] });
                console.error(error);
            }
        }
        load();
    }, []);

    // --- URL UPDATE LOGIC ---
    const updateFilters = (key, value) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        // Prevents page jumping to top on every interaction
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    // --- FILTERING & SORTING LOGIC ---
    const filtered = useMemo(() => {
        let result = catalog.products.filter((p) => p.price <= maxPrice);

        if (currentCategory) {
            result = result.filter((p) => p.category === currentCategory);
        }

        if (stockFilter) {
            result = result.filter((p) => p.stock > 0);
        }

        if (query.trim()) {
            const q = query.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.description?.toLowerCase().includes(q)
            );
        }

        if (sort === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
        if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price);

        return result;
    }, [catalog.products, currentCategory, query, maxPrice, sort, stockFilter]);

    return (
        <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-10 min-h-screen">

            {/* 1. HEADER SECTION */}
            <header className="border-thicker border-ink bg-paper p-8 shadow-block-sm flex flex-wrap items-end justify-between gap-4">
                <div>
                    <div className="font-mono-tag text-sm uppercase tracking-widest opacity-70">Catalog</div>
                    <h1 className="mt-2 font-display text-6xl md:text-7xl uppercase tracking-tighter">
                        All goods
                    </h1>
                </div>
                <div className="bg-pop-yellow border-thick px-6 py-2 font-mono-tag -rotate-2 shadow-block-sm">
                    {filtered.length} {filtered.length === 1 ? "item" : "results"}
                </div>
            </header>

            {/* 2. MAIN LAYOUT GRID */}
            <div className="mt-8 flex flex-col md:grid md:grid-cols-12 gap-8 items-start">

                {/* --- ASIDE: FILTERS (order-1: Top on Mobile, Left on Desktop) --- */}
                <aside className="order-1 md:col-span-3 space-y-6 w-full md:sticky top-24">

                    {/* Text Search */}
                    <div className="border-thicker border-ink bg-paper p-5 shadow-block-sm">
                        <label className="font-mono-tag block mb-2 text-xs uppercase">Search</label>
                        <input
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                updateFilters("q", e.target.value);
                            }}
                            placeholder="Type to search..."
                            className="w-full border-thick bg-background px-3 py-2 outline-none focus:bg-white transition-all placeholder:opacity-30"
                        />
                    </div>

                    {/* Categories */}
                    <div className="border-thicker border-ink bg-paper p-5 shadow-block-sm">
                        <div className="font-mono-tag mb-4 text-xs uppercase border-b-thick border-ink pb-2">Categories</div>
                        <ul className="space-y-3">
                            <li>
                                <button
                                    onClick={() => updateFilters("category", null)}
                                    className={`w-full text-left font-mono-tag text-sm transition-all hover:translate-x-1 ${!currentCategory ? "font-bold text-pop-red underline underline-offset-4" : ""
                                        }`}
                                >
                                    [ ALL ITEMS ]
                                </button>
                            </li>
                            {catalog.categories.map((c) => (
                                <li key={c.id}>
                                    <button
                                        onClick={() => updateFilters("category", c.id)}
                                        className={`w-full text-left font-mono-tag text-sm transition-all hover:translate-x-1 ${currentCategory === c.id ? "font-bold text-pop-red underline underline-offset-4" : ""
                                            }`}
                                    >
                                        → {c.name.toUpperCase()} <span className="text-[10px] opacity-40">({c.count})</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Price Range */}
                    <div className="border-thicker border-ink bg-pop-yellow p-5 shadow-block-sm">
                        <div className="font-mono-tag mb-3 text-xs uppercase">Budget Cap · ${maxPrice}</div>
                        <input
                            type="range"
                            min={20}
                            max={500}
                            step={10}
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="w-full accent-ink cursor-pointer"
                        />
                    </div>

                    <div className="border-thicker border-ink bg-paper p-5 shadow-block-sm">
                        <div className="font-mono-tag mb-3 text-xs uppercase">Availability</div>
                        <button
                            type="button"
                            onClick={() => updateFilters("stock", stockFilter ? null : "in")}
                            className={`w-full border-thick px-3 py-3 font-mono-tag shadow-block-sm ${stockFilter ? "bg-pop-lime" : "bg-background"}`}
                        >
                            {stockFilter ? "In-stock only" : "Show all stock"}
                        </button>
                    </div>

                    {/* Sort */}
                    <div className="border-thicker border-ink bg-paper p-5 shadow-block-sm">
                        <div className="font-mono-tag mb-2 text-xs uppercase">Sort by</div>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="w-full border-thick bg-background px-2 py-2 outline-none cursor-pointer font-mono-tag text-sm"
                        >
                            <option value="featured">Featured</option>
                            <option value="price-asc">Price ↑ (Low to High)</option>
                            <option value="price-desc">Price ↓ (High to Low)</option>
                        </select>
                    </div>
                </aside>

                {/* --- MAIN: PRODUCTS (order-2: Below Filters on Mobile, Right on Desktop) --- */}
                <main className="order-2 md:col-span-9 min-h-[600px] w-full">
                    {filtered.length === 0 ? (
                        <div className="w-full border-thicker border-dashed border-ink bg-paper p-12 md:p-20 text-center shadow-block-sm flex flex-col items-center justify-center relative overflow-hidden">
                            {/* Decorative Deco */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none flex items-center justify-center text-[10rem] md:text-[15rem] font-display">
                                EMPTY
                            </div>

                            <div className="relative z-10">
                                <div className="font-display text-4xl uppercase tracking-tighter">Zero matches</div>
                                <p className="mt-4 font-mono-tag opacity-70 max-w-xs mx-auto text-sm">
                                    No items found with current filters.
                                </p>
                                <button
                                    onClick={() => {
                                        setQuery("");
                                        setMaxPrice(500);
                                        router.push(pathname);
                                    }}
                                    className="mt-8 bg-ink text-paper border-thick px-8 py-3 font-mono-tag uppercase tracking-widest hover:bg-pop-red transition-colors shadow-block-sm active:translate-y-1 active:shadow-none"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-500">
                            {filtered.map((p, i) => (
                                <ProductCard key={p.id} product={p} index={i} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
