import Image from "next/image";
import styles from "./VintageCard.module.css";

interface VintageCardProps {
    title: string;
    image: string;
    type: string;
}

export default function VintageCard({ title, image, type }: VintageCardProps) {
    return (
        <div className={`vintage-card ${styles.card}`}>
            <span className={styles.type}>{type}</span>
            <div className={styles.imageWrapper}>
                <Image
                    src={image}
                    alt={title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            <h3 className={styles.title}>{title}</h3>
        </div>
    );
}
