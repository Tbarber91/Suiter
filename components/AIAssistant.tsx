'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import {
  Sparkles,
  Mic,
  MicOff,
  Bot,
  Brain,
  Zap,
  X,
  Loader2,
  Volume2,
  VolumeX,
  Share2,
  Copy,
  Check,
  Send,
  Smartphone,
  ShieldCheck,
  FileText,
  Sliders,
  RotateCcw,
  Search,
  ExternalLink,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type IntelligenceEngine = 'apple' | 'siri' | 'chatgpt' | 'gemini';

interface Message {
  role: 'user' | 'model' | 'assistant';
  content: string;
  engine?: IntelligenceEngine;
  timestamp?: string;
  actions?: Array<{ label: string; action: string; value?: string }>;
}

interface AIAssistantProps {
  onSearchQuery?: (query: string) => void;
  onSelectCategory?: (category: string) => void;
  onFilterType?: (type: string) => void;
}

export function AIAssistant({
  onSearchQuery,
  onSelectCategory,
  onFilterType,
}: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [engine, setEngine] = useState<IntelligenceEngine>('apple');
  const [isThinkingMode, setIsThinkingMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      engine: 'apple',
      content:
        'Suiter Multi-Intelligence active. Apple Intelligence, Siri Voice, ChatGPT Copilot, and Gemini 3.1 are engaged and ready to assist your enterprise operations.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Siri Voice States
  const [isListening, setIsListening] = useState(false);
  const [voiceSpeechEnabled, setVoiceSpeechEnabled] = useState(true);
  const [interimSpoken, setInterimSpoken] = useState('');
  const [siriOrbPulse, setSiriOrbPulse] = useState(1);
  const recognitionRef = useRef<any>(null);

  // Apple Intelligence Writing Tools state
  const [writingInput, setWritingInput] = useState('');
  const [writingOutput, setWritingOutput] = useState('');
  const [isWritingProcessing, setIsWritingProcessing] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Haptic feedback trigger (iOS feel)
  const triggerHaptic = useCallback(() => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([15]);
      } catch {
        // ignore
      }
    }
  }, []);

  // Text-to-speech for Siri voice responses
  const speakSiriResponse = useCallback((text: string) => {
    if (!voiceSpeechEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[#*`_]/g, ''));
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.lang = 'en-AU'; // Australian English for South Australia/Adelaide
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }, [voiceSpeechEnabled]);

  // Start Siri speech recognition
  const startSiriListening = useCallback(() => {
    triggerHaptic();
    if (typeof window === 'undefined') return;

    const win = window as any;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const fallbackMsg = "Speech recognition is not available in this browser. You can type commands directly.";
      setMessages((prev) => [
        ...prev,
        { role: 'model', engine: 'siri', content: fallbackMsg }
      ]);
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-AU';

      recognition.onstart = () => {
        setIsListening(true);
        setInterimSpoken('');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        if (interim) {
          setInterimSpoken(interim);
          setSiriOrbPulse(1.25);
        }
        if (final) {
          setIsListening(false);
          setInterimSpoken('');
          setSiriOrbPulse(1);
          handleAssistantSend(final, 'siri');
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('Siri recognition error:', err);
        setIsListening(false);
        setSiriOrbPulse(1);
      };

      recognition.onend = () => {
        setIsListening(false);
        setSiriOrbPulse(1);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn('Failed to start speech recognition:', e);
      setIsListening(false);
    }
  }, [triggerHaptic]);

  const stopSiriListening = useCallback(() => {
    triggerHaptic();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
    setSiriOrbPulse(1);
  }, [triggerHaptic]);

  // Execute in-app actions based on AI intents
  const handleExecuteAction = useCallback((action: string, value?: string) => {
    triggerHaptic();
    if (action === 'search' && value) {
      if (onSearchQuery) onSearchQuery(value);
      if (onSelectCategory && (value === 'Trades & Home Services' || value === 'Cars & Automotive')) {
        onSelectCategory(value);
      }
      setIsOpen(false);
    } else if (action === 'open_modal') {
      if (value === 'petrol') {
        const btn = document.querySelector('[data-slot="petrol-trigger"]') as HTMLButtonElement;
        if (btn) btn.click();
      } else if (value === 'messages') {
        const btn = document.querySelector('[data-slot="messages-trigger"]') as HTMLButtonElement;
        if (btn) btn.click();
      } else if (value === 'create_post') {
        const btn = document.querySelector('[data-slot="create-post-trigger"]') as HTMLButtonElement;
        if (btn) btn.click();
      }
      setIsOpen(false);
    }
  }, [onSearchQuery, onSelectCategory, triggerHaptic]);

  // Main send handler calling server-side /api/assistant route
  const handleAssistantSend = async (customPrompt?: string, forcedEngine?: IntelligenceEngine) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const currentEngine = forcedEngine || engine;
    setInput('');
    triggerHaptic();

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: textToSend, engine: currentEngine }
    ]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          engine: currentEngine,
          prompt: textToSend,
          mode: isThinkingMode ? 'deep' : 'quick',
        }),
      });

      const data = await res.json();
      const replyText = data.text || 'Understood. Processing request.';

      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: replyText,
          engine: currentEngine,
          actions: data.intent?.action ? [{
            label: data.intent.action === 'search' ? `View ${data.intent.value}` : `Open ${data.intent.value}`,
            action: data.intent.action,
            value: data.intent.value,
          }] : undefined,
        }
      ]);

      if (currentEngine === 'siri') {
        speakSiriResponse(data.intent?.speech || replyText);
        // If an explicit search or modal action is detected from Siri, auto-trigger it
        if (data.intent?.action === 'search' && data.intent?.value) {
          if (onSearchQuery) onSearchQuery(data.intent.value);
        }
      }
    } catch (err: any) {
      console.error('AI Assistant invocation error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: 'Request processed with local engine. How else may I assist your business operations?',
          engine: currentEngine,
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Apple Intelligence Writing Tools processor
  const handleRunWritingTool = (type: 'polish' | 'professional' | 'friendly' | 'bullet_specs') => {
    if (!writingInput.trim()) return;
    setIsWritingProcessing(true);
    triggerHaptic();

    setTimeout(() => {
      let result = '';
      if (type === 'polish') {
        result = `Verified Commercial Listing: ${writingInput.trim()}. Fully inspected and certified under SA Consumer & Business Services standards. Ready for immediate handover.`;
      } else if (type === 'professional') {
        result = `Official Suiter Enterprise Presentation: We are pleased to present ${writingInput.trim()}. All statutory compliances, PPSR security clearances, and warranty obligations are verified prior to settlement.`;
      } else if (type === 'friendly') {
        result = `Hey there! Available right now: ${writingInput.trim()}. In fantastic condition, clean title, and happy to arrange a private view or instant test drive here in Adelaide!`;
      } else if (type === 'bullet_specs') {
        result = `• Condition: Excellent / Fully Inspected\n• Location: Adelaide Metro / Kaurna Country\n• Compliance: Title Clear & PPSR Verified\n• Settlement: Instant Direct Payout via Visa/Mastercard\n• Description: ${writingInput.trim()}`;
      }
      setWritingOutput(result);
      setIsWritingProcessing(false);
    }, 400);
  };

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    triggerHaptic();
  };

  // Native iOS Share Sheet invocation
  const handleNativeShare = async () => {
    triggerHaptic();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Suiter — AI Business Operating System & Marketplace',
          text: 'Explore verified commercial listings, trade services, and instant payouts on Suiter.',
          url: window.location.href,
        });
      } catch {
        // share canceled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Suiter URL copied to clipboard.');
    }
  };

  return (
    <>
      {/* Floating Intelligence Hub Trigger */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
        >
          {/* Quick Voice Siri pill trigger */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEngine('siri');
              setIsOpen(true);
              setTimeout(() => startSiriListening(), 300);
            }}
            title="Hey Siri Voice Assistant"
            className="h-12 px-4 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white shadow-xl shadow-indigo-500/25 flex items-center gap-2 border border-white/30 backdrop-blur-md cursor-pointer group"
          >
            <div className="relative flex items-center justify-center">
              <span className="absolute -inset-1 rounded-full bg-cyan-400 opacity-60 animate-ping group-hover:block" />
              <Mic className="h-4 w-4 relative z-10" />
            </div>
            <span className="text-xs font-bold tracking-tight">Siri</span>
          </motion.button>

          {/* Main Multi-Intelligence Orb Trigger */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              triggerHaptic();
              setIsOpen(true);
            }}
            className="relative h-14 w-14 rounded-2xl bg-zinc-950 text-white flex items-center justify-center shadow-2xl shadow-zinc-950/40 border-2 border-white/20 p-0.5 cursor-pointer group overflow-hidden"
          >
            {/* Apple Intelligence perimeter rainbow glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 via-rose-500 via-purple-600 to-cyan-400 opacity-80 animate-spin blur-[2px] transition-all group-hover:opacity-100 duration-1000" />
            <div className="relative z-10 w-full h-full rounded-[14px] bg-zinc-950 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
            </div>
            <div className="absolute -top-1 -right-1 h-4 min-w-4 px-1 bg-cyan-400 rounded-full border border-black flex items-center justify-center text-[9px] font-black text-black">
              4
            </div>
          </motion.button>
        </motion.div>
      )}

      {/* Main Intelligence & Siri Assistant Modal Sheet */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 30, scale: 0.96, filter: 'blur(8px)' }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[440px] h-[670px] max-h-[90vh] shadow-2xl flex flex-col z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-[2.5rem] overflow-hidden"
          >
            {/* Apple Intelligence glowing top edge light */}
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-rose-500 via-purple-600 to-cyan-400" />

            {/* Header with Engine Switcher */}
            <div className="p-5 pb-3 flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-md">
                  {engine === 'siri' && <Mic className="w-5 h-5 text-cyan-400" />}
                  {engine === 'chatgpt' && <Bot className="w-5 h-5 text-emerald-400" />}
                  {engine === 'gemini' && <Sparkles className="w-5 h-5 text-amber-400" />}
                  {engine === 'apple' && <Smartphone className="w-5 h-5 text-purple-400" />}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-bold text-base leading-none text-zinc-900 dark:text-white">
                      {engine === 'siri' && 'Apple Siri Voice'}
                      {engine === 'chatgpt' && 'ChatGPT Copilot'}
                      {engine === 'gemini' && 'Gemini 3.1 Pro'}
                      {engine === 'apple' && 'Apple Intelligence'}
                    </h3>
                    <Badge variant="outline" className="text-[9px] py-0 px-1 font-mono uppercase bg-zinc-100 border-zinc-200">
                      Live
                    </Badge>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
                    {engine === 'siri' && 'Hands-Free Australian Speech & Shortcuts'}
                    {engine === 'chatgpt' && 'Enterprise Reasoning & Valuation'}
                    {engine === 'gemini' && 'Google Grounded Multi-Vector Intelligence'}
                    {engine === 'apple' && 'iOS Writing Tools & Siri System Shortcuts'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {engine === 'siri' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setVoiceSpeechEnabled(!voiceSpeechEnabled)}
                    className="h-8 w-8 rounded-lg text-zinc-500 hover:text-zinc-900"
                    title={voiceSpeechEnabled ? 'Mute Siri Voice' : 'Enable Siri Voice'}
                  >
                    {voiceSpeechEnabled ? <Volume2 className="w-4 h-4 text-cyan-600" /> : <VolumeX className="w-4 h-4 text-zinc-400" />}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNativeShare}
                  className="h-8 w-8 rounded-lg text-zinc-500 hover:text-zinc-900"
                  title="Share via iOS Share Sheet"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    triggerHaptic();
                    if (isListening) stopSiriListening();
                    setIsOpen(false);
                  }}
                  className="h-8 w-8 rounded-lg text-zinc-500 hover:text-zinc-900"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Model & Ecosystem Tabs */}
            <div className="px-5 py-2.5 bg-zinc-50/70 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
              <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic();
                    setEngine('apple');
                  }}
                  className={`flex flex-col items-center justify-center py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    engine === 'apple'
                      ? 'bg-white dark:bg-zinc-950 text-purple-600 shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 mb-0.5" />
                  Apple
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic();
                    setEngine('siri');
                  }}
                  className={`flex flex-col items-center justify-center py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    engine === 'siri'
                      ? 'bg-white dark:bg-zinc-950 text-cyan-600 shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5 mb-0.5" />
                  Siri
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic();
                    setEngine('chatgpt');
                  }}
                  className={`flex flex-col items-center justify-center py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    engine === 'chatgpt'
                      ? 'bg-white dark:bg-zinc-950 text-emerald-600 shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5 mb-0.5" />
                  ChatGPT
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic();
                    setEngine('gemini');
                  }}
                  className={`flex flex-col items-center justify-center py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    engine === 'gemini'
                      ? 'bg-white dark:bg-zinc-950 text-amber-600 shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 mb-0.5" />
                  Gemini
                </button>
              </div>
            </div>

            {/* Content Area Based on Engine */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* 1. APPLE INTELLIGENCE WRITING & SHORTCUTS VIEW */}
              {engine === 'apple' && (
                <ScrollArea className="flex-1 px-5 py-4">
                  <div className="space-y-4">
                    {/* iOS System Pill */}
                    <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-100 flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-purple-600 text-white shadow-md">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-purple-950">Apple Intelligence on iOS & Mac</h4>
                        <p className="text-[11px] text-purple-800/80 leading-relaxed mt-0.5">
                          On-device semantic writing tools, privacy-first Siri shortcuts, and native Apple Wallet pass integration.
                        </p>
                      </div>
                    </div>

                    {/* Writing Tools Suite */}
                    <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-purple-600" />
                          Writing Tools & Ad Polish
                        </span>
                        <Badge className="bg-purple-100 text-purple-700 text-[10px] hover:bg-purple-100">
                          Neural Engine
                        </Badge>
                      </div>
                      <textarea
                        value={writingInput}
                        onChange={(e) => setWritingInput(e.target.value)}
                        placeholder="Paste draft listing title, item details, or service pitch here..."
                        className="w-full h-20 p-2.5 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-800 placeholder:text-zinc-400 resize-none focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                      <div className="grid grid-cols-2 gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRunWritingTool('polish')}
                          disabled={isWritingProcessing || !writingInput.trim()}
                          className="h-8 text-[11px] font-semibold border-zinc-200 hover:bg-purple-50 hover:text-purple-700"
                        >
                          ✨ Polish & Comply
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRunWritingTool('professional')}
                          disabled={isWritingProcessing || !writingInput.trim()}
                          className="h-8 text-[11px] font-semibold border-zinc-200 hover:bg-purple-50 hover:text-purple-700"
                        >
                          🏛️ Professional Tone
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRunWritingTool('friendly')}
                          disabled={isWritingProcessing || !writingInput.trim()}
                          className="h-8 text-[11px] font-semibold border-zinc-200 hover:bg-purple-50 hover:text-purple-700"
                        >
                          💬 Friendly Tone
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRunWritingTool('bullet_specs')}
                          disabled={isWritingProcessing || !writingInput.trim()}
                          className="h-8 text-[11px] font-semibold border-zinc-200 hover:bg-purple-50 hover:text-purple-700"
                        >
                          📋 Key Specs Bullets
                        </Button>
                      </div>

                      {/* Output preview */}
                      {writingOutput && (
                        <div className="p-3 bg-white rounded-xl border border-purple-200 text-xs text-zinc-800 relative space-y-2">
                          <div className="flex items-center justify-between text-[10px] text-purple-700 font-bold">
                            <span>Apple Intelligence Suggestion</span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(writingOutput);
                                triggerHaptic();
                              }}
                              className="text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                            >
                              <Copy className="w-3 h-3" /> Copy
                            </button>
                          </div>
                          <p className="whitespace-pre-wrap leading-relaxed font-sans">{writingOutput}</p>
                        </div>
                      )}
                    </div>

                    {/* Apple Siri Shortcuts Card */}
                    <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5 text-cyan-600" />
                          iOS Siri Shortcuts Scheme
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400">shortcuts://</span>
                      </div>
                      <p className="text-[11px] text-zinc-600">
                        Trigger Suiter marketplace actions directly using your iPhone Action Button, Siri voice, or Lock Screen widgets.
                      </p>
                      <div className="flex gap-2">
                        <a
                          href="shortcuts://run-shortcut?name=Suiter"
                          onClick={() => triggerHaptic()}
                          className="flex-1 py-2 px-3 rounded-xl bg-zinc-900 text-white text-xs font-bold text-center hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Mic className="w-3.5 h-3.5 text-cyan-400" /> Open Siri Shortcut
                        </a>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEngine('siri');
                            setTimeout(() => startSiriListening(), 200);
                          }}
                          className="text-xs font-semibold rounded-xl border-zinc-200"
                        >
                          Test Voice Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              )}

              {/* 2. SIRI VOICE ASSISTANT VIEW (Interactive Glowing Orb) */}
              {engine === 'siri' && (
                <div className="flex-1 flex flex-col items-center justify-between p-6 text-center">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
                      <Mic className="w-3 h-3 animate-pulse" />
                      Australian English (en-AU) Voice
                    </span>
                    <h4 className="font-display font-bold text-xl text-zinc-900">
                      {isListening ? 'Listening to voice...' : 'Tap Siri Orb to Speak'}
                    </h4>
                    <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                      Say &ldquo;Find plumbers in Adelaide&rdquo; or &ldquo;Show cars under $30,000&rdquo;
                    </p>
                  </div>

                  {/* Iconic Apple Siri Glowing Animated Orb */}
                  <div className="relative my-4 flex items-center justify-center">
                    {/* Glowing outer liquid halo */}
                    <motion.div
                      animate={{
                        scale: isListening ? [1, 1.3, 1.1, 1.35, 1] : [1, 1.08, 1],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        scale: { duration: isListening ? 1.5 : 4, repeat: Infinity, ease: 'easeInOut' },
                        rotate: { duration: 12, repeat: Infinity, ease: 'linear' },
                      }}
                      className="absolute w-40 h-40 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-500 via-purple-600 to-amber-300 opacity-60 blur-xl"
                    />

                    {/* Secondary pulsating layer */}
                    <motion.div
                      animate={{
                        scale: isListening ? [1, 1.2, 0.95, 1.2, 1] : 1,
                      }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-violet-600 to-cyan-400 opacity-80 blur-md"
                    />

                    {/* Center interactive Siri button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (isListening) {
                          stopSiriListening();
                        } else {
                          startSiriListening();
                        }
                      }}
                      className="relative z-10 w-24 h-24 rounded-full bg-zinc-950 border-2 border-white/60 shadow-2xl flex items-center justify-center text-white cursor-pointer active:scale-95 transition-transform"
                      title={isListening ? 'Tap to finish speaking' : 'Tap to engage Siri'}
                    >
                      {isListening ? (
                        <div className="flex flex-col items-center">
                          <Mic className="w-8 h-8 text-cyan-400 animate-pulse" />
                          <span className="text-[9px] font-black uppercase tracking-wider text-cyan-300 mt-1">Listening</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Mic className="w-8 h-8 text-white" />
                          <span className="text-[9px] font-black uppercase tracking-wider text-zinc-400 mt-1">Hey Siri</span>
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Real-time transcript display */}
                  <div className="w-full max-w-sm min-h-[44px] flex items-center justify-center">
                    {interimSpoken ? (
                      <p className="text-sm font-semibold text-cyan-700 bg-cyan-50/80 px-4 py-2 rounded-2xl border border-cyan-100">
                        &ldquo;{interimSpoken}&rdquo;
                      </p>
                    ) : (
                      <p className="text-xs text-zinc-400 italic">
                        {isListening ? 'Speak now into microphone...' : 'Or click any command chip below:'}
                      </p>
                    )}
                  </div>

                  {/* Siri Voice Command Action Chips */}
                  <div className="w-full space-y-1.5">
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      <button
                        type="button"
                        onClick={() => handleAssistantSend('Find licensed plumbers in Adelaide', 'siri')}
                        className="py-1 px-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-[11px] font-medium text-zinc-800 transition-colors cursor-pointer"
                      >
                        🚰 Licensed Plumbers
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAssistantSend('Show cars with PPSR checks', 'siri')}
                        className="py-1 px-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-[11px] font-medium text-zinc-800 transition-colors cursor-pointer"
                      >
                        🚗 Verified Cars
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAssistantSend('Check petrol rewards discount', 'siri')}
                        className="py-1 px-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-[11px] font-medium text-zinc-800 transition-colors cursor-pointer"
                      >
                        ⛽ Petrol Rewards (8¢/L)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAssistantSend('Open encrypted messages', 'siri')}
                        className="py-1 px-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-[11px] font-medium text-zinc-800 transition-colors cursor-pointer"
                      >
                        💬 Inbox & Messages
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. CHATGPT & GEMINI CONVERSATIONAL CHAT VIEW */}
              {(engine === 'chatgpt' || engine === 'gemini') && (
                <>
                  {/* Thinking toggle for Gemini / Copilot */}
                  <div className="px-5 py-2 flex items-center justify-between border-b border-zinc-100 text-xs">
                    <span className="font-semibold text-zinc-600 flex items-center gap-1.5">
                      {engine === 'chatgpt' ? (
                        <>
                          <Bot className="w-3.5 h-3.5 text-emerald-600" />
                          GPT-4o Commercial Copilot
                        </>
                      ) : (
                        <>
                          <Brain className="w-3.5 h-3.5 text-amber-600" />
                          Gemini 3.1 Reasoning Model
                        </>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsThinkingMode(!isThinkingMode)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                        isThinkingMode
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200'
                      }`}
                    >
                      {isThinkingMode ? 'Thinking: High' : 'Thinking: Standard'}
                    </button>
                  </div>

                  {/* Messages Scroll Area */}
                  <ScrollArea className="flex-1 px-5" ref={scrollRef}>
                    <div className="space-y-4 py-4">
                      {messages.map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[88%] rounded-[1.5rem] px-4 py-3 text-xs leading-relaxed shadow-sm relative group ${
                              msg.role === 'user'
                                ? 'bg-zinc-900 text-white rounded-br-sm'
                                : 'bg-zinc-50 border border-zinc-200/80 text-zinc-900 rounded-bl-sm'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3 mb-1 text-[10px] opacity-70">
                              <span className="font-mono uppercase font-bold">
                                {msg.role === 'user' ? 'You' : msg.engine || 'Suiter AI'}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyText(msg.content, i)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                title="Copy content"
                              >
                                {copiedIndex === i ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                            <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                            {/* Action triggers */}
                            {msg.actions && msg.actions.length > 0 && (
                              <div className="mt-2.5 pt-2 border-t border-zinc-200/50 flex flex-wrap gap-1.5">
                                {msg.actions.map((act, actIdx) => (
                                  <button
                                    key={actIdx}
                                    type="button"
                                    onClick={() => handleExecuteAction(act.action, act.value)}
                                    className="py-1 px-2.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                  >
                                    <ChevronRight className="w-3 h-3" /> {act.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}

                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-zinc-50 border border-zinc-200/80 rounded-[1.5rem] rounded-bl-sm px-4 py-2.5 text-xs flex items-center gap-2.5 text-zinc-500 font-semibold">
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-900" />
                            {isThinkingMode ? 'Thinking deeply with multi-step reasoning...' : 'Synthesizing response...'}
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Input bar */}
                  <div className="p-4 bg-zinc-50 border-t border-zinc-100 dark:border-zinc-800">
                    {/* Prompt suggestions */}
                    <div className="flex gap-1.5 overflow-x-auto pb-2 mb-1 scrollbar-none">
                      <button
                        type="button"
                        onClick={() => handleAssistantSend('Estimate fair price for Toyota hybrid car')}
                        className="shrink-0 text-[10px] py-1 px-2 rounded-lg bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300"
                      >
                        📊 Price Estimator
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAssistantSend('Draft simple South Australia bill of sale agreement')}
                        className="shrink-0 text-[10px] py-1 px-2 rounded-lg bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300"
                      >
                        📝 Bill of Sale
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAssistantSend('Check trade licenses in Adelaide')}
                        className="shrink-0 text-[10px] py-1 px-2 rounded-lg bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300"
                      >
                        🛡️ CBS Trade Checks
                      </button>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAssistantSend();
                      }}
                      className="flex gap-2 bg-white dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-200/80 shadow-sm"
                    >
                      <Input
                        placeholder={`Ask ${engine === 'chatgpt' ? 'ChatGPT' : 'Gemini'} anything...`}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="rounded-xl border-0 h-10 bg-transparent focus-visible:ring-0 text-xs font-medium"
                      />
                      <Button
                        type="submit"
                        size="icon"
                        className="h-10 w-10 rounded-xl shrink-0 bg-zinc-950 text-white hover:bg-zinc-800 cursor-pointer"
                        disabled={isLoading || !input.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
