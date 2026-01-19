import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FindPG - India's Best PG Finder Platform",
  description: "Find your perfect PG accommodation in India. Verified listings, zero brokerage, safe and affordable PGs for boys and girls across major cities.",
  keywords: ["PG", "Paying Guest", "Accommodation", "Boys PG", "Girls PG", "Student Housing", "India"],
  authors: [{ name: "FindPG Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "FindPG - India's Best PG Finder Platform",
    description: "Find your perfect PG accommodation in India. Verified listings, zero brokerage, safe and affordable PGs.",
    url: "https://findpg.com",
    siteName: "FindPG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FindPG - India's Best PG Finder Platform",
    description: "Find your perfect PG accommodation in India. Verified listings, zero brokerage, safe and affordable PGs.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
