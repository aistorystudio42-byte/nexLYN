'use client'

import { useState } from 'react'
import { addClub } from '@/lib/supabase/actions'
import { Plus, Layers, Globe, Key, Mail, ShieldCheck } from 'lucide-react'

export default function AddClubForm({ clubTypes }: { clubTypes: string[] }) {
    const [recoveryCode, setRecoveryCode] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [slug, setSlug] = useState('')

    const nexLynSlugify = (text: string) => {
        const trMap: { [key: string]: string } = {
            'ğ': 'g', 'Ğ': 'g',
            'ü': 'u', 'Ü': 'u',
            'ş': 's', 'Ş': 's',
            'ı': 'i', 'İ': 'i',
            'ö': 'o', 'Ö': 'o',
            'ç': 'c', 'Ç': 'c'
        }

        // Önce Türkçe karakterleri İngilizce karşılıklarına çevir
        let result = text.toString()
        Object.keys(trMap).forEach(key => {
            result = result.replace(new RegExp(key, 'g'), trMap[key])
        })

        return result
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '/') // Boşlukları / ile değiştir
            .replace(/[^\w\/]+/g, '') // Sadece harf, rakam ve slash kalsın
            .replace(/\/+/g, '/') // Çift slashları engelle
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value
        setSlug(nexLynSlugify(title))
    }

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)
        try {
            const result = await addClub(formData)
            if (result.recovery_code) {
                setRecoveryCode(result.recovery_code)
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (recoveryCode) {
        return (
            <div className="bg-bronze/10 border border-bronze p-8 text-center space-y-6 animate-fade-in">
                <ShieldCheck size={48} className="mx-auto text-bronze" />
                <h3 className="text-xl font-serif text-ivory">Kulüp Başarıyla Oluşturuldu!</h3>
                <p className="text-sm text-ivory/60 max-w-md mx-auto">
                    Bu kulübün **Kurtarma Kodu** aşağıdadır. Bu kod şifre sıfırlama için TEK kullanımlıktır ve sadece ŞİMDİ gösterilir.
                </p>
                <div className="bg-black/60 p-4 font-mono text-xl tracking-widest text-bronze-accent border border-bronze/30 select-all">
                    {recoveryCode}
                </div>
                <button
                    onClick={() => setRecoveryCode(null)}
                    className="px-8 py-3 bg-bronze text-ivory text-[10px] tracking-widest uppercase hover:bg-bronze-light"
                >
                    Tamam, Not Aldım
                </button>
            </div>
        )
    }

    return (
        <form action={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/20 p-6 rounded-sm border border-white/5">
            {error && (
                <div className="md:col-span-2 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div className="flex items-center gap-3 bg-black/40 border border-white/10 px-4 py-1">
                    <Layers size={14} className="text-bronze" />
                    <input
                        name="title"
                        placeholder="Kulüp Görünen Adı"
                        className="w-full bg-transparent py-3 text-sm text-ivory outline-none"
                        required
                        onChange={handleTitleChange}
                    />
                </div>
                <div className="flex items-center gap-3 bg-black/40 border border-white/10 px-4 py-1">
                    <Globe size={14} className="text-bronze" />
                    <input
                        name="slug"
                        placeholder="Kulüp URL (slug)"
                        className="w-full bg-transparent py-3 text-sm text-ivory outline-none"
                        required
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 bg-black/40 border border-white/10 px-4 py-1">
                    <Key size={14} className="text-bronze" />
                    <input name="admin_password" type="password" placeholder="Kulüp Admin Şifresi" className="w-full bg-transparent py-3 text-sm text-ivory outline-none" required />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-3 bg-black/40 border border-white/10 px-4 py-1">
                    <Mail size={14} className="text-bronze" />
                    <input name="owner_email" type="email" placeholder="Sahip E-Posta Adresi" className="w-full bg-transparent py-3 text-sm text-ivory outline-none" required />
                </div>
                <select name="type" className="w-full bg-black/40 border border-white/10 px-4 py-4 text-sm text-ivory cursor-pointer outline-none appearance-none" required>
                    <option value="" disabled selected>Kulüp Türü Seçin</option>
                    {clubTypes.map(t => <option key={t} value={t} className="bg-neutral-900">{t}</option>)}
                </select>
                <textarea name="excerpt" placeholder="Kısa Tanıtım Notu" className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-ivory outline-none" rows={1} />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="md:col-span-2 py-4 bg-bronze text-ivory text-[10px] tracking-[0.4em] uppercase hover:bg-bronze-light disabled:opacity-50 transition-all shadow-xl shadow-bronze/10"
            >
                {loading ? 'Kaydediliyor...' : 'Kulübü Sisteme Kaydet ve Kurtarma Kodu Üret'}
            </button>
        </form>
    )
}
