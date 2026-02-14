import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Header from "@/components/Header";
import BreathingBackground from "@/components/ui/BreathingBackground";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NexLYN | Premium & Vintage Aesthetics",
  description: "Lüks cemiyetlerin dijital platformu. Vintage estetik ve premium deneyim.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <BreathingBackground />
        <Header />
        <div id="app" className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
