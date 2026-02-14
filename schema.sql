-- 1. USERS Tablosu
CREATE TABLE IF NOT EXISTS public.users (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  full_name text,
  avatar_url text,
  email text,
  is_banned boolean DEFAULT false,
  role text DEFAULT 'user',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CLUBS Tablosu
CREATE TABLE IF NOT EXISTS public.clubs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  type text DEFAULT 'STANDART',
  description text,
  image_url text,
  owner_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'AKTİF', -- 'AKTİF' veya 'ASKIYA ALINDI'
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. MODULES Tablosu
CREATE TABLE IF NOT EXISTS public.modules (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  club_id uuid REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  settings jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. SITE_SETTINGS Tablosu
CREATE TABLE IF NOT EXISTS public.site_settings (
  id integer PRIMARY KEY DEFAULT 1,
  contact_email text,
  instagram_url text,
  other_projects_url text,
  welcome_message text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT one_row CHECK (id = 1)
);

-- 5. SETTINGS Tablosu (Bakım Modu vb.)
CREATE TABLE IF NOT EXISTS public.settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  is_maintenance boolean DEFAULT false,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- İlk Değerleri Ata
INSERT INTO public.site_settings (id, contact_email, instagram_url, other_projects_url, welcome_message)
VALUES (1, 'info@nexlyn.com', 'https://instagram.com/nexlyn', 'https://projects.nexlyn.com', 'Lüks cemiyetlerin dijital platformuna hoş geldiniz.')
ON CONFLICT (id) DO NOTHING;

-- RLS'i Etkinleştir
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Politikaları Temizle ve Yeniden Oluştur
DROP POLICY IF EXISTS "Clubs everyone can view" ON public.clubs;
CREATE POLICY "Clubs everyone can view" ON public.clubs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Site settings everyone can view" ON public.site_settings;
CREATE POLICY "Site settings everyone can view" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);

-- NOT: Admin işlemleri Service Role Key ile yapılacağı için ek RLS politikalarına gerek yoktur.

