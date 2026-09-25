'use client';

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Award, Sparkles, ShieldCheck, CheckCircle2, ChevronRight, Zap, Star } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface UserLoyaltyBadgeProps {
  initialBookings?: number;
  onBookingsChange?: (count: number) => void;
  compact?: boolean;
}

interface LoyaltyTier {
  id: string;
  name: string;
  minBookings: number;
  nextTierBookings: number;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  ringColor: string;
  bgGlow: string;
  textColor: string;
  perks: string[];
}

const TIERS: LoyaltyTier[] = [
  {
    id: 'bronze',
    name: 'Bronze Explorer',
    minBookings: 0,
    nextTierBookings: 5,
    color: '#d97706',
    gradientFrom: '#b45309',
    gradientTo: '#d97706',
    ringColor: '#f59e0b',
    bgGlow: 'rgba(245, 158, 11, 0.12)',
    textColor: 'text-amber-700',
    perks: ['Verified Member Crest', 'Standard Map Listing', 'In-App Direct Messaging']
  },
  {
    id: 'silver',
    name: 'Silver Artisan',
    minBookings: 5,
    nextTierBookings: 10,
    color: '#64748b',
    gradientFrom: '#475569',
    gradientTo: '#94a3b8',
    ringColor: '#38bdf8',
    bgGlow: 'rgba(56, 189, 248, 0.12)',
    textColor: 'text-sky-700',
    perks: ['Priority Map Pinning', '50% Reduced Platform Fee', 'Silver Shield Profile Badge']
  },
  {
    id: 'gold',
    name: 'Gold Ambassador',
    minBookings: 10,
    nextTierBookings: 20,
    color: '#eab308',
    gradientFrom: '#ca8a04',
    gradientTo: '#facc15',
    ringColor: '#eab308',
    bgGlow: 'rgba(234, 179, 8, 0.15)',
    textColor: 'text-yellow-700',
    perks: ['Zero Service Commission', 'Top-Row Search Spotlight', 'Instant Auto-Booking Authorization']
  },
  {
    id: 'platinum',
    name: 'Platinum Sovereign',
    minBookings: 20,
    nextTierBookings: 20, // Max tier
    color: '#818cf8',
    gradientFrom: '#6366f1',
    gradientTo: '#a855f7',
    ringColor: '#818cf8',
    bgGlow: 'rgba(129, 140, 248, 0.18)',
    textColor: 'text-indigo-700',
    perks: ['Exclusive Concierge Escrow', 'Perpetual Top Spotlight', 'Unlimited Multi-Portal Syndication']
  }
];

export function UserLoyaltyBadge({
  initialBookings = 7,
  onBookingsChange,
  compact = false
}: UserLoyaltyBadgeProps) {
  // Load saved bookings from localStorage or default
  const [bookings, setBookings] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('suiter_user_loyalty_bookings');
      if (saved) return parseInt(saved, 10);
    }
    return initialBookings;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('suiter_user_loyalty_bookings', bookings.toString());
    }
    onBookingsChange?.(bookings);
  }, [bookings, onBookingsChange]);

  // Determine current tier
  const currentTier = [...TIERS].reverse().find(t => bookings >= t.minBookings) || TIERS[0];
  const nextTier = TIERS[TIERS.indexOf(currentTier) + 1] || null;

  // Calculate progress toward next tier
  const isMaxTier = !nextTier;
  const currentLevelBase = currentTier.minBookings;
  const nextLevelTarget = nextTier ? nextTier.minBookings : currentTier.minBookings;
  const neededForLevel = nextLevelTarget - currentLevelBase;
  const currentInLevel = bookings - currentLevelBase;
  const progressPercent = isMaxTier ? 100 : Math.min(100, Math.round((currentInLevel / neededForLevel) * 100));

  // Data for Recharts donut/ring
  const ringData = [
    { name: 'Completed', value: progressPercent, fill: currentTier.ringColor },
    { name: 'Remaining', value: Math.max(0, 100 - progressPercent), fill: '#f1f5f9' }
  ];

  const handleIncrement = () => {
    setBookings(prev => prev + 1);
  };

  const handleReset = () => {
    setBookings(0);
  };

  if (compact) {
    return (
      <div 
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl border shadow-xs transition-all"
        style={{ backgroundColor: currentTier.bgGlow, borderColor: currentTier.color + '40' }}
      >
        <div className="relative w-8 h-8 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ringData}
                dataKey="value"
                innerRadius={10}
                outerRadius={14}
                startAngle={90}
                endAngle={-270}
                stroke="none"
                isAnimationActive={true}
              >
                {ringData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <Award className="w-3.5 h-3.5 absolute text-zinc-900" style={{ color: currentTier.color }} />
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] font-black tracking-wider uppercase text-zinc-900 leading-none">
            {currentTier.name}
          </span>
          <span className="text-[9px] text-zinc-500 font-semibold font-mono mt-0.5">
            {bookings} {bookings === 1 ? 'Booking' : 'Bookings'} ({progressPercent}%)
          </span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="p-5 md:p-6 rounded-3xl border transition-all duration-300 shadow-sm relative overflow-hidden"
      style={{ backgroundColor: currentTier.bgGlow, borderColor: currentTier.color + '40' }}
    >
      {/* Background Accent Glow */}
      <div 
        className="absolute -right-12 -top-12 w-44 h-44 rounded-full opacity-40 blur-3xl pointer-events-none"
        style={{ backgroundColor: currentTier.ringColor }}
      />

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left: Recharts Animated Progress Ring & Tier Emblem */}
        <div className="flex items-center gap-5">
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ringData}
                  dataKey="value"
                  innerRadius={36}
                  outerRadius={45}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={0}
                  stroke="none"
                  isAnimationActive={true}
                  animationDuration={1000}
                >
                  {ringData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Inner Ring Badge Emblem */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <Award className="w-6 h-6" style={{ color: currentTier.color }} />
              <span className="text-[11px] font-black text-zinc-900 font-mono mt-0.5">
                {progressPercent}%
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge 
                className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 border-0 shadow-xs"
                style={{ backgroundColor: currentTier.color, color: '#ffffff' }}
              >
                <Sparkles className="w-2.5 h-2.5 mr-1 inline" />
                Loyalty Tier
              </Badge>
              <span className="text-[10px] font-mono font-bold text-zinc-500">
                {bookings} Total Bookings
              </span>
            </div>

            <h4 className="text-xl font-display font-black text-zinc-900 tracking-tight">
              {currentTier.name}
            </h4>

            <p className="text-xs text-zinc-600 font-medium">
              {isMaxTier ? (
                <span className="font-bold text-emerald-700">★ Maximum Sovereign Tier Unlocked!</span>
              ) : (
                <>
                  <span className="font-bold text-zinc-900">{nextLevelTarget - bookings} more bookings</span> to unlock{' '}
                  <span className="font-bold" style={{ color: nextTier?.color }}>{nextTier?.name}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Right: Booking Action Simulator / Verification */}
        <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
          <Button
            type="button"
            onClick={handleIncrement}
            size="sm"
            className="rounded-xl h-10 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Complete Booking (Level Up)</span>
          </Button>

          {bookings > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="text-[10px] text-zinc-400 hover:text-zinc-600 font-bold underline cursor-pointer"
            >
              Reset simulator
            </button>
          )}
        </div>
      </div>

      {/* Perks Checklist */}
      <div className="mt-5 pt-4 border-t border-zinc-200/60 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        {currentTier.perks.map((perk, idx) => (
          <div key={idx} className="flex items-center gap-1.5 text-zinc-700 font-medium bg-white/70 px-3 py-1.5 rounded-xl border border-zinc-200/50">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="text-[11px] truncate">{perk}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
