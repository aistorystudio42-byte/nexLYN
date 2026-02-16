import { createClient } from '@/lib/supabase/server'
import {
    updateCategory, updateCuratorPick,
    updateHeroSettings, updateNavigationSettings,
    updatePageSettings, deleteClub
} from '@/lib/supabase/actions'
import {
    Trash2, Plus, Save, Compass,
    Link as LinkIcon, Home, Info, BookOpen, LayoutDashboard, Key, Mail, Globe, Layers
} from 'lucide-react'
import AdminTabs from '@/components/admin/AdminTabs'
import AddClubForm from '@/components/admin/AddClubForm'
import ResetPasswordForm from '@/components/admin/ResetPasswordForm'
import SupportManager from '@/components/admin/SupportManager'

export default async function AdminPage() {
    const supabase = createClient()

    const { data: categories } = await supabase.from('categories').select('*').order('created_at', { ascending: false })
    const { data: curatorPick } = await supabase.from('curator_picks').select('*').maybeSingle()
    const { data: clubs } = await supabase.from('clubs').select('*').order('created_at', { ascending: false })
    const { data: settings } = await supabase.from('site_settings').select('*')

    const hero = settings?.find(s => s.id === 'hero')?.value || {}
    const navigation = settings?.find(s => s.id === 'navigation')?.value || []
    const aboutPage = settings?.find(s => s.id === 'page_hakkinda')?.value || {}
    const explorePage = settings?.find(s => s.id === 'page_kesfet')?.value || {}
    const supportPage = settings?.find(s => s.id === 'page_destek')?.value || {
        title: "nexLYN Destek Merkezi",
        subtitle: "Sistemle ilgili tüm sorularınızın cevapları, kulüp yönetme rehberleri ve teknik çözümler burada yer almaktadır.",
        categories: [
            {
                title: "Kulüp Yönetimi",
                icon: "BookOpen",
                links: [
                    { name: "Sıfırdan Kulüp Nasıl Açılır?", href: "#" },
                    { name: "Tür Seçimi Nasıl Yapılır?", href: "#" },
                    { name: "Kulüp Ayarları ve Özelleştirme", href: "#" }
                ]
            },
            {
                title: "Güvenlik & Erişim",
                icon: "ShieldAlert",
                links: [
                    { name: "Master Key (Kurtarma Kodu) Nedir?", href: "#" },
                    { name: "Şifremi Unuttum, Ne Yapmalıyım?", href: "#" },
                    { name: "Kulüp Devri Nasıl Yapılır?", href: "#" }
                ]
            },
            {
                title: "Genel Sorunlar",
                icon: "HelpCircle",
                links: [
                    { name: "Sık Karşılaşılan Hatalar", href: "#" },
                    { name: "Ödeme ve Abonelik Süreçleri", href: "#" },
                    { name: "Modül Kullanım Rehberi", href: "#" }
                ]
            }
        ]
    }

    const CLUB_TYPES = [
        'EĞLENCE/HOBİ',
        'OYUN/ARKADAŞLIK',
        'KURUM/TANITIM',
        'E-TİCARET/ SATIŞ',
        'AKADEMİ/EĞİTİM',
        'POPÜLERLİK/SOSYAL'
    ]

    const sections = [
        {
            id: 'general',
            label: 'Genel Bakış',
            icon: 'dashboard',
            component: (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/5 border border-white/10 p-8 rounded-sm">
                        <div className="text-[10px] tracking-widest text-ivory/30 uppercase mb-2">Toplam Kategori</div>
                        <div className="text-4xl font-serif text-bronze-accent">{categories?.length || 0}</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-8 rounded-sm">
                        <div className="text-[10px] tracking-widest text-ivory/30 uppercase mb-2">Aktif Kulüp</div>
                        <div className="text-4xl font-serif text-bronze-accent">{clubs?.length || 0}</div>
                    </div>
                </div>
            )
        },
        {
            id: 'home',
            label: 'Anasayfa',
            icon: 'home',
            component: (
                <div className="space-y-12">
                    {/* Hero Settings */}
                    <div className="bg-white/5 border border-white/5 p-8 rounded-sm space-y-6">
                        <h3 className="text-xs font-bold tracking-[0.3em] text-bronze uppercase">Hero Bölümü</h3>
                        <form action={updateHeroSettings} className="space-y-6">
                            <input name="title" defaultValue={hero.title} className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-ivory" placeholder="Başlık" />
                            <textarea name="subtitle" defaultValue={hero.subtitle} rows={3} className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-ivory" placeholder="Alt Başlık" />
                            <div className="grid grid-cols-2 gap-4">
                                <input name="button_text" defaultValue={hero.button_text} className="bg-black/40 border border-white/10 px-4 py-3 text-sm text-ivory" placeholder="Buton Metni" />
                                <input type="file" name="image" className="bg-black/40 border border-white/10 px-4 py-2 text-xs" />
                            </div>
                            <button type="submit" className="w-full py-3 bg-bronze text-ivory text-[10px] tracking-widest uppercase hover:bg-bronze-light">Hero Güncelle</button>
                        </form>
                    </div>

                    {/* Curator Pick */}
                    <div className="bg-white/5 border border-white/5 p-8 rounded-sm space-y-6">
                        <h3 className="text-xs font-bold tracking-[0.3em] text-bronze uppercase">Küratör Seçkisi</h3>
                        <form action={updateCuratorPick} className="space-y-6">
                            <input name="title" defaultValue={curatorPick?.title} className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-ivory" placeholder="Başlık" />
                            <input name="subtitle" defaultValue={curatorPick?.subtitle} className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-ivory" placeholder="Alt Başlık" />
                            <input type="file" name="image" className="w-full bg-black/40 border border-white/10 px-4 py-2 text-xs" />
                            <button type="submit" className="w-full py-3 bg-white/10 border border-white/10 text-ivory text-[10px] tracking-widest uppercase hover:bg-bronze">Seçkiyi Kaydet</button>
                        </form>
                    </div>
                </div>
            )
        },
        {
            id: 'categories',
            label: 'Kategoriler',
            icon: 'categories',
            component: (
                <div className="space-y-6">
                    <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                        <h3 className="text-sm font-serif text-ivory">Mevcut Kategorileri Düzenle</h3>
                        <p className="text-[10px] text-ivory/30 tracking-widest uppercase italic">* Yeni kategori ekleme/silme devre dışı bırakıldı.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {categories?.map((cat) => (
                            <form key={cat.id} action={updateCategory} className="bg-white/5 border border-white/5 p-6 rounded-sm hover:border-bronze/20 transition-all group">
                                <input type="hidden" name="id" value={cat.id} />
                                <input type="hidden" name="current_cover_url" value={cat.cover_url || ''} />

                                <div className="flex flex-col md:flex-row gap-8 items-start">
                                    {/* Thumbnail Preview */}
                                    <div className="w-24 h-32 bg-black/40 border border-white/10 shrink-0 overflow-hidden relative">
                                        {cat.cover_url && <img src={cat.cover_url} alt="" className="w-full h-full object-cover opacity-60" />}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60">
                                            <p className="text-[8px] text-ivory tracking-widest uppercase font-bold text-center px-1">Görseli Değiştir</p>
                                        </div>
                                        <input type="file" name="image" className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>

                                    {/* Input Fields */}
                                    <div className="flex-1 w-full space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[9px] text-ivory/30 tracking-widest uppercase">Kategori Başlığı</label>
                                                <input name="title" defaultValue={cat.title} className="w-full bg-black/40 border border-white/10 px-4 py-2.5 text-sm text-ivory outline-none focus:border-bronze" required />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] text-ivory/30 tracking-widest uppercase">Kısa Açıklama</label>
                                                <input name="subtitle" defaultValue={cat.subtitle} className="w-full bg-black/40 border border-white/10 px-4 py-2.5 text-sm text-ivory outline-none focus:border-bronze" />
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-2">
                                            <button type="submit" className="px-8 py-2.5 bg-bronze/10 border border-bronze/30 text-bronze text-[10px] tracking-[0.3em] font-bold uppercase hover:bg-bronze hover:text-ivory transition-all flex items-center gap-2">
                                                <Save size={14} /> DEĞİŞİKLİKLERİ MÜHÜRLE
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: 'explore',
            label: 'Kulüpler',
            icon: 'explore',
            component: (
                <div className="space-y-12">
                    <div className="bg-white/5 border border-white/5 p-8 space-y-6">
                        <h3 className="text-xs font-bold tracking-[0.3em] text-bronze uppercase flex items-center gap-2">
                            <Plus size={14} /> Yeni Kulüp Tanımla
                        </h3>
                        <AddClubForm clubTypes={CLUB_TYPES} />
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xs font-bold tracking-[0.3em] text-bronze uppercase flex items-center gap-2">
                            <Layers size={14} /> Mevcut Kulüpler
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {clubs?.map((club) => (
                                <div key={club.id} className="bg-white/5 border border-white/5 p-6 rounded-sm group hover:border-bronze/30 transition-all">
                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <span className="px-2 py-0.5 bg-bronze/20 text-bronze text-[9px] font-bold uppercase tracking-widest rounded-full">{club.type}</span>
                                                <h4 className="text-lg font-serif text-ivory">{club.title}</h4>
                                            </div>
                                            <div className="flex items-center gap-4 text-[11px] text-ivory/40 font-mono">
                                                <span className="flex items-center gap-1"><Globe size={10} /> /{club.slug}</span>
                                                <span className={`flex items-center gap-1 ${club.status === 'published' ? 'text-green-500' : 'text-orange-500'}`}>
                                                    ● {club.status === 'published' ? 'YAYINDA' : 'TASLAK'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <ResetPasswordForm clubId={club.id} clubTitle={club.title} />
                                            <form action={async () => { 'use server'; await deleteClub(club.id) }}>
                                                <button className="p-3 bg-red-500/10 text-red-500/40 hover:text-red-500 hover:bg-red-500/20 transition-all rounded-sm">
                                                    <Trash2 size={16} />
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'about',
            label: 'Hakkında',
            icon: 'about',
            component: (
                <div className="bg-white/5 border border-white/5 p-8 space-y-8">
                    <h3 className="text-sm font-serif text-ivory">Hakkında Sayfası İçeriği</h3>
                    <form action={async (fd) => {
                        'use server'
                        await updatePageSettings('page_hakkinda', {
                            title: fd.get('title'),
                            manifesto: fd.get('manifesto'),
                            vision_title: fd.get('vision_title'),
                            vision_text: fd.get('vision_text')
                        })
                    }} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] text-ivory/40 uppercase tracking-widest">Ana Başlık</label>
                            <input name="title" defaultValue={aboutPage.title} className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-ivory" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] text-ivory/40 uppercase tracking-widest">Manifesto</label>
                            <textarea name="manifesto" defaultValue={aboutPage.manifesto} rows={4} className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-ivory" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/5">
                            <div className="space-y-4">
                                <label className="text-[10px] text-ivory/40 uppercase tracking-widest">Vizyon Başlık</label>
                                <input name="vision_title" defaultValue={aboutPage.vision_title} className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-ivory" />
                                <label className="text-[10px] text-ivory/40 uppercase tracking-widest">Vizyon Metin</label>
                                <textarea name="vision_text" defaultValue={aboutPage.vision_text} rows={3} className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-ivory" />
                            </div>
                        </div>
                        <button type="submit" className="w-full py-4 bg-bronze text-ivory text-xs tracking-[0.3em] uppercase hover:bg-bronze-light flex items-center justify-center gap-2">
                            <Save size={16} /> Tüm Değişiklikleri Kaydet
                        </button>
                    </form>
                </div>
            )
        },
        {
            id: 'support',
            label: 'Destek',
            icon: 'help',
            component: (
                <div className="bg-white/5 border border-white/5 p-8 rounded-sm">
                    <SupportManager initialData={supportPage} />
                </div>
            )
        },
        {
            id: 'system',
            label: 'Sistem',
            icon: 'system',
            component: (
                <div className="bg-white/5 border border-white/5 p-8 space-y-6">
                    <h3 className="text-xs font-bold tracking-[0.4em] text-bronze uppercase">Menü Yönetimi</h3>
                    <p className="text-[10px] text-ivory/40 leading-relaxed italic">
                        * Menü yapısını şimdilik JSON formatında buradan yönetebilirsiniz. Yakında sürükle-bırak desteği eklenecektir.
                    </p>
                    <div className="bg-black/40 p-4 font-mono text-[11px] text-bronze-accent border border-white/5 rounded-sm">
                        <pre>{JSON.stringify(navigation, null, 2)}</pre>
                    </div>
                </div>
            )
        }
    ]

    return (
        <div className="animate-fade-in space-y-12 pb-32">
            <h1 className="text-4xl font-serif text-ivory tracking-tight border-b border-white/5 pb-8 italic">
                nexLYN <span className="text-bronze-accent not-italic">Control Center</span>
            </h1>

            <AdminTabs sections={sections} />
        </div>
    )
}
