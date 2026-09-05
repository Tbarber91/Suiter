'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { MessageSquare, Sparkles, Brain, Zap, Mic, X, Loader2 } from 'lucide-react';
import { getGeminiClient } from '@/lib/gemini';
import { ThinkingLevel } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'quick' | 'deep' | 'voice'>('quick');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Hi! I am your Suiter AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const ai = getGeminiClient();
      let modelName = 'gemini-3.1-flash-lite-preview';
      let config: any = {};

      if (mode === 'deep') {
        modelName = 'gemini-3.1-pro-preview';
        config = {
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
        };
      } else if (mode === 'quick') {
        config = {
          tools: [{ googleSearch: {} }]
        };
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents: userMsg,
        config
      });

      setMessages(prev => [...prev, { role: 'model', content: response.text || 'Sorry, I could not generate a response.' }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', content: 'Sorry, I encountered an error.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <motion.button 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 h-16 w-16 rounded-[1.5rem] shadow-2xl bg-zinc-900 text-white flex items-center justify-center z-50 group hover:shadow-zinc-300 transition-all border-2 border-white"
        >
          <Sparkles className="h-7 w-7 text-white" />
          <div className="absolute -top-2 -right-2 h-5 min-w-5 px-1 bg-indigo-600 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black">2</div>
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(10px)' }}
            className="fixed bottom-8 right-8 w-[400px] h-[650px] shadow-2xl flex flex-col z-50 glass border-0 rounded-[2.5rem] overflow-hidden"
          >
            <div className="p-6 pb-2 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-zinc-900 p-2 rounded-xl shadow-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg leading-none gradient-text">Suiter Intelligence</h3>
                  <p className="text-[10px] uppercase font-black tracking-widest text-zinc-400 mt-1">Powered by Gemini 3.1</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-xl h-10 w-10 hover:bg-zinc-100">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full flex-1 flex flex-col overflow-hidden">
              <div className="px-6 py-4">
                <TabsList className="grid w-full grid-cols-3 bg-zinc-100/50 p-1 rounded-2xl">
                  <TabsTrigger value="quick" className="rounded-xl text-[10px] font-bold tracking-tight py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Zap className="w-3 h-3 mr-1.5 text-amber-500" /> Search
                  </TabsTrigger>
                  <TabsTrigger value="deep" className="rounded-xl text-[10px] font-bold tracking-tight py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Brain className="w-3 h-3 mr-1.5 text-indigo-500" /> Thinking
                  </TabsTrigger>
                  <TabsTrigger value="voice" className="rounded-xl text-[10px] font-bold tracking-tight py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Mic className="w-3 h-3 mr-1.5 text-emerald-500" /> Voice
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col">
                {mode === 'voice' ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        ease: "easeInOut" 
                      }}
                      className="w-32 h-32 rounded-full bg-emerald-50 flex items-center justify-center border-4 border-white shadow-xl shadow-emerald-100"
                    >
                      <Mic className="w-12 h-12 text-emerald-600" />
                    </motion.div>
                    <div>
                      <h4 className="font-display font-bold text-2xl tracking-tight">Live Voice Chat</h4>
                      <p className="text-sm text-zinc-500 mt-2 font-medium px-4">
                        Speak naturally to find local items, services, or get business advice on Kaurna Country.
                      </p>
                    </div>
                    <Button size="lg" className="rounded-[1.25rem] h-14 px-10 font-bold bg-zinc-900 shadow-xl shadow-zinc-200">Start Conversation</Button>
                  </div>
                ) : (
                  <>
                    <ScrollArea className="flex-1 px-6" ref={scrollRef}>
                      <div className="space-y-6 py-4">
                        {messages.map((msg, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[85%] rounded-[1.5rem] px-5 py-3 text-sm font-medium leading-relaxed shadow-sm ${
                              msg.role === 'user' 
                                ? 'bg-zinc-900 text-white rounded-br-sm shadow-xl shadow-zinc-200' 
                                : 'bg-white border border-zinc-100 text-zinc-900 rounded-bl-sm'
                            }`}>
                              {msg.content}
                            </div>
                          </motion.div>
                        ))}
                        {isLoading && (
                          <div className="flex justify-start">
                            <div className="bg-white border border-zinc-100 rounded-[1.5rem] rounded-bl-sm px-5 py-3 text-sm flex items-center gap-3 text-zinc-400 font-bold tracking-tight">
                              <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
                              {mode === 'deep' ? 'System thinking deeply...' : 'Processing...'}
                            </div>
                          </div>
                        )}
                        <div className="h-4" />
                      </div>
                    </ScrollArea>
                    <div className="p-6 pt-2 bg-gradient-to-t from-white via-white to-transparent">
                      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2 bg-white p-1.5 rounded-[1.5rem] border border-zinc-100 shadow-xl shadow-zinc-200/50">
                        <Input 
                          placeholder="Ask Suiter AI anything..." 
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          className="rounded-xl border-0 h-12 bg-transparent focus-visible:ring-0 text-sm font-medium"
                        />
                        <Button type="submit" size="icon" className="h-12 w-12 rounded-xl shrink-0 bg-zinc-900 shadow-lg shadow-zinc-200" disabled={isLoading || !input.trim()}>
                          <MessageSquare className="w-5 h-5" />
                        </Button>
                      </form>
                    </div>
                  </>
                )}
              </div>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
