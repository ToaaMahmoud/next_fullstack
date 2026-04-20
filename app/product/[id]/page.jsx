import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatalog, getProductById } from "../../../lib/mock-api";
import ProductDetailClient from "./product-detail-client";
import { formatPrice } from "../../../lib/format";

export async function generateStaticParams() {
  const { products } = await getCatalog();
  return products.map((product) => ({ id: product.id }));
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
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
              Seller: <span className="font-bold">{product.seller?.storeName}</span>
            </div>
          </div>

          <ProductDetailClient product={product} />
        </div>
      </section>

      <section className="mt-8 border-thicker border-ink bg-paper p-6 shadow-block-sm">
        <div className="font-display text-3xl uppercase">Reviews & ratings</div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {product.reviews.map((review) => (
            <article key={review.id} className="border-thick bg-pop-beige p-4">
              <div className="font-display text-xl uppercase">{review.title}</div>
              <div className="mt-2 font-mono-tag opacity-70">{review.author} · {review.rating}/5</div>
              <p className="mt-3 text-sm">{review.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
