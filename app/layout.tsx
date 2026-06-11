import type {Metadata, Viewport} from 'next';
import './globals.css'; // Global styles
import { BottomNav } from '@/components/BottomNav';
import { Player } from '@/components/Player';
import { AddToPlaylistModal } from '@/components/AddToPlaylistModal';
import { PWARegister } from '@/components/PWARegister';
import { BackgroundProvider } from '@/components/BackgroundProvider';
// Kita hanya pakai ClerkProvider di tingkat layout utama
import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'Music App By Raizel', // Sudah saya ganti ke namamu
  description: 'Platform streaming musik modern',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Music App',
  },
  icons: {
    apple: 'https://f.top4top.io/p_3733w0g4e0.jpg',
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="text-white antialiased pb-24 min-h-screen" suppressHydrationWarning>
          <BackgroundProvider />
          <PWARegister />
          
          <main>
            {children}
          </main>

          <Player />
          <BottomNav />
          <AddToPlaylistModal />
        </body>
      </html>
    </ClerkProvider>
  );
}