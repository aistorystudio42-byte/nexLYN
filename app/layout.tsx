import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/site/Header";
import Background from "@/components/site/Background";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
    title: "nexLYN | Zihnin Arşivine Yolculuk",
    description: "Düşüncelerin fısıldandığı, keşiflerin sanata dönüştüğü bir dijital akademi.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="tr">
            <body className={`${inter.variable} ${playfair.variable} antialiased selection:bg-bronze/30 selection:text-ivory`}>
                <Background />
                <Header />
                <main className="min-h-screen reveal-up">
                    {children}
                </main>
            </body>
        </html>
    );
}
