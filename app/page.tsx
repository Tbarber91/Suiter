'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { AuthProvider } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Star, Clock, ShieldCheck, RefreshCw, Layers, LayoutGrid, List as ListIcon, Filter, Plus, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalDirectoryService } from '@/lib/directory-service';
import { Location } from '@/lib/types';
import { Input } from '@/components/ui/input';

const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted flex items-center justify-center">Loading map...</div>
});

const MOCK_LOCATIONS: Location[] = [
  {
    id: '1',
    lat: -34.9212,
    lng: 138.5995,
    title: 'Kaurna Cultural Centre',
    description: 'Local services and community support on Kaurna Country.',
    type: 'service',
    price: 'Community',
    rating: 5.0,
    category: 'Cultural',
    image: 'https://picsum.photos/seed/adelaide1/800/450',
    phone: '(08) 8212 9000',
    hours: ['Mon-Fri: 9:00 AM - 5:00 PM', 'Sat: 10:00 AM - 4:00 PM'],
    reviews: [
      { id: 'r10', user: 'Traditional Owner', rating: 5, comment: 'A vital space for connection and culture.', date: '1 month ago' }
    ]
  },
  {
    id: 'luxe-1',
    lat: -34.9250,
    lng: 138.6100,
    title: 'Tarntanya Designer Shop',
    description: 'Bespoke fashion and high-end accessories in the heart of the city.',
    type: 'shop',
    price: 'Premium',
    rating: 4.9,
    category: 'Fashion',
    externalUrl: 'https://example.com/adelaide-luxe',
    image: 'https://picsum.photos/seed/luxuryadelaide/800/450',
    phone: '(08) 8232 5500',
    hours: ['Mon-Sat: 10:00 AM - 6:00 PM'],
    reviews: [
      { id: 'r11', user: 'Vogue Enthusast', rating: 5, comment: 'The curators have impeccable taste.', date: '2 weeks ago' }
    ]
  },
  {
    id: '2',
    lat: -34.9200,
    lng: 138.5900,
    title: 'Solar Panel Maintenance',
    description: 'Energy efficiency expert listing for sustainable homes.',
    type: 'service',
    price: '$75/hr',
    rating: 4.7,
    category: 'Sustainability',
    image: 'https://picsum.photos/seed/solar/800/450',
    phone: '0412 345 678',
    hours: ['Mon-Fri: 8:00 AM - 4:00 PM'],
    reviews: [
      { id: 'r12', user: 'Gary T.', rating: 5, comment: 'Detailed report and quick service.', date: '3 months ago' }
    ]
  }
];

import { AIAssistant } from '@/components/AIAssistant';
import { AcknowledgementFooter } from '@/components/AcknowledgementFooter';
import { Logo } from '@/components/Logo';
import { ListingDetailModal } from '@/components/ListingDetailModal';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';

export default function Home() {
  const [syncedLocations, setSyncedLocations] = useState<Location[]>([]);
  const [firestoreListings, setFirestoreListings] = useState<Location[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-34.9285, 138.6007]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'ad' | 'service' | 'product' | 'shop'>('all');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [minRating, setMinRating] = useState<number>(0);
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  const [mobileTab, setMobileTab] = useState<'list' | 'map'>('list');

  const allLocations = [...MOCK_LOCATIONS, ...firestoreListings, ...syncedLocations];

  const filteredLocations = allLocations.filter(loc => {
    const matchesFilter = activeFilter === 'all' || loc.type === activeFilter;
    const matchesCategory = !activeCategory || loc.category === activeCategory;
    const matchesRating = !minRating || (loc.rating && loc.rating >= minRating);
    
    const matchesPrice = priceFilter === 'all' || 
      (priceFilter === 'free' && (!loc.price || loc.price.toLowerCase().includes('community') || loc.price.toLowerCase().includes('free'))) ||
      (priceFilter === 'budget' && (loc.price?.includes('$') && parseInt(loc.price.replace(/[^0-9]/g, '')) <= 75)) ||
      (priceFilter === 'premium' && (loc.price?.includes('Premium') || loc.price?.includes('Designer') || (loc.price?.includes('$') && parseInt(loc.price.replace(/[^0-9]/g, '')) > 75)));

    const titleVal = loc.title || '';
    const descVal = loc.description || '';
    const catVal = loc.category || '';
    const query = searchQuery.trim().toLowerCase();
    
    const matchesSearch = !query || 
      titleVal.toLowerCase().includes(query) || 
      descVal.toLowerCase().includes(query) ||
      catVal.toLowerCase().includes(query);
      
    return matchesFilter && matchesCategory && matchesRating && matchesPrice && matchesSearch;
  });

  // Group by category for the directory view
  const categories = Array.from(new Set(allLocations.map(l => l.category).filter(Boolean))) as string[];

  const handleSyncYellowPages = async () => {
    setIsSyncing(true);
    try {
      const results = await ExternalDirectoryService.fetchDirectoryListings();
      setSyncedLocations(prev => {
        const newOnes = results.filter(r => !prev.some(p => p.id === r.id));
        return [...prev, ...newOnes];
      });
    } catch (error) {
      console.error("Sync failed", error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    handleSyncYellowPages();

    // Setup real-time listener for user-created public listings
    const path = 'listings';
    const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: Location[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          lat: data.lat || -34.9285 + (Math.random() - 0.5) * 0.05,
          lng: data.lng || 138.6007 + (Math.random() - 0.5) * 0.05,
          title: data.title,
          description: data.description,
          type: data.type,
          price: data.price,
          rating: data.rating || 5.0,
          category: data.category || 'Product',
          image: data.image,
          stock: data.stock,
          externalUrl: data.externalUrl,
          isNew: data.isNew,
          phone: data.phone || '08 8212 3456',
          hours: data.hours || ['Mon-Fri: 9:00 AM - 5:30 PM', 'Sat: 9:00 AM - 4:00 PM'],
          reviews: data.reviews || [],
          source: data.source || undefined
        });
      });
      setFirestoreListings(items);
    }, (error) => {
      console.error("Firestore onSnapshot subscription failed:", error);
      // Fail gracefully or handle mapping error
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-background font-sans selection:bg-zinc-200 selection:text-zinc-900">
        <Header />
        
        <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden">
          {/* Left Panel - Listings & Directory Sections */}
          <section className={`w-full md:w-[540px] lg:w-[600px] flex-shrink-0 border-r bg-zinc-50/30 flex flex-col z-10 shadow-2xl shadow-black/5 overflow-hidden ${mobileTab === 'map' ? 'hidden md:flex' : 'flex'}`}>
            <header className="p-8 pb-4 border-b bg-white/40 backdrop-blur-md">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-display font-bold tracking-tight gradient-text">Enterprise Directory</h2>
                  <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                    <span className={`flex h-2 w-2 rounded-full ${isSyncing ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                    {isSyncing ? 'Syncing Network Data...' : 'Verified Businesses • Kaurna Country'}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                   <Logo size={32} className="opacity-20" />
                   <span className="text-[8px] font-black uppercase tracking-widest text-zinc-300 mt-1">Directory Powered</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Real-time Search Input */}
                <div className="relative flex items-center w-full group/search">
                  <Search className="absolute left-4 w-4 h-4 text-zinc-400 group-focus-within/search:text-zinc-650 transition-colors pointer-events-none" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search listings, storefronts, or custom trades..."
                    className="pl-11 pr-10 rounded-2xl h-12 bg-white border-zinc-100 shadow-sm focus:border-zinc-300 w-full text-xs font-bold tracking-tight text-zinc-800 placeholder:text-zinc-400 focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:ring-offset-0"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center transition-colors text-zinc-400 hover:text-zinc-650 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { id: 'all', label: 'All Listings' },
                    { id: 'shop', label: 'Storefronts' },
                    { id: 'product', label: 'E-Commerce' },
                    { id: 'service', label: 'Local Services' },
                    { id: 'ad', label: 'Bulletin Ads' }
                  ].map((tab) => (
                    <Button
                      key={tab.id}
                      variant={activeFilter === tab.id ? 'default' : 'outline'}
                      size="sm"
                      className={`rounded-2xl h-10 px-4 text-[11px] font-bold tracking-tight shrink-0 transition-all ${activeFilter === tab.id ? 'bg-zinc-900 text-white shadow-xl shadow-zinc-200' : 'bg-white border-zinc-100 hover:border-zinc-300'}`}
                      onClick={() => setActiveFilter(tab.id as any)}
                    >
                      {tab.label}
                    </Button>
                  ))}
                </div>

                <div className="flex items-center gap-4 justify-between border-t border-zinc-100 pt-4">
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-1">
                    <Button
                      variant={activeCategory === null ? 'outline' : 'ghost'}
                      size="sm"
                      className={`h-8 rounded-xl text-[10px] font-black uppercase tracking-widest px-3 ${activeCategory === null ? 'bg-zinc-100 border-transparent shadow-sm text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                      onClick={() => setActiveCategory(null)}
                    >
                      All Sections
                    </Button>
                    {categories.map((cat) => (
                      <Button
                        key={cat}
                        variant={activeCategory === cat ? 'outline' : 'ghost'}
                        size="sm"
                        className={`h-8 rounded-xl text-[10px] font-black uppercase tracking-widest px-3 shrink-0 ${activeCategory === cat ? 'bg-indigo-50 border-indigo-100 shadow-sm text-indigo-600' : 'text-zinc-400 hover:text-zinc-600'}`}
                        onClick={() => setActiveCategory(cat)}
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-7 w-7 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400'}`}
                      onClick={() => setViewMode('list')}
                    >
                      <ListIcon className="w-3.5 h-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-7 w-7 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400'}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Advanced Filters Row: Price & Rating */}
                <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-xs">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 shrink-0">Price:</span>
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'free', label: 'Free' },
                      { id: 'budget', label: 'Budget' },
                      { id: 'premium', label: 'Premium' }
                    ].map(p => (
                      <button
                        key={p.id}
                        onClick={() => setPriceFilter(p.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all shrink-0 ${
                          priceFilter === p.id ? 'bg-zinc-900 text-white' : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}

                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2 shrink-0">Rating:</span>
                    {[
                      { id: 0, label: 'All' },
                      { id: 4, label: '4.0+ ★' },
                      { id: 4.5, label: '4.5+ ★' },
                      { id: 5, label: '5.0 ★' }
                    ].map(r => (
                      <button
                        key={r.id}
                        onClick={() => setMinRating(r.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all shrink-0 ${
                          minRating === r.id ? 'bg-amber-500 text-white' : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>

                  <span className="text-[10px] font-bold text-zinc-400 shrink-0 pl-2">
                    {filteredLocations.length} results
                  </span>
                </div>
              </div>
            </header>
            
            <ScrollArea className="flex-1">
              <div className={`p-8 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ${viewMode === 'grid' ? 'grid grid-cols-2 gap-6 space-y-0' : ''}`}>
                <AnimatePresence mode="popLayout">
                  {filteredLocations.map((loc, idx) => (
                    <motion.div
                      key={loc.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95, y: 30 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 30 }}
                      transition={{ delay: idx * 0.04, duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                    >
                      <Card 
                        className={`overflow-hidden cursor-pointer transition-all duration-500 rounded-[2rem] border-2 shadow-2xl shadow-black/5 hover:translate-y-[-4px] ${selectedLocation?.id === loc.id ? 'border-zinc-900 ring-4 ring-zinc-100' : 'border-transparent hover:border-zinc-200'}`}
                        onClick={() => {
                          setSelectedLocation(loc);
                          setMapCenter([loc.lat, loc.lng]);
                          setIsDetailOpen(true);
                        }}
                      >
                        <div className={`relative ${viewMode === 'grid' ? 'aspect-square' : 'aspect-[2.4/1]'} w-full overflow-hidden`}>
                          <img 
                            src={loc.image} 
                            alt={loc.title} 
                            className="object-cover w-full h-full grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                          
                          <div className="absolute top-4 left-4 flex flex-wrap gap-2 pointer-events-none">
                            <Badge className="bg-white/90 backdrop-blur-md text-[#333] border-0 text-[9px] font-black uppercase tracking-widest h-7 px-3 rounded-xl shadow-xl">
                              {loc.type}
                            </Badge>
                            {loc.isNew && (
                              <Badge className="bg-emerald-500 text-white shadow-xl text-[9px] font-black uppercase tracking-widest h-7 px-3 rounded-xl border-0">New Listing</Badge>
                            )}
                          </div>
                          
                          <div className="absolute bottom-4 left-4">
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] drop-shadow-md">{loc.category}</span>
                          </div>
                        </div>
                        
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-display font-bold text-xl leading-tight tracking-tight text-zinc-900 group-hover:gradient-text transition-all">{loc.title}</h3>
                            {loc.rating && (
                              <div className="flex items-center bg-zinc-900 text-white px-2.5 py-1 rounded-xl text-[10px] font-black shadow-lg">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-1.5" />
                                {loc.rating}
                              </div>
                            )}
                          </div>
                          
                          <p className="text-sm text-zinc-500 line-clamp-2 mb-6 font-medium leading-relaxed">{loc.description}</p>
                          
                          <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
                            <div className="flex flex-col gap-1">
                               <p className="text-xl font-black tracking-tighter text-zinc-900">{loc.price}</p>
                               {loc.stock !== undefined && (
                                <p className="text-[9px] font-black text-indigo-600 underline underline-offset-4 decoration-2 decoration-indigo-100 uppercase tracking-widest">
                                  {loc.stock} Units Available Today
                                </p>
                              )}
                            </div>
                            
                            <div className="flex flex-col items-end gap-3">
                              <div className="flex items-center text-[9px] text-zinc-400 font-bold uppercase tracking-widest gap-4">
                                {loc.source && (
                                  <span className="flex items-center text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded leading-none">
                                    <ShieldCheck className="w-2.5 h-2.5 mr-1" />
                                    {loc.source}
                                  </span>
                                )}
                                <span className="flex items-center"><MapPin className="w-3 h-3 mr-1.5 text-zinc-300" /> 1.2 KM</span>
                                <span className="flex items-center"><Clock className="w-3 h-3 mr-1.5 text-zinc-300" /> 2H AGO</span>
                              </div>
                              {loc.externalUrl && (
                                <a 
                                  href={loc.externalUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="h-9 px-4 flex items-center justify-center text-[10px] font-black text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-100 uppercase tracking-widest"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  View on Provider
                                </a>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div className="h-20" />
              </div>
            </ScrollArea>
          </section>

          {/* Right Panel - Map */}
          <section className={`flex-1 relative ${mobileTab === 'list' ? 'hidden md:block' : 'block'} bg-muted group`}>
            <div className="absolute inset-0 z-0">
              <Map 
                locations={filteredLocations} 
                center={mapCenter}
                selectedLocationId={selectedLocation?.id}
                onMarkerClick={(loc) => {
                  setSelectedLocation(loc);
                  setMapCenter([loc.lat, loc.lng]);
                  setIsDetailOpen(true);
                }}
              />
            </div>
            
            {/* Map Controls Overlays */}
            <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
               <div className="glass p-1.5 rounded-[1.25rem] flex flex-col gap-1 shadow-2xl">
                 <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-white shadow-sm hover:scale-105 active:scale-95 transition-all"><Plus className="w-4 h-4" /></Button>
                 <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-white shadow-sm hover:scale-105 active:scale-95 transition-all"><Filter className="w-4 h-4" /></Button>
                 <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-white shadow-sm hover:scale-105 active:scale-95 transition-all"><Layers className="w-4 h-4" /></Button>
               </div>
            </div>

            <div className="absolute bottom-10 inset-x-0 flex justify-center z-10 pointer-events-none">
              <div className="glass px-6 py-3 rounded-full flex items-center gap-6 shadow-2xl pointer-events-auto border-white/40 ring-1 ring-black/5 animate-in slide-in-from-bottom-8 duration-700">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Currently Mapping</span>
                  <span className="text-xs font-bold text-zinc-900">Tarntanya / Adelaide</span>
                </div>
                <div className="w-px h-6 bg-zinc-200" />
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-zinc-200" />
                  ))}
                  <div className="w-6 h-6 rounded-full border-2 border-white bg-zinc-900 flex items-center justify-center text-[8px] font-bold text-white">+12</div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Floating Mobile View Switcher */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] md:hidden">
          <div className="bg-zinc-900/90 backdrop-blur-xl p-1.5 rounded-full shadow-2xl border border-white/20 flex items-center gap-1">
            <button
              onClick={() => setMobileTab('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                mobileTab === 'list' ? 'bg-white text-zinc-900 shadow-md' : 'text-white/70 hover:text-white'
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
            <button
              onClick={() => setMobileTab('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                mobileTab === 'map' ? 'bg-white text-zinc-900 shadow-md' : 'text-white/70 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
          </div>
        </div>
        
        <AIAssistant />
        <AcknowledgementFooter />

        <ListingDetailModal 
          location={isDetailOpen ? selectedLocation : null} 
          onClose={() => setIsDetailOpen(false)} 
        />
      </div>
    </AuthProvider>
  );
}
