'use client';

import React, { useState, useCallback } from 'react';
import { addClubAction } from '@/app/actions/addClubAction';
import { useToast } from '@/components/ui/ToastContext';

export default function NewClubForm() {
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await addClubAction(formData);

        setLoading(false);

        if (result.success) {
            showToast('Kulüp başarıyla oluşturuldu.', 'success');
            (e.target as HTMLFormElement).reset();
        } else {
            showToast(result.error || 'Kulüp oluşturulurken bir hata oluştu.', 'error');
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
                borderLeft: '4px solid #c1121f',
                paddingLeft: '15px'
            }}>Yeni Kulüp Ekle</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div style={{ position: 'relative' }}>
                    <input
                        name="name"
                        type="text"
                        placeholder="Kulüp Adı"
                        required
                        style={inputStyle}
                    />
                </div>

                <div style={{ position: 'relative' }}>
                    <select name="type" required style={inputStyle} defaultValue="">
                        <option value="" disabled>Kulüp Türü Seçin</option>
                        <option value="STANDART">Standart Kulüp</option>
                        <option value="VIP">VIP Elite</option>
                        <option value="PRIVATE">Gizli Cemiyet</option>
                        <option value="ENTERPRISE">Kurumsal</option>
                    </select>
                </div>

                <div style={{ position: 'relative' }}>
                    <input
                        name="email"
                        type="email"
                        placeholder="Sahip E-postası"
                        required
                        style={inputStyle}
                    />
                </div>

                <div style={{ position: 'relative' }}>
                    <input
                        name="password"
                        type="password"
                        placeholder="Başlangıç Şifresi (Opsiyonel)"
                        style={inputStyle}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        background: loading ? '#333' : '#c1121f',
                        color: '#fff',
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
                    {loading ? 'OLUŞTURULUYOR...' : 'CEMİYETİ YARAT'}
                </button>
            </form>
        </section>
    );
}

const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '2px solid rgba(193, 18, 31, 0.3)',
    color: '#fff',
    padding: '12px 0',
    fontSize: '1.1rem',
    outline: 'none',
    transition: 'border-color 0.3s ease'
};
