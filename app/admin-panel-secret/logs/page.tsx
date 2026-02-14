
import React from 'react';
import { createAdminClient } from '@/utils/supabase/admin';

interface LogEntry {
    id: string;
    event_type: string | null;
    payload: Record<string, unknown> | string | null;
    created_at: string;
}

export default async function AdminLogsPage() {
    const supabase = createAdminClient();

    const { data: logs, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50) as { data: LogEntry[] | null; error: unknown };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 'bold' }}>Sistem Logları</h1>
                <span style={{ color: '#666', fontSize: '0.8rem' }}>Son 50 Aktivite</span>
            </div>

            <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#1a1a1a', borderBottom: '1px solid #222' }}>
                            <th style={{ padding: '15px 20px', color: '#888', fontWeight: '600', fontSize: '0.85rem' }}>TARİH</th>
                            <th style={{ padding: '15px 20px', color: '#888', fontWeight: '600', fontSize: '0.85rem' }}>OLAY</th>
                            <th style={{ padding: '15px 20px', color: '#888', fontWeight: '600', fontSize: '0.85rem' }}>DETAY</th>
                        </tr>
                    </thead>
                    <tbody>
                        {error || !logs || logs.length === 0 ? (
                            <tr>
                                <td colSpan={3} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                                    Henüz sistem logu bulunamadı.
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id} style={{ borderBottom: '1px solid #222' }}>
                                    <td style={{ padding: '15px 20px', color: '#666', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                                        {new Date(log.created_at).toLocaleString('tr-TR')}
                                    </td>
                                    <td style={{ padding: '15px 20px' }}>
                                        <span style={{
                                            color: '#bda061',
                                            background: 'rgba(189,160,97,0.1)',
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase'
                                        }}>
                                            {log.event_type || 'SYSTEM_EVENT'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px 20px', color: '#888', fontSize: '0.85rem' }}>
                                        {typeof log.payload === 'object' ? JSON.stringify(log.payload) : (log.payload || 'Detay yok')}
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
