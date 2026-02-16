'use client'

import Link from 'next/link'

export default function SupportButton() {
    return (
        <Link
            href="/destek"
            className="premium-button fixed bottom-6 right-6 z-[200] !px-6 !py-2.5 !bg-obsidian !rounded-sm shadow-2xl"
        >
            <div className="w-2.5 h-2.5 rounded-full border border-ivory/40 flex items-center justify-center mr-2">
                <div className="w-1 h-1 bg-ivory/40 rounded-full" />
            </div>
            <span className="!lowercase !tracking-[0.25em]">Destek</span>
        </Link>
    )
}

