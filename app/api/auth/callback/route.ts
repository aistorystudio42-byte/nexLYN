import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // code varsa, bir sonraki aşamaya geçmek için 'next' parametresini kullanıyoruz
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // Hata durumunda veya code yoksa anasayfaya dön
    return NextResponse.redirect(`${origin}/giris?error=auth_failed`)
}
