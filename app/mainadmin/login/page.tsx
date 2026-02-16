import { loginAdmin } from '@/lib/auth/adminActions'

export default function AdminLoginPage({ searchParams }: { searchParams: { error?: string } }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-obsidian text-ivory p-8">
            <div className="w-full max-w-sm glass-card border border-bronze/30 p-10 animate-fade-in">
                <div className="text-center mb-10">
                    <h1 className="text-2xl font-serif text-bronze-light mb-2 tracking-widest uppercase">Admin Girişi</h1>
                    <p className="text-[10px] text-ivory/30 tracking-[0.2em] uppercase">Erişim için yönetici şifresini girin</p>
                </div>

                <form action={loginAdmin} className="space-y-6">
                    <div className="space-y-2">
                        <input
                            type="password"
                            name="password"
                            placeholder="Şifre"
                            className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-ivory outline-none focus:border-bronze transition-colors rounded-sm"
                            required
                            autoFocus
                        />
                        {searchParams.error && (
                            <p className="text-[10px] text-red-500 tracking-wider">Hatalı şifre. Tekrar deneyin.</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-bronze/10 border border-bronze/30 text-ivory text-xs tracking-[0.3em] uppercase hover:bg-bronze hover:text-white transition-all rounded-sm shadow-lg shadow-bronze/5"
                    >
                        GİRİŞ YAP
                    </button>
                </form>

                <p className="mt-8 text-center text-[10px] text-ivory/20 tracking-widest uppercase">
                    nexLYN Güvenli Bölge
                </p>
            </div>
        </div>
    )
}
