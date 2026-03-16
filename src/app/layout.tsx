import type { Metadata, Viewport } from 'next';
import { Outfit, Nunito } from 'next/font/google';
import QueryProvider from '@/lib/query-provider';
import ThemeApplier from '@/components/ui/ThemeApplier';
import ScrollToTop from '@/components/ui/ScrollToTop';
import './globals.css';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Recipe Note | 레시피 저장',
  description: 'AI로 정리하는 나만의 레시피 노트',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/raccoon/logo.svg',
    apple: '/icons/raccoon/logo.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Recipe Note',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${outfit.variable} ${nunito.variable} antialiased`}>
        <QueryProvider>
          <ThemeApplier />
          <ScrollToTop />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
