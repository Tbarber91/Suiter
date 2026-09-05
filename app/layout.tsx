import type { Metadata } from 'next';
import './globals.css';
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Suiter Marketplace',
  description: 'Premium Marketplace for Ads, Services, and E-commerce',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans antialiased", inter.variable, display.variable, mono.variable)}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
