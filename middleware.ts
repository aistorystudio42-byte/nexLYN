import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from './utils/supabase/middleware';

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createClient(request, response);

    // 1. Check Maintenance Mode
    const isMaintenancePath = request.nextUrl.pathname.startsWith('/maintenance');
    const isAdminPath = request.nextUrl.pathname.startsWith('/admin-panel-secret');

    // 1. Hardened Admin Security
    if (isAdminPath) {
        const isVerified = request.cookies.get('nexlyn_admin_verified')?.value === 'true';
        const { data: { user: adminUser } } = await supabase.auth.getUser();

        if (!isVerified || !adminUser) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // 2. Multi-Check (Maintenance and Ban)
    const { data: { user } } = await supabase.auth.getUser();

    // Promise.all for performance
    const [settingsResult, profileResult] = await Promise.all([
        supabase.from('settings').select('is_maintenance').limit(1).maybeSingle(),
        user ? supabase.from('users').select('is_banned').eq('id', user.id).maybeSingle() : Promise.resolve({ data: null })
    ]);

    const isMaintenance = settingsResult.data?.is_maintenance === true;
    const isBanned = profileResult.data?.is_banned === true;

    if (isMaintenance && !isMaintenancePath && !isAdminPath) {
        return NextResponse.rewrite(new URL('/maintenance', request.url));
    }

    if (isBanned && !request.nextUrl.pathname.startsWith('/banned')) {
        return NextResponse.rewrite(new URL('/banned', request.url));
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
