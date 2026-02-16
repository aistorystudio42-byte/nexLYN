import { createClient } from '@/lib/supabase/server'

export default async function HakkindaPage() {
    const supabase = createClient()
    const { data: settings } = await supabase
        .from('site_settings')
        .select('value')
        .eq('id', 'page_hakkinda')
        .single()

    const content = settings?.value || {
        title: "Hakkımızda",
        manifesto: "nexLYN, dijital gürültünün ortasında bir sessizlik adasıdır.",
        vision_title: "Vizyonumuz",
        vision_text: "Toplulukların sadece sayılardan ibaret olmadığı bir ağ."
    }

    return (
        <div className="container mx-auto px-8 pt-32 pb-20">
            <div className="max-w-3xl">
                <h1 className="text-5xl font-serif text-ivory mb-12">{content.title}</h1>

                <div className="space-y-12">
                    <section>
                        <h2 className="text-2xl font-serif text-bronze-light mb-4">Manifesto</h2>
                        <p className="text-ivory/70 leading-relaxed font-sans text-lg italic whitespace-pre-line">
                            "{content.manifesto}"
                        </p>
                    </section>

                    <section className="bronze-border glass-card p-8 ml-8">
                        <h2 className="text-xl font-serif text-ivory mb-4">{content.vision_title}</h2>
                        <p className="text-ivory/60 leading-relaxed font-sans">
                            {content.vision_text}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
