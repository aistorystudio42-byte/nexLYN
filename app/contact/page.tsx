import React from 'react';
import { getSiteSettings } from '@/app/actions/adminActions';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default async function ContactPage() {
    const settings = await getSiteSettings();

    return (
        <div style={{ padding: '120px 20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <ScrollReveal>
                <h1 style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: 'var(--h1)',
                    color: '#fff',
                    marginBottom: '20px',
                    letterSpacing: '-0.05em'
                }}>
                    Bize Ulaşın
                </h1>
                <div style={{
                    width: '60px',
                    height: '2px',
                    background: '#c1121f',
                    margin: '0 auto 40px'
                }} />
            </ScrollReveal>

            <ScrollReveal delay={200}>
                <p className="drop-cap" style={{
                    color: '#888',
                    fontSize: '1.2rem',
                    lineHeight: '1.8',
                    marginBottom: '60px',
                    textAlign: 'left'
                }}>
                    {settings?.welcome_message || 'NexLYN Enterprise ile hayalinizdeki cemiyeti gerçeğe dönüştürün. Sorularınız ve iş birliği talepleriniz için aşağıdaki kanallar üzerinden bizimle iletişime geçebilirsiniz.'}
                </p>
            </ScrollReveal>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                <ScrollReveal delay={400}>
                    <ContactCard
                        title="E-Posta"
                        value={settings?.contact_email || 'info@nexlyn.com'}
                        icon="✉️"
                        href={`mailto:${settings?.contact_email}`}
                    />
                </ScrollReveal>

                <ScrollReveal delay={600}>
                    <ContactCard
                        title="Instagram"
                        value="@nexlyn_social"
                        icon="📸"
                        href={settings?.instagram_url}
                    />
                </ScrollReveal>
            </div>

            {settings?.other_projects_url && (
                <ScrollReveal delay={800}>
                    <div style={{ marginTop: '80px' }}>
                        <a
                            href={settings.other_projects_url}
                            target="_blank"
                            style={{
                                color: '#bda061',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                                borderBottom: '1px solid #bda061',
                                paddingBottom: '4px'
                            }}
                        >
                            Diğer Projelerimizi Keşfedin →
                        </a>
                    </div>
                </ScrollReveal>
            )}
        </div>
    );
}

function ContactCard({ title, value, icon, href }: { title: string, value: string, icon: string, href?: string }) {
    const Content = () => (
        <div style={{
            background: '#080808',
            border: '1px solid #1a1a1a',
            padding: '40px',
            borderRadius: '12px',
            transition: 'all 0.5s ease',
            cursor: href ? 'pointer' : 'default',
        }} className="vintage-card">
            <div style={{ fontSize: '2.5rem', marginBottom: '20px', opacity: 0.8 }}>{icon}</div>
            <h3 style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>{title}</h3>
            <p style={{ fontSize: '1.1rem', color: '#fff', margin: 0 }}>{value}</p>
        </div>
    );

    if (href) return <a href={href} target="_blank" style={{ textDecoration: 'none' }}><Content /></a>;
    return <Content />;
}
