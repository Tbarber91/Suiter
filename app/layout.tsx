import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#09090b',
};

export const metadata: Metadata = {
  title: 'Suiter Marketplace',
  description: 'Enterprise marketplace and Apple advertising media management platform featuring total budget controls, instant payout disbursements, and automated invoicing.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SUITER',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'Suiter Marketplace',
    description: 'Enterprise marketplace and Apple advertising media management platform featuring total budget controls, instant payout disbursements, and automated invoicing.',
    siteName: 'SUITER',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans antialiased overflow-x-hidden max-w-full w-full", inter.variable, display.variable, mono.variable)}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SUITER" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body suppressHydrationWarning className="overflow-x-hidden max-w-full w-full min-h-screen pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">{children}</body>
    </html>
  );
}
