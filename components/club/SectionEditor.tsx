'use client'

import { useState } from 'react'
import { Settings, Save, X, Plus, Trash2, Globe, Shield, MessageSquare, BarChart3, Box } from 'lucide-react'
import { updateClubAbout, updateClubMetadata, createPoll, toggleClubModule, updateModuleData } from '@/lib/supabase/actions'

export default function SectionEditor({ club, type }: { club: any, type: 'about' | 'chat' | 'polls' | 'modules' }) {
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [editingModule, setEditingModule] = useState<any>(null)
    const [moduleData, setModuleData] = useState<any>(null)

    // Form States
    const [excerpt, setExcerpt] = useState(club.excerpt || '')
    const [vision, setVision] = useState(club.theme_settings?.vision || '')
    const [rules, setRules] = useState(club.theme_settings?.rules || '')
    const [socials, setSocials] = useState({
        instagram: club.theme_settings?.socials?.instagram || '',
        twitter: club.theme_settings?.socials?.twitter || '',
        website: club.theme_settings?.socials?.website || ''
    })
    const [rooms, setRooms] = useState<string[]>(club.theme_settings?.rooms || ['GENEL_LOBI', 'STRATEJI_ODASI', 'DUYURULAR'])
    const [newPoll, setNewPoll] = useState({ question: '', options: ['', ''] })

    // MODULE LOGIC MAPPING
    const getModuleConfig = (mid: string) => {
        // Collection Based (Lists)
        const collections: any = {
            // Ticaret
            'tic_vitrin': { fields: ['title', 'price', 'image', 'stock'], labels: ['Ürün Adı', 'Fiyat', 'Görsel URL', 'Stok'] },
            'tic_yorum': { fields: ['user', 'comment', 'rating'], labels: ['Kullanıcı', 'Yorum', 'Puan (1-5)'] },
            'tic_kampanya': { fields: ['title', 'code', 'discount'], labels: ['Kampanya Adı', 'Kupon Kodu', 'İndirim %'] },
            // Oyun
            'oyun_turnuva': { fields: ['match', 'score', 'status'], labels: ['Eşleşme (A vs B)', 'Skor', 'Durum (Canlı/Bitti)'] },
            'oyun_kadro': { fields: ['name', 'role', 'avatar', 'kda'], labels: ['Oyuncu Adı', 'Mevki/Rol', 'Avatar URL', 'KDA'] },
            'oyun_takvim': { fields: ['event', 'date', 'platform'], labels: ['Etkinlik/Maç', 'Tarih', 'Yer/Platform'] },
            // Akademi
            'aka_kutuphane': { fields: ['title', 'format', 'url'], labels: ['Kaynak Adı', 'Format (.pdf)', 'İndirme Linki'] },
            'aka_makale': { fields: ['title', 'author', 'content'], labels: ['Makale Başlığı', 'Yazar', 'Kısa Özet'] },
            // Eğlence
            'egl_etkinlik': { fields: ['title', 'date', 'location', 'link'], labels: ['Etkinlik', 'Zaman', 'Mekan', 'Bilet/Kayıt Linki'] },
            'egl_galeri': { fields: ['title', 'url'], labels: ['Görsel Adı', 'Görsel URL'] },
            // Kurumsal
            'kur_bulten': { fields: ['title', 'date', 'content'], labels: ['Haber Başlığı', 'Tarih', 'İçerik'] },
            'kur_vizyon': { fields: ['name', 'position', 'image'], labels: ['Kişi/Bölüm', 'Görev/Vizyon', 'Görsel URL'] },
            'kur_sss': { fields: ['question', 'answer'], labels: ['Soru', 'Cevap'] },
            // Sosyal
            'sos_profil': { fields: ['name', 'bio', 'links'], labels: ['Üye Adı', 'Biyografi', 'Sosyal Medya'] },
            'sos_gorev': { fields: ['task', 'reward', 'deadline'], labels: ['Görev', 'Ödül', 'Son Tarih'] },
            'sos_kural': { fields: ['title', 'content'], labels: ['Kural Başlığı', 'Açıklama'] }
        }

        // Link/Embed Based
        const links: any = {
            'tic_destek': { label: 'VIP Destek Hattı (Link)', placeholder: 'https://...', key: 'support_url' },
            'oyun_medya': { label: 'Twitch / YouTube Embed URL', placeholder: 'https://...', key: 'embed_url' },
            'oyun_strateji': { label: 'Strateji Odası Erişim Linki', placeholder: 'https://...', key: 'strategy_url' },
            'aka_program': { label: 'Akademik Takvim / Program URL', placeholder: 'https://...', key: 'program_url' },
            'aka_forum': { label: 'Forum / Tartışma Alanı Linki', placeholder: 'https://...', key: 'forum_url' },
            'aka_sinav': { label: 'Sınav / Quiz Erişim Linki', placeholder: 'https://...', key: 'quiz_url' },
            'egl_muzik': { label: 'Spotify / Apple Music Çalma Listesi', placeholder: 'https://...', key: 'playlist_url' },
            'egl_lounge': { label: 'Lounge Sohbet Odası (Discord/Telegram)', placeholder: 'https://...', key: 'chat_url' },
            'kur_randevu': { label: 'Rezervasyon/Randevu Sistemi Linki', placeholder: 'https://calendly.com/...', key: 'booking_url' },
            'sos_meydan': { label: 'Kolektif Meydan Sohbet Linki', placeholder: 'https://...', key: 'square_url' }
        }

        // Settings/Form Based
        const settings: any = {
            'tic_siparis': { fields: [{ k: 'whatsapp', l: 'Sipariş Hattı (WhatsApp)' }, { k: 'note', l: 'Ödeme Notu' }] },
            'egl_anket': { fields: [{ k: 'question', l: 'Aktif Oylama Sorusu' }, { k: 'options', l: 'Seçenekler (Virgülle ayır)' }] },
            'kur_iletisim': { fields: [{ k: 'mail', l: 'Kurumsal E-Posta' }, { k: 'phone', l: 'Telefon' }, { k: 'address', l: 'Merkez Adres' }] },
            'sos_bagis': { fields: [{ k: 'goal', l: 'Hedef Bağış Mik.' }, { k: 'current', l: 'Toplanan' }, { k: 'link', l: 'Ödeme Linki' }] }
        }

        if (collections[mid]) return { type: 'COLLECTION', ...collections[mid] }
        if (links[mid]) return { type: 'LINK', ...links[mid] }
        if (settings[mid]) return { type: 'SETTINGS', ...settings[mid] }

        return { type: 'COLLECTION', fields: ['title', 'description'], labels: ['Başlık', 'Açıklama'] }
    }

    const handleSaveAbout = async () => {
        setLoading(true)
        try {
            await updateClubAbout(club.id, excerpt)
            await updateClubMetadata(club.id, { ...club.theme_settings, vision, rules, socials })
            setIsEditing(false)
        } finally { setLoading(false) }
    }

    const handleSaveChat = async () => {
        setLoading(true)
        try {
            await updateClubMetadata(club.id, { ...club.theme_settings, rooms })
            setIsEditing(false)
        } finally { setLoading(false) }
    }

    const handleModuleToggle = async (mid: string, active: boolean) => {
        setLoading(true)
        try {
            await toggleClubModule(club.id, mid, active)
        } finally { setLoading(false) }
    }

    const handleSaveModuleData = async () => {
        if (!editingModule) return
        setLoading(true)
        try {
            await updateModuleData(club.id, editingModule.module_id, moduleData)
            setEditingModule(null)
        } finally { setLoading(false) }
    }

    const handleCreatePoll = async () => {
        if (!newPoll.question || newPoll.options.some(o => !o)) return
        setLoading(true)
        try {
            await createPoll(club.id, newPoll.question, newPoll.options)
            setIsEditing(false)
            setNewPoll({ question: '', options: ['', ''] })
        } finally { setLoading(false) }
    }

    if (!isEditing) {
        return (
            <button
                onClick={() => setIsEditing(true)}
                className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-8 py-4 bg-black/60 backdrop-blur-xl text-white text-[10px] tracking-[0.4em] uppercase hover:bg-bronze transition-all shadow-2xl shadow-bronze/20 rounded-full font-bold border border-bronze/30 group animate-in fade-in slide-in-from-bottom-8 duration-1000"
            >
                <Settings size={16} className="text-bronze group-hover:rotate-180 transition-transform duration-700" />
                <span className="opacity-60 group-hover:opacity-100">MİMAR MODU</span>
            </button>
        )
    }

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-8 animate-fade-in">
            <div className="w-full max-w-2xl bg-black border border-bronze/30 shadow-2xl shadow-bronze/10 rounded-sm overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-bronze/10 rounded-full flex items-center justify-center">
                            <Settings size={20} className="text-bronze" />
                        </div>
                        <div>
                            <h3 className="text-xl font-serif text-ivory">
                                {editingModule ? `Modül Verisi: ${editingModule.module_id.split('_')[1]}` : 'Mimar Modu'}
                            </h3>
                            <p className="text-[9px] tracking-widest text-bronze uppercase font-bold">
                                {editingModule ? 'VERİ GİRİŞİ' : 'BÖLÜM KONFİGÜRASYONU'}
                            </p>
                        </div>
                    </div>
                    <button onClick={() => editingModule ? setEditingModule(null) : setIsEditing(false)} className="text-ivory/40 hover:text-white transition-colors">
                        {editingModule ? <MessageSquare size={20} className="rotate-45" /> : <X size={24} />}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar">
                    {editingModule ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex justify-between items-center border-l-2 border-bronze pl-4">
                                <h4 className="text-sm tracking-widest text-ivory uppercase font-bold">
                                    {getModuleConfig(editingModule.module_id).type === 'COLLECTION' ? 'ARŞİV KAYITLARI' : 'MODÜL YAPILANDIRMASI'}
                                </h4>
                                {getModuleConfig(editingModule.module_id).type === 'COLLECTION' && (
                                    <button onClick={() => setModuleData([...(Array.isArray(moduleData) ? moduleData : []), {}])} className="text-[10px] text-bronze uppercase tracking-widest flex items-center gap-2 hover:text-white transition-all"><Plus size={14} /> YENİ KAYIT</button>
                                )}
                            </div>

                            <div className="space-y-6">
                                {/* COLLECTION EDITOR */}
                                {getModuleConfig(editingModule.module_id).type === 'COLLECTION' && (
                                    <div className="space-y-4">
                                        {(Array.isArray(moduleData) ? moduleData : []).map((item: any, i: number) => {
                                            const config = getModuleConfig(editingModule.module_id)
                                            return (
                                                <div key={i} className="p-6 bg-white/[0.03] border border-white/10 rounded-sm relative group">
                                                    <button onClick={() => setModuleData(moduleData.filter((_: any, idx: number) => idx !== i))} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {config.fields.map((field: string, fIdx: number) => (
                                                            <div key={field} className="space-y-1">
                                                                <label className="text-[9px] text-ivory/30 uppercase tracking-widest ml-1">{config.labels[fIdx]}</label>
                                                                <input type="text" value={item[field] || ''} onChange={(e) => {
                                                                    const newData = [...moduleData]
                                                                    newData[i] = { ...newData[i], [field]: e.target.value }
                                                                    setModuleData(newData)
                                                                }} className="w-full bg-black/40 border border-white/10 p-3 text-xs text-ivory outline-none focus:border-bronze" placeholder="..." />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        {(!moduleData || moduleData.length === 0) && <div className="py-20 border border-dashed border-white/10 text-center opacity-30 italic text-xs uppercase tracking-widest">Henüz mühürlenmiş veri yok.</div>}
                                    </div>
                                )}

                                {/* LINK EDITOR */}
                                {getModuleConfig(editingModule.module_id).type === 'LINK' && (
                                    <div className="space-y-4">
                                        <label className="text-[10px] text-ivory/30 uppercase tracking-widest ml-1">{getModuleConfig(editingModule.module_id).label}</label>
                                        <input
                                            type="text"
                                            value={typeof moduleData === 'string' ? moduleData : (moduleData as any)?.[getModuleConfig(editingModule.module_id).key] || ''}
                                            onChange={(e) => setModuleData(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 p-5 text-sm text-ivory italic focus:border-bronze outline-none"
                                            placeholder={getModuleConfig(editingModule.module_id).placeholder}
                                        />
                                        <p className="text-[9px] text-bronze uppercase italic leading-relaxed">Örnek: {getModuleConfig(editingModule.module_id).placeholder}</p>
                                    </div>
                                )}

                                {/* SETTINGS EDITOR */}
                                {getModuleConfig(editingModule.module_id).type === 'SETTINGS' && (
                                    <div className="grid grid-cols-1 gap-6">
                                        {getModuleConfig(editingModule.module_id).fields.map((field: any) => (
                                            <div key={field.k} className="space-y-2">
                                                <label className="text-[10px] text-ivory/30 uppercase tracking-widest ml-1">{field.l}</label>
                                                <input
                                                    type="text"
                                                    value={(moduleData as any)?.[field.k] || ''}
                                                    onChange={(e) => setModuleData({ ...(moduleData as any), [field.k]: e.target.value })}
                                                    className="w-full bg-black/40 border border-white/10 p-4 text-xs text-ivory focus:border-bronze outline-none"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button onClick={handleSaveModuleData} disabled={loading} className="w-full py-5 bg-bronze text-white text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-bronze-light transition-all shadow-xl shadow-bronze/20">DEĞİŞİKLİKLERİ MÜHÜRLÜ VE AKTİF ET</button>
                        </div>
                    ) : (
                        <>
                            {/* ABOUT EDITOR */}
                            {type === 'about' && (
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <h4 className="text-sm tracking-widest text-ivory uppercase font-bold border-l-2 border-bronze pl-4">Manifesto</h4>
                                        <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="w-full bg-white/5 border border-white/10 p-6 text-sm text-ivory outline-none focus:border-bronze min-h-[150px] italic font-serif" />
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-sm tracking-widest text-ivory uppercase font-bold border-l-2 border-bronze pl-4">Vizyon & Kurallar</h4>
                                        <input type="text" value={vision} onChange={(e) => setVision(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 text-xs text-ivory outline-none focus:border-bronze" placeholder="Vizyonunuz..." />
                                        <textarea value={rules} onChange={(e) => setRules(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 text-xs text-ivory outline-none focus:border-bronze min-h-[100px]" placeholder="Kurallarınız..." />
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-sm tracking-widest text-ivory uppercase font-bold border-l-2 border-bronze pl-4">Sosyal Linkler</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <input type="text" value={socials.instagram} onChange={(e) => setSocials({ ...socials, instagram: e.target.value })} className="bg-white/5 border border-white/10 p-4 text-[10px] text-ivory outline-none focus:border-bronze" placeholder="Instagram" />
                                            <input type="text" value={socials.twitter} onChange={(e) => setSocials({ ...socials, twitter: e.target.value })} className="bg-white/5 border border-white/10 p-4 text-[10px] text-ivory outline-none focus:border-bronze" placeholder="Twitter (X)" />
                                            <input type="text" value={socials.website} onChange={(e) => setSocials({ ...socials, website: e.target.value })} className="bg-white/5 border border-white/10 p-4 text-[10px] text-ivory outline-none focus:border-bronze" placeholder="Website" />
                                        </div>
                                    </div>
                                    <button onClick={handleSaveAbout} disabled={loading} className="w-full py-4 bg-bronze text-white text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-bronze-light transition-all">KAYDET VE MÜHÜRLE</button>
                                </div>
                            )}

                            {/* CHAT EDITOR */}
                            {type === 'chat' && (
                                <div className="space-y-8">
                                    <h4 className="text-sm tracking-widest text-ivory uppercase font-bold border-l-2 border-bronze pl-4">Kanal Yönetimi</h4>
                                    <div className="space-y-4">
                                        {rooms.map((room, i) => (
                                            <div key={i} className="flex gap-2">
                                                <div className="w-12 h-12 bg-white/5 flex items-center justify-center border border-white/10 text-bronze">#</div>
                                                <input
                                                    type="text"
                                                    value={room}
                                                    onChange={(e) => {
                                                        const newRooms = [...rooms]
                                                        newRooms[i] = e.target.value.toUpperCase().replace(/\s+/g, '_')
                                                        setRooms(newRooms)
                                                    }}
                                                    className="flex-1 bg-white/5 border border-white/10 p-4 text-xs text-ivory outline-none focus:border-bronze"
                                                />
                                                <button onClick={() => setRooms(rooms.filter((_, idx) => idx !== i))} className="p-4 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"><Trash2 size={16} /></button>
                                            </div>
                                        ))}
                                        <button onClick={() => setRooms([...rooms, 'YENI_KANAL'])} className="text-[10px] text-bronze uppercase tracking-widest flex items-center gap-2"><Plus size={14} /> KANAL EKLE</button>
                                    </div>
                                    <button onClick={handleSaveChat} disabled={loading} className="w-full py-4 bg-bronze text-white text-[10px] tracking-[0.3em] uppercase font-bold">KANALLARI GÜNCELLE</button>
                                </div>
                            )}

                            {/* POLLS EDITOR */}
                            {type === 'polls' && (
                                <div className="space-y-8">
                                    <h4 className="text-sm tracking-widest text-ivory uppercase font-bold border-l-2 border-bronze pl-4">Yeni Anket</h4>
                                    <input type="text" value={newPoll.question} onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })} className="w-full bg-white/5 border border-white/10 p-4 text-xs text-ivory" placeholder="Soru..." />
                                    {newPoll.options.map((opt, i) => (
                                        <input key={i} type="text" value={opt} onChange={(e) => {
                                            const o = [...newPoll.options]
                                            o[i] = e.target.value
                                            setNewPoll({ ...newPoll, options: o })
                                        }} className="w-full bg-white/5 border border-white/10 p-4 text-xs text-ivory" placeholder={`Seçenek ${i + 1}`} />
                                    ))}
                                    <button onClick={() => setNewPoll({ ...newPoll, options: [...newPoll.options, ''] })} className="text-[10px] text-bronze uppercase tracking-widest">+ SEÇENEK</button>
                                    <button onClick={handleCreatePoll} disabled={loading} className="w-full py-4 bg-bronze text-white text-[10px] tracking-[0.3em] uppercase font-bold">ANKETİ BAŞLAT</button>
                                </div>
                            )}

                            {/* MODULES EDITOR */}
                            {type === 'modules' && (
                                <div className="space-y-8">
                                    <h4 className="text-sm tracking-widest text-ivory uppercase font-bold border-l-2 border-bronze pl-4">Modül Donanımı</h4>
                                    <div className="grid grid-cols-1 gap-4">
                                        {club.modules?.map((mod: any) => (
                                            <div key={mod.id} className="p-6 bg-white/5 border border-white/10 flex justify-between items-center rounded-sm group hover:border-bronze/30 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <Box size={20} className={mod.is_active ? 'text-bronze' : 'text-ivory/20'} />
                                                    <div>
                                                        <p className="text-xs text-white uppercase tracking-widest">{mod.module_id.split('_')[1]}</p>
                                                        <p className={`text-[9px] uppercase ${mod.is_active ? 'text-green-500' : 'text-red-500'}`}>{mod.is_active ? 'AKTİF' : 'PASİF'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingModule(mod)
                                                            setModuleData(Array.isArray(mod.data) ? mod.data : [])
                                                        }}
                                                        className="px-4 py-2 text-[9px] tracking-widest uppercase border border-white/10 text-ivory/40 hover:text-white transition-all font-bold"
                                                    >
                                                        VERİYİ DÜZENLE
                                                    </button>
                                                    <button onClick={() => handleModuleToggle(mod.module_id, !mod.is_active)} className={`px-6 py-2 text-[9px] tracking-widest uppercase font-bold border ${mod.is_active ? 'border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white' : 'border-green-500/30 text-green-500 hover:bg-green-500 hover:text-white'}`}>
                                                        {mod.is_active ? 'KAPAT' : 'AÇ'}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
