import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import {
    Lock, Search, ShieldCheck, ArrowRight, MessageSquare,
    Check, X, Users, Layout, Shield, Info, BarChart3,
    MessagesSquare, HelpCircle, Settings, Box, Globe, Eye, EyeOff,
    Plus, Megaphone, Trash2
} from 'lucide-react'
import { joinClub, handleJoinRequest, toggleClubStatus, updateClubAbout, updateClubMetadata, toggleClubModule } from '@/lib/supabase/actions'
import ChatRoom from '@/components/club/ChatRoom'
import PollManager from '@/components/club/PollManager'
import SectionEditor from '@/components/club/SectionEditor'

export default async function ClubCatchAllPage({
    params,
    searchParams
}: {
    params: { slug: string[] },
    searchParams: { tab?: string, room?: string }
}) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const slugArray = params.slug || []
    const lastSegment = slugArray[slugArray.length - 1]
    const validViews = ['admin', 'sohbet', 'anketler', 'hakkinda', 'moduller']

    const isViewSegment = validViews.includes(lastSegment)
    const currentView = isViewSegment ? lastSegment : 'hakkinda'
    const fullSlug = isViewSegment ? slugArray.slice(0, -1).join('/') : slugArray.join('/')
    const isAdminView = currentView === 'admin'

    const { data: club } = await supabase
        .from('clubs')
        .select(`
            *,
            owner:profiles!owner_id(*),
            modules:club_modules(*)
        `)
        .eq('slug', fullSlug)
        .maybeSingle()

    if (!club) notFound()

    const isOwner = user?.id === club.owner_id

    let membership = null
    let request = null
    if (user) {
        const { data: m } = await supabase.from('club_members').select('*').eq('club_id', club.id).eq('user_id', user.id).maybeSingle()
        membership = m
        const { data: r } = await supabase.from('join_requests').select('*').eq('club_id', club.id).eq('user_id', user.id).maybeSingle()
        request = r
    }

    // --- ADMIN PANEL VIEW ---
    if (isAdminView) {
        if (!isOwner) redirect(`/kulup/${fullSlug}`)
        const adminTab = searchParams.tab || 'genel'
        const { data: requests } = await supabase.from('join_requests').select('*, user:profiles!user_id(*)').eq('club_id', club.id).eq('status', 'pending')
        const { data: members } = await supabase.from('club_members').select('*, user:profiles!user_id(*)').eq('club_id', club.id)

        return (
            <div className="container mx-auto px-8 pt-32 pb-20">
                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="w-full lg:w-72 space-y-6">
                        <div className="bronze-border glass-card p-6 bg-black/60 relative overflow-hidden">
                            <h1 className="text-xl font-serif text-ivory mb-1">{club.title}</h1>
                            <p className="text-[9px] tracking-[0.3em] text-bronze uppercase font-bold">KONTROL PANELİ</p>
                            <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                                <div className="flex justify-between text-[10px] uppercase tracking-widest text-ivory/40">
                                    <span>DURUM:</span>
                                    <span className={club.status === 'published' ? 'text-green-500 font-bold' : 'text-orange-400 font-bold'}>{club.status === 'published' ? 'YAYINDA' : 'TASLAK'}</span>
                                </div>
                                <form action={toggleClubStatus.bind(null, club.id, club.status)}>
                                    <button type="submit" className={`w-full py-3 mt-2 text-[10px] tracking-[0.2em] uppercase border transition-all flex items-center justify-center gap-3 font-bold ${club.status === 'published' ? 'border-orange-500/30 text-orange-400 hover:bg-orange-500' : 'border-green-500/30 text-green-500 hover:bg-green-500 hover:text-white'}`}>
                                        {club.status === 'published' ? <><EyeOff size={14} /> TASLAĞA ÇEK</> : <><Eye size={14} /> KULÜBÜ YAYINLA</>}
                                    </button>
                                </form>
                            </div>
                        </div>

                        <nav className="flex flex-col gap-2">
                            {[
                                { id: 'genel', name: 'Dashboard', icon: Info },
                                { id: 'istekler', name: 'Üye Başvuruları', icon: Users, badge: requests?.length },
                                { id: 'hakkinda', name: 'Hakkında & Manifesto', icon: Globe },
                                { id: 'sohbet', name: 'Sohbet Odaları', icon: MessagesSquare },
                                { id: 'anketler', name: 'Anket & Oylama', icon: BarChart3 },
                                { id: 'moduller', name: 'Özel Modüller', icon: Box }
                            ].map(item => (
                                <a key={item.id} href={`/kulup/${fullSlug}/admin?tab=${item.id}`} className={`flex items-center justify-between px-5 py-4 text-[11px] tracking-widest uppercase rounded-sm border transition-all ${adminTab === item.id ? 'bg-bronze border-bronze text-white shadow-lg shadow-bronze/20' : 'bg-white/5 border-white/5 text-ivory/40 hover:bg-white/10'}`}>
                                    <div className="flex items-center gap-3"><item.icon size={16} /> {item.name}</div>
                                    {item.badge ? <span className="px-2 py-0.5 bg-white/20 rounded-full text-[9px] font-bold">{item.badge}</span> : null}
                                </a>
                            ))}
                        </nav>
                        <a
                            href={`/kulup/${fullSlug}`}
                            className="group relative block w-full py-5 text-center overflow-hidden rounded-sm transition-all duration-500 shadow-xl shadow-bronze/10"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-bronze/80 via-bronze to-bronze/80 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                            <div className="absolute inset-0 bg-bronze border border-white/20" />
                            <span className="relative z-10 flex items-center justify-center gap-3 text-[11px] tracking-[0.4em] uppercase text-white font-black">
                                <Settings size={14} className="group-hover:rotate-180 transition-transform duration-700" />
                                MİMAR MODU
                            </span>
                        </a>
                    </div>

                    <div className="flex-1 min-h-[700px] animate-fade-in" key={adminTab}>
                        {adminTab === 'genel' && (
                            <div className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <StatCard label="ONAYLI ÜYE" value={members?.length || 0} sub="Toplam erişim." />
                                    <StatCard label="BEKLEYEN" value={requests?.length || 0} sub="Kapıdaki adaylar." />
                                    <StatCard label="MODÜL" value={club.modules?.filter((m: any) => m.is_active).length || 0} sub="Aktif donanım." />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans">
                                    {/* MANİFESTO DURUMU */}
                                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-sm space-y-4">
                                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                            <h4 className="text-[10px] tracking-[0.3em] font-bold text-bronze uppercase">MANIFESTO VE VİZYON</h4>
                                            <span className="text-[8px] text-ivory/20 font-mono uppercase">Status: OK</span>
                                        </div>
                                        <div className="space-y-4 pt-4">
                                            <p className="text-xs text-ivory/60 leading-relaxed italic line-clamp-3">"{club.excerpt || 'Henüz bir manifesto mühürlenmedi...'}"</p>
                                            <div className="flex gap-2">
                                                <span className="text-[9px] bg-white/5 border border-white/10 px-2 py-1 text-ivory/40 uppercase tracking-widest">Vizyon: {club.theme_settings?.vision ? 'Mühürlendi' : 'Boş'}</span>
                                                <span className="text-[9px] bg-white/5 border border-white/10 px-2 py-1 text-ivory/40 uppercase tracking-widest">Kurallar: {club.theme_settings?.rules ? 'Aktif' : 'Pasif'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* AKTİF KANALLAR */}
                                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-sm space-y-4">
                                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                            <h4 className="text-[10px] tracking-[0.3em] font-bold text-bronze uppercase">İLETİŞİM KANALLARI</h4>
                                            <span className="text-[8px] text-green-500 font-mono uppercase">Canlı</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 pt-4">
                                            {(club.theme_settings?.rooms || ['GENEL_LOBI']).map((room: string) => (
                                                <div key={room} className="flex items-center gap-2 p-2 bg-black/20 border border-white/5 text-[10px] text-ivory/60 uppercase tracking-widest">
                                                    <MessagesSquare size={12} className="text-bronze" /> # {room}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* DONANIM DURUMU */}
                                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-sm space-y-4">
                                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                            <h4 className="text-[10px] tracking-[0.3em] font-bold text-bronze uppercase">MODÜL ENVARTERİ</h4>
                                            <span className="text-[8px] text-ivory/20 font-mono uppercase">30/5</span>
                                        </div>
                                        <div className="space-y-2 pt-4">
                                            {club.modules?.filter((m: any) => m.is_active).map((mod: any) => (
                                                <div key={mod.id} className="flex justify-between items-center p-2 bg-black/20 border-l-2 border-bronze">
                                                    <span className="text-[10px] text-ivory uppercase tracking-widest">{mod.module_id.split('_')[1]}</span>
                                                    <span className="text-[9px] text-ivory/20 font-mono uppercase">Aktif</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* KONSENSÜS DURUMU */}
                                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-sm space-y-4 text-center flex flex-col justify-center min-h-[200px]">
                                        <BarChart3 size={32} className="mx-auto text-bronze/20 mb-2" />
                                        <h4 className="text-[10px] tracking-[0.3em] font-bold text-bronze uppercase">ANKET VE OYLAMA</h4>
                                        <p className="text-[10px] text-ivory/40 uppercase tracking-widest mt-2">{((await supabase.from('polls').select('id').eq('club_id', club.id)).data?.length || 0)} Toplam Oylama Kaydı</p>
                                    </div>
                                </div>

                                <div className="p-6 bg-bronze/5 border border-bronze/20 rounded-sm italic text-[11px] text-bronze-light text-center tracking-widest uppercase">
                                    Sistem Takip Modu: Verileri düzenlemek için kulüp canlı sayfasındaki "Mimar Modu" donanımını kullanın.
                                </div>
                            </div>
                        )}
                        {adminTab === 'istekler' && (
                            <div className="space-y-4">
                                {requests?.map(req => (
                                    <div key={req.id} className="p-6 bg-black/40 border border-white/5 flex justify-between items-center rounded-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-bronze/10 rounded-full flex items-center justify-center font-serif text-bronze">{req.user.email[0].toUpperCase()}</div>
                                            <div><p className="text-ivory font-serif">{req.user.email}</p><p className="text-xs text-ivory/30 italic">"{req.message || 'Not yok.'}"</p></div>
                                        </div>
                                        <div className="flex gap-2">
                                            <form action={handleJoinRequest.bind(null, req.id, 'approved')}><button className="px-4 py-2 bg-green-500/10 text-green-500 text-[10px] tracking-widest uppercase border border-green-500/20 hover:bg-green-500 hover:text-white transition-all font-bold">ONAY</button></form>
                                            <form action={handleJoinRequest.bind(null, req.id, 'rejected')}><button className="px-4 py-2 bg-red-500/10 text-red-500 text-[10px] tracking-widest uppercase border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">RED</button></form>
                                        </div>
                                    </div>
                                ))}
                                {(!requests || requests.length === 0) && <p className="p-20 text-center text-ivory/20 text-xs tracking-widest uppercase">Bekleyen başvuru yok.</p>}
                            </div>
                        )}
                        {adminTab === 'hakkinda' && (
                            <div className="space-y-10">
                                <div className="flex justify-between items-center border-b border-white/5 pb-6">
                                    <h3 className="text-xl font-serif text-ivory flex items-center gap-3"><Globe size={20} className="text-bronze" /> Manifesto & Vizyon Arşivi</h3>
                                    <span className="text-[9px] tracking-widest text-bronze uppercase italic font-bold">Sadece Görüntüleme</span>
                                </div>
                                <div className="space-y-8 italic font-sans">
                                    <div className="p-10 bg-white/[0.02] border border-white/5 rounded-sm">
                                        <p className="text-[10px] tracking-widest text-bronze uppercase font-bold mb-6">Mevcut Manifesto</p>
                                        <div className="text-lg text-ivory/60 leading-relaxed whitespace-pre-wrap">"{club.excerpt || "Henüz bir manifesto mühürlenmedi."}"</div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-sm">
                                            <p className="text-[10px] tracking-widest text-bronze uppercase font-bold mb-4">Organizasyonel Vizyon</p>
                                            <p className="text-sm text-ivory/40 leading-relaxed">"{club.theme_settings?.vision || "Vizyon henüz mühürlenmedi."}"</p>
                                        </div>
                                        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-sm">
                                            <p className="text-[10px] tracking-widest text-bronze uppercase font-bold mb-4">Üyelik Yasaları</p>
                                            <p className="text-sm text-ivory/40 leading-relaxed">"{club.theme_settings?.rules || "Kurallar henüz mühürlenmedi."}"</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {adminTab === 'sohbet' && (
                            <div className="space-y-10">
                                <div className="flex justify-between items-center border-b border-white/5 pb-6">
                                    <h3 className="text-xl font-serif text-ivory">Aktif Kanal Envanteri</h3>
                                    <span className="text-[9px] tracking-widest text-bronze uppercase italic font-bold">Canlı Yayın Kanalları</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {(club.theme_settings?.rooms || ['GENEL_LOBI']).map((room: string) => (
                                        <div key={room} className="p-8 bg-white/5 border border-white/5 rounded-sm flex items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <MessagesSquare size={24} className="text-bronze" />
                                                <div>
                                                    <span className="text-xs text-ivory tracking-[0.2em] uppercase font-bold"># {room}</span>
                                                    <p className="text-[9px] text-ivory/20 uppercase mt-1">Erişim: Tüm Üyeler</p>
                                                </div>
                                            </div>
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {adminTab === 'anketler' && (
                            <div className="space-y-10">
                                <div className="flex justify-between items-center border-b border-white/5 pb-6">
                                    <h3 className="text-xl font-serif text-ivory">Oylama ve Konsensüs Kayıtları</h3>
                                    <span className="text-[9px] tracking-widest text-bronze uppercase italic font-bold">Arşivlenmiş Veriler</span>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {(await supabase.from('polls').select('*').eq('club_id', club.id).order('created_at', { ascending: false })).data?.map(poll => (
                                        <div key={poll.id} className="p-8 bg-white/5 border border-white/5 rounded-sm flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-ivory font-serif mb-2 italic">"{poll.question}"</p>
                                                <p className="text-[10px] text-ivory/20 tracking-widest uppercase font-bold italic">{new Date(poll.created_at).toLocaleDateString()} • {poll.options.length} SEÇENEK</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`text-[9px] tracking-widest uppercase font-bold ${poll.is_active ? 'text-green-500' : 'text-ivory/20'}`}>{poll.is_active ? 'YAYINDA' : 'KAPALI'}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {(!(await supabase.from('polls').select('id').eq('club_id', club.id)).data?.length) && <PlaceholderBox icon={BarChart3} text="Henüz bir oylama kaydı bulunmuyor." />}
                                </div>
                            </div>
                        )}
                        {adminTab === 'moduller' && (
                            <div className="space-y-10">
                                <div className="flex justify-between items-center border-b border-white/5 pb-6">
                                    <h3 className="text-xl font-serif text-ivory italic">Sistem Donanım Raporu</h3>
                                    <span className="text-[9px] tracking-widest text-bronze uppercase italic font-bold">Donanım Entegre Durumu</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {club.modules?.map((mod: any) => (
                                        <div key={mod.id} className="p-8 bg-black/40 border-l-4 border-bronze/30 rounded-sm flex justify-between items-center">
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 bg-bronze/10 rounded-full flex items-center justify-center shrink-0"><Box size={24} className="text-bronze" /></div>
                                                <div>
                                                    <p className="text-sm tracking-[0.3em] text-white uppercase font-serif italic">{mod.module_id.split('_')[1]}</p>
                                                    <p className="text-[9px] text-ivory/20 uppercase mt-1">Sistem Protokolü: {mod.is_active ? 'ÇALIŞIYOR' : 'DURDURULDU'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <form action={async () => { 'use server'; await toggleClubModule(club.id, mod.module_id, !mod.is_active) }}>
                                                    <button type="submit" className={`px-4 py-2 text-[8px] tracking-[0.2em] font-bold uppercase border transition-all ${mod.is_active ? 'border-red-500/20 text-red-500/50 hover:bg-red-500 hover:text-white' : 'border-green-500/20 text-green-500/50 hover:bg-green-500 hover:text-white'}`}>
                                                        {mod.is_active ? 'DEVRE DIŞI BIRAK' : 'SİSTEMİ AÇ'}
                                                    </button>
                                                </form>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${mod.is_active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 opacity-20'}`} />
                                                    <span className={`text-[9px] tracking-widest font-bold uppercase ${mod.is_active ? 'text-green-500' : 'text-red-500/20'}`}>{mod.is_active ? 'AKTİF' : 'PASİF'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    // --- PUBLIC/MEMBER VIEWS ---
    const clubTabs = [
        { id: 'hakkinda', name: 'HAKKINDA', icon: Info },
        { id: 'sohbet', name: 'SOHBET ODALARI', icon: MessagesSquare },
        { id: 'anketler', name: 'ANKET ALANLARI', icon: BarChart3 },
        { id: 'moduller', name: 'MODÜLLER', icon: Layout }
    ]

    return (
        <div className="min-h-screen">
            {isOwner && (
                <SectionEditor
                    club={club}
                    type={currentView === 'hakkinda' ? 'about' : currentView === 'sohbet' ? 'chat' : currentView === 'anketler' ? 'polls' : currentView === 'moduller' ? 'modules' : 'about'}
                />
            )}

            <div className="pt-32 pb-16 border-b border-white/5 bg-gradient-to-b from-black/40 to-transparent">
                <div className="container mx-auto px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                        <div>
                            <span className="text-[10px] tracking-[0.5em] text-bronze uppercase block mb-6 font-bold">{club.type} EKOSİSTEMİ</span>
                            <h1 className="text-6xl font-serif text-ivory italic leading-tight">{club.title}</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            {isOwner && <Link href={`/kulup/${fullSlug}/admin`} className="px-10 py-4 bg-bronze text-white text-[10px] tracking-[0.3em] uppercase hover:bg-bronze-light transition-all shadow-xl shadow-bronze/20 font-bold">ARŞİVİ YÖNET</Link>}
                            {!membership && !request && user && (
                                <form action={joinClub} className="flex gap-4">
                                    <input type="hidden" name="club_id" value={club.id} />
                                    <input type="text" name="message" placeholder="Katılma nedeniniz..." className="bg-black/40 border border-white/10 px-4 py-2 text-[10px] text-ivory outline-none focus:border-bronze italic w-48" />
                                    <button type="submit" className="px-10 py-4 bg-ivory text-black text-[10px] tracking-[0.3em] uppercase hover:bg-white transition-all font-bold">ARŞİVE KATIL</button>
                                </form>
                            )}
                            {request && request.status === 'pending' && <div className="px-8 py-4 bg-white/5 border border-white/10 text-ivory/40 text-[9px] tracking-widest uppercase italic">✅ BAŞVURU İŞLENİYOR</div>}
                        </div>
                    </div>

                    <nav className="flex items-center gap-12 mt-16 border-t border-white/5 pt-8 overflow-x-auto no-scrollbar">
                        {clubTabs.map(tab => {
                            const isActive = currentView === tab.id
                            const isLocked = !membership && (tab.id === 'sohbet' || tab.id === 'anketler')
                            return (
                                <a key={tab.id} href={`/kulup/${fullSlug.replace(/^\//, '')}/${tab.id}`} className={`relative z-10 group flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase transition-all pb-4 border-b-2 whitespace-nowrap ${isActive ? 'text-bronze border-bronze font-bold' : 'text-ivory/30 border-transparent hover:text-ivory/60'} ${isLocked ? 'cursor-not-allowed' : ''}`}>
                                    <tab.icon size={14} className={isActive ? 'text-bronze' : 'text-ivory/20 group-hover:text-ivory/40'} />
                                    {tab.name}
                                    {isLocked && <Lock size={10} className="ml-1 opacity-20" />}
                                </a>
                            )
                        })}
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-8 py-20 animate-fade-in" key={currentView}>
                {currentView === 'hakkinda' && (
                    <div className="max-w-4xl space-y-16">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="md:col-span-2 space-y-10">
                                <section className="space-y-6">
                                    <h3 className="text-2xl font-serif text-ivory italic border-l-2 border-bronze pl-6 uppercase tracking-wider">Organizasyonel Manifesto</h3>
                                    <div className="text-lg text-ivory/60 leading-relaxed font-sans italic whitespace-pre-wrap">{club.excerpt || "Henüz bir manifesto mühürlenmedi."}</div>
                                </section>

                                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-white/5">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] tracking-widest text-bronze uppercase font-bold flex items-center gap-2"><Globe size={14} /> KULÜP VİZYONU</h4>
                                        <p className="text-xs text-ivory/40 leading-relaxed italic">{club.theme_settings?.vision || "Bu ekosistemin vizyonu henüz belirlenmedi."}</p>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] tracking-widest text-bronze uppercase font-bold flex items-center gap-2"><Shield size={14} /> ARŞİV KURALLARI</h4>
                                        <p className="text-xs text-ivory/40 leading-relaxed italic">{club.theme_settings?.rules || "Bu alanda henüz bir yasa bulunmamaktadır."}</p>
                                    </div>
                                </section>
                            </div>
                            <div className="space-y-10">
                                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-sm">
                                    <p className="text-[10px] tracking-widest text-bronze uppercase font-bold mb-4">Üyelik Modeli</p>
                                    <p className="text-xs text-ivory/40 italic leading-relaxed">NexLYN protokolü gereği bu arşive erişim onay gerektirir. ÜYELİK ÜCRETSİZDİR.</p>
                                </div>
                                {club.theme_settings?.socials && (Object.values(club.theme_settings.socials).some(v => v)) && (
                                    <div className="space-y-4">
                                        <p className="text-[10px] tracking-widest text-bronze uppercase font-bold">BAĞLANTILAR</p>
                                        <div className="flex flex-wrap gap-2">
                                            {club.theme_settings.socials.instagram && <a href={club.theme_settings.socials.instagram} target="_blank" className="px-4 py-2 bg-white/5 border border-white/10 text-[9px] text-ivory/60 hover:text-bronze transition-all uppercase tracking-widest">INSTAGRAM</a>}
                                            {club.theme_settings.socials.twitter && <a href={club.theme_settings.socials.twitter} target="_blank" className="px-4 py-2 bg-white/5 border border-white/10 text-[9px] text-ivory/60 hover:text-bronze transition-all uppercase tracking-widest">TWITTER</a>}
                                            {club.theme_settings.socials.website && <a href={club.theme_settings.socials.website} target="_blank" className="px-4 py-2 bg-white/5 border border-white/10 text-[9px] text-ivory/60 hover:text-bronze transition-all uppercase tracking-widest">WEB</a>}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <p className="text-[10px] tracking-widest text-bronze uppercase font-bold">TEMSİLCİ</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-bronze/10 rounded-full flex items-center justify-center font-serif text-bronze">{club.owner?.email?.[0].toUpperCase()}</div>
                                        <div><p className="text-xs text-ivory font-serif">{club.owner?.email?.split('@')[0]}</p><p className="text-[9px] text-bronze uppercase tracking-widest">KURUCU ÜYE</p></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {currentView === 'sohbet' && (
                    membership ? (
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            <div className="lg:col-span-1 space-y-4">
                                <h3 className="text-sm tracking-widest text-bronze mb-6 uppercase italic font-bold">Kolektif Kanallar</h3>
                                {(club.theme_settings?.rooms || ['GENEL_LOBI', 'STRATEJI_ODASI', 'DUYURULAR']).map((room: string) => (
                                    <a key={room} href={`/kulup/${fullSlug}/sohbet?room=${room}`} className={`w-full block text-left px-6 py-4 text-[10px] tracking-widest border transition-all rounded-sm uppercase ${searchParams.room === room || (!searchParams.room && room === (club.theme_settings?.rooms?.[0] || 'GENEL_LOBI')) ? 'bg-bronze text-white border-bronze font-bold' : 'border-white/5 text-ivory/40 hover:border-bronze shadow-lg'}`}># {room}</a>
                                ))}
                            </div>
                            <div className="lg:col-span-3">
                                <ChatRoom
                                    clubId={club.id}
                                    roomId={searchParams.room || (club.theme_settings?.rooms?.[0] || 'GENEL_LOBI')}
                                    initialMessages={(await supabase.from('chat_messages').select('*, user:profiles(email)').eq('club_id', club.id).eq('room_id', searchParams.room || (club.theme_settings?.rooms?.[0] || 'GENEL_LOBI')).order('created_at', { ascending: true }).limit(50)).data || []}
                                />
                            </div>
                        </div>
                    ) : <JoinWall club={club} user={user} request={request} />
                )}

                {currentView === 'anketler' && (
                    membership ? (
                        <div className="space-y-12 max-w-4xl">
                            <h3 className="text-2xl font-serif text-ivory italic uppercase tracking-wider">Konsensüs Mekanizması</h3>
                            <div className="grid grid-cols-1 gap-8">
                                {(await supabase.from('polls').select('*, votes:poll_votes(*)').eq('club_id', club.id).order('created_at', { ascending: false })).data?.map(poll => (
                                    <PollManager
                                        key={poll.id}
                                        poll={poll}
                                        hasVoted={poll.votes.some((v: any) => v.user_id === user?.id)}
                                        userId={user?.id}
                                    />
                                ))}
                                {(!(await supabase.from('polls').select('id').eq('club_id', club.id)).data?.length) && (
                                    <div className="p-32 border border-dashed border-white/10 text-center bg-white/5">
                                        <BarChart3 size={48} className="mx-auto mb-6 text-bronze opacity-20" />
                                        <p className="text-xs tracking-[0.4em] text-ivory/20 uppercase italic">Henüz aktif bir oylama bulunmuyor.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : <JoinWall club={club} user={user} request={request} />
                )}

                {currentView === 'moduller' && (
                    membership ? <ModulesView modules={club.modules} /> : <JoinWall club={club} user={user} request={request} lockMessage="ÖZEL MODÜLLER ÜYELERE ÖZELDİR" />
                )}
            </div>
        </div>
    )
}

// Small Admin Components
function StatCard({ label, value, sub }: any) {
    return (
        <div className="p-10 bg-white/5 border border-white/5 rounded-sm group hover:border-bronze/20 transition-all">
            <p className="text-[10px] tracking-widest text-bronze uppercase mb-4 font-bold">{label}</p>
            <p className="text-5xl font-serif text-ivory">{value}</p>
            <p className="text-[9px] text-ivory/20 mt-4 italic">{sub}</p>
        </div>
    )
}

function AboutEditor({ id, excerpt, vision, rules }: any) {
    return (
        <form action={async (f) => {
            'use server';
            await updateClubAbout(id, f.get('excerpt') as string)
            // Note: In a real app we'd fetch current metadata first, but for now we'll update vision/rules
            await updateClubMetadata(id, { vision: f.get('vision'), rules: f.get('rules') })
        }} className="space-y-6">
            <div className="space-y-4">
                <label className="text-[10px] tracking-widest text-bronze uppercase font-bold">Manifesto</label>
                <textarea name="excerpt" defaultValue={excerpt} className="w-full bg-black/40 border border-white/10 p-8 text-sm text-ivory outline-none focus:border-bronze min-h-[200px] italic font-serif" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <label className="text-[10px] tracking-widest text-bronze uppercase font-bold">Vizyon</label>
                    <textarea name="vision" defaultValue={vision} className="w-full bg-black/40 border border-white/10 p-4 text-xs text-ivory outline-none focus:border-bronze min-h-[100px]" />
                </div>
                <div className="space-y-4">
                    <label className="text-[10px] tracking-widest text-bronze uppercase font-bold">Kurallar</label>
                    <textarea name="rules" defaultValue={rules} className="w-full bg-black/40 border border-white/10 p-4 text-xs text-ivory outline-none focus:border-bronze min-h-[100px]" />
                </div>
            </div>
            <button className="px-10 py-5 bg-bronze text-white text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-bronze-light transition-all shadow-xl shadow-bronze/20">MÜHÜRLE VE KAYDET</button>
        </form>
    )
}

function PlaceholderBox({ icon: Icon, text }: any) {
    return (
        <div className="p-32 border border-dashed border-white/10 bg-white/5 text-center">
            <Icon size={48} className="mx-auto mb-6 text-bronze/20" />
            <p className="text-xs tracking-widest text-ivory/20 uppercase italic">{text}</p>
        </div>
    )
}

function ModulesView({ modules }: any) {
    const renderModuleContent = (mod: any) => {
        const mid = mod.module_id;
        const data = mod.data;
        const listData = Array.isArray(data) ? data : [];

        if (!data || (Array.isArray(data) && data.length === 0)) {
            return (
                <div className="h-full flex flex-col items-center justify-center py-20 opacity-20 border border-dashed border-white/5">
                    <Box size={32} className="mb-4" />
                    <p className="text-[10px] tracking-[0.3em] uppercase italic">Donanım Bekleniyor...</p>
                </div>
            )
        }

        // 1. TİCARET MODÜLLERİ
        if (mid === 'tic_vitrin') {
            return (
                <div className="grid grid-cols-1 gap-4">
                    {listData.map((item: any, i: number) => (
                        <div key={i} className="group/item border border-white/5 bg-white/[0.02] p-4 flex gap-4 hover:border-bronze/30 transition-all">
                            <div className="w-16 h-16 bg-black border border-white/10 shrink-0 overflow-hidden relative">
                                {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <Box size={20} className="m-auto opacity-10" />}
                                {item.stock && <span className="absolute bottom-0 right-0 bg-bronze text-white text-[7px] px-1 font-bold">{item.stock}</span>}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-xs text-ivory font-bold uppercase tracking-widest">{item.title}</h4>
                                <p className="text-[10px] text-bronze font-mono mt-1">{item.price} ALTIN</p>
                            </div>
                        </div>
                    ))}
                </div>
            )
        }

        if (mid === 'tic_kampanya') {
            return (
                <div className="space-y-4">
                    {listData.map((item: any, i: number) => (
                        <div key={i} className="p-6 border-2 border-dashed border-bronze/30 bg-bronze/5 rounded-sm text-center">
                            <h4 className="text-sm text-ivory font-serif italic mb-2">{item.title}</h4>
                            <div className="bg-black/40 border border-white/10 p-2 font-mono text-bronze tracking-[0.3em] text-xs">
                                {item.code}
                            </div>
                            <p className="text-[9px] text-bronze uppercase font-bold mt-2">%{item.discount} İNDİRİM MÜHÜRLENDİ</p>
                        </div>
                    ))}
                </div>
            )
        }

        // 2. OYUN MODÜLLERİ
        if (mid === 'oyun_turnuva') {
            return (
                <div className="space-y-4">
                    {listData.map((item: any, i: number) => (
                        <div key={i} className="p-4 bg-white/[0.03] border border-white/10 rounded-sm">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[8px] text-ivory/20 uppercase tracking-[0.2em]">{item.status}</span>
                                <div className="w-2 h-2 rounded-full bg-bronze animate-pulse" />
                            </div>
                            <div className="flex justify-between items-center px-4">
                                <span className="text-xs text-ivory font-bold">{item.match.split('vs')[0]}</span>
                                <span className="text-sm font-mono text-bronze px-3 italic">{item.score}</span>
                                <span className="text-xs text-ivory font-bold">{item.match.split('vs')[1]}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )
        }

        if (mid === 'oyun_kadro') {
            return (
                <div className="grid grid-cols-2 gap-3">
                    {listData.map((item: any, i: number) => (
                        <div key={i} className="p-4 bg-white/[0.02] border border-white/5 text-center group/card hover:border-bronze transition-all">
                            <div className="w-14 h-14 mx-auto mb-3 rounded-full border border-bronze/30 overflow-hidden bg-black grayscale group-hover/card:grayscale-0 transition-all">
                                {item.avatar ? <img src={item.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-bronze text-xs font-serif">{item.name?.[0]}</div>}
                            </div>
                            <p className="text-[10px] text-ivory font-bold uppercase truncate mb-1">{item.name}</p>
                            <p className="text-[8px] text-bronze tracking-widest uppercase mb-1">{item.role}</p>
                            <p className="text-[8px] text-ivory/20 font-mono italic">KDA: {item.kda}</p>
                        </div>
                    ))}
                </div>
            )
        }

        // 3. SOSYAL / BAĞIŞ MODÜLÜ
        if (mid === 'sos_bagis') {
            const goal = parseFloat(data.goal) || 0;
            const current = parseFloat(data.current) || 0;
            const percentage = Math.min(100, (current / goal) * 100) || 0;
            return (
                <div className="space-y-6">
                    <div className="text-center">
                        <p className="text-[9px] text-ivory/40 uppercase tracking-[0.3em] mb-2">Kolektif Hedef</p>
                        <p className="text-2xl font-serif text-bronze italic">{current} / {goal} <span className="text-xs not-italic">ALTIN</span></p>
                    </div>
                    <div className="h-2 w-full bg-black border border-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-bronze transition-all duration-1000" style={{ width: `${percentage}%` }} />
                    </div>
                    {data.link && (
                        <a href={data.link} className="block w-full py-3 bg-bronze text-white text-center text-[9px] tracking-[0.3em] font-bold uppercase hover:bg-bronze-light transition-all">
                            KAYNAK AKTAR
                        </a>
                    )}
                </div>
            )
        }

        // 4. LİNK / EMBED TABANLI MODÜLLER
        if (typeof data === 'string' || data.playlist_url || data.embed_url || data.chat_url || data.strategy_url || data.program_url || data.forum_url || data.quiz_url || data.booking_url || data.square_url) {
            const link = typeof data === 'string' ? data : (data.playlist_url || data.embed_url || data.chat_url || data.strategy_url || data.program_url || data.forum_url || data.quiz_url || data.booking_url || data.square_url);
            return (
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 border border-bronze/30 flex items-center justify-center rounded-sm bg-bronze/5 mb-2">
                        <Globe size={24} className="text-bronze" />
                    </div>
                    <a href={link} target="_blank" className="px-6 py-3 border border-white/10 text-ivory uppercase tracking-[0.2em] text-[10px] hover:bg-white/5 transition-all text-center">
                        HARİCİ ERİŞİM MÜHÜRLENDİ
                    </a>
                    <p className="text-[8px] text-ivory/20 font-mono truncate max-w-full italic">{link}</p>
                </div>
            )
        }

        // 5. GENEL LİSTE (SSS, Kurallar, Etkinlikler vb.)
        return (
            <div className="space-y-4">
                {listData.map((item: any, i: number) => (
                    <div key={i} className="p-4 bg-white/[0.02] border border-white/5 hover:border-bronze/20 transition-all rounded-sm border-l-2 border-l-bronze/30">
                        <h4 className="text-xs text-ivory font-bold uppercase tracking-widest flex justify-between">
                            {item.title || item.question || item.task || item.event || item.name}
                            {item.date && <span className="text-[8px] text-bronze/60 font-mono">{item.date}</span>}
                        </h4>
                        {(item.content || item.answer || item.bio || item.reward) && (
                            <p className="text-xs text-ivory/40 italic font-sans mt-2">{item.content || item.answer || item.bio || item.reward}</p>
                        )}
                        {item.links && <p className="text-[9px] text-bronze mt-2 truncate font-mono">{item.links}</p>}
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {modules?.filter((m: any) => m.is_active).map((mod: any) => (
                <div key={mod.id} className="bronze-border glass-card p-10 flex flex-col group hover:border-bronze bg-black/40 relative overflow-hidden transition-all min-h-[450px]">
                    <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/5 relative z-10">
                        <div className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center bg-white/[0.02] shadow-inner shrink-0">
                            <Box className="text-bronze" size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-serif text-ivory tracking-[0.2em] uppercase">{mod.module_id.split('_')[1]}</h3>
                            <p className="text-[8px] text-bronze-light uppercase font-bold tracking-[0.3em]">SİSTEM DONANIMI</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 pr-2">
                        {renderModuleContent(mod)}
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center relative z-10">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                            <span className="text-[9px] tracking-widest text-ivory/20 uppercase font-bold">OPERASYONEL</span>
                        </div>
                        <span className="text-[8px] text-ivory/10 font-mono">{mod.module_id}</span>
                    </div>

                    {/* Background Detail */}
                    <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none select-none">
                        <Shield size={120} />
                    </div>
                </div>
            ))}
        </div>
    )
}

function JoinWall({ club, user, request, lockMessage }: any) {
    return (
        <div className="max-w-2xl mx-auto py-10">
            <div className="bronze-border glass-card p-16 text-center space-y-10 bg-black/80 relative overflow-hidden">
                <Lock className="absolute -top-10 -right-10 text-white/[0.01] w-80 h-80 -rotate-12" />
                <div className="w-24 h-24 border border-bronze/30 rounded-full flex items-center justify-center mx-auto bg-bronze/5 mb-4 text-bronze font-serif text-4xl italic">!</div>
                <div className="space-y-4 relative z-10">
                    <h1 className="text-4xl font-serif text-ivory italic uppercase tracking-widest">{lockMessage || "ARŞİV KORUMALI"}</h1>
                    <p className="text-bronze text-[11px] tracking-[0.5em] font-bold uppercase">YETKİSİZ ERİŞİM DENEMESİ</p>
                </div>
                <p className="text-base text-ivory/40 italic leading-relaxed max-w-lg mx-auto font-sans">Bu verilere erişmek için "{club.title}" arşivine dahil olmalısınız.</p>
                <div className="pt-10 relative z-10">
                    {!user ? <Link href="/giris" className="inline-flex px-16 py-5 bg-bronze text-white text-[11px] tracking-[0.4em] uppercase font-bold shadow-2xl shadow-bronze/20 hover:bg-bronze-light transition-all">TANIMLAN VE GİRİŞ YAP</Link> :
                        request ? <div className="p-10 border border-dashed border-bronze/40 bg-bronze/5 text-bronze-light text-xs tracking-[0.3em] uppercase italic font-bold">✅ KRİPTOLU BAŞVURU İNCELENİYOR</div> :
                            <Link href={`/kulup/${club.slug}`} className="inline-flex px-16 py-5 border border-bronze text-bronze text-[11px] tracking-[0.4em] uppercase font-bold hover:bg-bronze hover:text-white transition-all">ANA SAYFAYA DÖN VE KATIL</Link>}
                </div>
            </div>
        </div>
    )
}
