'use client'

import Link from 'next/link'

export default function Hero({ settings }: { settings: any }) {
    const {
        title = "nexLYN ile Kendi Dijital\nKulübünü Kur",
        subtitle = "Hayalinizdeki topluluğu oluşturun, dijital kulübünüzü özgürce özelleştirin ve yönetin.",
        button_text = "GİRİŞ YAP",
        image_url = "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000"
    } = settings

    return (
        <section className="relative w-full h-[70vh] flex flex-col items-start justify-center px-12 overflow-hidden border-b border-white/5">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-[-1]">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[30s] ease-linear scale-110 animate-slow-zoom"
                    style={{ backgroundImage: `url("${image_url}")` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            <div className="max-w-3xl pt-8">
                {/* Visual Accent */}
                <div className="w-12 h-px bg-bronze/60 mb-8 reveal-up stagger-1" />

                <h1 className="text-4xl md:text-7xl font-serif text-ivory mb-8 leading-[1.1] tracking-tight whitespace-pre-line reveal-up stagger-2">
                    {title}
                </h1>

                <p className="text-sm md:text-lg text-ivory/60 mb-12 max-w-xl leading-relaxed font-sans italic reveal-up stagger-3">
                    {subtitle}
                </p>

                <div className="flex items-center gap-6 reveal-up stagger-4">
                    <Link href="/giris" className="premium-button">
                        <span>{button_text}</span>
                    </Link>
                </div>
            </div>

            <style jsx>{`
                @keyframes slow-zoom {
                    from { transform: scale(1.1) translateX(0); }
                    to { transform: scale(1.2) translateX(2%); }
                }
                .animate-slow-zoom {
                    animation: slow-zoom 60s infinite alternate linear;
                }
            `}</style>
        </section>
    )
}

