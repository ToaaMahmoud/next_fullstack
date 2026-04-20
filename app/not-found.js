import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center mt-20">
      <div className="bg-paper border-thicker border-ink p-12 shadow-block max-w-lg w-full">
        <div className="inline-block bg-pop-pink border-thick px-4 py-1 font-mono-tag shadow-block-sm uppercase tracking-widest text-sm">
          Error 404
        </div>

        <h1 className="mt-6 font-display text-7xl md:text-8xl uppercase tracking-tighter leading-none">
          Lost in <br />
          <span className="text-pop-blue">Space?</span>
        </h1>

        <p className="mt-6 font-mono-tag text-lg border-t-thick border-ink pt-6">
          The page you are looking for has been moved, deleted, or never existed
          in this dimension.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-ink text-paper border-thick px-8 py-4 font-display text-xl uppercase tracking-wider shadow-block hover-press transition-all"
          >
            ← Back to Home
          </Link>

          <Link
            href="/shop"
            className="bg-pop-yellow border-thick px-8 py-4 font-display text-xl uppercase tracking-wider shadow-block hover-pop transition-all"
          >
            Go Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
