'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { getClubs } from '@/app/actions/clubActions';
import VintageCard from './ui/VintageCard';
import ScrollReveal from './ui/ScrollReveal';
import SkeletonCard, { SkeletonGrid } from './ui/SkeletonCard';
import Link from 'next/link';

import { Club } from '@/types';

interface InfiniteClubListProps {
    initialClubs: Club[];
    initialTotalPages: number;
}

const CATEGORIES = ["HEPSİ", "TİCARET", "OYUN", "AKADEMİ", "SANAT", "TEKNOLOJİ"];

export default function InfiniteClubList({ initialClubs, initialTotalPages }: InfiniteClubListProps) {
    const [clubs, setClubs] = useState<Club[]>(initialClubs);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(initialTotalPages);
    const [loading, setLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState("HEPSİ");

    const { ref, inView } = useInView({
        threshold: 0,
        triggerOnce: false,
    });

    const loadMore = useCallback(async () => {
        if (loading || page >= totalPages) return;

        setLoading(true);
        try {
            const nextPage = page + 1;
            const response = await getClubs({ page: nextPage, limit: 12 });

            setClubs((prev) => [...prev, ...response.clubs as Club[]]);
            setPage(nextPage);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('Daha fazla kulüp yüklenirken hata oluştu:', error);
        } finally {
            setLoading(false);
        }
    }, [page, totalPages, loading]);

    useEffect(() => {
        if (inView) {
            loadMore();
        }
    }, [inView, loadMore]);

    const filteredClubs = useMemo(() => {
        if (activeFilter === "HEPSİ") return clubs;
        return clubs.filter(club => club.type?.toUpperCase() === activeFilter);
    }, [clubs, activeFilter]);

    // Masonry item class logic
    const getItemClass = (index: number) => {
        if (index % 7 === 0) return "masonry-item-wide";
        if (index % 5 === 0) return "masonry-item-large";
        return "masonry-item";
    };

    return (
        <div style={{ width: '100%' }}>
            {/* Pill Filters */}
            <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '50px',
                overflowX: 'auto',
                paddingBottom: '10px',
                scrollbarWidth: 'none'
            }}>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        className={`pill-button ${activeFilter === cat ? 'active' : ''}`}
                        onClick={() => setActiveFilter(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="masonry-grid">
                {filteredClubs.map((club, index) => (
                    <ScrollReveal
                        key={`${club.id}-${activeFilter}`}
                        delay={(index % 4) * 100}
                        className={getItemClass(index)}
                    >
                        <Link
                            href={`/clubs/${club.id}`}
                            prefetch={true}
                            style={{ textDecoration: 'none', color: 'inherit', height: '100%', display: 'block' }}
                        >
                            <VintageCard
                                title={club.name}
                                image={club.image_url || club.logo_url || '/placeholder-club.webp'}
                                type={club.type}
                            />
                        </Link>
                    </ScrollReveal>
                ))}

                {loading && Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={`skeleton-${i}`} />
                ))}
            </div>

            {page < totalPages && !loading && (
                <div ref={ref} style={{ height: '50px', marginTop: '40px' }} />
            )}
        </div>
    );
}
