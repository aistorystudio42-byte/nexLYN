'use client'

import { useState } from 'react'
import { ChevronRight, HelpCircle, BookOpen, MessageSquare, ShieldAlert, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/browser'

const ICON_MAP: { [key: string]: any } = {
    HelpCircle,
    BookOpen,
    MessageSquare,
    ShieldAlert
}

export default function SupportPage({ initialContent }: { initialContent: any }) {
    const [selectedLink, setSelectedLink] = useState<{ name: string, content: string } | null>(null)

    return (
        <div className="container mx-auto px-8 pt-32 pb-20">
            <div className="max-w-3xl mb-16 animate-fade-in">
                <h1 className="text-5xl font-serif text-ivory mb-6 italic">
                    {initialContent.title.split(' ')[0]} <span className="text-bronze-accent not-italic">{initialContent.title.split(' ').slice(1).join(' ')}</span>
                </h1>
                <p className="text-ivory/60 leading-relaxed font-sans italic text-lg">
                    {initialContent.subtitle}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {initialContent.categories.map((cat: any, idx: number) => {
                    const Icon = ICON_MAP[cat.icon] || HelpCircle
                    return (
                        <div key={idx} className="bg-white/5 border border-white/5 p-8 hover:border-bronze/30 transition-all group rounded-sm shadow-xl shadow-black/50">
                            <div className="w-12 h-12 bg-bronze/10 border border-bronze/20 flex items-center justify-center mb-6 group-hover:bg-bronze transition-all duration-500">
                                <Icon size={24} className="text-bronze-accent group-hover:text-ivory" />
                            </div>
                            <h3 className="text-xl font-serif text-ivory mb-6 tracking-wide underline underline-offset-8 decoration-white/5 group-hover:decoration-bronze/50 transition-all">{cat.title}</h3>
                            <ul className="space-y-4">
                                {cat.links.map((link: any, lIdx: number) => (
                                    <li key={lIdx}>
                                        <button
                                            onClick={() => setSelectedLink(link)}
                                            className="w-full text-left text-sm text-ivory/40 hover:text-bronze-light flex items-center justify-between group/link transition-all font-sans italic"
                                        >
                                            <span>{link.name}</span>
                                            <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-bronze" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                })}
            </div>

            {/* Modal - Arşiv Görünümü */}
            {selectedLink && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-12 animate-fade-in">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedLink(null)} />
                    <div className="relative w-full max-w-2xl bg-neutral-900 border border-bronze/30 shadow-2xl overflow-hidden rounded-sm flex flex-col max-h-[80vh]">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-black/20">
                            <h2 className="text-xl font-serif text-bronze-accent italic">{selectedLink.name}</h2>
                            <button onClick={() => setSelectedLink(null)} className="text-ivory/40 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        {/* Modal Content */}
                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            <div className="prose prose-invert max-w-none">
                                <p className="text-ivory/70 leading-relaxed font-sans whitespace-pre-line text-base">
                                    {selectedLink.content || "Bu içerik henüz arşivlenmemiş. Lütfen daha sonra tekrar kontrol edin."}
                                </p>
                            </div>
                        </div>
                        {/* Modal Footer */}
                        <div className="p-6 bg-black/20 border-t border-white/5 text-center">
                            <p className="text-[10px] tracking-widest text-ivory/20 uppercase font-sans italic">nexLYN Bilgi Arşivi • 2026</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-20 p-12 bg-gradient-to-b from-bronze/10 to-transparent border border-bronze/20 text-center space-y-6 rounded-sm">
                <h2 className="text-4xl font-serif text-ivory italic">Aradığınızı <span className="text-bronze-accent not-italic">bulamadınız mı?</span></h2>
                <p className="text-ivory/40 text-sm max-w-xl mx-auto italic font-sans">
                    Teknik ekibimize doğrudan ulaşmak ve özel durumlarınız için destek almak için resmi iletişim kanallarımızı kullanabilirsiniz.
                </p>
                <div className="pt-4 flex justify-center">
                    <button className="premium-button !bg-bronze !text-ivory !border-bronze-light/30">
                        <span>İLETİŞİME GEÇ</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
