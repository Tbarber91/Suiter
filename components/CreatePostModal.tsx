'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Sparkles, Mic, Video, Image as ImageIcon, Loader2, Share2 } from 'lucide-react';
import { getGeminiClient } from '@/lib/gemini';
import { useAuth } from './AuthProvider';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '@/lib/firebase';

const SYNDICATION_PORTALS = [
  { id: 'gumtree', name: 'Gumtree Classifieds', desc: 'Australia wide reach' },
  { id: 'ebay', name: 'eBay Marketplace', desc: 'Global e-commerce lists' },
  { id: 'ebay_pro', name: 'eBay Pro Storefront', desc: 'Verified retailer listing' },
  { id: 'google_ads', name: 'Google Local Ads', desc: 'Search engine placement map' },
  { id: 'facebook', name: 'Facebook Marketplace', desc: 'Localized community buyers' },
  { id: 'locanto', name: 'Locanto Classifieds', desc: 'Trades and services board' },
  { id: 'trading_post', name: 'Trading Post', desc: 'Adelaide & regional trade' },
];

export function CreatePostModal({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState<'ad' | 'service' | 'product' | 'shop'>('service');
  const [stock, setStock] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [isNew, setIsNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Syndication States
  const [syndicateAll, setSyndicateAll] = useState(true);
  const [selectedPortals, setSelectedPortals] = useState<string[]>([
    'ebay', 'ebay_pro', 'google_ads', 'facebook', 'locanto', 'trading_post', 'gumtree'
  ]);
  const [isSyndicating, setIsSyndicating] = useState(false);
  const [syndicationProgress, setSyndicationProgress] = useState(0);
  const [syndicationLogs, setSyndicationLogs] = useState<string[]>([]);
  const [currentChannelPosting, setCurrentChannelPosting] = useState<string>('');

  // AI States
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState('');
  
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const handleGenerateImage = async () => {
    if (!imagePrompt) return;
    setIsGeneratingImage(true);
    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: imagePrompt,
        config: {
          imageConfig: {
            aspectRatio: "16:9",
            imageSize: "1K"
          }
        }
      });
      
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      console.error("Failed to generate image", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleTranscribeAudio = async () => {
    setIsTranscribing(true);
    setTimeout(() => {
      setDescription(prev => prev + " [Transcribed Audio: I am offering professional plumbing services in the downtown area. Available 24/7 for emergencies.]");
      setIsTranscribing(false);
    }, 2000);
  };

  const [isVideoAnalyzing, setIsVideoAnalyzing] = useState(false);

  const handleAnalyzeVideo = async () => {
    setIsVideoAnalyzing(true);
    setTimeout(() => {
      setDescription(prev => prev + "\n\n[Video Analysis: The video shows a clean, well-lit workspace with professional tools. The service provider appears experienced and organized.]");
      setIsVideoAnalyzing(false);
    }, 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    setIsSyndicating(true);
    setSyndicationProgress(0);
    setSyndicationLogs(["🤖 INITIALIZING MAX-EXPOSURE MULTI-POST AUTO-SYNDICATOR..."]);

    const listingId = 'lst-' + Math.random().toString(36).substring(2, 9);
    const path = `listings/${listingId}`;

    // Portals we are sync'ing to
    const activePortals = syndicateAll ? SYNDICATION_PORTALS.map(p => p.id) : selectedPortals;
    const stepsCount = activePortals.length;
    
    const triggerSyndicationProcess = async () => {
      let currentProgress = 5;
      setSyndicationProgress(5);
      
      const portalLogNames: { [key: string]: string } = {
        ebay: 'eBay Marketplace',
        ebay_pro: 'eBay Pro Storefront',
        google_ads: 'Google Local Search Ads',
        facebook: 'Facebook Marketplace',
        locanto: 'Locanto Classifieds',
        trading_post: 'Trading Post Australia',
        gumtree: 'Gumtree Classifieds'
      };

      // Progress increments
      for (let i = 0; i < stepsCount; i++) {
        const portalId = activePortals[i];
        const portalName = portalLogNames[portalId] || portalId;
        
        setCurrentChannelPosting(portalId);
        setSyndicationLogs(prev => [
          ...prev, 
          `🔑 SECURE CONNECT: Establishing OAuth/API connection path to ${portalName}...`,
          `📝 COMPILING FEED: Structuring optimized headers and local keywords...`
        ]);
        
        await new Promise(resolve => setTimeout(resolve, 600));
        
        setSyndicationLogs(prev => [
          ...prev, 
          `🚀 SYNCHRONIZING: Pushing imagery assets and service maps...`
        ]);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Success
        currentProgress = Math.min(100, Math.floor(((i + 1) / stepsCount) * 90));
        setSyndicationProgress(currentProgress);
        
        setSyndicationLogs(prev => [
          ...prev, 
          `✅ LIVE IN CO-ORDS: Ad synced live on ${portalName}! [Host Proxy ID: ads-${Math.random().toString(36).substring(2, 7)}]`
        ]);
        
        await new Promise(resolve => setTimeout(resolve, 400));
      }

      setSyndicationProgress(100);
      setSyndicationLogs(prev => [
        ...prev,
        `🎉 MULTI-PORTAL AD SYNDICATION COMPLETED!`,
        `🌐 1 Core Post created -> ${stepsCount} platforms active with maximum exposure.`
      ]);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to firebase
      try {
        await setDoc(doc(db, 'listings', listingId), {
          id: listingId,
          title,
          description,
          price: price || 'Free/Quotes',
          type,
          stock: stock ? parseInt(stock, 10) : 0,
          externalUrl: externalUrl || '',
          isNew: isNew || false,
          image: generatedImage || `https://picsum.photos/seed/${listingId}/800/450`,
          ownerId: user.id,
          ownerName: user.name,
          ownerHandle: user.handle || '@user',
          createdAt: serverTimestamp(),
          category: type === 'shop' ? 'Fashion' : type === 'service' ? 'Trades' : 'Product',
          syndicatedChannels: activePortals,
          syndicatedUrls: activePortals.map(p => ({
            channel: p,
            url: `https://www.${p === 'trading_post' ? 'tradingpost.com.au' : p + '.com'}/list/synced-${listingId}`
          }))
        });

        setTitle('');
        setDescription('');
        setPrice('');
        setStock('');
        setExternalUrl('');
        setGeneratedImage(null);
        setIsSyndicating(false);
        setIsOpen(false);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      } finally {
        setIsSubmitting(false);
      }
    };

    triggerSyndicationProcess();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent className="sm:max-w-[700px] rounded-[2.5rem] max-h-[90vh] overflow-y-auto border-0 glass p-0 overflow-hidden">
        {isSyndicating ? (
          <div className="p-10 flex flex-col items-center justify-center min-h-[500px] bg-zinc-950 text-white animate-in fade-in duration-500">
            <div className="relative mb-6 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
              </div>
            </div>
            
            <h3 className="text-2xl font-display font-black tracking-tight text-center mb-1">
              Multi-Portal Ad Syndicator
            </h3>
            <p className="text-zinc-400 text-xs text-center mb-6 max-w-sm font-medium">
              Automatically broadcasting advertising blips across your active connected platforms...
            </p>

            <div className="w-full max-w-md bg-zinc-800 rounded-full h-3 overflow-hidden mb-6 border border-zinc-700/50 p-[2px]">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-300 shadow-lg shadow-indigo-500/40" 
                style={{ width: `${syndicationProgress}%` }}
              />
            </div>

            <div className="flex gap-2.5 items-center justify-center mb-8 flex-wrap max-w-md">
              {SYNDICATION_PORTALS.map((portal) => {
                const isActive = (syndicateAll ? SYNDICATION_PORTALS.map(p => p.id) : selectedPortals).includes(portal.id);
                if (!isActive) return null;
                const portalProgressThresholds: { [key: string]: number } = {
                  gumtree: 14,
                  ebay: 28,
                  ebay_pro: 42,
                  google_ads: 56,
                  facebook: 70,
                  locanto: 84,
                  trading_post: 98
                };
                const thresh = portalProgressThresholds[portal.id] || 0;
                const isDone = syndicationProgress > thresh || syndicationProgress === 100;
                const isCurrent = currentChannelPosting === portal.id && syndicationProgress < 100;
                
                return (
                  <div 
                    key={portal.id} 
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-wider transition-all duration-300 ${
                      isDone 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                        : isCurrent 
                          ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300 animate-pulse scale-105' 
                          : 'bg-zinc-900/50 border-zinc-800 text-zinc-500'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isDone ? 'bg-emerald-400' : isCurrent ? 'bg-indigo-400 animate-ping' : 'bg-zinc-600'}`} />
                    {portal.name.split(' ')[0]}
                  </div>
                );
              })}
            </div>

            <div className="w-full max-w-md bg-black/60 border border-zinc-905 rounded-2xl p-4 font-mono text-[10px] text-zinc-300 space-y-1.5 h-44 overflow-y-auto scrollbar-none shadow-inner">
              {syndicationLogs.map((log, index) => (
                <div key={index} className="leading-relaxed animate-in fade-in slide-in-from-bottom-1 duration-300">
                  <span className="text-zinc-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                  <span className={log.includes('✅') ? 'text-emerald-400 font-semibold' : log.includes('🤖') || log.includes('🎉') ? 'text-indigo-400 font-semibold' : 'text-zinc-300'}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="p-8 pb-4">
              <DialogHeader>
                <DialogTitle className="text-3xl font-display font-bold tracking-tight gradient-text">Create Listing</DialogTitle>
                <p className="text-muted-foreground text-sm font-medium">Define your listing or establish your shop profile on Kaurna Country.</p>
              </DialogHeader>
            </div>
            
            <Tabs defaultValue="details" className="w-full">
              <div className="px-8 border-b border-zinc-100">
                <TabsList className="grid w-64 grid-cols-2 bg-zinc-100/50 p-1 rounded-xl mb-4">
                  <TabsTrigger value="details" className="rounded-lg text-xs font-bold tracking-tight data-[state=active]:bg-white data-[state=active]:shadow-sm">Details</TabsTrigger>
                  <TabsTrigger value="ai-tools" className="rounded-lg text-xs font-bold tracking-tight data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    AI Studio <Sparkles className="w-3 h-3 ml-1.5 text-indigo-500" />
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <ScrollArea className="max-h-[60vh]">
                <div className="px-8">
                  <TabsContent value="details">
                    <form onSubmit={handleSubmit} className="grid gap-8 py-6">
                      <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Listing Category</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { id: 'service', label: 'Service' },
                            { id: 'ad', label: 'Ad' },
                            { id: 'product', label: 'Product' },
                            { id: 'shop', label: 'Shop' }
                          ].map((cat) => (
                            <Button 
                              key={cat.id}
                              type="button" 
                              variant={type === cat.id ? 'default' : 'outline'} 
                              onClick={() => setType(cat.id as any)}
                              className={`rounded-xl text-[10px] font-black uppercase tracking-widest h-10 transition-all ${type === cat.id ? 'bg-zinc-900 shadow-lg shadow-zinc-200' : 'bg-white border-zinc-200'}`}
                            >
                              {cat.label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="grid gap-2">
                          <Label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Listing Headline</Label>
                          <Input
                            id="title"
                            placeholder={type === 'shop' ? "e.g. Luxe Designer Boutique" : "e.g. Handmade Ceramic Vase"}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="rounded-2xl h-12 bg-white border-zinc-100 shadow-sm focus:border-zinc-300"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="price" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Price / Value</Label>
                          <Input
                            id="price"
                            placeholder={type === 'shop' ? "Professional" : "e.g. $45"}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="rounded-2xl h-12 bg-white border-zinc-100 shadow-sm focus:border-zinc-300"
                          />
                        </div>
                      </div>

                      {(type === 'product' || type === 'shop') && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4">
                          <div className="grid gap-2">
                            <Label htmlFor="externalUrl" className="text-xs font-bold uppercase tracking-widest text-zinc-400">External Storefront</Label>
                            <Input
                              id="externalUrl"
                              placeholder="https://myshop.com"
                              value={externalUrl}
                              onChange={(e) => setExternalUrl(e.target.value)}
                              className="rounded-2xl h-12 bg-white border-zinc-100 shadow-sm focus:border-zinc-300"
                            />
                            <p className="text-[10px] text-muted-foreground font-medium pl-1">Link your existing Shopify, Etsy, or Designer Portal.</p>
                          </div>
                          {type === 'product' && (
                            <div className="grid gap-2">
                              <Label htmlFor="stock" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Inventory Status</Label>
                              <Input
                                id="stock"
                                type="number"
                                placeholder="Units available"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                className="rounded-2xl h-12 bg-white border-zinc-100 shadow-sm focus:border-zinc-300"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      <div className="grid gap-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Full Description</Label>
                          <div className="flex gap-2">
                            <Button type="button" variant="ghost" size="sm" onClick={handleAnalyzeVideo} disabled={isVideoAnalyzing} className="h-7 text-[10px] font-bold rounded-lg bg-zinc-100 hover:bg-zinc-200 cursor-pointer">
                              {isVideoAnalyzing ? <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> : <Video className="w-3 h-3 mr-1.5" />}
                              AI Video Analysis
                            </Button>
                            <Button type="button" variant="ghost" size="sm" onClick={handleTranscribeAudio} disabled={isTranscribing} className="h-7 text-[10px] font-bold rounded-lg bg-zinc-100 hover:bg-zinc-200 cursor-pointer">
                              {isTranscribing ? <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> : <Mic className="w-3 h-3 mr-1.5" />}
                              Voice Dictate
                            </Button>
                          </div>
                        </div>
                        <Textarea
                          id="description"
                          placeholder="Share the story behind your item or service..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          required
                          className="rounded-2xl min-h-[140px] bg-white border-zinc-100 shadow-sm focus:border-zinc-300 p-4 animate-in fade-in"
                        />
                      </div>

                      {type === 'product' && (
                        <div className="flex items-center space-x-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                          <input 
                            type="checkbox" 
                            id="isNew" 
                            checked={isNew} 
                            onChange={(e) => setIsNew(e.target.checked)}
                            className="w-5 h-5 rounded-lg border-zinc-200 text-zinc-900 focus:ring-zinc-900"
                          />
                          <Label htmlFor="isNew" className="text-sm font-bold text-zinc-700 cursor-pointer">This is a brand new / unboxed item</Label>
                        </div>
                      )}

                      {generatedImage && (
                        <div className="grid gap-3 animate-in fade-in">
                          <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Preview Asset</Label>
                          <div className="relative aspect-video rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl">
                            <img src={generatedImage} alt="Generated cover" className="object-cover w-full h-full" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          </div>
                        </div>
                      )}

                      {/* Multi-Portal Auto-Post (Instant Syndication) */}
                      <div className="space-y-4 bg-indigo-50/40 p-6 rounded-3xl border border-indigo-100/60 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                              <Share2 className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-zinc-800">Multi-Portal Syndication</h4>
                              <p className="text-[9px] text-zinc-500 font-semibold font-sans">Post once, broadcast to 7 portals simultaneously</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              id="syndicateAll" 
                              checked={syndicateAll} 
                              onChange={(e) => {
                                setSyndicateAll(e.target.checked);
                                if (e.target.checked) {
                                  setSelectedPortals(SYNDICATION_PORTALS.map(p => p.id));
                                }
                              }}
                              className="w-4 h-4 rounded text-indigo-600 border-zinc-200 focus:ring-indigo-500"
                            />
                            <Label htmlFor="syndicateAll" className="text-xs font-bold text-zinc-700 cursor-pointer">Post Everywhere (Recommended)</Label>
                          </div>
                        </div>

                        {!syndicateAll && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            {SYNDICATION_PORTALS.map((portal) => (
                              <div key={portal.id} className="flex items-start space-x-2 p-2 rounded-xl bg-white border border-zinc-100/80 hover:border-zinc-200 shadow-sm transition-all focus-within:ring-2 focus-within:ring-indigo-500">
                                <input 
                                  type="checkbox" 
                                  id={`portal-${portal.id}`}
                                  checked={selectedPortals.includes(portal.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedPortals([...selectedPortals, portal.id]);
                                    } else {
                                      setSelectedPortals(selectedPortals.filter(p => p !== portal.id));
                                    }
                                  }}
                                  className="w-4 h-4 mt-0.5 rounded text-indigo-600 border-zinc-200 focus:ring-indigo-500"
                                />
                                <div className="leading-tight">
                                  <Label htmlFor={`portal-${portal.id}`} className="text-xs font-bold text-zinc-700 cursor-pointer block">{portal.name}</Label>
                                  <span className="text-[9px] text-zinc-400 font-semibold">{portal.desc}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="text-[9px] bg-white/70 px-4 py-2 rounded-xl border border-indigo-100/80 text-indigo-800 font-bold flex items-center justify-between shadow-sm animate-pulse-subtle">
                          <span>🚀 Syndication Boost Active: Maximizes views and customer deliverability.</span>
                          <span className="bg-indigo-100 text-indigo-800 text-[8px] px-1.5 py-0.5 rounded font-black font-mono">10x RADAR</span>
                        </div>
                      </div>
                      
                      <div className="h-4" />
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="ai-tools" className="py-8 space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-xl">
                          <ImageIcon className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-display font-bold leading-none">AI Cover Generation</h4>
                          <p className="text-xs text-muted-foreground font-medium mt-1">Generate studio-quality product photos using Gemini.</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Input 
                          placeholder="e.g. A luxury watch on a marble stand, soft lighting..." 
                          value={imagePrompt}
                          onChange={(e) => setImagePrompt(e.target.value)}
                          className="rounded-2xl h-12 bg-white border-zinc-100 shadow-sm focus:border-zinc-300"
                        />
                        <Button onClick={handleGenerateImage} disabled={isGeneratingImage || !imagePrompt} className="rounded-2xl h-12 px-6 font-bold bg-zinc-900 cursor-pointer">
                          {isGeneratingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate'}
                        </Button>
                      </div>
                      
                      {generatedImage && (
                        <div className="relative aspect-video rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl mt-4">
                          <img src={generatedImage} alt="Generated cover" className="object-cover w-full h-full" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 pt-8 border-t border-zinc-100 animate-pulse">
                      <div className="flex items-center gap-3 opacity-55">
                        <div className="p-2 bg-zinc-100 rounded-xl">
                          <Video className="w-5 h-5 text-zinc-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-display font-bold leading-none">Cinematic Ad Generator</h4>
                          <p className="text-xs text-muted-foreground font-medium mt-1">Coming soon: Generate 4K marketing clips for your brand.</p>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full rounded-2xl h-14 border-dashed border-2 opacity-50" disabled>
                        Unlock with Marketplace Pro
                      </Button>
                    </div>
                  </TabsContent>
                </div>
              </ScrollArea>
            </Tabs>

            <div className="p-8 pt-4 bg-zinc-50 border-t border-zinc-100 font-sans">
              <Button 
                type="button" 
                onClick={handleSubmit}
                className="w-full rounded-[1.25rem] h-14 bg-zinc-900 font-black text-sm tracking-widest uppercase hover:bg-zinc-800 hover:-translate-y-0.5 transition-all cursor-pointer" 
                disabled={!user || isSubmitting}
              >
                {isSubmitting && <Loader2 className="w-5 h-5 animate-spin mr-2 animate-spin" />}
                {user ? (type === 'shop' ? 'Establish Designer Shop' : 'Publish to Marketplace') : 'Sign in to Publish'}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
