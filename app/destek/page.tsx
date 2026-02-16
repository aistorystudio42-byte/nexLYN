import { createClient } from '@/lib/supabase/server'
import SupportClient from './SupportClient'

export default async function SupportPage() {
    const supabase = createClient()
    const { data: settings } = await supabase
        .from('site_settings')
        .select('value')
        .eq('id', 'page_destek')
        .single()

    const content = settings?.value || {
        title: "nexLYN Destek Merkezi",
        subtitle: "Sistemle ilgili tüm sorularınızın cevapları, kulüp yönetme rehberleri ve teknik çözümler burada yer almaktadır.",
        categories: [
            {
                title: "Kulüp Yönetimi",
                icon: "BookOpen",
                links: [
                    { name: "Sıfırdan Kulüp Nasıl Açılır?", content: "Kulüp açmak için anasayfadaki 'Kulüp Kur' butonunu kullanabilirsiniz..." },
                    { name: "Tür Seçimi Nasıl Yapılır?", content: "Kulübünüzün amacına göre 6 farklı foundation modelden birini seçmelisiniz..." }
                ]
            }
        ]
    }

    return <SupportClient initialContent={content} />
}
