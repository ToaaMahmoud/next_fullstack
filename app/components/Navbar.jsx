"use client"
import Link from 'next/link';
import { useState } from 'react';

function Navbar() {

    const [count, setCount] = useState(0);
    const [user, setUser] = useState();

    const handleLogout = () => { };


    return (
        <header className="sticky top-0 z-40 border-b-thicker border-ink bg-paper">

            <div className="mx-auto flex flex-col md:flex-row max-w-[1400px] items-stretch justify-between gap-2 px-6 py-3 md:px-6">
                <Link
                    href="/"
                    className="bg-ink px-5 py-3 text-paper font-display text-2xl uppercase tracking-tighter shadow-block-sm hover-pop"
                >
                    Monolith<span className="text-pop-lime">.</span>
                </Link>

                <nav className=" items-center gap-2 flex">
                    <Link href="/shop" className={`font-mono-tag px-3 py-2 border-thick border-transparent hover:border-ink hover:bg-pop-yellow hover:scale-105 transition-all select-none`}>
                        Shop
                    </Link>

                    <Link href="/about" className={`font-mono-tag px-3 py-2 border-thick border-transparent hover:border-ink hover:bg-pop-yellow hover:scale-105 transition-all select-none`}>
                        About
                    </Link>

                    {user && (
                        <Link href="/account" className="font-mono-tag px-3 py-2 border-thick border-transparent hover:border-ink hover:bg-pop-lime">
                            Account
                        </Link>
                    )}

                    {user?.role === "seller" && (
                        <Link href="/seller" className="font-mono-tag px-3 py-2 border-thick border-transparent hover:border-ink hover:bg-pop-blue">
                            Seller Dashboard
                        </Link>
                    )}

                    {user?.role === "admin" && (
                        <Link href="/admin" className="font-mono-tag px-3 py-2 border-thick border-transparent hover:border-ink hover:bg-pop-pink">
                            Admin
                        </Link>
                    )}
                </nav>

                <div className="flex items-center gap-2">
                    {user ? (
                        <>
                            <span className=" md:inline-flex items-center gap-2 border-thick bg-pop-lime px-3 py-2 font-mono-tag shadow-block-sm">
                                <span className="size-2 bg-ink" />
                                {user.name} · {user.role}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="border-thick bg-paper px-3 py-2 font-mono-tag shadow-block-sm hover-pop hover:bg-pop-pink"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/signin"
                                className="border-thick bg-paper px-3 py-2 font-mono-tag shadow-block-sm hover-pop hover:bg-pop-yellow"
                            >
                                Sign in
                            </Link>
                            <Link
                                href="/signup"
                                className=" sm:inline-block border-thick bg-pop-blue text-paper px-3 py-2 font-mono-tag shadow-block-sm hover-pop"
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                    <Link
                        href="/cart"
                        className="border-thick bg-pop-yellow px-4 py-2 font-mono-tag shadow-block-sm hover-pop"
                    >
                        Cart [{count.toString().padStart(2, "0")}]
                    </Link>
                </div>
            </div>
        </header>
    );

}

export default Navbar