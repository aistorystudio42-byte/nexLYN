'use client'

import Link from 'next/link'

export default function SupportButton() {
    return (
        <Link
            href="/destek"
            className="text-[11px] font-sans tracking-[0.2em] text-ivory/60 hover:text-white transition-colors uppercase"
        >
            Destek
        </Link>
    )
}

