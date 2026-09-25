'use client';

import React, { useState } from 'react';
import { Mic, MicOff, X, AlertCircle, Sparkles, Check, Radio } from 'lucide-react';
import { useVoiceSearch } from '@/hooks/useVoiceSearch';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';

interface VoiceSearchButtonProps {
  onSearchChange: (keyword: string) => void;
  currentValue?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'input-inline' | 'standalone' | 'header';
  className?: string;
  suggestedKeywords?: string[];
}

export function VoiceSearchButton({
  onSearchChange,
  currentValue = '',
  size = 'default',
  variant = 'input-inline',
  className = '',
  suggestedKeywords = ['Kitchen Renovations', 'Toyota Hybrid', 'Solar Panel', 'Adelaide CBD', 'Unley'],
}: VoiceSearchButtonProps) {
  const [showHelperModal, setShowHelperModal] = useState(false);

  const {
    isListening,
    isSupported,
    interimTranscript,
    errorMessage,
    startListening,
    stopListening,
    toggleListening,
    clearError,
  } = useVoiceSearch({
    onResult: (spokenText) => {
      if (spokenText) {
        onSearchChange(spokenText);
      }
    },
  });

  const handleMicClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSupported) {
      setShowHelperModal(true);
      return;
    }
    toggleListening();
  };

  const handleSelectKeyword = (keyword: string) => {
    onSearchChange(keyword);
    if (isListening) {
      stopListening();
    }
  };

  const buttonSizeClasses = {
    sm: 'w-7 h-7 text-xs',
    default: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    default: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {/* Microphone Trigger Button */}
      <button
        type="button"
        id={`voice-search-trigger-${variant}`}
        onClick={handleMicClick}
        aria-label={isListening ? 'Stop voice search' : 'Search by voice'}
        title={
          !isSupported
            ? 'Voice search not supported in this browser'
            : isListening
            ? 'Listening... Click to stop'
            : 'Voice search (tap to speak keywords)'
        }
        className={`relative flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer ${buttonSizeClasses} ${
          isListening
            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-105 animate-pulse'
            : 'text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50/80 active:scale-95'
        } ${!isSupported ? 'opacity-40 cursor-not-allowed hover:bg-transparent hover:text-zinc-400' : ''}`}
      >
        {isListening ? (
          <div className="relative flex items-center justify-center">
            {/* Animated pulsing wave rings */}
            <span className="absolute -inset-1 rounded-xl bg-rose-400 opacity-60 animate-ping" />
            <Mic className={`${iconSizes} relative z-10 text-white`} />
          </div>
        ) : (
          <Mic className={`${iconSizes} transition-transform hover:scale-110`} />
        )}
      </button>

      {/* Active Listening Floating Banner & Visualizer */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full right-0 mt-3 z-50 w-72 sm:w-80 rounded-2xl bg-white border border-zinc-200 shadow-2xl p-4 text-left overflow-hidden backdrop-blur-md"
            style={{ minWidth: '280px' }}
          >
            {/* Header / Status */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
                </span>
                <span className="text-xs font-bold text-zinc-900 tracking-tight flex items-center gap-1.5">
                  Listening to Voice Search...
                </span>
              </div>
              <button
                type="button"
                onClick={stopListening}
                className="w-6 h-6 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 flex items-center justify-center transition-colors cursor-pointer"
                title="Stop listening"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Audio Wave Visualizer Bars */}
            <div className="flex items-center justify-center gap-1.5 my-3 h-8 bg-zinc-50 rounded-xl px-3 border border-zinc-100">
              <motion.div
                animate={{ height: ['8px', '24px', '12px', '28px', '8px'] }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
                className="w-1.5 bg-rose-500 rounded-full"
              />
              <motion.div
                animate={{ height: ['14px', '6px', '24px', '16px', '14px'] }}
                transition={{ repeat: Infinity, duration: 0.7, delay: 0.1, ease: 'easeInOut' }}
                className="w-1.5 bg-indigo-600 rounded-full"
              />
              <motion.div
                animate={{ height: ['24px', '12px', '32px', '18px', '24px'] }}
                transition={{ repeat: Infinity, duration: 0.9, delay: 0.15, ease: 'easeInOut' }}
                className="w-1.5 bg-violet-600 rounded-full"
              />
              <motion.div
                animate={{ height: ['16px', '28px', '8px', '22px', '16px'] }}
                transition={{ repeat: Infinity, duration: 0.75, delay: 0.2, ease: 'easeInOut' }}
                className="w-1.5 bg-rose-500 rounded-full"
              />
              <motion.div
                animate={{ height: ['8px', '20px', '14px', '26px', '8px'] }}
                transition={{ repeat: Infinity, duration: 0.85, delay: 0.05, ease: 'easeInOut' }}
                className="w-1.5 bg-indigo-500 rounded-full"
              />
            </div>

            {/* Live Transcript Feedback */}
            <div className="min-h-[44px] flex items-center justify-center px-3 py-2 bg-zinc-50/80 rounded-xl border border-zinc-100/80 text-center">
              {interimTranscript || currentValue ? (
                <p className="text-xs font-semibold text-zinc-900 break-words">
                  &ldquo;<span className="text-indigo-600">{interimTranscript || currentValue}</span>&rdquo;
                  <span className="inline-block w-1.5 h-3.5 ml-1 bg-rose-500 animate-pulse align-middle" />
                </p>
              ) : (
                <p className="text-xs text-zinc-400 italic">
                  Say keywords, trades, vehicle models, or suburbs...
                </p>
              )}
            </div>

            {/* Suggested Spoken Phrases */}
            <div className="mt-3 pt-2 border-t border-zinc-100">
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Try speaking:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {suggestedKeywords.slice(0, 4).map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => handleSelectKeyword(kw)}
                    className="text-[10px] font-medium bg-zinc-100 hover:bg-indigo-50 hover:text-indigo-600 text-zinc-600 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="text-[10px] text-zinc-400">
                Filters listings in real-time
              </span>
              <Button
                type="button"
                size="sm"
                onClick={stopListening}
                className="h-7 text-xs rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white px-3 font-semibold cursor-pointer"
              >
                <Check className="w-3 h-3 mr-1" />
                Done
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Tooltip */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute top-full right-0 mt-2 z-50 w-72 rounded-xl bg-rose-50 border border-rose-200 p-3 text-left shadow-lg text-rose-800 text-xs"
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-rose-900">Voice Search Notice</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-rose-700">{errorMessage}</p>
              </div>
              <button
                type="button"
                onClick={clearError}
                className="text-rose-400 hover:text-rose-700 p-0.5 rounded cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Browser Support Fallback Modal */}
      <AnimatePresence>
        {showHelperModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-zinc-100 text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <MicOff className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">Voice Search Browser Support</h3>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                The browser SpeechRecognition API is supported natively in Google Chrome, Microsoft Edge, and Safari.
                If you are using Firefox or an unsupported WebView, you can type your keywords directly into the search bar.
              </p>
              <div className="mt-5 flex justify-end">
                <Button
                  onClick={() => setShowHelperModal(false)}
                  className="rounded-xl h-10 px-4 text-xs font-bold bg-zinc-900 text-white cursor-pointer"
                >
                  Got it
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
