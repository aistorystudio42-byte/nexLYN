# nexLYN Product Shell

nexLYN, Dark Academia estetiğine sahip, Next.js App Router ve Supabase SSR ile güçlendirilmiş bir topluluk ve içerik platformu kabuğudur.

## 🚀 Teknolojik Yığın

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS (Custom Dark Academia Theme)
- **Backend/Auth:** Supabase SSR (@supabase/ssr)
- **Icons:** Lucide React

## 🛠️ Kurulum Adımları

1. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   # veya
   pnpm install
   ```

2. **Supabase Kurulumu:**
   - Supabase panelinizden bir proje oluşturun.
   - `supabase/schema.sql` dosyasındaki SQL kodunu Supabase SQL Editor'a yapıştırın ve çalıştırın.
   - Bu işlem `profiles`, `categories`, `curator_picks` ve `stories` tablolarını oluşturacak ve RLS politikalarını ayarlayacaktır.

3. **Çevresel Değişkenler:**
   - `.env.local` dosyasını açın ve Supabase API anahtarlarınızı girin:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     ```

4. **Uygulamayı Başlatın:**
   ```bash
   npm run dev
   ```

## 🎨 Tasarım Dili

Uygulama tamamen CSS ile oluşturulmuş şu efektleri içerir:
- **Vignette:** Kenarlarda koyulaşma efekti.
- **Grain:** Retro/analog bir doku için noise katmanı.
- **Bronze:** Metalik detaylar ve düşük opaklıklı bordürler.
- **Dark Academia:** Fildişi, bronz ve obsidyen renk paleti.

## 🔐 Güvenlik

- `/mainadmin` sayfası korunmaktadır.
- Giriş yapan kullanıcının `profiles` tablosundaki `role` değeri `mainadmin` olmalıdır.
- `lib/auth/requireMainAdmin.ts` yardımcısı server-side koruma sağlar.

## 📈 Performans

- Tüm veri çekme işlemleri `LIMIT` ve `select` ile sınırlandırılmıştır.
- Keşfet sayfası `api/stories` rotası üzerinden cursor tabanlı "infinite scroll" kullanır.
