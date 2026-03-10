import type { Metadata } from 'next';
import './globals.css';
import { Instrument_Serif } from 'next/font/google';
import DemoBanner from '@/components/DemoBanner';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AutomateAI Suite',
  description: 'AIOS - Autonomous AI Agent Governance Dashboard',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={instrumentSerif.variable}>
      <body className="bg-mc-bg text-mc-text min-h-screen">
        <DemoBanner />
        {children}
      </body>
    </html>
  );
}
