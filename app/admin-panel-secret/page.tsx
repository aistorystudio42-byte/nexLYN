
import React from 'react';
import { getAdminStats, getAdminClubs, getSiteSettings } from '@/app/actions/adminActions';
import AdminClubTable from '@/components/admin/AdminClubTable';
import NewClubForm from '@/components/admin/NewClubForm';
import SiteSettingsForm from '@/components/admin/SiteSettingsForm';

export default async function AdminPanelPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string; search?: string }>
}) {
    const params = await searchParams;
    const page = parseInt(params.page || '1');
    const search = params.search || '';

    const [stats, clubsData, siteSettings] = await Promise.all([
        getAdminStats(),
        getAdminClubs({ page, search, limit: 10 }),
        getSiteSettings()
    ]);

    return (
        <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ marginBottom: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ color: '#fff', fontSize: '3.5rem', margin: 0, fontWeight: '800', fontFamily: 'Playfair Display, serif', letterSpacing: '-0.05em' }}>
                        Yönetim Merkezi
                    </h1>
                    <p style={{ color: '#666', marginTop: '10px', fontSize: '1.1rem' }}>
                        NexLYN Enterprise Kontrol Paneli • Aktif Üretim Modu
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#4caf50', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '2px' }}>● SİSTEM ÇEVRİMİÇİ</div>
                    <div style={{ color: '#444', fontSize: '0.7rem' }}>Service Role Auth Enabled</div>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '60px' }}>
                <StatCard label="Toplam Kullanıcı" value={stats.userCount} icon="👥" />
                <StatCard label="Aktif Kulüpler" value={stats.clubCount} icon="♣️" />
                <StatCard label="Toplam Modüller" value={stats.moduleCount} icon="🧩" />
                <StatCard
                    label="Sistem Durumu"
                    value={stats.systemStatus}
                    icon="⚡"
                    color={stats.isMaintenance ? '#ff4d4d' : '#4caf50'}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '60px' }}>
                <NewClubForm />
                <SiteSettingsForm settings={siteSettings} />
            </div>

            <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ padding: '30px', borderBottom: '1px solid #1a1a1a' }}>
                    <h3 style={{ color: '#fff', margin: 0, fontFamily: 'Playfair Display, serif' }}>Tüm Kulüpler</h3>
                </div>
                <AdminClubTable
                    clubs={clubsData.clubs}
                    currentPage={page}
                    totalCount={clubsData.totalCount}
                    limit={10}
                />
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, color = '#fff' }: { label: string, value: string | number, icon: string, color?: string }) {
    return (
        <div style={{
            background: 'rgba(15, 15, 15, 0.8)',
            border: '1px solid #222',
            padding: '30px',
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden',
            backdropFilter: 'blur(10px)'
        }}>
            <div style={{ position: 'absolute', top: 0, right: 0, padding: '20px', fontSize: '2rem', opacity: 0.1 }}>{icon}</div>
            <span style={{ color: '#666', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{label}</span>
            <div style={{ color, fontSize: '2.5rem', fontWeight: '800', fontFamily: 'Playfair Display, serif', marginTop: '10px' }}>{value.toLocaleString()}</div>
            <div style={{ height: '2px', background: `linear-gradient(90deg, ${color === '#fff' ? '#c1121f' : color}, transparent)`, width: '60px', marginTop: '15px' }}></div>
        </div>
    );
}

