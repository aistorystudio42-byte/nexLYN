import React from 'react';

export default function MaintenancePage() {
    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0a0a',
            color: '#fff',
            fontFamily: 'serif',
            textAlign: 'center',
            padding: '20px'
        }}>
            <h1 style={{
                fontSize: '3rem',
                color: '#9e1b1b',
                marginBottom: '20px',
                letterSpacing: '5px'
            }}>
                NEXLYN
            </h1>
            <div style={{
                width: '100px',
                height: '2px',
                background: '#9e1b1b',
                marginBottom: '40px'
            }} />
            <p style={{
                fontSize: '1.2rem',
                maxWidth: '600px',
                lineHeight: '1.6',
                color: '#888'
            }}>
                Cemiyet geçici olarak erişime kapalıdır.
                <br />
                Restorasyon çalışmaları devam ediyor.
            </p>
            <p style={{
                marginTop: '60px',
                fontSize: '0.8rem',
                letterSpacing: '2px',
                color: '#444'
            }}>
                SESSIO TERMINATED
            </p>
        </div>
    );
}
