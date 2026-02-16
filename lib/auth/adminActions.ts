import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginAdmin(formData: FormData) {
    'use server'

    const password = formData.get('password') as string
    const masterPassword = process.env.MAIN_ADMIN_PASSWORD

    if (password === masterPassword) {
        cookies().set('admin_session', 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/', // Path ekledik
            maxAge: 60 * 60 * 24 // 24 hours
        })
        redirect('/mainadmin')
    } else {
        redirect('/mainadmin/login?error=true')
    }
}

export async function logoutAdmin() {
    'use server'
    cookies().delete('admin_session')
    redirect('/')
}
