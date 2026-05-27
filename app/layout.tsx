import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { APP_URL } from '@/lib/env';
import ClientConsoleFilter from '@/components/ClientConsoleFilter';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'LeetLens — Behavioral Analyzer',
  description: 'Discover your coding psychology. Deep behavioral insights from your LeetCode history.',
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: 'LeetLens — Behavioral Analyzer',
    description: 'Discover your coding psychology. Deep behavioral insights from your LeetCode history.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClientConsoleFilter />
        {children}
      </body>
    </html>
  );
}
