
import React from 'react';
import { getAdminClubs } from '@/app/actions/adminActions';
import AdminClubTable from '@/components/admin/AdminClubTable';
import NewClubForm from '@/components/admin/NewClubForm';

export default async function AdminClubsPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string; search?: string }>
}) {
    const params = await searchParams;
    const page = parseInt(params.page || '1');
    const search = params.search || '';
    const limit = 10;

    const clubsData = await getAdminClubs({ page, search, limit });

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'Playfair Display, serif' }}>
                    Kulüp Yönetimi
                </h1>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>
                    Toplam {clubsData.totalCount} Kayıtlı Kulüp
                </div>
            </div>

            <div style={{ marginBottom: '60px' }}>
                <NewClubForm />
            </div>

            <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ padding: '30px', borderBottom: '1px solid #1a1a1a' }}>
                    <h3 style={{ color: '#fff', margin: 0, fontFamily: 'Playfair Display, serif' }}>Tüm Kulüpler</h3>
                </div>
                <AdminClubTable
                    clubs={clubsData.clubs}
                    currentPage={page}
                    totalCount={clubsData.totalCount}
                    limit={limit}
                />
            </div>
        </div>
    );
}
