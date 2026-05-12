import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Outfit } from 'next/font/google';
import './globals.css';
import RegisterSW from '@/components/RegisterSW';
import { AuthProvider } from '@/contexts/AuthContext';
import LayoutShell from '@/components/LayoutShell';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
const outfit = Outfit({ variable: '--font-outfit', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AeroCare | Emergency Medical Response',
  description:
    'AeroCare is a real-time emergency medical response platform. Dispatch ambulances, find CPR volunteers, locate hospitals, and save lives.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'AeroCare' },
  icons: { icon: '/icon-192.png', apple: '/icon-512.png' },
};

export const viewport: Viewport = {
  themeColor: '#EF4444',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} h-full`}>
      <head>
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <AuthProvider>
          <LayoutShell>{children}</LayoutShell>
          <RegisterSW />
        </AuthProvider>
      </body>
    </html>
  );
}
