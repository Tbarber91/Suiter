'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Figma, 
  Grid, 
  Layout, 
  Eye, 
  Layers, 
  Smartphone, 
  Monitor, 
  Tablet, 
  BookOpen, 
  Calendar, 
  FileText, 
  Mail, 
  Users, 
  LogIn, 
  Store,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { DirectoryModal } from './DirectoryModal';
import { InstantBookingModal } from './InstantBookingModal';
import { BusinessCollateralModal } from './BusinessCollateralModal';
import { AdvertisingDirectMailModal } from './AdvertisingDirectMailModal';
import { StaffManagementModal } from './StaffManagementModal';
import { AuthLandingModal } from './AuthLandingModal';
import { BusinessProfileModal } from './BusinessProfileModal';
import { SubscriptionAndDeploymentModal } from './SubscriptionAndDeploymentModal';
import { CreditCard, Rocket } from 'lucide-react';

interface FigmaDesignToolbarProps {
  onToggleGrid?: (enabled: boolean) => void;
  gridEnabled?: boolean;
}

export function FigmaDesignToolbar({ onToggleGrid, gridEnabled = false }: FigmaDesignToolbarProps) {
  const [activeFrame, setActiveFrame] = useState('Marketplace Canvas');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <>
      {/* Floating Figma Toolbar */}
      <nav aria-label="Figma Design Controls" className="fixed top-20 left-1/2 -translate-x-1/2 z-40 max-w-[95vw] pointer-events-none transition-all duration-300">
        <div className="bg-zinc-900/95 backdrop-blur-xl text-white rounded-full p-1.5 shadow-2xl border border-white/10 flex items-center gap-1.5 pointer-events-auto ring-1 ring-black/20 text-xs">
          {/* Brand Icon */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full font-mono text-[11px] font-bold text-zinc-200">
            <svg className="w-3.5 h-3.5" viewBox="0 0 38 57" fill="none">
              <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
              <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
              <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
              <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
              <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
            </svg>
            <span className="hidden sm:inline">Figma Flow</span>
          </div>

          <div className="w-px h-5 bg-white/10 mx-0.5" />

          {/* Quick Flow Triggers */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-[50vw] sm:max-w-none scrollbar-none py-0.5">
            {/* Directory Trigger */}
            <DirectoryModal
              trigger={
                <button 
                  onClick={() => setActiveFrame('Yellow & White Directory')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/10 text-[11px] font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Directory</span>
                </button>
              }
            />

            {/* Instant Bookings Trigger */}
            <InstantBookingModal
              trigger={
                <button 
                  onClick={() => setActiveFrame('Instant Bookings Engine')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/10 text-[11px] font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Instant Bookings</span>
                </button>
              }
            />

            {/* Collateral Studio */}
            <BusinessCollateralModal
              trigger={
                <button 
                  onClick={() => setActiveFrame('Collateral Studio')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/10 text-[11px] font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden md:inline">Collateral (Cards & Invoices)</span>
                  <span className="md:hidden">Invoices</span>
                </button>
              }
            />

            {/* Direct Mail & Letterbox Drop */}
            <AdvertisingDirectMailModal
              trigger={
                <button 
                  onClick={() => setActiveFrame('Letterbox Drops & SEO')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/10 text-[11px] font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Mail className="w-3.5 h-3.5 text-pink-400" />
                  <span className="hidden lg:inline">Letterbox Drops</span>
                </button>
              }
            />

            {/* Staff Database */}
            <StaffManagementModal
              trigger={
                <button 
                  onClick={() => setActiveFrame('Staff Database')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/10 text-[11px] font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Users className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden lg:inline">Staff Roster</span>
                </button>
              }
            />

            {/* Business Profile Studio */}
            <BusinessProfileModal
              trigger={
                <button 
                  onClick={() => setActiveFrame('Business Profile')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/10 text-[11px] font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Store className="w-3.5 h-3.5 text-purple-400" />
                  <span className="hidden xl:inline">Pro Profile</span>
                </button>
              }
            />

            {/* Subscriptions & Deployment Pipeline */}
            <SubscriptionAndDeploymentModal
              initialTab="subscriptions"
              trigger={
                <button 
                  onClick={() => setActiveFrame('Subscription Fees')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/10 text-[11px] font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden xl:inline">Subscriptions</span>
                </button>
              }
            />

            <SubscriptionAndDeploymentModal
              initialTab="bootp"
              trigger={
                <button 
                  onClick={() => setActiveFrame('Deployment & BootP Enclave')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/20 hover:bg-indigo-500/30 text-[11px] font-bold text-indigo-300 transition-colors cursor-pointer whitespace-nowrap border border-indigo-500/30"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  <span>BootP & Deploy</span>
                </button>
              }
            />

            {/* Sign In & Log In Landing Page */}
            <AuthLandingModal
              trigger={
                <button 
                  onClick={() => setActiveFrame('Auth Landing Page')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-[11px] font-bold text-emerald-300 transition-colors cursor-pointer whitespace-nowrap border border-emerald-500/30"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In Landing</span>
                </button>
              }
            />
          </div>

          <div className="w-px h-5 bg-white/10 mx-0.5 hidden sm:block" />

          {/* Grid Toggle */}
          <button
            type="button"
            onClick={() => onToggleGrid && onToggleGrid(!gridEnabled)}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              gridEnabled ? 'bg-emerald-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
            title="Toggle 8pt Baseline Grid Overlay"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* 8pt Grid Overlay (when enabled) */}
      {gridEnabled && (
        <div 
          className="fixed inset-0 pointer-events-none z-30 opacity-15"
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: '16px 16px'
          }}
        />
      )}
    </>
  );
}
