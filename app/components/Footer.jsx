import Link from 'next/link'
import React from 'react'

function Footer() {
    return (
        <footer className="mt-32 border-t-thicker border-ink bg-ink text-paper">
            <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 md:grid-cols-4">
                <div className="space-y-4">
                    <div className="size-12 bg-pop-lime border-thicker border-paper" />
                    <div className="font-display text-3xl uppercase tracking-tighter">
                        Monolith<span className="text-pop-lime">.</span>
                    </div>
                    <p className="max-w-xs text-sm opacity-80">
                        Loud objects, quiet logic. Goods built to last a lifetime.
                    </p>
                </div>
                <div>
                    <div className="font-mono-tag text-pop-lime mb-4">Shop</div>
                    <ul className="space-y-2">
                        <li><Link className='cursor-pointer hover:font-bold transition-all select-none' href="/shop">All goods</Link></li>
                        <li><Link className='cursor-pointer hover:font-bold transition-all select-none' href="/shop?category=apparel">Apparel</Link></li>
                        <li><Link className='cursor-pointer hover:font-bold transition-all select-none' href="/shop?category=objects">Objects</Link></li>
                        <li><Link className='cursor-pointer hover:font-bold transition-all select-none' href="/shop?category=books">Books</Link></li>
                        <li><Link className='cursor-pointer hover:font-bold transition-all select-none' href="/shop?category=audio">Audio</Link></li>
                    </ul>
                </div>
                <div>
                    <div className="font-mono-tag text-pop-lime mb-4">Account</div>
                    <ul className="space-y-2">
                        <li><Link className='cursor-pointer hover:font-bold transition-all select-none' href="/signin">Sign in</Link></li>
                        <li><Link className='cursor-pointer hover:font-bold transition-all select-none' href="/signup">Register</Link></li>
                        <li><Link className='cursor-pointer hover:font-bold transition-all select-none' href="/account/orders">Orders</Link></li>
                    </ul>
                </div>
            </div>
            <div className="border-t-thick border-paper">
                <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 font-mono-tag">
                    <span>© 2026 Monolith</span>
                    <span>iTi NextJs FinalProject | Mustafa & Toaa</span>
                </div>
            </div>
        </footer>
    )

}

export default Footer