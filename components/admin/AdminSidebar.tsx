
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
    const pathname = usePathname();

    const menuItems = [
        { label: 'DASHBOARD', icon: '📊', path: '/admin-panel-secret' },
        { label: 'KULLANICILAR', icon: '👤', path: '/admin-panel-secret/users' },
        { label: 'KULÜPLER', icon: '🏢', path: '/admin-panel-secret/clubs' },
        { label: 'İÇERİK DENETİMİ', icon: '🛡️', path: '/admin-panel-secret/moderation' },
        { label: 'LOGLAR', icon: '📜', path: '/admin-panel-secret/logs' },
    ];

    return (
        <aside style={{
            width: '260px',
            backgroundColor: '#0a0a0a',
            borderRight: '1px solid #222',
            height: '100vh',
            padding: '2rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
                <div style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '2px', textAlign: 'center', marginBottom: '1rem' }}>
                    NEX<span style={{ color: '#9e1b1b' }}>LYN</span> ADMIN
                </div>
            </Link>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link key={item.path} href={item.path} style={{ textDecoration: 'none' }}>
                            <div style={{
                                padding: '0.8rem 1rem',
                                color: isActive ? '#fff' : '#666',
                                backgroundColor: isActive ? 'rgba(158, 27, 27, 0.1)' : 'transparent',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                transition: 'all 0.2s',
                                borderLeft: isActive ? '3px solid #9e1b1b' : '3px solid transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                borderRadius: '0 8px 8px 0'
                            }}>
                                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                                {item.label}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div style={{ marginTop: 'auto', padding: '1.5rem', background: '#111', borderRadius: '12px', border: '1px solid #222' }}>
                <div style={{ fontSize: '0.75rem', color: '#444', marginBottom: '8px' }}>SYSTEM VERSION</div>
                <div style={{ fontSize: '0.9rem', color: '#888', fontWeight: 'bold' }}>v2.4.0-Enterprise</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4caf50' }}></div>
                    <span style={{ fontSize: '0.75rem', color: '#4caf50' }}>Secure Engine Active</span>
                </div>
            </div>
        </aside>
    );
}
