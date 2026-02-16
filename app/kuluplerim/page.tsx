import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function KuluplerimPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/giris')
    }

    // Fetch clubs owned by the user
    const { data: ownedClubs } = await supabase
        .from('clubs')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="container mx-auto px-8 pt-32 pb-20">
            <div className="max-w-4xl">
                <h1 className="text-5xl font-serif text-ivory mb-12 italic">Özel <span className="text-bronze-accent not-italic">Koleksiyonun</span></h1>

                {ownedClubs && ownedClubs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {ownedClubs.map(club => (
                            <div key={club.id} className="bronze-border glass-card p-8 group hover:border-bronze-light transition-all">
                                <div className="flex justify-between items-start mb-6">
                                    <span className="px-3 py-1 bg-bronze/10 text-bronze text-[10px] tracking-widest uppercase border border-bronze/20">
                                        {club.type}
                                    </span>
                                    <span className={`text-[9px] tracking-widest uppercase ${club.status === 'published' ? 'text-green-500' : 'text-orange-400'}`}>
                                        ● {club.status === 'published' ? 'YAYINDA' : 'TASLAK'}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-serif text-ivory mb-3">{club.title}</h3>
                                <p className="text-sm text-ivory/50 mb-8 line-clamp-2 italic">{club.excerpt}</p>
                                <a
                                    href={`/kulup/${club.slug.replace(/^\//, '')}/admin`}
                                    className="relative z-10 block w-full text-center py-3 bg-bronze text-ivory text-[10px] tracking-[0.3em] uppercase hover:bg-bronze-light transition-all"
                                >
                                    KULÜBÜ YÖNET
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bronze-border glass-card p-20 text-center flex flex-col items-center justify-center animate-fade-in">
                        <div className="w-20 h-20 border border-bronze/30 rounded-full flex items-center justify-center mb-8 bg-bronze/5">
                            <span className="text-bronze text-3xl font-serif">!</span>
                        </div>
                        <h2 className="text-2xl font-serif text-ivory mb-4">Henüz Bir Kulübün Yok</h2>
                        <p className="text-ivory/40 font-sans italic mb-10 max-w-md">
                            Kendi topluluğunu kurmak için moderatör onayı alman gerekiyor. Arşivdeki diğer kulüpleri incelemek ister misin?
                        </p>
                        <Link href="/kesfet" className="premium-button !px-10 !py-4 !bg-bronze/10 !border-bronze/30 !text-bronze-light hover:!text-ivory">
                            <span>ARŞİVİ KEŞFET</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
