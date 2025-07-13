import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
// Custom Providers
import { AppProvider } from '@/components/providers/appProvider';
// UI Components
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'AspAIre',
  description: 'Your AI-powered career and job search assistant.',
  icons: {
    icon: [
      { url: '/assets/icons/favicon.ico' }, // Default favicon
      { url: '/assets/icons/favicon.svg', type: 'image/svg+xml' },
      { url: '/assets/icons/favicon-96x96.png', sizes: '96x96' },
    ],
    apple: [{ url: '/assets/icons/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/manifest/site.webmanifest',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppProvider>
          <div className='flex flex-col h-screen overflow-x-hidden'>
            {/* Header */}
            <Header />
            {/* Main content */}
            <main className='flex-grow overflow-y-auto'>
              <section className='container h-full'>{children}</section>
            </main>
            {/* Footer */}
            <Footer />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
