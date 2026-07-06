import React from 'react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Oblivion Spell Altar',
  description:
    "Craft powerful custom spells with ease using this Oblivion Spell Calculator. Whether you're min-maxing your magic or experimenting with creative effects, this tool helps you visualize magicka costs, durations, and effect stacking - all within the constraints of the game's enchanting system.",
  openGraph: {
    title: 'Oblivion Spell Altar',
    description:
      "Craft powerful custom spells with ease using this Oblivion Spell Calculator. Whether you're min-maxing your magic or experimenting with creative effects, this tool helps you visualize magicka costs, durations, and effect stacking - all within the constraints of the game's enchanting system.",
    url: 'https://spells.oblivion.tools',
    siteName: 'Oblivion Spell Altar',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oblivion Spell Altar',
    description:
      "Craft powerful custom spells with ease using this Oblivion Spell Calculator. Whether you're min-maxing your magic or experimenting with creative effects, this tool helps you visualize magicka costs, durations, and effect stacking - all within the constraints of the game's enchanting system.",
  },
  alternates: {
    canonical: 'https://spells.oblivion.tools',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#1e1e1e',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body id="root" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
