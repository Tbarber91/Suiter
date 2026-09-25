'use client';

import React, { useState } from 'react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { PriceHistoryPoint } from '@/lib/types';

interface PriceTrendSparklineProps {
  history?: number[] | PriceHistoryPoint[];
  currentPriceDisplay?: string;
  className?: string;
  width?: number;
  height?: number;
  showBadge?: boolean;
}

export function PriceTrendSparkline({
  history,
  currentPriceDisplay,
  className = '',
  width = 72,
  height = 24,
  showBadge = true,
}: PriceTrendSparklineProps) {
  const [isHovered, setIsHovered] = useState(false);
  const rawId = React.useId();
  const id = rawId.replace(/:/g, '_');

  if (!history || history.length < 2) {
    return null;
  }

  // Normalize points to numbers & labels
  const points: { price: number; date?: string }[] = history.map((item, idx) => {
    if (typeof item === 'number') {
      return { price: item, date: `T-${history.length - 1 - idx}` };
    }
    return { price: item.price, date: item.date || `T-${history.length - 1 - idx}` };
  });

  const numericPrices = points.map(p => p.price);
  const firstPrice = numericPrices[0];
  const lastPrice = numericPrices[numericPrices.length - 1];
  const min = Math.min(...numericPrices);
  const max = Math.max(...numericPrices);
  const diff = lastPrice - firstPrice;
  const percentChange = firstPrice !== 0 ? (diff / firstPrice) * 100 : 0;

  const isDrop = diff < 0;
  const isRise = diff > 0;
  const isFlat = diff === 0;

  // Colors based on consumer sentiment:
  // Price drop is favorable (emerald/green)
  // Price rise is alert (rose/amber)
  // Flat is neutral (zinc)
  const strokeColor = isDrop ? '#10b981' : isRise ? '#f59e0b' : '#71717a';
  const fillColor = isDrop ? 'rgba(16, 185, 129, 0.15)' : isRise ? 'rgba(245, 158, 11, 0.15)' : 'rgba(113, 113, 122, 0.12)';
  const badgeBg = isDrop ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70' : isRise ? 'bg-amber-50 text-amber-700 border-amber-200/70' : 'bg-zinc-50 text-zinc-600 border-zinc-200';

  // SVG coordinates calculation
  const paddingX = 4;
  const paddingY = 3;
  const range = max - min || 1;
  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingY * 2;

  const svgCoords = points.map((p, idx) => {
    const x = paddingX + (idx / (points.length - 1)) * usableWidth;
    const y = height - paddingY - ((p.price - min) / range) * usableHeight;
    return { x, y };
  });

  const pathD = svgCoords.reduce((acc, coord, idx) => {
    return idx === 0 ? `M ${coord.x.toFixed(1)} ${coord.y.toFixed(1)}` : `${acc} L ${coord.x.toFixed(1)} ${coord.y.toFixed(1)}`;
  }, '');

  const areaD = `${pathD} L ${svgCoords[svgCoords.length - 1].x.toFixed(1)} ${height} L ${svgCoords[0].x.toFixed(1)} ${height} Z`;

  const lastCoord = svgCoords[svgCoords.length - 1];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div
      id={`sparkline-container-${id}`}
      className={`relative inline-flex items-center gap-1.5 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => e.stopPropagation()}
    >
      {/* SVG Sparkline */}
      <div className="relative flex items-center justify-center">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible select-none"
        >
          <defs>
            <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDrop ? '#10b981' : isRise ? '#f59e0b' : '#71717a'} stopOpacity="0.3" />
              <stop offset="100%" stopColor={isDrop ? '#10b981' : isRise ? '#f59e0b' : '#71717a'} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          {/* Shaded Area Under Curve */}
          <path d={areaD} fill={`url(#grad-${id})`} />
          {/* Trend Line */}
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Terminal Data Point */}
          <circle
            cx={lastCoord.x}
            cy={lastCoord.y}
            r="2.5"
            fill={strokeColor}
            className="animate-pulse"
          />
        </svg>
      </div>

      {/* Badge showing trend % */}
      {showBadge && (
        <span
          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-extrabold border ${badgeBg} shadow-2xs whitespace-nowrap`}
          title={`Price trend: ${percentChange > 0 ? '+' : ''}${percentChange.toFixed(1)}%`}
        >
          {isDrop ? (
            <TrendingDown className="w-2.5 h-2.5 stroke-[2.5]" />
          ) : isRise ? (
            <TrendingUp className="w-2.5 h-2.5 stroke-[2.5]" />
          ) : (
            <Minus className="w-2.5 h-2.5 stroke-[2.5]" />
          )}
          <span>
            {Math.abs(percentChange).toFixed(1)}%
          </span>
        </span>
      )}

      {/* Rich hover tooltip detailing historical trend */}
      {isHovered && (
        <div 
          className="absolute bottom-full left-0 mb-2 z-50 p-2.5 bg-zinc-900 text-white rounded-xl shadow-xl text-left border border-zinc-700/60 pointer-events-none w-48 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Price Trend</span>
            <span className={`text-[10px] font-black flex items-center gap-0.5 ${isDrop ? 'text-emerald-400' : isRise ? 'text-amber-400' : 'text-zinc-300'}`}>
              {isDrop ? 'Price Drop' : isRise ? 'Price Rise' : 'Steady'} ({percentChange > 0 ? '+' : ''}{percentChange.toFixed(1)}%)
            </span>
          </div>
          
          <div className="flex justify-between items-center text-[11px] mb-1">
            <span className="text-zinc-400">Initial:</span>
            <span className="font-semibold">{formatCurrency(firstPrice)}</span>
          </div>
          <div className="flex justify-between items-center text-[11px] mb-1">
            <span className="text-zinc-400">Current:</span>
            <span className="font-black text-white">{formatCurrency(lastPrice)}</span>
          </div>
          
          <div className="text-[9px] text-zinc-400 mt-1 pt-1 border-t border-zinc-800 flex justify-between">
            <span>Range: {formatCurrency(min)} - {formatCurrency(max)}</span>
            <span>{points.length} checks</span>
          </div>
        </div>
      )}
    </div>
  );
}
