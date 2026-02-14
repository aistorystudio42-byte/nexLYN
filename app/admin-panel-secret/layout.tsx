
import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getAdminStats } from '@/app/actions/adminActions';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

import { ToastProvider } from '@/components/ui/ToastContext';
import AdminErrorBoundary from '@/components/admin/AdminErrorBoundary';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const isVerified = cookieStore.get('nexlyn_admin_verified')?.value === 'true';

    if (!isVerified) {
        redirect('/');
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/');
    }

    const stats = await getAdminStats();

    return (
        <ToastProvider>
            <AdminErrorBoundary>
                <div style={{ display: 'flex', minHeight: '100vh', background: '#050505', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
                    <AdminSidebar />

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <AdminHeader isMaintenance={stats.isMaintenance} />
                        <main style={{ padding: '40px', overflowY: 'auto' }}>
                            {children}
                        </main>
                    </div>
                </div>
            </AdminErrorBoundary>
        </ToastProvider>
    );
}
