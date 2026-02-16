import { MoreHorizontal } from 'lucide-react'
import CuratorCard from './CuratorCard'

interface Pick {
    id: string
    title: string
    subtitle: string
    cover_url: string
}

export default function CuratorPanel({ pick }: { pick: Pick | null }) {
    return (
        <div className="w-full lg:w-72 flex flex-col gap-6 py-12">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif text-ivory/90 tracking-widest uppercase">Küratör Alanı</h2>
                <div className="flex gap-1">
                    {[1, 2, 3, 4].map(i => <div key={i} className="w-1 h-1 bg-ivory/20 rounded-full" />)}
                </div>
            </div>

            <div className="bg-obsidian border border-white/5 p-4 rounded-sm">
                {pick ? (
                    <CuratorCard pick={pick} />
                ) : (
                    <div className="aspect-square flex flex-col items-center justify-center p-8 text-center bg-white/5">
                        <p className="text-[10px] tracking-widest uppercase text-ivory/20 italic">Seçki Yok</p>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-white/5">
                    <button className="premium-button w-full !py-2 !justify-between !px-4">
                        <span>Diğer Seçenekler</span>
                        <span className="ml-2">{">"}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
