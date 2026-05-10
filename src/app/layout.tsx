import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

// Site-wide default. The landing page inherits this; the legal pages
// (terms / privacy / etc.) override per page; the (dashboard) layout
// sets `document.title` at runtime to "Admin Console" so staff still
// see admin branding in the tab once they're signed in.
export const metadata: Metadata = {
  title: 'Zimo Live — Live audio rooms, gifts, and community',
  description:
    'Zimo Live is a live audio social app. Join voice rooms, send gifts, meet new people, and hang out with families on the go. Free on Google Play.',
  icons: {
    icon: '/zimolive-logo.webp',
    apple: '/zimolive-logo.webp',
  },
  openGraph: {
    title: 'Zimo Live — Live audio rooms, gifts, and community',
    description:
      'Join live voice rooms, send gifts, and meet new people. Free on Google Play.',
    type: 'website',
    siteName: 'Zimo Live',
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
