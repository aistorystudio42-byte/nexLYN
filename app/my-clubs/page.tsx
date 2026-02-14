import { getUserClubs } from '@/app/actions/clubActions';
import EmptyState from '@/components/ui/EmptyState';
import { Club } from '@/types';
import VintageCard from '@/components/ui/VintageCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Link from 'next/link';

export default async function MyClubsPage() {
    const clubs: Club[] = await getUserClubs();

    return (
        <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', padding: '120px 20px' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <header style={{ marginBottom: '60px' }}>
                    <h1 style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: '3.5rem',
                        color: 'var(--accent)',
                        marginBottom: '10px'
                    }}>
                        Kulüplerim
                    </h1>
                    <div style={{ width: '60px', height: '2px', background: 'var(--primary)' }} />
                </header>

                {clubs.length === 0 ? (
                    <EmptyState
                        title="Henüz bir kulübe dahil değilsiniz."
                        description="Prestijli dünyamızı keşfedin ve ilgi alanlarınıza en uygun topluluğa hemen katılın."
                        buttonText="Kulüpleri İncele"
                        buttonLink="/discover"
                        icon="🏺"
                    />
                ) : (
                    <div className="masonry-grid">
                        {clubs.map((club, index) => (
                            <ScrollReveal key={club.id} delay={index * 100} className="masonry-item">
                                <Link href={`/clubs/${club.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <VintageCard
                                        title={club.name}
                                        image={club.image_url || club.logo_url || '/placeholder-club.webp'}
                                        type={club.type}
                                    />
                                </Link>
                            </ScrollReveal>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
