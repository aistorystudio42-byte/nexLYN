import { createClient } from '@/utils/supabase/server';
import AuthButton from '@/components/AuthButton';
import Link from 'next/link';
import OnboardingModal from '@/components/OnboardingModal';
import BusinessModel from '@/components/BusinessModel';

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Determine if it's a new user (within the last 2 minutes for demo purposes, 
  // or we could check if they have a record in public.users if we wanted to be more precise)
  const isNewUser = user ? (
    new Date().getTime() - new Date(user.created_at).getTime() < 120000 &&
    user.last_sign_in_at &&
    new Date(user.last_sign_in_at).getTime() - new Date(user.created_at).getTime() < 10000
  ) : false;

  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center pt-20">
        {/* Background Gradient */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(135deg, #050000 0%, #1a0505 50%, #050000 100%)',
          }}
        />

        {/* Subtle Texture Overlay */}
        <div className="absolute inset-0 z-1 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />

        <div className="relative z-10 w-full max-w-4xl px-6 text-center">
          <h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-playfair), serif', color: '#f2ebd9' }}
          >
            Geleceğin Kulüplerine <br />
            <span style={{ color: '#c1121f' }}>Hoş Geldiniz</span>
          </h1>

          <p
            className="text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed tracking-wide"
            style={{ fontFamily: 'var(--font-inter), sans-serif', color: 'rgba(242, 235, 217, 0.6)' }}
          >
            Gizlilik, prestij ve teknolojinin buluştuğu noktada, modern dijital köşkünüzü inşa edin.
            En seçkin topluluklarla bağlantı kurun.
          </p>

          <div className="flex flex-col items-center gap-8">
            {user ? (
              <div className="flex flex-wrap justify-center gap-6" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                <Link
                  href="/discover"
                  className="px-8 py-3 border border-[#9e1b1b] text-[#f2ebd9] uppercase tracking-widest text-sm hover:bg-[#9e1b1b] transition-all duration-500"
                  style={{
                    fontVariant: 'small-caps',
                    fontFamily: 'var(--font-inter)',
                    textDecoration: 'none',
                    border: '1px solid #9e1b1b',
                    color: '#f2ebd9'
                  }}
                >
                  Keşfet'e Git
                </Link>
                <Link
                  href="/my-clubs"
                  className="px-8 py-3 border border-[#bda061]/30 text-[#bda061] uppercase tracking-widest text-sm hover:border-[#bda061] transition-all duration-500"
                  style={{
                    fontVariant: 'small-caps',
                    fontFamily: 'var(--font-inter)',
                    textDecoration: 'none',
                    border: '1px solid rgba(189, 160, 97, 0.3)',
                    color: '#bda061'
                  }}
                >
                  Kulüplerim
                </Link>
              </div>
            ) : (
              <AuthButton />
            )}
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-[#c1121f]/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#bda061]/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </section>

      {/* Business Model Section (Pricings & Guide) */}
      <div className="w-full">
        <BusinessModel />
      </div>

      {/* Onboarding Modal */}
      <OnboardingModal isNewUser={!!isNewUser} />
    </div>
  );
}
