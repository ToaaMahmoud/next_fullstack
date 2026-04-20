"use client";

import { useEffect, useState } from "react";
import { getAdminDashboardData } from "../../lib/mock-api";
import { formatPrice } from "../../lib/format";

export default function AdminPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      setData(await getAdminDashboardData());
    }
    load();
  }, []);

  if (!data) {
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
          Mock moderation tools
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <section className="lg:col-span-5 space-y-6">
          <div className="border-thicker border-ink bg-paper p-6 shadow-block-sm">
            <div className="font-display text-2xl uppercase">User management</div>
            <div className="mt-4 space-y-3">
              {data.users.map((user) => (
                <div key={user.id} className="border-thick p-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-display text-xl uppercase">{user.name}</div>
                    <div className="font-mono-tag opacity-70">{user.role} · {user.email}</div>
                  </div>
                  <button className={`border-thick px-3 py-2 font-mono-tag ${user.status === "restricted" ? "bg-pop-red text-paper" : "bg-pop-yellow"}`}>
                    {user.status === "restricted" ? "Restore user" : "Soft restrict"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="border-thicker border-ink bg-pop-yellow p-6 shadow-block-sm">
            <div className="font-display text-2xl uppercase">Product & category management</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {data.categories.map((category) => (
                <div key={category.id} className="border-thick bg-paper p-4">
                  <div className="font-display text-xl uppercase">{category.name}</div>
                  <div className="mt-2 font-mono-tag opacity-70">{category.count} listed items</div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-thick bg-paper p-4 text-sm">
              {data.products.length} total SKUs are ready for mocked edit, archive, and category reassignment actions.
            </div>
          </div>
        </section>

        <section className="lg:col-span-7 space-y-6">
          <div className="border-thicker border-ink bg-paper p-6 shadow-block-sm">
            <div className="font-display text-2xl uppercase">Orders & shipping</div>
            <div className="mt-4 space-y-3">
              {data.orders.map((order) => (
                <div key={order.id} className="border-thick p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-display text-xl uppercase">{order.id}</div>
                      <div className="font-mono-tag opacity-70">{order.customerName} · {order.shippingMethod}</div>
                    </div>
                    <div className="bg-pop-lime border-thick px-3 py-1 font-mono-tag">{order.status}</div>
                  </div>
                  <div className="mt-3 text-sm">
                    {order.items.length} items · {formatPrice(order.total)} · Email notice ready for {order.customerEmail}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-thicker border-ink bg-pop-blue text-paper p-6 shadow-block-sm">
            <div className="font-display text-2xl uppercase">Content management</div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="border-thick border-paper p-4">
                <div className="font-mono-tag text-pop-yellow">Homepage banner</div>
                <div className="mt-2 font-display text-2xl uppercase">{data.contentBlocks.banner.title}</div>
                <div className="mt-2 text-sm">{data.contentBlocks.banner.subtitle}</div>
              </div>
              <div className="border-thick border-paper p-4">
                <div className="font-mono-tag text-pop-yellow">Section states</div>
                <div className="mt-3 space-y-2">
                  {data.contentBlocks.homepageSections.map((section) => (
                    <div key={section.id} className="flex justify-between font-mono-tag">
                      <span>{section.name}</span>
                      <span>{section.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
