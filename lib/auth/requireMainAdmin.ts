import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function requireMainAdmin() {
    const cookieStore = cookies()
    const isAdminSaved = cookieStore.get('admin_session')?.value === 'authenticated'

    if (!isAdminSaved) {
        redirect('/mainadmin/login')
    }

    return true
}
