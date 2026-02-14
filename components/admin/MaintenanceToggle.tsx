
'use client';

import React, { useState, useTransition } from 'react';
import { toggleMaintenanceMode } from '@/app/actions/adminActions';

interface Props {
    initialStatus: boolean;
}

export default function MaintenanceToggle({ initialStatus }: Props) {
    const [isMaintenance, setIsMaintenance] = useState(initialStatus);
    const [isPending, startTransition] = useTransition();

    const handleToggle = async () => {
        const nextStatus = !isMaintenance;

        if (confirm(`Siteyi ${nextStatus ? 'BAKIMA ALMAK' : 'YAYINA ALMAK'} istediğinize emin misiniz?`)) {
            startTransition(async () => {
                const result = await toggleMaintenanceMode(nextStatus);
                if (result.success) {
                    setIsMaintenance(nextStatus);
                } else {
                    alert('Hata: ' + result.error);
                }
            });
        }
    };

    return (
        <div style={{
            padding: '4px',
            borderRadius: '12px',
            border: isMaintenance ? '2px solid #ff4d4d' : '2px solid #222',
            background: isMaintenance ? 'rgba(255, 77, 77, 0.1)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: isPending ? 'wait' : 'default',
            transition: 'all 0.3s ease'
        }}>
            <span style={{
                fontSize: '0.8rem',
                fontWeight: 'bold',
                color: isMaintenance ? '#ff4d4d' : '#888',
                marginLeft: '8px'
            }}>
                {isMaintenance ? 'KRİTİK: BAKIM MODU AKTİF' : 'SİSTEM ÇEVRİMİÇİ'}
            </span>

            <button
                onClick={handleToggle}
                disabled={isPending}
                style={{
                    background: isMaintenance ? '#ff4d4d' : '#333',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    boxShadow: isMaintenance ? '0 0 15px rgba(255, 77, 77, 0.4)' : 'none',
                    transition: 'all 0.2s ease',
                    opacity: isPending ? 0.7 : 1
                }}
            >
                {isMaintenance ? 'Yayına Al' : 'Bakımı Başlat'}
            </button>
        </div>
    );
}
