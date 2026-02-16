'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function uploadImage(file: File) {
    if (!file || file.size === 0 || !(file instanceof File)) return null

    const supabase = createClient()
    const fileExt = file.name.split('.').pop()
    const cleanFileName = file.name.replace(/[^\w\s.]/gi, '').replace(/\s+/g, '-').toLowerCase()
    const fileName = `${Date.now()}-${cleanFileName}`
    const filePath = `uploads/${fileName}`

    const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        })

    if (uploadError) {
        console.error('Upload Error:', uploadError)
        return null
    }

    const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath)

    return publicUrl
}

export async function updateCategory(formData: FormData) {
    const supabase = createClient()
    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const subtitle = formData.get('subtitle') as string
    const imageFile = formData.get('image') as File

    let cover_url = formData.get('current_cover_url') as string

    // Görsel yükleme işlemi
    const uploadedUrl = await uploadImage(imageFile)
    if (uploadedUrl) cover_url = uploadedUrl

    const { error } = await supabase
        .from('categories')
        .update({ title, subtitle, cover_url })
        .eq('id', id)

    if (error) throw error
    revalidatePath('/')
    revalidatePath('/mainadmin')
}

export async function updateCuratorPick(formData: FormData) {
    const supabase = createClient()
    const title = formData.get('title') as string
    const subtitle = formData.get('subtitle') as string
    const imageFile = formData.get('image') as File

    let cover_url = formData.get('cover_url') as string

    const uploadedUrl = await uploadImage(imageFile)
    if (uploadedUrl) cover_url = uploadedUrl

    // We only maintain one pick for now, so we clear and insert or update
    await supabase.from('curator_picks').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    const { error } = await supabase
        .from('curator_picks')
        .insert([{ title, subtitle, cover_url }])

    if (error) throw error
    revalidatePath('/')
    revalidatePath('/mainadmin')
}

export async function updateHeroSettings(formData: FormData) {
    const supabase = createClient()
    const title = formData.get('title') as string
    const subtitle = formData.get('subtitle') as string
    const button_text = formData.get('button_text') as string
    const imageFile = formData.get('image') as File

    let image_url = formData.get('image_url') as string
    const uploadedUrl = await uploadImage(imageFile)
    if (uploadedUrl) image_url = uploadedUrl

    const { error } = await supabase
        .from('site_settings')
        .upsert({
            id: 'hero',
            value: { title, subtitle, button_text, image_url }
        })

    if (error) throw error
    revalidatePath('/')
}

export async function updateNavigationSettings(links: any[]) {
    const supabase = createClient()
    const { error } = await supabase
        .from('site_settings')
        .upsert({
            id: 'navigation',
            value: links
        })

    if (error) throw error
    revalidatePath('/')
}

export async function updatePageSettings(id: string, value: any) {
    const supabase = createClient()
    const { error } = await supabase
        .from('site_settings')
        .upsert({ id, value })

    if (error) throw error
    revalidatePath('/')
    revalidatePath('/mainadmin')
}

import { createAdminClient } from './admin'

export async function addClub(formData: FormData) {
    const supabase = createClient()
    const adminClient = createAdminClient()

    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const admin_password = formData.get('admin_password') as string
    const owner_email = (formData.get('owner_email') as string).toLowerCase().trim()
    const type = formData.get('type') as string
    const excerpt = formData.get('excerpt') as string

    // 1. Profil kontrolü (Admin Yetkisiyle)
    let { data: profile } = await adminClient
        .from('profiles')
        .select('id, email')
        .ilike('email', owner_email)
        .maybeSingle()

    // 2. Eğer profil yoksa, Auth sisteminden kullanıcıyı bulup profili manuel mühürle
    if (!profile) {
        const { data: { users }, error: listError } = await adminClient.auth.admin.listUsers()
        if (listError) throw listError

        const authedUser = users.find(u => u.email?.toLowerCase() === owner_email)

        if (!authedUser) {
            throw new Error(`Kritik Hata: '${owner_email}' adresiyle kayıtlı bir kullanıcı bulunamadı. Lütfen önce bu e-posta ile giriş yapıldığından emin olun.`)
        }

        // Profili manuel oluştur
        const { data: newProfile, error: insertError } = await adminClient
            .from('profiles')
            .insert([{ id: authedUser.id, email: authedUser.email, role: 'user' }])
            .select()
            .single()

        if (insertError) throw insertError
        profile = newProfile
    }

    const ownerId = profile?.id

    if (!ownerId) {
        throw new Error('Kritik Hata: Profil kimliği alınamadı.')
    }

    // 3. Generate Initial Recovery Code
    const recovery_code = `NEX-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    const { data: newClub, error } = await adminClient
        .from('clubs')
        .insert([{
            title,
            slug,
            admin_password,
            owner_id: ownerId,
            type,
            recovery_code,
            excerpt,
            status: 'draft'
        }])
        .select()
        .single()

    if (error) {
        if (error.code === '23505') throw new Error('Hata: Bu URL (slug) zaten bir başka kulüp tarafından kullanılıyor.')
        throw error
    }

    // 4. Initialize Modules based on Type
    const moduleMapping: { [key: string]: string[] } = {
        'EĞLENCE/HOBİ': ['egl_etkinlik', 'egl_galeri', 'egl_anket', 'egl_muzik', 'egl_lounge'],
        'OYUN/ARKADAŞLIK': ['oyun_turnuva', 'oyun_kadro', 'oyun_takvim', 'oyun_medya', 'oyun_strateji'],
        'KURUM/TANITIM': ['kur_bulten', 'kur_vizyon', 'kur_iletisim', 'kur_sss', 'kur_randevu'],
        'E-TİCARET/ SATIŞ': ['tic_vitrin', 'tic_siparis', 'tic_yorum', 'tic_kampanya', 'tic_destek'],
        'AKADEMİ/EĞİTİM': ['aka_kutuphane', 'aka_program', 'aka_forum', 'aka_sinav', 'aka_makale'],
        'POPÜLERLİK/SOSYAL': ['sos_profil', 'sos_bagis', 'sos_gorev', 'sos_kural', 'sos_meydan']
    }

    const defaultModules = moduleMapping[type] || []
    if (defaultModules.length > 0) {
        const moduleInserts = defaultModules.map(mid => ({
            club_id: newClub.id,
            module_id: mid,
            is_active: true
        }))
        await adminClient.from('club_modules').insert(moduleInserts)
    }

    revalidatePath('/kesfet')
    revalidatePath('/mainadmin')

    return { success: true, recovery_code }
}

export async function resetClubPassword(clubId: string, recoveryCode: string, newPassword: string) {
    const supabase = createClient()

    // 1. Check if recovery code matches
    const { data: club, error: fetchError } = await supabase
        .from('clubs')
        .select('id')
        .eq('id', clubId)
        .eq('recovery_code', recoveryCode)
        .single()

    if (fetchError || !club) {
        throw new Error('Geçersiz Kurtarma Kodu. Şifre değiştirilemedi.')
    }

    // 2. Generate NEW rolling recovery code
    const new_recovery_code = `NEX-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    const { error: updateError } = await supabase
        .from('clubs')
        .update({
            admin_password: newPassword,
            recovery_code: new_recovery_code
        })
        .eq('id', clubId)

    if (updateError) throw updateError

    revalidatePath('/mainadmin')
    return { success: true, new_recovery_code }
}

export async function deleteClub(id: string) {
    const supabase = createClient()
    const { error } = await supabase
        .from('clubs')
        .delete()
        .eq('id', id)

    if (error) throw error
    revalidatePath('/kesfet')
    revalidatePath('/mainadmin')
}

export async function joinClub(formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Oturum açmanız gerekiyor.')

    const club_id = formData.get('club_id') as string
    const message = formData.get('message') as string

    const { error } = await supabase
        .from('join_requests')
        .insert([{
            club_id,
            user_id: user.id,
            message,
            status: 'pending'
        }])

    if (error) {
        if (error.code === '23505') throw new Error('Hata: Zaten bir katılım isteğiniz bulunuyor.')
        throw error
    }

    revalidatePath('/kulup')
}

export async function handleJoinRequest(requestId: string, status: 'approved' | 'rejected') {
    const supabase = createClient()
    const { data: request } = await supabase.from('join_requests').select('*').eq('id', requestId).single()
    if (!request) return

    await supabase.from('join_requests').update({ status }).eq('id', requestId)

    if (status === 'approved') {
        await supabase.from('club_members').insert([{
            club_id: request.club_id,
            user_id: request.user_id,
            role: 'member'
        }])
    }

    revalidatePath('/')
}

export async function toggleClubStatus(clubId: string, currentStatus: string) {
    const supabase = createClient()
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'

    const { error } = await supabase
        .from('clubs')
        .update({ status: newStatus })
        .eq('id', clubId)

    if (error) throw error

    revalidatePath(`/kuluplerim`)
    revalidatePath(`/kesfet`)
    revalidatePath(`/`)
}

export async function updateClubAbout(clubId: string, excerpt: string) {
    const supabase = createClient()
    const { error } = await supabase.from('clubs').update({ excerpt }).eq('id', clubId)
    if (error) throw error
    revalidatePath(`/`)
}

export async function updateClubMetadata(clubId: string, metadata: any) {
    const supabase = createClient()
    const { error } = await supabase.from('clubs').update({ theme_settings: metadata }).eq('id', clubId)
    if (error) throw error
    revalidatePath(`/`)
}

export async function sendChatMessage(clubId: string, roomId: string, content: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('chat_messages').insert([{ club_id: clubId, room_id: roomId, user_id: user.id, content }])
    if (error) throw error
}

export async function createPoll(clubId: string, question: string, options: string[]) {
    const supabase = createClient()
    const optionsJson = options.map((opt, i) => ({ id: `opt_${i}`, text: opt }))
    const { error } = await supabase.from('polls').insert([{ club_id: clubId, question, options: optionsJson }])
    if (error) throw error
    revalidatePath(`/`)
}

export async function voteInPoll(pollId: string, optionId: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('poll_votes').insert([{ poll_id: pollId, user_id: user.id, option_id: optionId }])
    if (error) throw error
    revalidatePath(`/`)
}

export async function toggleClubModule(clubId: string, moduleId: string, isActive: boolean) {
    const supabase = createClient()
    const { error } = await supabase
        .from('club_modules')
        .update({ is_active: isActive })
        .eq('club_id', clubId)
        .eq('module_id', moduleId)

    if (error) throw error
    revalidatePath(`/`)
}

export async function updateModuleData(clubId: string, moduleId: string, data: any) {
    const supabase = createClient()
    const { error } = await supabase
        .from('club_modules')
        .update({ data })
        .eq('club_id', clubId)
        .eq('module_id', moduleId)

    if (error) throw error
    revalidatePath(`/`)
}
