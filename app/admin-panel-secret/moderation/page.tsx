
import React from 'react';
import { getModerationContent } from '@/app/actions/adminActions';
import DeleteModuleButton from '@/components/admin/DeleteModuleButton';

interface ModerationItem {
    id: string;
    type: string;
    created_at: string;
    club_id: string;
    clubs: { name: string }[] | { name: string } | null;
}

export default async function ModerationPage() {
    const content: ModerationItem[] = await getModerationContent();

    return (
        <div>
            <h1 style={{ color: '#fff', fontSize: '2rem', marginBottom: '30px', fontWeight: 'bold' }}>İçerik Denetimi</h1>

            <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#1a1a1a', borderBottom: '1px solid #222' }}>
                            <th style={{ padding: '15px 20px', color: '#888', fontWeight: '600', fontSize: '0.85rem' }}>MODÜL TİPİ</th>
                            <th style={{ padding: '15px 20px', color: '#888', fontWeight: '600', fontSize: '0.85rem' }}>KULÜP</th>
                            <th style={{ padding: '15px 20px', color: '#888', fontWeight: '600', fontSize: '0.85rem' }}>TARİH</th>
                            <th style={{ padding: '15px 20px', color: '#888', fontWeight: '600', fontSize: '0.85rem', textAlign: 'right' }}>DENETİM</th>
                        </tr>
                    </thead>
                    <tbody>
                        {content.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Denetlenecek içerik bulunamadı.</td>
                            </tr>
                        ) : (
                            content.map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #222', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '15px 20px' }}>
                                        <span style={{
                                            textTransform: 'uppercase',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            color: item.type === 'chat' ? '#4a90e2' : '#f5a623',
                                            padding: '2px 6px',
                                            background: 'rgba(255,255,255,0.05)',
                                            borderRadius: '4px'
                                        }}>
                                            {item.type}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px 20px', color: '#fff' }}>{Array.isArray(item.clubs) ? item.clubs[0]?.name : item.clubs?.name || 'Bilinmeyen Kulup'}</td>
                                    <td style={{ padding: '15px 20px', color: '#666', fontSize: '0.85rem' }}>
                                        {new Date(item.created_at).toLocaleDateString('tr-TR')}
                                    </td>
                                    <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                                        <DeleteModuleButton moduleId={item.id} />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
