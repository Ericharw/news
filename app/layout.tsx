import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NEWS - NAC Early Warning System | PT PLN (Persero)",
  description: "NEWS (NAC Early Warning System) - Sistem Manajemen Kegiatan & Diklat PT PLN (Persero)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#F1F5F9] text-slate-800 selection:bg-[#00A3E0] selection:text-white font-sans"
      >
        {children}
      </body>
    </html>
  );
}
