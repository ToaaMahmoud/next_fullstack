"use client";

import { useEffect, useState } from "react";
import { normalizeProduct, normalizeUser, requestJSON } from "../../lib/api-client";
import { formatPrice } from "../../lib/format";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setErrorMessage("");
        const [usersResponse, productsResponse] = await Promise.all([
          requestJSON("/api/admin/users", { method: "GET" }),
          requestJSON("/api/admin/products", { method: "GET" }),
        ]);

        setUsers((usersResponse.users || []).map(normalizeUser));
        setProducts((productsResponse.products || []).map(normalizeProduct));
      } catch (error) {
        setErrorMessage(error.message || "Failed to load admin data.");
      }
    }
    load();
  }, []);

  async function handleUserAction(userId, action) {
    try {
      const response = await requestJSON("/api/admin/users", {
        method: "PATCH",
        body: JSON.stringify({ userId, action }),
      });

      const updatedUser = normalizeUser(response.user);
      setUsers((current) =>
        current.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
    } catch (error) {
      setErrorMessage(error.message || "Failed to update user.");
    }
  }

  if (users.length === 0 && products.length === 0 && !errorMessage) {
    return <div className="mx-auto max-w-[1200px] px-4 md:px-8 py-10 font-mono-tag">Loading admin UI...</div>;
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-10">
      <header className="border-thicker border-ink bg-paper p-8 shadow-block-sm flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono-tag opacity-70">Admin panel</div>
          <h1 className="mt-2 font-display text-6xl uppercase tracking-tighter">Control room</h1>
        </div>
        <div className="bg-pop-pink border-thick px-4 py-2 font-mono-tag shadow-block-sm">
          Live admin APIs
        </div>
      </header>

      {errorMessage ? (
        <div className="mt-8 border-thick bg-pop-pink p-4 font-mono-tag">
          {errorMessage}
        </div>
      ) : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <section className="lg:col-span-5 space-y-6">
          <div className="border-thicker border-ink bg-paper p-6 shadow-block-sm">
            <div className="font-display text-2xl uppercase">User management</div>
            <div className="mt-4 space-y-3">
              {users.map((user) => (
                <div key={user.id} className="border-thick p-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-display text-xl uppercase">{user.name}</div>
                    <div className="font-mono-tag opacity-70">{user.role} · {user.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-tag">{user.status}</span>
                    <button
                      onClick={() =>
                        handleUserAction(
                          user.id,
                          user.status === "suspended" ? "activate" : "suspend"
                        )
                      }
                      className={`border-thick px-3 py-2 font-mono-tag ${user.status === "suspended" ? "bg-pop-lime" : "bg-pop-yellow"}`}
                    >
                      {user.status === "suspended" ? "Activate" : "Suspend"}
                    </button>
                    {user.role === "seller" && user.status === "pending" ? (
                      <button
                        onClick={() => handleUserAction(user.id, "approve")}
                        className="border-thick bg-pop-blue px-3 py-2 font-mono-tag text-paper"
                      >
                        Approve
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="lg:col-span-7 space-y-6">
          <div className="border-thicker border-ink bg-paper p-6 shadow-block-sm">
            <div className="font-display text-2xl uppercase">Product inventory</div>
            <div className="mt-4 space-y-3">
              {products.map((product) => (
                <div key={product.id} className="border-thick p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-display text-xl uppercase">{product.name}</div>
                      <div className="font-mono-tag opacity-70">
                        {product.category} · {product.seller?.storeName || "No seller"}
                      </div>
                    </div>
                    <div className="bg-pop-lime border-thick px-3 py-1 font-mono-tag">
                      {product.isActive ? "Active" : "Archived"}
                    </div>
                  </div>
                  <div className="mt-3 text-sm">
                    {formatPrice(product.price)} · {product.stock} units · {product.reviews} reviews
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
