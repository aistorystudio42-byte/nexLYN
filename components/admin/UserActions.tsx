
'use client';

import React, { useTransition } from 'react';
import { promoteToAdmin, banUser } from '@/app/actions/adminActions';

interface Props {
    userId: string;
    isBanned: boolean;
    role: string;
}

export default function UserActions({ userId, isBanned, role }: Props) {
    const [isPending, startTransition] = useTransition();

    const handlePromote = async () => {
        if (window.confirm('Bu kullanıcıyı Süper Admin yapmak istediğinize emin misiniz?')) {
            startTransition(async () => {
                await promoteToAdmin(userId);
            });
        }
    };

    const handleBan = async () => {
        if (window.confirm('Bu kullanıcıyı YASAKLAMAK istediğinize emin misiniz?')) {
            startTransition(async () => {
                await banUser(userId);
            });
        }
    };

    return (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
                onClick={handlePromote}
                disabled={role === 'admin' || isPending}
                style={{
                    background: 'transparent',
                    color: role === 'admin' ? '#444' : '#fff',
                    border: `1px solid ${role === 'admin' ? '#333' : '#444'}`,
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    cursor: (role === 'admin' || isPending) ? 'not-allowed' : 'pointer',
                    opacity: isPending ? 0.7 : 1
                }}>
                Admin Yap
            </button>
            <button
                onClick={handleBan}
                disabled={isBanned || isPending}
                style={{
                    background: isBanned ? '#333' : '#9e1b1b',
                    color: '#fff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    cursor: (isBanned || isPending) ? 'not-allowed' : 'pointer',
                    opacity: (isBanned || isPending) ? 0.5 : 1
                }}>
                {isBanned ? 'Yasaklı' : 'Yasakla'}
            </button>
        </div>
    );
}
