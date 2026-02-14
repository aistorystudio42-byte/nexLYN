import React from 'react';
import { getAdminUsers } from '@/app/actions/adminActions';
import UserActions from '@/components/admin/UserActions';

interface AdminUser {
    id: string;
    full_name: string | null;
    email: string;
    role: string;
    is_banned: boolean;
    created_at: string;
}

export default async function UsersManagementPage() {
    const users: AdminUser[] = await getAdminUsers();

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 'bold' }}>Kullanıcı Yönetimi</h1>
                <span style={{ background: '#222', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', color: '#888' }}>
                    {users.length} Kayıtlı Üye
                </span>
            </div>

            <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#1a1a1a', borderBottom: '1px solid #222' }}>
                            <th style={{ padding: '15px 20px', color: '#888', fontWeight: '600', fontSize: '0.85rem' }}>KULLANICI</th>
                            <th style={{ padding: '15px 20px', color: '#888', fontWeight: '600', fontSize: '0.85rem' }}>E-POSTA</th>
                            <th style={{ padding: '15px 20px', color: '#888', fontWeight: '600', fontSize: '0.85rem' }}>ROL</th>
                            <th style={{ padding: '15px 20px', color: '#888', fontWeight: '600', fontSize: '0.85rem', textAlign: 'right' }}>AKSİYONLAR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #222', transition: 'background 0.2s' }}>
                                <td style={{ padding: '15px 20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(45deg, #9e1b1b, #441111)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {user.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ color: '#fff', fontWeight: '500' }}>{user.full_name || 'İsimsiz Kullanıcı'}</div>
                                            {user.is_banned && <span style={{ color: '#ff4d4d', fontSize: '0.7rem', fontWeight: 'bold' }}>[YASAKLI]</span>}
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '15px 20px', color: '#aaa', fontSize: '0.9rem' }}>{user.email}</td>
                                <td style={{ padding: '15px 20px' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        background: user.role === 'admin' ? 'rgba(158, 27, 27, 0.2)' : '#222',
                                        color: user.role === 'admin' ? '#ff4d4d' : '#888',
                                        border: user.role === 'admin' ? '1px solid rgba(158, 27, 27, 0.3)' : '1px solid #333'
                                    }}>
                                        {user.role === 'admin' ? 'SÜPER ADMİN' : 'ÜYE'}
                                    </span>
                                </td>
                                <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                                    <UserActions userId={user.id} isBanned={user.is_banned} role={user.role} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
