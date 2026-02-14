import { createClient } from '@supabase/supabase-js';

export const createAdminClient = () => {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!serviceKey) {
        console.warn('UYARI: SUPABASE_SERVICE_ROLE_KEY eksik. Admin işlemleri kısıtlı olabilir.');
    }

    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceKey || anonKey!
    );
};
