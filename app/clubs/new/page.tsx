import React from 'react';
import { createClubAction } from '@/app/actions/clubActions';

export default function NewClubPage() {
    return (
        <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 20px' }}>
                <h1 style={{ color: 'var(--accent)', marginBottom: '40px', textAlign: 'center' }}>YENİ CEMİYET OLUŞTUR</h1>

                <form action={createClubAction} className="animate-fade-slide" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    <div>
                        <label style={{ color: '#666', fontSize: '0.8rem', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>
                            CEMİYET ADI
                        </label>
                        <input
                            name="clubName"
                            className="vintage-input"
                            placeholder="Örn: Royal Chess Club"
                            required
                        />
                    </div>

                    <div>
                        <label style={{ color: '#666', fontSize: '0.8rem', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>
                            VİZYON VE TANIM
                        </label>
                        <textarea
                            name="description"
                            className="vintage-textarea"
                            placeholder="Kulübün ruhunu ve kurallarını buraya dökün..."
                            rows={4}
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <button type="submit" className="vintage-button">
                            CEMİYETİ MÜHÜRLE
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
