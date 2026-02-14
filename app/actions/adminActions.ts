'use server';

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';

/**
 * Kulüp sahibini günceller.
 */
export async function updateClubOwner(clubId: string, newOwnerId: string) {
    const supabaseAdmin = createAdminClient();

    const { error } = await supabaseAdmin
        .from('clubs')
        .update({ owner_id: newOwnerId })
        .eq('id', clubId);

    if (error) {
        console.error('Update Owner Error:', error.message);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin-panel-secret');
    return { success: true };
}

/**
 * Kulüp durumunu (Aktif/Askıda) değiştirir.
 */
export async function toggleClubStatus(clubId: string, currentStatus: string) {
    const supabaseAdmin = createAdminClient();
    const newStatus = currentStatus === 'AKTİF' ? 'ASKIYA ALINDI' : 'AKTİF';

    const { error } = await supabaseAdmin
        .from('clubs')
        .update({ status: newStatus })
        .eq('id', clubId);

    if (error) {
        console.error('Toggle Status Error:', error.message);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin-panel-secret');
    return { success: true };
}

/**
 * Kulüp sahibinin şifresini sıfırlar.
 */
export async function resetUserPassword(userId: string, newPassword: string) {
    const supabaseAdmin = createAdminClient();

    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: newPassword
    });

    if (error) {
        console.error('Password Reset Error:', error.message);
        return { success: false, error: error.message };
    }

    return { success: true };
}

/**
 * Kulüp yapılandırmasını sıfırlar.
 */
export async function resetClubConfig(clubId: string) {
    const supabaseAdmin = createAdminClient();

    const { error } = await supabaseAdmin
        .from('clubs')
        .update({
            description: 'Reset by System Admin',
            image_url: null
        })
        .eq('id', clubId);

    if (error) {
        console.error('Reset Config Error:', error.message);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin-panel-secret');
    return { success: true };
}

/**
 * Kulüpleri filtreleyerek ve sayfalayarak getirir.
 */
export async function getAdminClubs({
    search = '',
    page = 1,
    limit = 10
}: {
    search?: string;
    page?: number;
    limit?: number;
} = {}) {
    const supabase = await createClient();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from('clubs')
        .select('*', { count: 'exact' });

    if (search) {
        query = query.ilike('name', `%${search}%`);
    }

    const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) {
        console.error('Fetch Admin Clubs Error:', error.message);
        return { clubs: [], totalCount: 0 };
    }

    return {
        clubs: data || [],
        totalCount: count || 0
    };
}

/**
 * Sistem istatistiklerini getirir.
 */
export async function getAdminStats() {
    const supabase = await createClient();

    const [
        { count: userCount },
        { count: clubCount },
        { count: moduleCount },
        { data: settings }
    ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('clubs').select('*', { count: 'exact', head: true }),
        supabase.from('modules').select('*', { count: 'exact', head: true }),
        supabase.from('settings').select('is_maintenance').limit(1).maybeSingle()
    ]);

    return {
        userCount: userCount || 0,
        clubCount: clubCount || 0,
        moduleCount: moduleCount || 0,
        isMaintenance: settings?.is_maintenance || false,
        systemStatus: settings?.is_maintenance ? 'Bakımda' : 'Online'
    };
}

/**
 * Tüm kullanıcıları listeler.
 */
export async function getAdminUsers() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Fetch Users Error:', error.message);
        return [];
    }
    return data || [];
}

/**
 * Kullanıcıyı yasaklar (Ban).
 */
export async function banUser(userId: string) {
    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin
        .from('users')
        .update({ is_banned: true })
        .eq('id', userId);

    if (error) return { success: false, error: error.message };
    revalidatePath('/admin-panel-secret/users');
    return { success: true };
}

/**
 * Kullanıcıyı Süper Admin yapar.
 */
export async function promoteToAdmin(userId: string) {
    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin
        .from('users')
        .update({ role: 'admin' })
        .eq('id', userId);

    if (error) return { success: false, error: error.message };
    revalidatePath('/admin-panel-secret/users');
    return { success: true };
}

/**
 * Denetim için tüm modülleri getirir.
 */
export async function getModerationContent() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('modules')
        .select(`
            id,
            type,
            created_at,
            club_id,
            clubs (
                name
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Fetch Moderation Error:', error.message);
        return [];
    }
    return data || [];
}

/**
 * Modülü kalıcı olarak siler (Hard Delete).
 */
export async function deleteModule(moduleId: string) {
    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin
        .from('modules')
        .delete()
        .eq('id', moduleId);

    if (error) return { success: false, error: error.message };
    revalidatePath('/admin-panel-secret/moderation');
    return { success: true };
}

/**
 * Bakım modunu değiştirir.
 */
export async function toggleMaintenanceMode(isMaintenance: boolean) {
    const supabaseAdmin = createAdminClient();

    // Check if settings row exists, if not create one
    const { data: existing } = await supabaseAdmin.from('settings').select('id').limit(1).maybeSingle();

    let error;
    if (existing) {
        const { error: updateError } = await supabaseAdmin
            .from('settings')
            .update({ is_maintenance: isMaintenance })
            .eq('id', existing.id);
        error = updateError;
    } else {
        const { error: insertError } = await supabaseAdmin
            .from('settings')
            .insert({ is_maintenance: isMaintenance });
        error = insertError;
    }

    if (error) return { success: false, error: error.message };

    revalidatePath('/', 'layout');
    revalidatePath('/admin-panel-secret');
    return { success: true };
}

/**
 * Site ayarlarını getirir.
 */
export async function getSiteSettings() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

    if (error) {
        console.error('Fetch Settings Error:', error.message);
        return null;
    }
    return data;
}

/**
 * Site ayarlarını günceller.
 */
export async function updateSiteSettings(formData: FormData) {
    const supabaseAdmin = createAdminClient();

    const updates = {
        contact_email: formData.get('contact_email')?.toString(),
        instagram_url: formData.get('instagram_url')?.toString(),
        other_projects_url: formData.get('other_projects_url')?.toString(),
        welcome_message: formData.get('welcome_message')?.toString(),
    };

    const { error } = await supabaseAdmin
        .from('site_settings')
        .update(updates)
        .eq('id', 1);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/contact');
    revalidatePath('/admin-panel-secret');
    return { success: true };
}

