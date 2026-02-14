import { getClubById } from '@/app/actions/clubActions';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import ManageClubButton from '@/components/clubs/ManageClubButton';
import { getModulesByClubType } from '@/utils/moduleParser';
import ModuleFactory from '@/components/ModuleFactory';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ClubDetailPage({ params }: PageProps) {
    const { id } = await params;
    const club = await getClubById(id);

    if (!club) {
        notFound();
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isOwner = user && club.owner_id === user.id;

    const clubType = club.type || 'General';
    const modules = getModulesByClubType(clubType);

    return (
        <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(100px, 15vw, 140px) 20px 60px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '48px' }}>
                    <div style={{ position: 'sticky', top: '120px', height: 'fit-content' }}>
                        <div className="vintage-card" style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                                <Image
                                    src={club.image_url || club.logo_url || '/placeholder-club.webp'}
                                    alt={club.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    style={{ objectFit: 'cover' }}
                                    priority
                                />
                            </div>
                            <div style={{ padding: '28px' }}>
                                <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>{club.name}</h1>
                                <span style={{ color: 'var(--accent)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '3px' }}>
                                    {club.type || 'STANDART KULUP'}
                                </span>
                                {isOwner && <ManageClubButton clubId={club.id} />}
                            </div>
                        </div>
                    </div>

                    <div>
                        <section style={{ marginBottom: '64px' }}>
                            <h2 style={{ color: 'var(--text)', marginBottom: '32px', borderBottom: '1px solid rgba(189,160,97,0.15)', paddingBottom: '16px' }}>
                                Kulup Modulleri
                            </h2>
                            {modules.length > 0 ? (
                                <ModuleFactory modules={modules} />
                            ) : (
                                <div style={{
                                    padding: '48px',
                                    border: '1px solid rgba(189,160,97,0.1)',
                                    textAlign: 'center',
                                    backgroundColor: '#0d0a0a'
                                }}>
                                    <p style={{ color: 'var(--accent)', fontFamily: 'var(--font-playfair), serif', opacity: 0.7 }}>
                                        Bu kulup turu icin henuz modul tanimlanmamis.
                                    </p>
                                </div>
                            )}
                        </section>

                        <section>
                            <h2 style={{ color: 'var(--text)', marginBottom: '24px', borderBottom: '1px solid rgba(189,160,97,0.15)', paddingBottom: '16px' }}>
                                Hakkinda
                            </h2>
                            <p style={{ color: 'var(--text)', opacity: 0.7, lineHeight: '1.8' }}>
                                {club.description || 'Aciklama bulunmuyor.'}
                            </p>
                        </section>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    main > div > div {
                        grid-template-columns: 1fr !important;
                        gap: 32px !important;
                    }
                    main > div > div > div:first-child {
                        position: static !important;
                    }
                }
            `}</style>
        </main>
    );
}
