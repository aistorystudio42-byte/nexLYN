'use client'

import { useState } from 'react'
import { resetClubPassword } from '@/lib/supabase/actions'
import { ShieldAlert, Key, CheckCircle2, XCircle } from 'lucide-react'

export default function ResetPasswordForm({ clubId, clubTitle }: { clubId: string, clubTitle: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const [recoveryCode, setRecoveryCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newRecoveryCode, setNewRecoveryCode] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleReset(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            const result = await resetClubPassword(clubId, recoveryCode, newPassword)
            if (result.new_recovery_code) {
                setNewRecoveryCode(result.new_recovery_code)
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (newRecoveryCode) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6 animate-fade-in">
                <div className="max-w-md w-full bg-neutral-900 border border-bronze p-8 text-center space-y-6">
                    <CheckCircle2 size={48} className="mx-auto text-green-500" />
                    <h3 className="text-xl font-serif text-ivory">Şifre Sıfırlandı!</h3>
                    <p className="text-sm text-ivory/60">
                        {clubTitle} kulübünün şifresi güncellendi. İşte yeni **Kurtarma Kodu**:
                    </p>
                    <div className="bg-black/60 p-4 font-mono text-lg tracking-widest text-bronze-accent border border-bronze/30 select-all">
                        {newRecoveryCode}
                    </div>
                    <button
                        onClick={() => {
                            setNewRecoveryCode(null)
                            setIsOpen(false)
                            setRecoveryCode('')
                            setNewPassword('')
                        }}
                        className="w-full py-3 bg-bronze text-ivory text-xs tracking-widest uppercase hover:bg-bronze-light"
                    >
                        Kapat ve Devam Et
                    </button>
                </div>
            </div>
        )
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-3 bg-white/5 border border-white/5 hover:bg-bronze transition-colors rounded-sm"
                title="Şifre Sıfırla"
            >
                <ShieldAlert size={16} />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 animate-fade-in">
                    <div className="max-w-md w-full bg-neutral-900 border border-white/10 p-8 space-y-6">
                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                            <h3 className="text-lg font-serif text-ivory">Şifre Sıfırla: {clubTitle}</h3>
                            <button onClick={() => setIsOpen(false)} className="text-ivory/40 hover:text-ivory"><XCircle size={20} /></button>
                        </div>

                        {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs">{error}</div>}

                        <form onSubmit={handleReset} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] text-ivory/40 uppercase tracking-widest">Mevcut Kurtarma Kodu</label>
                                <input
                                    value={recoveryCode}
                                    onChange={(e) => setRecoveryCode(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-ivory outline-none focus:border-bronze"
                                    placeholder="NEX-XXXX-XXXX"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-ivory/40 uppercase tracking-widest">Yeni Şifre</label>
                                <div className="relative">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-bronze" size={14} />
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 pl-12 pr-4 py-3 text-sm text-ivory outline-none focus:border-bronze"
                                        placeholder="Min. 8 karakter"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-bronze text-ivory text-[10px] tracking-[0.3em] uppercase hover:bg-bronze-light disabled:opacity-50"
                            >
                                {loading ? 'İşleniyor...' : 'Şifreyi Güncelle'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
