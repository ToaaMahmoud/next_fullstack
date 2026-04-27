"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
    normalizeCategory,
    normalizeProduct,
    requestJSON,
} from "../../lib/api-client";
import ProductCard from "../components/ProductCard";

// 1. We move the logic into a separate component
function ShopContent() {
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
    const [maxPrice, setMaxPrice] = useState(5000);
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
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    // --- FILTERING & SORTING LOGIC ---
    const filtered = (() => {
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
    })();

    const categoryMap = Object.fromEntries(
        catalog.categories.map(c => [c.id, c.name])
    );

    return (
        <div className="mx-auto max-w-350 px-4 md:px-8 py-10 min-h-screen">
            {/* HEADER */}
            <header className="border-thicker border-ink bg-paper p-8 shadow-block-sm flex flex-wrap items-end justify-between gap-4">
                <div>
                    <div className="font-mono-tag text-sm uppercase tracking-widest opacity-70">Catalog</div>
                    <h1 className="mt-2 font-display text-6xl md:text-7xl uppercase tracking-tighter">All goods</h1>
                </div>
                <div className="bg-pop-yellow border-thick px-6 py-2 font-mono-tag -rotate-2 shadow-block-sm">
                    {filtered.length} {filtered.length === 1 ? "item" : "results"}
                </div>
            </header>

            <div className="mt-8 flex flex-col md:grid md:grid-cols-12 gap-8 items-start">
                {/* ASIDE FILTERS */}
                <aside className="order-1 md:col-span-3 space-y-6 w-full md:sticky top-24">
                    <div className="border-thicker border-ink bg-paper p-5 shadow-block-sm">
                        <label className="font-mono-tag block mb-2 text-xs uppercase">Search</label>
                        <input
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                updateFilters("q", e.target.value);
                            }}
                            placeholder="Type to search..."
                            className="w-full border-thick bg-background px-3 py-2 outline-none focus:bg-white transition-all"
                        />
                    </div>

                    <div className="border-thicker border-ink bg-paper p-5 shadow-block-sm">
                        <div className="font-mono-tag mb-4 text-xs uppercase border-b-thick border-ink pb-2">Categories</div>
                        <ul className="space-y-3">
                            <li>
                                <button
                                    onClick={() => updateFilters("category", null)}
                                    className={`w-full text-left font-mono-tag text-sm ${!currentCategory ? "font-bold text-pop-red underline" : ""}`}
                                >
                                    [ ALL ITEMS ]
                                </button>
                            </li>
                            {catalog.categories.map((c) => (
                                <li key={c.id}>
                                    <button
                                        onClick={() => updateFilters("category", c.id)}
                                        className={`w-full text-left font-mono-tag text-sm ${currentCategory === c.id ? "font-bold text-pop-red underline" : ""}`}
                                    >
                                        → {c.name.toUpperCase()} <span className="text-[10px] opacity-40">({c.count})</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="border-thicker border-ink bg-pop-yellow p-5 shadow-block-sm">
                        <div className="font-mono-tag mb-3 text-xs uppercase">Budget Cap · ${maxPrice}</div>
                        <input
                            type="range"
                            min={20}
                            max={10000}
                            step={10}
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="w-full accent-ink"
                        />
                    </div>
                </aside>

                {/* MAIN PRODUCTS GRID */}
                <main className="order-2 md:col-span-9 min-h-150 w-full">
                    {filtered.length === 0 ? (
                        <div className="w-full border-thicker border-dashed border-ink bg-paper p-20 text-center shadow-block-sm">
                            <div className="font-display text-4xl uppercase">Zero matches</div>
                            <button
                                onClick={() => { setQuery(""); setMaxPrice(5000); router.push(pathname); }}
                                className="mt-8 bg-ink text-paper border-thick px-8 py-3 font-mono-tag"
                            >
                                Reset Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {filtered.map((p, i) => (
                                <ProductCard key={p.id} product={p} cat={categoryMap[p.category]} index={i} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

// 2. THE FIX: Default export wraps the logic in Suspense
export default function ShopPage() {
    return (
        <Suspense fallback={<div className="p-20 text-center font-mono-tag">LOADING CATALOG...</div>}>
            <ShopContent />
        </Suspense>
    );
}