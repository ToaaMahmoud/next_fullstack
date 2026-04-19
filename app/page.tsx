import Link from "next/link";
import ProductCard from "./components/ProductCard";

const catColors = ["bg-pop-red text-paper", "bg-pop-yellow", "bg-pop-blue text-paper", "bg-paper"];

export default function Home() {

  const featured = [
  {
    id: "p1",
    name: "Heavyweight Cotton Tee",
    price: 48,
    category: "apparel",
    description: "320gsm tubular cotton, garment-dyed in Portugal.",
    image: "https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/T26252s.jpg",
    stock: 12,
    rating: 4.8,
    reviews: 124,
  },
  {
    id: "p2",
    name: "Wool Field Jacket",
    price: 320,
    category: "apparel",
    description: "Boiled wool, horn buttons, fully lined.",
    image: "https://thomasfarthing.co.uk/cdn/shop/files/RIVERTON_3_f47813db-f01a-48f6-bd43-938621a77df8_800x.jpg?v=1768285498a",
    stock: 5,
    rating: 4.9,
    reviews: 38,
  },
  {
    id: "p3",
    name: "Selvedge Denim",
    price: 180,
    category: "apparel",
    description: "14oz Japanese selvedge, straight leg.",
    image: "https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/AD1037s.jpg?im=Resize,width=750",
    stock: 20,
    rating: 4.7,
    reviews: 211,
  },
  {
    id: "p4",
    name: "Linen Overshirt",
    price: 145,
    category: "apparel",
    description: "European linen, mother-of-pearl buttons.",
    image: "https://content.josephturner.co.uk/ExtraLarge/12cc9eca-mens-natural-linen-overshirt-mclnosnat_1.jpg",
    stock: 9,
    rating: 4.6,
    reviews: 64,
  },
  {
    id: "p5",
    name: "Ceramic Vessel",
    price: 95,
    category: "objects",
    description: "Hand-thrown stoneware, matte glaze.",
    image: "https://static.zarahome.net/assets/public/26f2/35ad/e70f46e2bbf5/05140e5c4b92/46371000802-r1/46371000802-r1.jpg?ts=1744021965671",
    stock: 7,
    rating: 4.9,
    reviews: 22,
  },
  {
    id: "p6",
    name: "Brass Desk Lamp",
    price: 240,
    category: "objects",
    description: "Solid brass, dimmable LED.",
    image: "https://marketbymodernnest.com/cdn/shop/products/EnglishCountry_209_1024x.jpg?v=1678316361",
    stock: 4,
    rating: 5.0,
    reviews: 17,
  }
]

const categories = [
  { id: "apparel", name: "Apparel", count: 4 },
  { id: "objects", name: "Objects", count: 4 },
  { id: "books", name: "Books", count: 2 },
  { id: "audio", name: "Audio", count: 2 },
];

  return (
    <div className="px-4 md:px-8 pt-8 pb-24">
      
      <section className="mx-auto max-w-[1400px] grid grid-cols-1 lg:grid-cols-12 border-thicker border-ink bg-paper shadow-block-lg overflow-hidden">
        <div className="lg:col-span-7 p-8 md:p-14 lg:border-r-thicker border-ink relative">
          <div className="inline-block bg-pop-blue text-paper px-3 py-1 font-mono-tag border-thick -rotate-2 shadow-block-sm">
            New Collection — 2026
          </div>
          <h1 className="mt-8 font-display text-[14vw] md:text-[7.5rem] leading-[0.85] uppercase tracking-tighter">
            Build<br />
            your<br />
            <span className="bg-pop-red text-paper px-3 inline-block -rotate-1 border-thick shadow-block">world.</span>
          </h1>
          <p className="mt-10 max-w-md text-lg">
            Disciplined logic meets joyful geometry. A small studio making
            things you can keep — apparel, objects, books, and sound.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="bg-ink text-paper border-thick px-8 py-4 font-display text-xl uppercase tracking-wider shadow-block-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              Shop the drop →
            </Link>
            <Link
              href="/about"
              className="bg-pop-yellow border-thick px-8 py-4 font-display text-xl uppercase tracking-wider shadow-block-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              The studio
            </Link>
          </div>
         
          <div className="absolute top-6 right-6 size-12 bg-pop-yellow border-thick rotate-12 hidden md:block" />
        </div>

        <div className="lg:col-span-5 bg-pop-blue p-8 relative flex items-center justify-center min-h-[420px]">
          <div className="absolute top-0 right-0 size-32 bg-pop-red border-l-thicker border-b-thicker border-ink" />
          <div className="absolute bottom-8 left-8 size-20 bg-pop-yellow border-thick rotate-12" />
          <div className="relative z-10 border-thicker bg-paper p-3 rotate-3 shadow-block">
            <img
              src={featured[1]?.image}
              alt={featured[1]?.name}
              className="h-[360px] w-[280px] object-cover border-thick"
            />
            <div className="absolute -bottom-3 -right-3 bg-pop-red text-paper border-thick px-3 py-1 font-mono-tag -rotate-3">
              Featured
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="mx-auto max-w-[1400px] mt-8 border-thicker border-ink bg-ink text-pop-yellow py-3 overflow-hidden">
        <div className="flex gap-12 whitespace-nowrap font-mono-tag text-sm px-6 animate-marquee">
          <span>Free shipping over $200</span><span>★</span>
          <span>Made in small runs</span><span>★</span>
          <span>30-day returns</span><span>★</span>
          <span>Established 2018</span><span>★</span>
          <span>Free shipping over $200</span><span>★</span>
          <span>Made in small runs</span><span>★</span>
          {/* Duplicate for seamless loop */}
          <span>Free shipping over $200</span><span>★</span>
          <span>Made in small runs</span><span>★</span>
        </div>
      </section>

      
      <section className="mx-auto max-w-[1400px] mt-24">
        <div className="flex items-end justify-between mb-8">
          <div className="bg-ink text-paper px-6 py-3 -rotate-1 shadow-block-sm">
            <h2 className="font-display text-3xl uppercase tracking-tighter">Departments</h2>
          </div>
          <span className="font-mono-tag hidden md:block">{categories.length} sections</span>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {categories.map((c, i) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.id}`}
              className={`block p-6 border-thicker shadow-block-sm hover:-translate-y-1 hover:shadow-block transition-all ${catColors[i % catColors.length]} ${i % 2 === 0 ? "rotate-1" : "-rotate-1"}`}
            >
              <div className="font-mono-tag opacity-70">0{i + 1}</div>
              <div className="mt-6 font-display text-3xl uppercase">{c.name}</div>
              <div className="mt-2 font-mono-tag">{c.count} items →</div>
            </Link>
          ))}
        </div>
      </section>

     
      <section className="mx-auto max-w-[1400px] mt-24">
        <div className="flex items-end justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="size-12 bg-pop-red border-thick rotate-12" />
            <h2 className="font-display text-4xl uppercase tracking-tighter">Priority gear</h2>
          </div>
          <Link href="/shop" className="bg-pop-yellow border-thick px-4 py-2 font-mono-tag shadow-block-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
            View all →
          </Link>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      
      <section className="mx-auto max-w-[1400px] mt-32 border-thicker border-ink bg-pop-yellow shadow-block-lg p-10 md:p-16 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <div className="font-mono-tag">A note from the studio</div>
          <div className="mt-4 size-16 bg-ink" />
        </div>
        <div className="md:col-span-9">
          <p className="font-display text-3xl md:text-5xl leading-[1.05] uppercase tracking-tighter">
            "We don't believe in seasons. We believe in things that earn their
            keep — in your hand, in your home, in your life."
          </p>
          <div className="mt-8 font-mono-tag">— The editors</div>
        </div>
      </section>
    </div>
  );
}