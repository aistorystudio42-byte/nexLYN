import { requireMainAdmin } from '@/lib/auth/requireMainAdmin'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Ensure only mainadmin can access
    await requireMainAdmin()

    return (
        <div className="pt-24 px-8">
            <div className="container mx-auto">
                <div className="flex items-center gap-4 mb-12">
                    <div className="w-2 h-2 bg-bronze rounded-full animate-pulse" />
                    <h1 className="text-xs font-sans font-bold tracking-[0.4em] text-bronze uppercase">
                        Yönetim Paneli / Güvenli Bölge
                    </h1>
                </div>
                {children}
            </div>
        </div>
    )
}
