import LoginClient from './LoginClient'

export default function GirisPage() {
    return (
        <div className="container mx-auto px-8 pt-32 pb-20 flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md bronze-border glass-card p-12 text-center animate-fade-in shadow-2xl relative overflow-hidden">
                {/* Decorative Background Element */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-bronze to-transparent opacity-50" />

                <h1 className="text-3xl font-serif text-ivory mb-4 tracking-tight">
                    nexLYN <span className="text-bronze-accent italic">Kulüp ve Topluluk</span> Platformu
                </h1>

                <p className="text-ivory/50 font-sans mb-12 tracking-wide text-sm leading-relaxed px-4">
                    Kendi kulübünüzü kurmak, topluluklara katılmak ve daha fazlasını keşfetmek için güvenle giriş yapın.
                </p>

                <LoginClient />

                <div className="mt-12 pt-8 border-t border-white/5">
                    <p className="text-[9px] text-ivory/20 leading-relaxed uppercase tracking-[0.2em]">
                        Güvenliğiniz için <span className="text-ivory/40">Google Auth</span> altyapısı kullanılmaktadır.
                    </p>
                </div>
            </div>
        </div>
    )
}
