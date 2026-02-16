'use client'

interface Pick {
    id: string
    title: string
    subtitle: string
    cover_url: string
}

export default function CuratorCard({ pick, index = 0 }: { pick: Pick, index?: number }) {
    return (
        <div
            className={`group relative w-full border border-white/5 hover:border-bronze/50 transition-all duration-700 cursor-pointer rounded-sm flex flex-col items-center bg-black/20 shadow-2xl overflow-hidden reveal-up`}
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            {/* Visual Area */}
            <div className="relative w-full aspect-[4/5] flex flex-col items-center justify-center bg-neutral-900 overflow-hidden border-b border-white/5">
                {pick.cover_url ? (
                    <>
                        <img
                            src={pick.cover_url}
                            alt={pick.title}
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 var(--ease-premium)"
                        />
                        {/* Elegant Vignette Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center opacity-20">
                        <div className="w-12 h-12 border border-ivory/20 rounded-full flex items-center justify-center mb-3 group-hover:border-bronze-light transition-colors duration-500">
                            <span className="text-2xl font-light text-ivory/40">+</span>
                        </div>
                        <span className="text-[10px] tracking-[0.2em] uppercase font-sans italic">Görsel Bekleniyor</span>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="w-full p-6 flex flex-col items-center text-center bg-gradient-to-b from-transparent to-black/40">
                <h3 className="text-sm font-serif text-ivory mb-2 tracking-[0.1em] group-hover:text-bronze-light transition-colors duration-500">
                    {pick.title || 'Seçki Başlığı'}
                </h3>
                <p className="text-[10px] text-ivory/30 font-sans tracking-tight mb-8 line-clamp-2 italic px-2 group-hover:text-ivory/60 transition-colors duration-500">
                    {pick.subtitle || 'Bu seçki için henüz bir açıklama mühürlenmemiş.'}
                </p>

                {/* Decorative Line - Animates on hover */}
                <div className="relative w-full h-px bg-white/5 mb-6 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-bronze/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                </div>

                <button className="premium-button w-full">
                    <span>İNCELE</span>
                </button>
            </div>
        </div>
    )
}

