import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkyBlock Premium Market - Minecraft Satış Platformu",
  description: "Minecraft SkyBlock sunucusu için premium VIP rank, kozmetik ürünler ve daha fazlası. Güvenli ödeme sistemi ve otomatik teslimat.",
  keywords: "Minecraft, SkyBlock, VIP, Market, Premium, Rank",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "SkyBlock Premium Market",
    description: "Minecraft sunucunuzun en iyi ürün platformu",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-zinc-50`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
