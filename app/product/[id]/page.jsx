"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductDetailClient from "./product-detail-client";
import { formatPrice } from "../../../lib/format";
import {
  normalizeProduct,
  normalizeReview,
  requestJSON,
} from "../../../lib/api-client";

export default function ProductPage() {
  const params = useParams();
  const productId = params?.id;
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function load() {
      if (!productId) return;

      try {
        setErrorMessage("");
        const [productsResponse, reviewsResponse] = await Promise.all([
          requestJSON("/api/products?limit=1000", { method: "GET" }),
          requestJSON(`/api/reviews?productId=${productId}`, { method: "GET" }),
        ]);

        const foundProduct = (productsResponse.products || [])
          .map(normalizeProduct)
          .find((item) => item.id === productId);

        if (!foundProduct) {
          setErrorMessage("Product not found.");
          setProduct(null);
          return;
        }

        setProduct(foundProduct);
        setReviews((reviewsResponse.reviews || []).map(normalizeReview));
      } catch (error) {
        setErrorMessage(error.message || "Failed to load product.");
      }
    }

    load();
  }, [productId]);

  if (errorMessage) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-10">
        <div className="border-thick bg-pop-pink p-6 font-mono-tag">
          {errorMessage}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-10 font-mono-tag">
        Loading product...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-10">
      <div className="mb-6 font-mono-tag">
        <Link href="/shop" className="underline">Shop</Link> / {product.name}
      </div>

      <section className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-6 border-thicker border-ink bg-paper p-4 shadow-block-sm">
          <img src={product.image} alt={product.name} className="w-full border-thick object-cover aspect-square" />
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="border-thicker border-ink bg-paper p-6 shadow-block-sm">
            <div className="font-mono-tag opacity-70">{product.category}</div>
            <h1 className="mt-3 font-display text-5xl uppercase tracking-tighter">{product.name}</h1>
            <p className="mt-4 max-w-xl text-lg">{product.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="bg-pop-yellow border-thick px-4 py-2 font-mono-tag">{formatPrice(product.price)}</div>
              <div className="bg-pop-lime border-thick px-4 py-2 font-mono-tag">{product.stock} in stock</div>
              <div className="bg-pop-blue text-paper border-thick px-4 py-2 font-mono-tag">{product.rating} rating</div>
            </div>
            <div className="mt-6 text-sm">
              Seller: <span className="font-bold">{product.seller?.storeName || "Unknown seller"}</span>
            </div>
          </div>

          <ProductDetailClient product={product} />
        </div>
      </section>

      <section className="mt-8 border-thicker border-ink bg-paper p-6 shadow-block-sm">
        <div className="font-display text-3xl uppercase">Reviews & ratings</div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {reviews.length === 0 ? (
            <div className="border-thick bg-pop-beige p-4 text-sm">
              No reviews yet for this product.
            </div>
          ) : (
            reviews.map((review) => (
              <article key={review.id} className="border-thick bg-pop-beige p-4">
                <div className="font-display text-xl uppercase">{review.title}</div>
                <div className="mt-2 font-mono-tag opacity-70">{review.author} · {review.rating}/5</div>
                <p className="mt-3 text-sm">{review.body}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
