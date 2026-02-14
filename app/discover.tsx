import { getClubs } from '@/app/actions/clubActions';
import InfiniteClubList from '@/components/InfiniteClubList';
import { Club } from '@/types';

export default async function DiscoverPage() {
    const { clubs, totalPages } = await getClubs({ page: 1, limit: 12 });

    return (
        <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg)' }}>

            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 20px 60px' }}>
                <header style={{ marginBottom: '40px' }}>
                    <h1 style={{
                        fontSize: '3.5rem',
                        color: 'var(--accent)',
                        marginBottom: '16px',
                        letterSpacing: '-1px'
                    }}>
                        Seçkin Kulüpleri Keşfet
                    </h1>
                    <p style={{
                        fontSize: '1.2rem',
                        color: 'var(--text)',
                        opacity: 0.7,
                        maxWidth: '600px',
                        lineHeight: '1.6'
                    }}>
                        NEXLY&apos;nin ayrıcalıklı dünyasına hoş geldiniz. İlgi alanlarınıza uygun en prestijli kulüpleri burada bulabilirsiniz.
                    </p>
                </header>

                <section>
                    <InfiniteClubList initialClubs={clubs as Club[]} initialTotalPages={totalPages} />
                </section>
            </div>
        </main>
    );
}
