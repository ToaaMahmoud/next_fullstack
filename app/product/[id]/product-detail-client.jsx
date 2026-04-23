"use client";

import { useCartStore } from "../../../lib/stores/cart-store";
import { useUserStore } from "../../../lib/stores/user-store";

export default function ProductDetailClient({ product }) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleFavorite = useUserStore((state) => state.toggleFavorite);
  const isFavorite = useUserStore((state) => state.hasFavorite(product.id));

  async function handleToggleFavorite() {
    try {
      await toggleFavorite(product.id);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="border-thicker border-ink bg-pop-yellow p-6 shadow-block-sm">
      <div className="font-display text-2xl uppercase">Buy flow</div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <button
          type="button"
          onClick={() => addItem(product, 1)}
          className="border-thick bg-ink text-paper px-6 py-4 font-display text-lg uppercase shadow-block-sm hover-press transition-all"
        >
          Add to cart
        </button>
        <button
          type="button"
          onClick={handleToggleFavorite}
          className="border-thick bg-paper px-6 py-4 font-display text-lg uppercase shadow-block-sm hover-pop transition-all"
        >
          {isFavorite ? "Remove favorite" : "Save to wishlist"}
        </button>
      </div>
      <div className="mt-4 text-sm">
        Product detail UI is mocked and ready to swap over to external APIs later.
      </div>
    </div>
  );
}
