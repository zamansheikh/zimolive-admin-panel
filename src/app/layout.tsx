import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Zimo Live — Admin Console',
  description: 'Run gifts, users, agencies, and live moderation from one place.',
  icons: {
    icon: '/zimolive-logo.webp',
    apple: '/zimolive-logo.webp',
  },
};

export const viewport: Viewport = {
  themeColor: '#E91E63',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
