'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

interface NavLinksProps {
    links: { href: string; label: string }[];
}

export default function NavLinks({ links }: NavLinksProps) {
    const pathname = usePathname();

    return (
        <>
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
                >
                    {link.label}
                </Link>
            ))}
        </>
    );
}
