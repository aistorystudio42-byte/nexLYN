'use client';

import React, { useState, useCallback } from 'react';
import { updateSiteSettings } from '@/app/actions/adminActions';
import { useToast } from '@/components/ui/ToastContext';

interface Props {
    settings: {
        contact_email: string;
        instagram_url: string;
        other_projects_url: string;
        welcome_message: string;
    } | null;
}

export default function SiteSettingsForm({ settings }: Props) {
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await updateSiteSettings(formData);

        setLoading(false);
        if (result.success) {
            showToast('Ayarlar başarıyla güncellendi.', 'success');
        } else {
            showToast(result.error || 'Ayarlar kaydedilirken hata oluştu.', 'error');
        }
    }, [showToast]);

    return (
        <section style={{
            background: '#0a0a0a',
            padding: '40px',
            borderRadius: '16px',
            border: '1px solid #1a1a1a',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
        }}>
            <h2 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '2rem',
                color: '#fff',
                marginBottom: '30px',
                borderLeft: '4px solid #bda061',
                paddingLeft: '15px'
            }}>İletişim Ayarları</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div style={{ position: 'relative' }}>
                    <label style={labelStyle}>İletişim E-postası</label>
                    <input
                        name="contact_email"
                        type="email"
                        defaultValue={settings?.contact_email || ''}
                        style={inputStyle}
                    />
                </div>

                <div style={{ position: 'relative' }}>
                    <label style={labelStyle}>Instagram URL</label>
                    <input
                        name="instagram_url"
                        type="url"
                        defaultValue={settings?.instagram_url || ''}
                        style={inputStyle}
                    />
                </div>

                <div style={{ position: 'relative' }}>
                    <label style={labelStyle}>Diğer Projeler URL</label>
                    <input
                        name="other_projects_url"
                        type="url"
                        defaultValue={settings?.other_projects_url || ''}
                        style={inputStyle}
                    />
                </div>

                <div style={{ position: 'relative' }}>
                    <label style={labelStyle}>Hoş Geldiniz Mesajı</label>
                    <textarea
                        name="welcome_message"
                        defaultValue={settings?.welcome_message || ''}
                        rows={3}
                        style={{ ...inputStyle, resize: 'none' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        background: loading ? '#333' : '#bda061',
                        color: '#000',
                        padding: '18px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        border: 'none',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {loading ? 'GÜNCELLENİYOR...' : 'AYARLARI KAYDET'}
                </button>
            </form>
        </section>
    );
}

const labelStyle: React.CSSProperties = {
    color: '#666',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: '8px',
    display: 'block'
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid #222',
    color: '#fff',
    padding: '12px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s ease'
};
