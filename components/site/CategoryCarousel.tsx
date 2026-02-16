'use client'

// nexLYN Category Carousel - Client Component

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import CategoryCard from './CategoryCard'

interface Category {
    id: string
    title: string
    subtitle: string
    cover_url: string
}

export default function CategoryCarousel({ categories }: { categories: Category[] }) {
    const scrollRef = useRef<HTMLDivElement>(null)

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef
            const scrollAmount = 400
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
            }
        }
    }

    return (
        <div className="w-full relative group py-12">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-6 flex-1">
                    <h2 className="text-xl font-serif text-ivory/90 tracking-widest whitespace-nowrap uppercase italic">Kategori Alanı</h2>
                    <div className="h-px bg-white/10 flex-1" />
                </div>
                <div className="flex items-center gap-4 ml-8">
                    <button
                        onClick={() => scroll('left')}
                        className="premium-button !w-10 !h-10 !p-0"
                    >
                        <span><ChevronLeft size={20} /></span>
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="premium-button !w-10 !h-10 !p-0"
                    >
                        <span><ChevronRight size={20} /></span>
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-6 no-scrollbar snap-x snap-mandatory scroll-smooth"
            >
                {categories.map((category) => (
                    <div key={category.id} className="w-[calc(50%-8px)] lg:w-[calc(25%-12px)] flex-shrink-0 snap-start">
                        <CategoryCard category={category} />
                    </div>
                ))}
            </div>

            <div className="flex justify-start gap-2.5 mt-10">
                {categories.map((_, idx) => (
                    <div
                        key={idx}
                        className={`w-1 h-4 transition-all ${idx === 0 ? 'bg-bronze' : 'bg-white/5'}`}
                    />
                ))}
            </div>
        </div>
    )
}
