import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
// Custom Providers
import { ThemeProvider } from '@/components/providers/themeProvider';
// UI Components
import { Header } from '@/components/ui/header';

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
  manifest: '/assets/icons/site.webmanifest',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem={true} disableTransitionOnChange={true}>
          <Header />
          {/* Main content */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
