'use client';

import React from 'react';

export default function SkeletonCard() {
    return (
        <div className="skeleton masonry-item" style={{
            height: '100%',
            width: '100%',
            border: '1px solid rgba(193, 18, 31, 0.1)',
            boxShadow: '0 0 20px rgba(193, 18, 31, 0.05)'
        }}>
            <div style={{ padding: '20px' }}>
                <div className="skeleton" style={{ height: '30px', width: '60%', marginBottom: '15px', backgroundColor: '#111' }} />
                <div className="skeleton" style={{ height: '150px', width: '100%', marginBottom: '15px', backgroundColor: '#111' }} />
                <div className="skeleton" style={{ height: '20px', width: '80%', backgroundColor: '#111' }} />
            </div>
        </div>
    );
}

export function SkeletonGrid() {
    return (
        <div className="masonry-grid">
            {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}
