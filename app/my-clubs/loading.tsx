import React from 'react';
import { SkeletonGrid } from '@/components/ui/SkeletonCard';

export default function Loading() {
    return (
        <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', padding: '120px 20px' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <header style={{ marginBottom: '60px' }}>
                    <div className="skeleton" style={{ height: '60px', width: '300px', marginBottom: '10px' }} />
                    <div style={{ width: '60px', height: '2px', background: 'rgba(193, 18, 31, 0.2)' }} />
                </header>
                <SkeletonGrid />
            </div>
        </main>
    );
}
