import React from 'react';
import { SkeletonGrid } from '@/components/ui/SkeletonCard';

export default function Loading() {
    return (
        <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', padding: '120px 20px' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <header style={{ marginBottom: '60px' }}>
                    <div className="skeleton" style={{ height: '60px', width: '400px', marginBottom: '20px' }} />
                    <div className="skeleton" style={{ height: '20px', width: '600px' }} />
                </header>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '50px' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="skeleton" style={{ height: '40px', width: '100px', borderRadius: '99px' }} />
                    ))}
                </div>
                <SkeletonGrid />
            </div>
        </main>
    );
}
