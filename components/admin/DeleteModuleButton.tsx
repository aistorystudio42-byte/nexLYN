
'use client';

import React, { useTransition } from 'react';
import { deleteModule } from '@/app/actions/adminActions';

interface Props {
    moduleId: string;
}

export default function DeleteModuleButton({ moduleId }: Props) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        if (window.confirm('Bu modülü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
            startTransition(async () => {
                const result = await deleteModule(moduleId);
                if (!result.success) {
                    alert('Hata: ' + result.error);
                }
            });
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            style={{
                background: 'rgba(158, 27, 27, 0.1)',
                color: '#ff4d4d',
                border: '1px solid rgba(158, 27, 27, 0.3)',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '0.8rem',
                cursor: isPending ? 'wait' : 'pointer',
                opacity: isPending ? 0.7 : 1
            }}>
            {isPending ? 'Siliniyor...' : 'Modülü Sil (Hard Delete)'}
        </button>
    );
}
