'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

interface Club {
    id: string
    title: string
    slug: string
    excerpt: string
    cover_url: string
    created_at: string
}

export default function InfiniteFeed({ initialStories }: { initialStories: Club[] }) {
    const [clubs, setClubs] = useState<Club[]>(initialStories)
    const [cursor, setCursor] = useState<string | null>(initialStories[initialStories.length - 1]?.created_at || null)
    const [loading, setLoading] = useState(false)
    const loaderRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading && cursor) {
                    loadMore()
                }
            },
            { threshold: 1.0 }
        )

        if (loaderRef.current) {
            observer.observe(loaderRef.current)
        }

        return () => observer.disconnect()
    }, [cursor, loading])

    const loadMore = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/clubs?cursor=${cursor}`)
            const data = await res.json()
            if (data.clubs.length > 0) {
                setClubs(prev => [...prev, ...data.clubs])
                setCursor(data.nextCursor)
            } else {
                setCursor(null)
            }
        } catch (error) {
            console.error('Error loading clubs:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
            {clubs.map((club) => (
                <Link key={club.id} href={`/kulup/${club.slug}`} className="group bronze-border glass-card p-6 hover-lift rounded-sm animate-fade-in block">
                    <div className="aspect-video w-full overflow-hidden mb-6 relative border border-bronze/10">
                        <div
                            className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700"
                            style={{ backgroundImage: `url(${club.cover_url || 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800'})` }}
                        />
                    </div>
                    <h3 className="text-xl font-serif text-ivory mb-3 group-hover:text-bronze-light transition-colors">
                        {club.title}
                    </h3>
                    <p className="text-sm text-ivory/50 font-sans leading-relaxed line-clamp-3 italic">
                        {club.excerpt}
                    </p>
                    <div className="mt-6 pt-6 border-t border-bronze/5 flex justify-between items-center">
                        <span className="text-[10px] tracking-[0.2em] text-bronze uppercase font-bold">Arşivi İncele</span>
                        <span className="text-ivory/20 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                </Link>
            ))}
            <div ref={loaderRef} className="col-span-full h-20 flex items-center justify-center">
                {loading && <div className="w-5 h-5 border-2 border-bronze border-t-transparent rounded-full animate-spin" />}
            </div>
        </div>
    )
}
