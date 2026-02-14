'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                zIndex: 9999
            }}>
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        style={{
                            background: '#0a0a0a',
                            border: `1px solid ${toast.type === 'success' ? '#bda061' : toast.type === 'error' ? '#c1121f' : '#333'}`,
                            padding: '16px 24px',
                            borderRadius: '8px',
                            color: '#fff',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            animation: 'toast-in 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
                            minWidth: '280px'
                        }}
                    >
                        <span style={{ fontSize: '1.2rem' }}>
                            {toast.type === 'success' ? '⚜️' : toast.type === 'error' ? '🔺' : 'ℹ️'}
                        </span>
                        <div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.5, marginBottom: '2px' }}>
                                {toast.type === 'success' ? 'İşlem Tamamlandı' : toast.type === 'error' ? 'Veritabanı Hatası' : 'Bilgi'}
                            </div>
                            <div style={{ fontSize: '0.9rem' }}>{toast.message}</div>
                        </div>
                    </div>
                ))}
            </div>
            <style jsx global>{`
                @keyframes toast-in {
                    from { opacity: 0; transform: translateY(20px) scale(0.9); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
