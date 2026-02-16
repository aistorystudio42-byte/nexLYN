-- Clean start: Drop existing tables if they exist
DROP TABLE IF EXISTS poll_votes CASCADE;
DROP TABLE IF EXISTS polls CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS club_modules CASCADE;
DROP TABLE IF EXISTS join_requests CASCADE;
DROP TABLE IF EXISTS club_members CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS curator_picks CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS clubs CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Profiles table: Users who can own clubs
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'mainadmin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clubs table: The heart of nexLYN
CREATE TABLE clubs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  admin_password TEXT NOT NULL, -- Managed by Main Admin
  recovery_code TEXT NOT NULL,   -- The Master Key
  type TEXT NOT NULL CHECK (type IN (
    'EĞLENCE/HOBİ', 
    'OYUN/ARKADAŞLIK', 
    'KURUM/TANITIM', 
    'E-TİCARET/ SATIŞ', 
    'AKADEMİ/EĞİTİM', 
    'POPÜLERLİK/SOSYAL'
  )),
  excerpt TEXT,
  cover_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  theme_settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table: Visualized as the 6 Business Models on Homepage
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type_ref TEXT NOT NULL, -- Connection to club types
  subtitle TEXT,
  cover_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Curator Picks table (Premium highlights)
CREATE TABLE curator_picks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  cover_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Settings
CREATE TABLE site_settings (
  id TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Security: Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE curator_picks ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public categories are viewable" ON categories FOR SELECT USING (true);
CREATE POLICY "Public curator picks are viewable" ON curator_picks FOR SELECT USING (true);
CREATE POLICY "Public site settings are viewable" ON site_settings FOR SELECT USING (true);

-- Mutation Policies (Admin Actions)
-- Sadece mainadmin rolündeki kullanıcılar veri ekleyebilir, güncelleyebilir veya silebilir.
CREATE POLICY "Admin insert site_settings" ON site_settings FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'mainadmin'));
CREATE POLICY "Admin update site_settings" ON site_settings FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'mainadmin'));
CREATE POLICY "Admin delete site_settings" ON site_settings FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'mainadmin'));

CREATE POLICY "Admin insert categories" ON categories FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'mainadmin'));
CREATE POLICY "Admin update categories" ON categories FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'mainadmin'));
CREATE POLICY "Admin delete categories" ON categories FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'mainadmin'));

CREATE POLICY "Admin insert curator_picks" ON curator_picks FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'mainadmin'));
CREATE POLICY "Admin update curator_picks" ON curator_picks FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'mainadmin'));
CREATE POLICY "Admin delete curator_picks" ON curator_picks FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'mainadmin'));

CREATE POLICY "Admin insert profiles" ON profiles FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'mainadmin'));
CREATE POLICY "Admin update profiles" ON profiles FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'mainadmin'));
CREATE POLICY "Admin delete profiles" ON profiles FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'mainadmin'));

-- Kulüpler için SELECT herkes için açık, yönetime sadece sahip ve admin yetkili.
CREATE POLICY "Public clubs are viewable" ON clubs FOR SELECT USING (true);
CREATE POLICY "Admin manage clubs insert" ON clubs FOR INSERT WITH CHECK ((select auth.uid()) = owner_id OR EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'mainadmin'));
CREATE POLICY "Admin manage clubs update" ON clubs FOR UPDATE USING ((select auth.uid()) = owner_id OR EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'mainadmin'));
CREATE POLICY "Admin manage clubs delete" ON clubs FOR DELETE USING ((select auth.uid()) = owner_id OR EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'mainadmin'));

-- Initial Data: The 6 Foundation Models
INSERT INTO categories (title, type_ref, subtitle, cover_url) VALUES 
('Eğlence & Hobi', 'EĞLENCE/HOBİ', 'Ortak tutkular, sanatsal üretimler ve ilham verici sergiler.', 'https://images.unsplash.com/photo-1514525253361-bee8d4872393?q=80&w=800'),
('Oyun & Esports', 'OYUN/ARKADAŞLIK', 'Rekabetçi takımlar, turnuva ağaçları ve stratejik koordinasyon.', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800'),
('Kurumsal Sunum', 'KURUM/TANITIM', 'Marka prestiji, resmi bültenler ve profesyonel ağ yönetimi.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800'),
('E-Ticaret & Satış', 'E-TİCARET/ SATIŞ', 'Dijital vitrinler, VIP müşteri desteği ve hızlı sipariş formları.', 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=800'),
('Akademi & Eğitim', 'AKADEMİ/EĞİTİM', 'Bilgi paylaşımı, dijital kütüphane ve interaktif sınav sistemleri.', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800'),
('Sosyal & STK', 'POPÜLERLİK/SOSYAL', 'Topluluk manifestoları, bağış takibi ve gönüllü ağları.', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800');

-- System Data
INSERT INTO site_settings (id, value) VALUES 
('hero', '{"title": "nexLYN ile Kendi Dijital Kulübünü Kur", "subtitle": "Hayalinizdeki topluluğu oluşturun, dijital kulübünüzü özgürce özelleştirin ve yönetin.", "button_text": "Dijital Kulüpleri Keşfet", "image_url": "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000"}'::jsonb),
('navigation', '[{"name": "Keşfet", "href": "/kesfet"}, {"name": "Kulüplerim", "href": "/kuluplerim"}, {"name": "Hakkında", "href": "/hakkinda"}]'::jsonb),
('page_kesfet', '{"title": "Keşfet", "subtitle": "nexLYN arşivindeki en seçkin topluluklar ve dijital kulüpler."}'::jsonb);

-- Trigger for Profile Creation (Ensure role 'user' by default)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- STORAGE SETUP
INSERT INTO storage.buckets (id, name, public) 
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- Clean existing policies to avoid errors
DROP POLICY IF EXISTS "Görseller herkese açık olsun" ON storage.objects;
DROP POLICY IF EXISTS "Görsel yüklemeye izin ver" ON storage.objects;
DROP POLICY IF EXISTS "Görsel güncellemeye izin ver" ON storage.objects;
DROP POLICY IF EXISTS "Görsel silmeye izin ver" ON storage.objects;

-- Re-create Storage RLS Policies
CREATE POLICY "Görseller herkese açık olsun" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'assets' );

CREATE POLICY "Görsel yüklemeye izin ver" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'assets' );

CREATE POLICY "Görsel güncellemeye izin ver" 
ON storage.objects FOR UPDATE 
WITH CHECK ( bucket_id = 'assets' );

CREATE POLICY "Görsel silmeye izin ver" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'assets' );
-- CLUB ECOSYSTEM ENHANCEMENTS

-- Members table: Who belongs to which club
CREATE TABLE club_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(club_id, user_id)
);

-- Join Requests: Entry management for private/approval-based clubs
CREATE TABLE join_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(club_id, user_id)
);

-- Club Modules: Specific data for each club's 5 modules
CREATE TABLE club_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL, -- e.g., 'tic_vitrin', 'oyun_kadro'
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}'::jsonb,
  data JSONB DEFAULT '[]'::jsonb, -- Module specific content
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(club_id, module_id)
);

-- Chat Messages Table
CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  room_id TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Polls Table
CREATE TABLE polls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of {id, text}
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Poll Votes Table
CREATE TABLE poll_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  option_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(poll_id, user_id)
);

-- RLS for new tables
ALTER TABLE club_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Members viewable by anyone" ON club_members FOR SELECT USING (true);
CREATE POLICY "Join requests viewable by owner and requester" ON join_requests FOR SELECT 
  USING ((select auth.uid()) = user_id OR (select auth.uid()) IN (SELECT owner_id FROM clubs WHERE id = club_id));

CREATE POLICY "Allow members to join" ON join_requests FOR INSERT WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "Owners update requests" ON join_requests FOR UPDATE USING ((select auth.uid()) IN (SELECT owner_id FROM clubs WHERE id = club_id));
CREATE POLICY "Owners delete requests" ON join_requests FOR DELETE USING ((select auth.uid()) IN (SELECT owner_id FROM clubs WHERE id = club_id));

CREATE POLICY "Modules viewable by anyone" ON club_modules FOR SELECT USING (true);
CREATE POLICY "Owners insert modules" ON club_modules FOR INSERT WITH CHECK ((select auth.uid()) IN (SELECT owner_id FROM clubs WHERE id = club_id));
CREATE POLICY "Owners update modules" ON club_modules FOR UPDATE USING ((select auth.uid()) IN (SELECT owner_id FROM clubs WHERE id = club_id));
CREATE POLICY "Owners delete modules" ON club_modules FOR DELETE USING ((select auth.uid()) IN (SELECT owner_id FROM clubs WHERE id = club_id));

CREATE POLICY "Owners insert members" ON club_members FOR INSERT WITH CHECK ((select auth.uid()) IN (SELECT owner_id FROM clubs WHERE id = club_id));
CREATE POLICY "Owners update members" ON club_members FOR UPDATE USING ((select auth.uid()) IN (SELECT owner_id FROM clubs WHERE id = club_id));
CREATE POLICY "Owners delete members" ON club_members FOR DELETE USING ((select auth.uid()) IN (SELECT owner_id FROM clubs WHERE id = club_id));

-- Chat Policies
CREATE POLICY "Chat viewable by club members" ON chat_messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM club_members WHERE club_id = chat_messages.club_id AND user_id = (select auth.uid())));

CREATE POLICY "Members can send messages" ON chat_messages FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM club_members WHERE club_id = chat_messages.club_id AND user_id = (select auth.uid())));

-- Poll Policies
CREATE POLICY "Polls viewable by anyone" ON polls FOR SELECT USING (true);
CREATE POLICY "Votes viewable by anyone" ON poll_votes FOR SELECT USING (true);
CREATE POLICY "Members can vote" ON poll_votes FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM club_members WHERE club_id = (SELECT club_id FROM polls WHERE id = poll_id) AND user_id = (select auth.uid())));

CREATE POLICY "Owners insert polls" ON polls FOR INSERT WITH CHECK ((select auth.uid()) IN (SELECT owner_id FROM clubs WHERE id = club_id));
CREATE POLICY "Owners update polls" ON polls FOR UPDATE USING ((select auth.uid()) IN (SELECT owner_id FROM clubs WHERE id = club_id));
CREATE POLICY "Owners delete polls" ON polls FOR DELETE USING ((select auth.uid()) IN (SELECT owner_id FROM clubs WHERE id = club_id));

-- Trigger: Automatically add owner as admin member when club is created
CREATE OR REPLACE FUNCTION public.handle_new_club()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.club_members (club_id, user_id, role)
  VALUES (new.id, new.owner_id, 'admin');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_club_created
  AFTER INSERT ON public.clubs
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_club();

-- PERFORMANCE INDEXES (Foreign Keys)
-- Supabase Performance Advisor recommends indexing all foreign keys for optimal performance.
CREATE INDEX IF NOT EXISTS idx_clubs_owner_id ON public.clubs(owner_id);
CREATE INDEX IF NOT EXISTS idx_club_members_club_id ON public.club_members(club_id);
CREATE INDEX IF NOT EXISTS idx_club_members_user_id ON public.club_members(user_id);
CREATE INDEX IF NOT EXISTS idx_join_requests_club_id ON public.join_requests(club_id);
CREATE INDEX IF NOT EXISTS idx_join_requests_user_id ON public.join_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_club_modules_club_id ON public.club_modules(club_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_club_id ON public.chat_messages(club_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_polls_club_id ON public.polls(club_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_poll_id ON public.poll_votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_user_id ON public.poll_votes(user_id);
