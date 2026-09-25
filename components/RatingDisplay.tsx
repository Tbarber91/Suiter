'use client';

import React from 'react';
import { Star, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Review } from '@/lib/types';
import { computeRatingStats } from '@/lib/transactions';

interface RatingDisplayProps {
  reviews?: Review[];
  fallbackRating?: number | null;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  showBreakdown?: boolean;
  className?: string;
}

export function RatingDisplay({
  reviews,
  fallbackRating = 5.0,
  size = 'md',
  showCount = true,
  showBreakdown = false,
  className = ''
}: RatingDisplayProps) {
  const stats = computeRatingStats(reviews, fallbackRating);

  const starSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-5 h-5'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm font-bold',
    lg: 'text-2xl font-display font-bold'
  };

  if (!showBreakdown) {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`${starSizes[size]} ${
                stats.average >= star
                  ? 'fill-amber-400 text-amber-400'
                  : stats.average >= star - 0.5
                  ? 'fill-amber-400/60 text-amber-400'
                  : 'fill-zinc-200 text-zinc-200'
              }`}
            />
          ))}
        </div>
        <span className={`${textSizes[size]} text-zinc-900`}>
          {stats.average.toFixed(1)}
        </span>
        {showCount && (
          <span className="text-xs text-zinc-500 font-medium">
            ({stats.count} {stats.count === 1 ? 'review' : 'reviews'})
          </span>
        )}
      </div>
    );
  }

  // Detailed breakdown view
  return (
    <div className={`p-6 rounded-3xl bg-zinc-50 border border-zinc-200/80 space-y-5 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-display font-black text-zinc-950 tracking-tight">
            {stats.average.toFixed(1)}
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    stats.average >= star
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-zinc-200 text-zinc-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-zinc-500 font-medium flex items-center gap-2">
              <span>Based on {stats.count} customer reviews</span>
              {stats.verifiedCount > 0 && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  {stats.verifiedCount} Verified Transactions
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">
            Customer Satisfaction
          </span>
          <span className="text-xl font-display font-black text-emerald-600">
            {stats.percentageBreakdown[5] + stats.percentageBreakdown[4]}% Positive
          </span>
        </div>
      </div>

      {/* Progress Bars for 5, 4, 3, 2, 1 Stars */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((stars) => {
          const pct = stats.percentageBreakdown[stars] || 0;
          const count = stats.breakdown[stars] || 0;
          return (
            <div key={stars} className="flex items-center gap-3 text-xs">
              <span className="w-12 font-bold text-zinc-700 flex items-center gap-1 shrink-0">
                {stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </span>
              <div className="flex-1 h-2.5 rounded-full bg-zinc-200 overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-12 text-right font-mono text-zinc-500 shrink-0">
                {pct}% ({count})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
