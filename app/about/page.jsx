import React from 'react'

function page() {
    return (
        <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-12 space-y-10">
            <div className="border-thicker border-ink bg-paper p-10 md:p-16 shadow-block">
                <div className="font-mono-tag">Established 2018</div>
                <h1 className="mt-6 font-display text-6xl md:text-8xl uppercase tracking-tighter leading-[0.9]">
                    A small studio,<br />
                    <span className="bg-pop-red text-paper px-3 inline-block -rotate-1 border-thick shadow-block-sm">a few good things.</span>
                </h1>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <div className="bg-pop-yellow border-thicker border-ink p-8 shadow-block-sm rotate-1">
                    <p className="text-lg leading-relaxed">
                        Struktur is an independent storefront founded on a single idea: that
                        a small number of well-made things outweighs a great many disposable
                        ones. We work with makers we trust, in materials we believe in.
                    </p>
                </div>
                <div className="bg-pop-blue text-paper border-thicker border-ink p-8 shadow-block-sm -rotate-1">
                    <p className="text-lg leading-relaxed">
                        Every product passes through our hands before it leaves the studio.
                        What you receive is what we&apos;d keep for ourselves. Nothing more,
                        nothing less.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default page
