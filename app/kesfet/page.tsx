import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import InfiniteFeed from '@/components/site/InfiniteFeed'

export default async function KesfetPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/giris')
    }

    // Fetch Page Settings
    const { data: settings } = await supabase
        .from('site_settings')
        .select('value')
        .eq('id', 'page_kesfet')
        .single()

    const content = settings?.value || {
        title: "Keşfet",
        subtitle: "Arşivdeki en yeni hikayeler ve topluluk hazineleri."
    }

    // Fetch Real Clubs (status must be 'published')
    const { data: clubs } = await supabase
        .from('clubs')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(10)

    return (
        <div className="container mx-auto px-8 pt-32 pb-20">
            <div className="max-w-2xl mb-12 animate-fade-in">
                <h1 className="text-5xl font-serif text-ivory mb-6 italic">Büyük <span className="text-bronze-accent not-italic">Arşiv</span></h1>
                <p className="text-ivory/60 leading-relaxed font-sans italic">
                    {content.subtitle}
                </p>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-bronze/30 to-transparent mb-12" />

            <InfiniteFeed initialStories={clubs || []} />
        </div>
    )
}
