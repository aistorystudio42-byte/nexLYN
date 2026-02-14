import styles from "./LuxButton.module.css";

interface LuxButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export default function LuxButton({
    children,
    className,
    ...props
}: LuxButtonProps) {
    return (
        <button className={`${styles.button} ${className || ""}`} {...props}>
            {children}
        </button>
    );
}
