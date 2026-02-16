'use client'

import { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp, Save, BookOpen, ShieldAlert, HelpCircle, MessageSquare } from 'lucide-react'
import { updatePageSettings } from '@/lib/supabase/actions'

const ICONS = [
    { name: 'BookOpen', icon: BookOpen },
    { name: 'ShieldAlert', icon: ShieldAlert },
    { name: 'HelpCircle', icon: HelpCircle },
    { name: 'MessageSquare', icon: MessageSquare }
]

export default function SupportManager({ initialData }: { initialData: any }) {
    const [data, setData] = useState(initialData)
    const [loading, setLoading] = useState(false)

    const addCategory = () => {
        const newCategory = {
            title: "Yeni Kategori",
            icon: "HelpCircle",
            links: [{ name: "Yeni Soru", content: "Buraya cevabı yazın..." }]
        }
        setData({ ...data, categories: [...data.categories, newCategory] })
    }

    const removeCategory = (index: number) => {
        const newCats = [...data.categories]
        newCats.splice(index, 1)
        setData({ ...data, categories: newCats })
    }

    const addLink = (catIndex: number) => {
        const newCats = [...data.categories]
        newCats[catIndex].links.push({ name: "Yeni Soru", content: "" })
        setData({ ...data, categories: newCats })
    }

    const removeLink = (catIndex: number, linkIndex: number) => {
        const newCats = [...data.categories]
        newCats[catIndex].links.splice(linkIndex, 1)
        setData({ ...data, categories: newCats })
    }

    const updateLink = (catIndex: number, linkIndex: number, field: string, value: string) => {
        const newCats = [...data.categories]
        newCats[catIndex].links[linkIndex][field] = value
        setData({ ...data, categories: newCats })
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            await updatePageSettings('page_destek', data)
            alert('Destek sayfası başarıyla güncellendi!')
        } catch (error) {
            alert('Hata: Kaydedilemedi.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Page Header Settings */}
            <div className="bg-white/5 border border-white/10 p-6 space-y-4 rounded-sm">
                <h3 className="text-[10px] tracking-[0.2em] text-bronze uppercase font-bold">Genel Bilgiler</h3>
                <div className="grid grid-cols-1 gap-4">
                    <input
                        value={data.title}
                        onChange={(e) => setData({ ...data, title: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-ivory outline-none focus:border-bronze"
                        placeholder="Sayfa Başlığı"
                    />
                    <textarea
                        value={data.subtitle}
                        onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-ivory outline-none focus:border-bronze"
                        placeholder="Alt Başlık / Açıklama"
                        rows={2}
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] tracking-[0.2em] text-bronze uppercase font-bold text-nowrap">Kategoriler ve Sorular</h3>
                    <button
                        onClick={addCategory}
                        className="flex items-center gap-2 px-4 py-2 bg-bronze/10 border border-bronze/20 text-bronze text-[10px] tracking-widest uppercase hover:bg-bronze hover:text-ivory transition-all"
                    >
                        <Plus size={14} /> Yeni Kategori Ekle
                    </button>
                </div>

                {data.categories.map((cat: any, cIdx: number) => (
                    <div key={cIdx} className="bg-white/5 border border-white/10 p-6 space-y-6 rounded-sm relative group/cat">
                        <button
                            onClick={() => removeCategory(cIdx)}
                            className="absolute top-4 right-4 text-red-500/20 hover:text-red-500 transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] text-ivory/30 tracking-widest uppercase">Kategori Başlığı</label>
                                <input
                                    value={cat.title}
                                    onChange={(e) => {
                                        const newCats = [...data.categories]
                                        newCats[cIdx].title = e.target.value
                                        setData({ ...data, categories: newCats })
                                    }}
                                    className="w-full bg-black/40 border border-white/10 px-4 py-2 text-sm text-ivory outline-none focus:border-bronze"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] text-ivory/30 tracking-widest uppercase">İkon Seçimi</label>
                                <div className="flex gap-2">
                                    {ICONS.map((item) => (
                                        <button
                                            key={item.name}
                                            onClick={() => {
                                                const newCats = [...data.categories]
                                                newCats[cIdx].icon = item.name
                                                setData({ ...data, categories: newCats })
                                            }}
                                            className={`p-2 border transition-all ${cat.icon === item.name ? 'border-bronze bg-bronze/10 text-bronze' : 'border-white/5 text-ivory/20 hover:text-ivory/50'}`}
                                        >
                                            <item.icon size={18} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Links / Questions within Category */}
                        <div className="pl-6 border-l border-bronze/20 space-y-4">
                            {cat.links.map((link: any, lIdx: number) => (
                                <div key={lIdx} className="bg-black/20 p-4 space-y-4 relative group/link">
                                    <button
                                        onClick={() => removeLink(cIdx, lIdx)}
                                        className="absolute top-4 right-4 text-red-500/10 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>

                                    <div className="space-y-2">
                                        <label className="text-[9px] text-ivory/30 tracking-widest uppercase">Soru Başlığı</label>
                                        <input
                                            value={link.name}
                                            onChange={(e) => updateLink(cIdx, lIdx, 'name', e.target.value)}
                                            className="w-full bg-black/40 border border-white/5 px-4 py-2 text-xs text-ivory outline-none focus:border-bronze"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] text-ivory/30 tracking-widest uppercase">Modal İçeriği (Cevap)</label>
                                        <textarea
                                            value={link.content}
                                            onChange={(e) => updateLink(cIdx, lIdx, 'content', e.target.value)}
                                            rows={3}
                                            className="w-full bg-black/40 border border-white/5 px-4 py-2 text-xs text-ivory outline-none focus:border-bronze italic"
                                        />
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => addLink(cIdx)}
                                className="flex items-center gap-2 text-[9px] text-bronze/60 hover:text-bronze tracking-[0.2em] uppercase transition-all"
                            >
                                <Plus size={12} /> Soru Ekle
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleSave}
                disabled={loading}
                className="w-full py-5 bg-bronze text-ivory text-xs tracking-[0.4em] uppercase hover:bg-bronze-light flex items-center justify-center gap-3 transition-all shadow-xl shadow-bronze/10"
            >
                <Save size={18} /> {loading ? 'KAYDEDİLİYOR...' : 'TÜM DESTEK VERİLERİNİ MÜHÜRLE'}
            </button>
        </div>
    )
}
