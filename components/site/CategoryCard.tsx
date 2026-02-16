'use client'

import Link from 'next/link'

interface Category {
    id: string
    title: string
    subtitle: string
    cover_url: string
}

export default function CategoryCard({ category }: { category: Category }) {
    return (
        <div className="group relative aspect-[3/4] overflow-hidden bg-obsidian border border-white/5 hover:border-bronze/50 transition-all duration-500 cursor-pointer rounded-sm flex flex-col shadow-2xl">
            {/* Image Area */}
            <div className="relative w-full aspect-square overflow-hidden border-b border-white/5 bg-neutral-900">
                {category.cover_url ? (
                    <>
                        <img
                            src={category.cover_url}
                            alt={category.title}
                            className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-in-out"
                        />
                        {/* Elegant Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-60" />
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-white/5 to-transparent">
                        <div className="w-10 h-10 border border-ivory/10 rounded-full flex items-center justify-center mb-2 group-hover:border-bronze/50 transition-colors">
                            <span className="text-ivory/20 group-hover:text-bronze-light transition-colors text-xs">+</span>
                        </div>
                        <span className="text-[8px] tracking-[0.2em] text-ivory/20 uppercase">Arşiv Görseli Yok</span>
                    </div>
                )}

                {/* Visual Accent */}
                <div className="absolute top-4 left-4 w-2 h-2 border border-bronze/30 rounded-full group-hover:bg-bronze transition-all" />
            </div>

            {/* Content Area */}
            <div className="flex-1 w-full p-5 flex flex-col items-center text-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-sm font-serif text-ivory tracking-wide group-hover:text-bronze-light transition-colors duration-300">
                        {category.title || 'İsimsiz Kategori'}
                    </h3>
                    <p className="text-[10px] text-ivory/40 font-sans tracking-tight line-clamp-1 italic px-2">
                        {category.subtitle || 'Açıklama mevcut değil.'}
                    </p>
                </div>

                <Link
                    href={`/kategori/${category.id}`}
                    className="premium-button w-full !py-2"
                >
                    <span>İNCELE</span>
                </Link>
            </div>
        </div>
    )
}
