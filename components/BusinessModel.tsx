import styles from './BusinessModel.module.css';

interface PricingCardProps {
    type: string;
    price: string;
}

const PricingCard = ({ type, price }: PricingCardProps) => (
    <div className={styles.pricingCard}>
        <div className={styles.cardHeader}>
            <div className={styles.premiumBadge}>LUXURY</div>
            <h3 className={styles.cardTitle}>{type}</h3>
        </div>
        <div className={styles.cardBody}>
            <span className={styles.priceLabel}>Aylık Abonelik</span>
            <div className={styles.priceValue}>
                <span className={styles.currency}>TL</span>
                <span className={styles.amount}>{price}</span>
            </div>
        </div>
        <div className={styles.cardFooter}>
            <ul className={styles.features}>
                <li>Özel Modüller</li>
                <li>Sınırsız Üye</li>
                <li>7/24 Teknik Destek</li>
            </ul>
        </div>
    </div>
);

export default function BusinessModel() {
    const clubTypes = [
        { type: 'Ticaret/Ürün Kulübü', price: '[FİYAT GİRİLECEK]' },
        { type: 'Oyun/E-Spor Kulübü', price: '[FİYAT GİRİLECEK]' },
        { type: 'Akademi/Eğitim Kulübü', price: '[FİYAT GİRİLECEK]' },
        { type: 'Eğlence/Hobi Kulübü', price: '[FİYAT GİRİLECEK]' },
        { type: 'Kurumsal/Tanıtım Kulübü', price: '[FİYAT GİRİLECEK]' },
    ];

    return (
        <section className={styles.businessSection}>
            <div className={styles.parchmentOverlay}></div>
            <div className={styles.container}>
                {/* Bölüm 1 & 2: Cemiyetini Kur & Talimat Akışı */}
                <div className={styles.introHeader}>
                    <h2 className={styles.mainTitle}>Kendi Kulübünüzü Kurun</h2>
                    <p className={styles.subtitle}>
                        Hayalinizdeki topluluğu gerçeğe dönüştürün. Profesyonel altyapımızla cemiyetinizi yönetmeye başlayın.
                    </p>
                </div>

                <div className={styles.stepsFlow}>
                    <div className={styles.step}>
                        <div className={styles.iconCircle}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 9h16" /><path d="M4 15h16" /><path d="M10 3L8 21" /><path d="M16 3l-2 18" />
                            </svg>
                        </div>
                        <h4>1. Türünü Seç</h4>
                        <p>İşletmenize veya topluluğunuza en uygun kulüp modelini belirleyin.</p>
                    </div>
                    <div className={styles.stepConnector}></div>
                    <div className={styles.step}>
                        <div className={styles.iconCircle}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" />
                            </svg>
                        </div>
                        <h4>2. Bize Ulaş</h4>
                        <p>Zarif bir iletişimle ihtiyaçlarınızı anlayalım ve kurulumu başlatalolın.</p>
                    </div>
                    <div className={styles.stepConnector}></div>
                    <div className={styles.step}>
                        <div className={styles.iconCircle}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="3" y1="9" x2="21" y2="9" />
                            </svg>
                        </div>
                        <h4>3. Cemiyetini Yönet</h4>
                        <p>Dijital dünyadaki elit kulübünüzün kontrolünü elinize alın.</p>
                    </div>
                </div>

                <p className={styles.communicationNote}>
                    * Süreç, en yüksek kaliteyi sağlamak adına ekibimizle birebir iletişim kurularak manuel olarak yürütülmektedir.
                </p>

                {/* Bölüm 3: Abonelik Fiyatlandırma Tablosu */}
                <div className={styles.pricingGrid}>
                    {clubTypes.map((item, index) => (
                        <PricingCard key={index} type={item.type} price={item.price} />
                    ))}
                </div>

                {/* Bölüm 4: Dinamik E-Posta Butonu */}
                <div className={styles.ctaWrapper}>
                    <a
                        href="mailto:nexlyn@outlook.com?subject=Yeni Kulüp Kurulum Talebi&body=Adım Soyadım:%0D%0Aİstediğim Kulüp Türü:%0D%0Aİletişim Numaram:"
                        className={styles.megaButton}
                    >
                        Kurulum Talebi Gönder
                    </a>
                </div>
            </div>
        </section>
    );
}
