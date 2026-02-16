import { createClient } from '@/lib/supabase/server'
import Hero from '@/components/site/Hero'
import CategoryCarousel from '@/components/site/CategoryCarousel'
import CuratorPanel from '@/components/site/CuratorPanel'

async function getHomeData() {
    const supabase = createClient()

    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8)

    const { data: curatorPick } = await supabase
        .from('curator_picks')
        .select('*')
        .limit(1)
        .maybeSingle()

    const { data: settings } = await supabase
        .from('site_settings')
        .select('*')

    const hero = settings?.find(s => s.id === 'hero')?.value || {}

    return {
        categories: categories || [],
        curatorPick: curatorPick || null,
        hero
    }
}

export default async function HomePage() {
    const { categories, curatorPick, hero } = await getHomeData()

    return (
        <div className="container mx-auto px-8 pb-32">
            <Hero settings={hero} />

            <div className="flex flex-col lg:flex-row gap-16 mt-16">
                <div className="flex-1">
                    <CategoryCarousel categories={categories} />
                </div>

                <CuratorPanel pick={curatorPick} />
            </div>
        </div>
    )
}
