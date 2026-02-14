'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';

export default function AuthButton() {
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleLogin = async () => {
        setLoading(true);
        try {
            await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
        } catch (error) {
            console.error('Login error:', error);
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleLogin}
            disabled={loading}
            className="group relative px-10 py-4 transition-all duration-500 ease-out"
            style={{
                background: 'transparent',
                border: 'none',
                borderBottom: '2px solid #9e1b1b',
                cursor: 'pointer',
                outline: 'none',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderBottomColor = '#c1121f';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderBottomColor = '#9e1b1b';
            }}
        >
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-[#c1121f]/0 group-hover:bg-[#c1121f]/5 transition-colors duration-500 rounded-t-lg" />

            <div className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-[#c1121f] border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[#f2ebd9] font-inter text-sm tracking-widest uppercase">Yükleniyor</span>
                    </div>
                ) : (
                    <>
                        <svg
                            className="w-5 h-5 text-[#c1121f] transition-transform duration-500 group-hover:scale-110"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.64 2 12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.19 0 8.8-3.72 8.8-9.04 0-.46-.05-.86-.05-.86z" />
                        </svg>
                        <span
                            className="text-[#f2ebd9] font-inter text-base font-medium tracking-[0.2em] uppercase"
                            style={{ fontVariant: 'small-caps' }}
                        >
                            Google ile Giriş
                        </span>
                    </>
                )}
            </div>
        </button>
    );
}
