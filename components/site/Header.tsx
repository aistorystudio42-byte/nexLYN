import Link from 'next/link'
import { Search, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function Header() {
    const supabase = createClient()
    const { data: settings } = await supabase
        .from('site_settings')
        .select('value')
        .eq('id', 'navigation')
        .maybeSingle()

    const navLinks = settings?.value || [
        { name: 'Keşfet', href: '/kesfet' },
        { name: 'Kulüplerim', href: '/kuluplerim' },
        { name: 'Seçkiler', href: '/seckiler' },
        { name: 'Hakkında', href: '/hakkinda' }
    ]

    return (
        <header className="fixed top-0 left-0 right-0 z-[100] h-16 px-8 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-md">
            <div className="flex items-center gap-16">
                <Link href="/" className="text-xl font-serif tracking-[0.2em] text-ivory/90 hover:text-white transition-colors uppercase">
                    nexLYN
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((item: any) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="group flex items-center gap-1.5 text-[11px] font-sans tracking-[0.15em] text-ivory/60 hover:text-white transition-colors uppercase text-nowrap"
                        >
                            {item.name}
                            <ChevronDown size={10} className="text-ivory/30 group-hover:text-white/50" />
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="flex items-center gap-8">
                <Link
                    href="/giris"
                    className="premium-button !py-1.5 !px-6"
                >
                    <span>Giriş Yap</span>
                </Link>
                <button className="text-ivory/60 hover:text-white transition-colors">
                    <Search size={18} />
                </button>
            </div>
        </header>
    )
}
