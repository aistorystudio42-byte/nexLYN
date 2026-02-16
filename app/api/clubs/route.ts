import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get('cursor')
    const supabase = createClient()

    let query = supabase
        .from('clubs')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(6)

    if (cursor) {
        query = query.lt('created_at', cursor)
    }

    const { data: clubs, error } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({
        clubs: clubs || [],
        nextCursor: clubs && clubs.length > 0 ? clubs[clubs.length - 1].created_at : null
    })
}
