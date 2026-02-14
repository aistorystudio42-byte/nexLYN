"use server"

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function verifyAdminAction(prevState: { error?: string } | null, formData: FormData) {
    const password = formData.get('password') as string;
    const adminSecret = process.env.NEXLYN_ADMIN_SECRET;

    if (password === adminSecret) {
        const cookieStore = await cookies();

        // Set a secure HTTP-Only cookie for 24 hours
        cookieStore.set('nexlyn_admin_verified', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
        });

        redirect('/admin-panel-secret');
    }

    return { error: 'Geçersiz admin şifresi.' };
}
