
'use client';

import React from 'react';
import MaintenanceToggle from './MaintenanceToggle';

interface Props {
    isMaintenance?: boolean;
}

export default function AdminHeader({ isMaintenance }: Props) {
    return (
        <header style={{
            padding: '1rem 2rem',
            backgroundColor: '#0a0a0a',
            borderBottom: '1px solid #222',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '70px',
            position: 'sticky',
            top: 0,
            zIndex: 90
        }}>
            <div>
                <span style={{ color: '#444', fontSize: '0.8rem', letterSpacing: '2px', fontWeight: 'bold' }}>SYSTEM CONTROL NEXUS</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: '#111', borderRadius: '8px', border: '1px solid #222' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4caf50' }}></div>
                    <span style={{ fontSize: '0.75rem', color: '#888' }}>ADMIN SESSION: ACTIVE</span>
                </div>

                <MaintenanceToggle initialStatus={isMaintenance || false} />
            </div>
        </header>
    );
}
