'use client';

import React from 'react';
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';

interface EmptyStateProps {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    icon?: string;
}

export default function EmptyState({ title, description, buttonText, buttonLink, icon = "⚜️" }: EmptyStateProps) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '100px 20px',
            textAlign: 'center',
            minHeight: '60vh'
        }}>
            <ScrollReveal>
                <div className="empty-state-icon">{icon}</div>
                <h2 style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '2.5rem',
                    color: '#fff',
                    marginBottom: '15px',
                    letterSpacing: '-0.02em'
                }}>
                    {title}
                </h2>
                <p style={{
                    color: '#666',
                    fontSize: '1.1rem',
                    maxWidth: '400px',
                    marginBottom: '40px',
                    lineHeight: '1.6'
                }}>
                    {description}
                </p>
                <Link href={buttonLink}>
                    <button className="vintage-button" style={{
                        padding: '18px 40px',
                        boxShadow: '0 10px 30px rgba(193, 18, 31, 0.2)'
                    }}>
                        {buttonText}
                    </button>
                </Link>
            </ScrollReveal>
        </div>
    );
}
