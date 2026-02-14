'use server';

import { createClient } from '@/utils/supabase/server';
import { Club, PaginatedClubs } from '@/types';

export async function getClubs({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}): Promise<PaginatedClubs> {
    const supabase = await createClient();

    // Hesaplama: sayfa ve limite göre aralığı belirle
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
        .from('clubs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) {
        console.error('Veri çekme hatası:', error.message);
        throw new Error('Kulüpler listelenirken bir hata oluştu.');
    }

    return {
        clubs: (data as Club[]) || [],
        totalCount: count || 0,
        currentPage: page,
        totalPages: count ? Math.ceil(count / limit) : 0,
    };
}

export async function getClubById(id: string): Promise<Club | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Kulüp getirme hatası:', error.message);
        return null;
    }

    return data;
}

export async function createClubAction(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Yetkisiz işlem.");
    }

    const name = formData.get('clubName') as string;
    const description = formData.get('description') as string;

    const { data, error } = await supabase
        .from('clubs')
        .insert({
            name,
            description,
            owner_id: user.id
        })
        .select()
        .single();

    if (error) {
        console.error('Kulüp oluşturma hatası:', error.message);
        throw new Error('Kulüp oluşturulamadı.');
    }

    return data;
}

export async function getUserClubs() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .eq('owner_id', user.id);

    if (error) {
        console.error('Kullanıcı kulüpleri getirme hatası:', error.message);
        return [];
    }

    return (data as Club[]) || [];
}
