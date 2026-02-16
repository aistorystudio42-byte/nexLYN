'use client'

import { createClient } from '@/lib/supabase/browser'
import { Chrome } from 'lucide-react'

export default function LoginClient() {
    const supabase = createClient()

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/api/auth/callback`
            }
        })
    }

    return (
        <div className="py-8">
            <button
                onClick={handleGoogleLogin}
                className="w-full py-5 bg-ivory text-obsidian font-sans font-bold text-xs tracking-[0.3em] uppercase flex items-center justify-center gap-4 hover:bg-bronze-light hover:text-ivory transition-all shadow-2xl shadow-bronze/20 group"
            >
                <Chrome size={18} className="text-obsidian group-hover:text-ivory transition-colors" />
                Google İle Güvenli Giriş Yap
            </button>
            <p className="mt-8 text-[10px] text-ivory/20 tracking-[0.2em] uppercase italic">
                * Şifre gerektirmez, tek tıkla topluluğa katılın.
            </p>
        </div>
    )
}
