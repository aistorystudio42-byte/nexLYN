"use client"

import { useActionState } from 'react';
import { verifyAdminAction } from '@/app/actions/verifyAdmin';
import styles from './AdminEntry.module.css';

export default function AdminEntryPage() {
    const [state, action, isPending] = useActionState(verifyAdminAction, null);

    return (
        <div className={styles.container}>
            <div className={styles.loginCard}>
                <h1 className={styles.title}>NEXLYN CONTROL</h1>
                <p className={styles.subtitle}>Erişim için yetki anahtarını giriniz.</p>

                <form action={action} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input
                            type="password"
                            name="password"
                            placeholder="Anahtar Kelime"
                            required
                            className={styles.input}
                        />
                    </div>

                    {state?.error && <p className={styles.error}>{state.error}</p>}

                    <button
                        type="submit"
                        disabled={isPending}
                        className={styles.button}
                    >
                        {isPending ? 'DOĞRULANIYOR...' : 'GİRİŞ YAP'}
                    </button>
                </form>
            </div>
        </div>
    );
}
