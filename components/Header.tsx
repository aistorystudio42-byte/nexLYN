import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';
import { createClient } from '@/utils/supabase/server';
import AuthButton from './AuthButton';
import NavLinks from './NavLinks';
import { signOut } from '@/app/actions/authActions';

export default async function Header() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const navLinks = [
        { href: '/discover', label: 'Keşfet' },
        { href: '/my-clubs', label: 'Kulüplerim' },
    ];

    return (
        <header className={styles.header}>
            <div className={styles.navContainer} style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                <Link href="/" className={styles.logoContainer}>
                    <Image
                        src="/assets/logo.png"
                        alt="nexLYN Logo"
                        width={150}
                        height={60}
                        style={{ objectFit: 'contain' }}
                        priority
                    />
                </Link>

                <nav className={styles.nav}>
                    <NavLinks links={navLinks} />
                </nav>
            </div>

            <div className={styles.authSection}>
                {user ? (
                    <div className={styles.profileInfo}>
                        {user.user_metadata?.avatar_url && (
                            <Image
                                src={user.user_metadata.avatar_url}
                                alt="Profil"
                                width={36}
                                height={36}
                                className={styles.profileImage}
                            />
                        )}
                        <span style={{ fontSize: '0.9rem', color: 'var(--text)', opacity: 0.8 }}>
                            {user.user_metadata?.full_name || user.email}
                        </span>
                        <form action={signOut}>
                            <button type="submit" className={styles.logoutButton}>
                                Çıkış Yap
                            </button>
                        </form>
                    </div>
                ) : (
                    <AuthButton />
                )}
            </div>
        </header>
    );
}
