'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

export default class AdminErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    backgroundColor: '#000',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    textAlign: 'center'
                }}>
                    <div style={{
                        maxWidth: '500px',
                        padding: '60px',
                        background: '#0a0a0a',
                        border: '1px solid #1a1a1a',
                        borderRadius: '16px',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⚖️</div>
                        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', marginBottom: '20px' }}>
                            Sistemde bir dalgalanma var.
                        </h2>
                        <p style={{ color: '#666', lineHeight: '1.8', marginBottom: '40px' }}>
                            Kritik bir hata tespit edildi. Lütfen sayfayı yenileyin veya yöneticiyle iletişime geçin.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="vintage-button"
                            style={{ padding: '15px 40px' }}
                        >
                            SİSTEMİ YENİLE
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
