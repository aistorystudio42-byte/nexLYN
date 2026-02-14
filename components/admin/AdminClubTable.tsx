'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { updateClubOwner, resetClubConfig, toggleClubStatus, resetUserPassword } from '@/app/actions/adminActions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastContext';

interface Club {
    id: string;
    name: string;
    type?: string;
    owner_id: string;
    status?: string;
    created_at: string;
}

interface AdminClubTableProps {
    clubs: Club[];
    currentPage: number;
    totalCount: number;
    limit: number;
}

export default function AdminClubTable({ clubs, currentPage, totalCount, limit }: AdminClubTableProps) {
    const [editingClub, setEditingClub] = useState<Club | null>(null);
    const [newOwnerId, setNewOwnerId] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const router = useRouter();
    const { showToast } = useToast();

    const totalPages = useMemo(() => Math.ceil(totalCount / limit), [totalCount, limit]);

    const handleEdit = useCallback((club: Club) => {
        setEditingClub(club);
        setNewOwnerId(club.owner_id);
    }, []);

    const handleUpdateOwner = useCallback(async () => {
        if (!editingClub) return;
        setIsUpdating(true);
        const result = await updateClubOwner(editingClub.id, newOwnerId);
        setIsUpdating(false);
        if (result.success) {
            setEditingClub(null);
            showToast('Kulüp sahibi güncellendi.', 'success');
            router.refresh();
        } else {
            showToast(result.error || 'Güncelleme hatası.', 'error');
        }
    }, [editingClub, newOwnerId, router, showToast]);

    const handleReset = useCallback(async (clubId: string) => {
        if (!confirm('Bu kulübün ayarlarını sıfırlamak istediğinize emin misiniz?')) return;
        setIsUpdating(true);
        const result = await resetClubConfig(clubId);
        setIsUpdating(false);
        if (result.success) {
            showToast('Ayarlar temizlendi.', 'success');
            router.refresh();
        } else {
            showToast(result.error || 'Temizleme hatası.', 'error');
        }
    }, [router, showToast]);

    const handleToggleStatus = useCallback(async (clubId: string, status: string) => {
        const res = await toggleClubStatus(clubId, status);
        if (res.success) {
            showToast('Durum güncellendi.', 'success');
            router.refresh();
        } else {
            showToast(res.error || 'Durum değiştirilemedi.', 'error');
        }
    }, [router, showToast]);

    const handlePasswordReset = useCallback(async (ownerId: string) => {
        const newPass = prompt('Yeni şifreyi girin:');
        if (!newPass) return;

        const res = await resetUserPassword(ownerId, newPass);
        if (res.success) {
            showToast('Şifre başarıyla güncellendi.', 'success');
        } else {
            showToast(res.error || 'Şifre sıfırlama hatası.', 'error');
        }
    }, [showToast]);

    const changePage = useCallback((newPage: number) => {
        const params = new URLSearchParams(window.location.search);
        params.set('page', newPage.toString());
        router.push(`?${params.toString()}`);
    }, [router]);

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ backgroundColor: '#111', border: '1px solid #222', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #333', color: '#888', fontSize: '0.8rem' }}>
                            <th style={{ padding: '1rem' }}>ID</th>
                            <th style={{ padding: '1rem' }}>İSİM</th>
                            <th style={{ padding: '1rem' }}>TÜR</th>
                            <th style={{ padding: '1rem' }}>SAHİP ID</th>
                            <th style={{ padding: '1rem' }}>DURUM</th>
                            <th style={{ padding: '1rem' }}>AKSİYONLAR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clubs.map(club => (
                            <tr key={club.id} style={{ borderBottom: '1px solid #222', fontSize: '0.9rem' }}>
                                <td style={{ padding: '1rem', color: '#555' }}>{club.id.substring(0, 8)}...</td>
                                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{club.name}</td>
                                <td style={{ padding: '1rem' }}>{club.type || 'Standart'}</td>
                                <td style={{ padding: '1rem', color: '#ccc' }}>{club.owner_id.substring(0, 8)}...</td>
                                <td style={{ padding: '1rem' }}>
                                    <button
                                        onClick={() => handleToggleStatus(club.id, club.status || 'AKTİF')}
                                        style={{
                                            backgroundColor: club.status === 'ASKIYA ALINDI' ? '#9e1b1b' : '#333',
                                            color: '#fff',
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.7rem',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        {club.status === 'ASKIYA ALINDI' ? 'ASKIDA' : 'AKTİF'}
                                    </button>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            onClick={() => handleEdit(club)}
                                            style={{ background: 'none', border: '1px solid #444', color: '#fff', padding: '4px 12px', cursor: 'pointer', fontSize: '0.8rem' }}
                                        >
                                            DÜZENLE
                                        </button>
                                        <button
                                            onClick={() => handlePasswordReset(club.owner_id)}
                                            style={{ background: 'none', border: '1px solid #444', color: '#bda061', padding: '4px 12px', cursor: 'pointer', fontSize: '0.8rem' }}
                                        >
                                            ŞİFRE SIFIRLA
                                        </button>
                                        <button
                                            onClick={() => handleReset(club.id)}
                                            style={{ background: 'none', border: '1px solid #444', color: '#9e1b1b', padding: '4px 12px', cursor: 'pointer', fontSize: '0.8rem' }}
                                        >
                                            TEMİZLE
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
                <span style={{ color: '#666', fontSize: '0.9rem', marginRight: '1rem' }}>
                    Toplam: {totalCount} | Sayfa {currentPage} / {totalPages || 1}
                </span>
                <button
                    disabled={currentPage <= 1}
                    onClick={() => changePage(currentPage - 1)}
                    style={{ background: '#111', border: '1px solid #333', color: '#fff', padding: '5px 15px', cursor: currentPage <= 1 ? 'not-allowed' : 'pointer' }}
                >
                    GERİ
                </button>
                <button
                    disabled={currentPage >= totalPages}
                    onClick={() => changePage(currentPage + 1)}
                    style={{ background: '#111', border: '1px solid #333', color: '#fff', padding: '5px 15px', cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer' }}
                >
                    İLERİ
                </button>
            </div>

            {/* Edit Modal */}
            {editingClub && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.85)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        backgroundColor: '#111',
                        border: '1px solid #333',
                        width: '100%',
                        maxWidth: '500px',
                        padding: '2rem'
                    }}>
                        <h2 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.25rem' }}>Kulüp Düzenle: {editingClub.name}</h2>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ color: '#888', display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem' }}>SAHİP ID (USER_ID)</label>
                            <input
                                type="text"
                                value={newOwnerId}
                                onChange={(e) => setNewOwnerId(e.target.value)}
                                style={{
                                    width: '100%',
                                    backgroundColor: '#000',
                                    border: '1px solid #333',
                                    color: '#fff',
                                    padding: '0.75rem',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button
                                onClick={() => setEditingClub(null)}
                                style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
                            >
                                İPTAL
                            </button>
                            <button
                                onClick={handleUpdateOwner}
                                disabled={isUpdating}
                                style={{
                                    backgroundColor: '#fff',
                                    color: '#000',
                                    border: 'none',
                                    padding: '0.75rem 2rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                {isUpdating ? 'GÜNCELLENİYOR...' : 'KAYDET'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
