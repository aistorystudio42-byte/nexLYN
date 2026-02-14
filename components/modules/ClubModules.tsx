'use client';

import DOMPurify from 'isomorphic-dompurify';

interface ModuleProps {
    content?: string;
}

export function TradeModule({ content = '<p>Ticaret modülü içeriği yüklendi.</p>' }: ModuleProps) {
    const sanitizedContent = DOMPurify.sanitize(content);

    return (
        <div className="trade-module" style={{ border: '1px solid var(--accent)', padding: '20px', borderRadius: '4px' }}>
            <h3 style={{ color: 'var(--accent)', marginBottom: '16px' }}>Ticaret Paneli</h3>
            <div
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                style={{ color: 'var(--text)', opacity: 0.9 }}
            />
        </div>
    );
}

export function GamingModule({ content = '<p>Oyun dünyasına hoş geldiniz.</p>' }: ModuleProps) {
    const sanitizedContent = DOMPurify.sanitize(content);

    return (
        <div className="gaming-module" style={{ border: '1px solid var(--primary)', padding: '20px', borderRadius: '4px' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '16px' }}>Gaming Zone</h3>
            <div
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                style={{ color: 'var(--text)', opacity: 0.9 }}
            />
        </div>
    );
}

export function GeneralModule({ content, title }: { content: string; title: string }) {
    const sanitizedContent = DOMPurify.sanitize(content);

    return (
        <div className="general-module" style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '20px', borderRadius: '4px' }}>
            <h3 style={{ color: 'var(--text)', marginBottom: '16px' }}>{title}</h3>
            <div
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                style={{ color: 'var(--text)', opacity: 0.8 }}
            />
        </div>
    );
}
