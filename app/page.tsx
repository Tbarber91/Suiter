'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { AuthProvider } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MapPin, Star, Clock, ShieldCheck, RefreshCw, Layers, 
  LayoutGrid, List as ListIcon, Filter, Plus, Search, X,
  Calendar as CalendarIcon, Check, RotateCcw, SlidersHorizontal, 
  Compass, Sparkles, Mic, MessageSquare, ArrowUpDown 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalDirectoryService } from '@/lib/directory-service';
import { Location } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { FigmaDesignToolbar } from '@/components/FigmaDesignToolbar';
import { InstantBookingModal } from '@/components/InstantBookingModal';
import { GoogleAdsModal } from '@/components/GoogleAdsModal';
import { AIAssistant } from '@/components/AIAssistant';
import { AcknowledgementFooter } from '@/components/AcknowledgementFooter';
import { Logo } from '@/components/Logo';
import { ListingDetailModal } from '@/components/ListingDetailModal';
import { PublicProfileModal } from '@/components/PublicProfileModal';
import { ChatModal } from '@/components/ChatModal';
import { PriceTrendSparkline } from '@/components/PriceTrendSparkline';
import { VoiceSearchButton } from '@/components/VoiceSearchButton';
import { computeRatingStats } from '@/lib/transactions';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';

const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted flex items-center justify-center">Loading map...</div>
});

const MOCK_LOCATIONS: Location[] = [
  {
    id: 'apple-pin-norwood',
    lat: -34.9220,
    lng: 138.6340,
    title: 'The Parade Prestige Kitchens & Joinery Showroom',
    businessName: 'Norwood Architectural Joinery',
    address: '142 The Parade, Norwood SA 5067',
    description: 'Official Apple Maps sponsored location. Architectural millwork, engineered stone benchtops, and custom kitchen joinery with direct Apple Maps navigation.',
    type: 'ad',
    price: 'Free 3D Consult',
    rating: 5.0,
    category: 'Kitchen Renovations',
    image: 'https://picsum.photos/seed/norwoodkitchens/800/450',
    phone: '(08) 8332 9911',
    isNew: true,
    isAppleMapsSponsored: true,
    appleMapsAdTier: 'top_placement',
    appleMapsBadge: 'Featured Pin',
    hours: ['Mon-Fri: 8:00 AM - 5:30 PM', 'Sat: 9:00 AM - 4:00 PM'],
    reviews: [
      { id: 'r-ap1', user: 'Verified Apple Maps Visitor', rating: 5, comment: 'Turn-by-turn navigation led right to their showroom client bay.', date: 'Yesterday' }
    ]
  },
  {
    id: 'reno-1',
    lat: -34.9285,
    lng: 138.6007,
    title: 'Vance Master Kitchen Renovation & Joinery',
    businessName: 'Vance Joinery & Stone Studio',
    address: '128 King William St, Adelaide SA 5000',
    description: 'Bespoke 3D laser spatial scan, 2-pack cabinetry, Quantum Quartz stone benchtops & Master Builder AS 4386 sign-off.',
    type: 'service',
    price: 'From $12,500',
    priceHistory: [14200, 13800, 13400, 12900, 12500],
    rating: 5.0,
    category: 'Kitchen Renovations',
    image: 'https://picsum.photos/seed/adelaidekitchenreno/800/450',
    phone: '(08) 8234 5678',
    isNew: true,
    isAppleMapsSponsored: true,
    appleMapsAdTier: 'top_placement',
    appleMapsBadge: 'Verified Ad',
    hours: ['Mon-Fri: 7:30 AM - 5:00 PM'],
    reviews: [
      { id: 'r-reno', user: 'Julian Hastings', rating: 5, comment: 'Phenomenal attention to detail on our stone island bench.', date: '2 days ago' }
    ]
  },
  {
    id: 'car-1',
    lat: -34.9080,
    lng: 138.5950,
    title: '2022 Toyota RAV4 Cruiser Hybrid (Second Hand / LMVD Certified)',
    businessName: 'City West Toyota Certified LMVD',
    address: '240 West Terrace, Adelaide SA 5000',
    description: 'One owner, full logbook service history, 50-point roadworthy mechanical inspection report & PPSR title clear.',
    type: 'product',
    price: '$38,900',
    priceHistory: [41500, 40200, 39600, 38900],
    stock: 1,
    rating: 4.8,
    category: 'Second Hand Cars',
    image: 'https://picsum.photos/seed/toyotarav4hybrid/800/450',
    phone: '(08) 8352 1100',
    isNew: true,
    isAppleMapsSponsored: true,
    appleMapsAdTier: 'direct_pin',
    appleMapsBadge: 'Promoted',
    hours: ['Mon-Sat: 8:30 AM - 5:30 PM'],
    reviews: [
      { id: 'r-car', user: 'Sarah M.', rating: 5, comment: 'Instant test drive booking and roadworthy report provided immediately.', date: '1 week ago' }
    ]
  },
  {
    id: 'site-1',
    lat: -34.9450,
    lng: 138.6080,
    title: 'Unley Park Prime Architectural Site Feasibility & Survey',
    description: 'Licensed building surveyor site feasibility appraisal, boundary peg check, and quantity surveying for luxury residences.',
    type: 'service',
    price: '$1,200 Fixed',
    priceHistory: [1100, 1150, 1200, 1200],
    rating: 4.9,
    category: 'Sites & Feasibility',
    image: 'https://picsum.photos/seed/constructionsiteunley/800/450',
    phone: '(08) 8332 4000',
    hours: ['Mon-Fri: 7:00 AM - 4:30 PM'],
    reviews: [
      { id: 'r-site', user: 'David W.', rating: 5, comment: 'Essential soil report and contour measurements before design phase.', date: '3 weeks ago' }
    ]
  },
  {
    id: 'app-1',
    lat: -34.9220,
    lng: 138.6040,
    title: 'Fast-Track Trade License & Building Application Review',
    description: 'Statutory compliance verification, Consumer & Business Services (CBS) check, and rapid sign-off consultation.',
    type: 'service',
    price: '$450 Review',
    priceHistory: [520, 490, 470, 450],
    rating: 5.0,
    category: 'Applications & Audits',
    image: 'https://picsum.photos/seed/legalarchitect/800/450',
    phone: '(08) 8231 9900',
    hours: ['Mon-Fri: 8:30 AM - 5:30 PM'],
    reviews: [
      { id: 'r-app', user: 'Mark Henderson', rating: 5, comment: 'Expedited our contractor registration without delay.', date: '1 month ago' }
    ]
  },
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
    priceHistory: [380, 410, 450, 480],
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
    priceHistory: [95, 88, 80, 75],
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

const VOICE_SUGGESTED_KEYWORDS = [
  'Kitchen Renovations',
  'Toyota Hybrid',
  'Solar Panel',
  'Unley Park',
  'Cultural Centre',
  'Adelaide CBD'
];

const GEOGRAPHIC_AREAS = [
  { id: 'all', label: 'All Adelaide', center: [-34.9285, 138.6007] as [number, number], zoom: 12, keywords: [] },
  { id: 'cbd', label: 'Adelaide CBD', center: [-34.9285, 138.6007] as [number, number], zoom: 14, keywords: ['adelaide', 'cbd', 'tarntanya', 'king william', 'victoria square', 'kaurna'] },
  { id: 'north', label: 'North Adelaide & Prospect', center: [-34.8950, 138.5950] as [number, number], zoom: 13, keywords: ['north adelaide', 'prospect', 'churchill', 'medindie', 'enfield'] },
  { id: 'east', label: 'Norwood & Burnside', center: [-34.9220, 138.6340] as [number, number], zoom: 13, keywords: ['norwood', 'burnside', 'kensington', 'magill', 'the parade'] },
  { id: 'south', label: 'Unley & Hyde Park', center: [-34.9450, 138.6080] as [number, number], zoom: 13, keywords: ['unley', 'hyde park', 'mitcham', 'goodwood', 'parkside'] },
  { id: 'west', label: 'Glenelg & Port Adelaide', center: [-34.9810, 138.5160] as [number, number], zoom: 12, keywords: ['glenelg', 'port adelaide', 'coast', 'beach', 'west beach', 'henley'] },
];

export default function Home() {
  const [syncedLocations, setSyncedLocations] = useState<Location[]>([]);
  const [firestoreListings, setFirestoreListings] = useState<Location[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-34.9285, 138.6007]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'ad' | 'service' | 'product' | 'shop'>('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [priceMin, setPriceMin] = useState<number | ''>('');
  const [priceMax, setPriceMax] = useState<number | ''>('');
  const [selectedRadius, setSelectedRadius] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'relevance' | 'date_desc' | 'date_asc' | 'price_asc' | 'price_desc' | 'rating_desc'>('relevance');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals for Public Profile and In-App Chat
  const [selectedPublicProfile, setSelectedPublicProfile] = useState<Location | null>(null);
  const [activeChatListing, setActiveChatListing] = useState<Location | null>(null);

  const [mobileTab, setMobileTab] = useState<'list' | 'map'>('list');

  const allLocations = [...MOCK_LOCATIONS, ...firestoreListings, ...syncedLocations];

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const clearAllCategories = () => {
    setSelectedCategories([]);
  };

  const handleSelectArea = (areaId: string) => {
    setSelectedArea(areaId);
    const target = GEOGRAPHIC_AREAS.find(a => a.id === areaId);
    if (target) {
      setMapCenter(target.center);
    }
  };

  const parseNumericPrice = (priceStr?: string): number => {
    if (!priceStr) return 0;
    const digits = priceStr.replace(/[^0-9]/g, '');
    return digits ? parseInt(digits, 10) : 0;
  };

  const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const resetAllFilters = () => {
    setActiveFilter('all');
    setSelectedCategories([]);
    setSelectedArea('all');
    setMinRating(0);
    setPriceFilter('all');
    setPriceMin('');
    setPriceMax('');
    setSelectedRadius(0);
    setSortBy('relevance');
    setSearchQuery('');
    setMapCenter([-34.9285, 138.6007]);
  };

  const filteredLocations = allLocations.filter(loc => {
    const matchesFilter = activeFilter === 'all' || loc.type === activeFilter;
    
    // Multi-select categories match:
    const matchesCategory = selectedCategories.length === 0 || (loc.category && selectedCategories.includes(loc.category));
    
    const matchesRating = !minRating || (loc.rating && loc.rating >= minRating);
    
    const priceNum = parseNumericPrice(loc.price);
    const matchesPresetPrice = priceFilter === 'all' || 
      (priceFilter === 'free' && (!loc.price || loc.price.toLowerCase().includes('community') || loc.price.toLowerCase().includes('free'))) ||
      (priceFilter === 'budget' && (priceNum > 0 && priceNum <= 100)) ||
      (priceFilter === 'mid' && (priceNum > 100 && priceNum <= 1000)) ||
      (priceFilter === 'premium' && (loc.price?.includes('Premium') || loc.price?.includes('Designer') || priceNum > 1000));

    const matchesMinPrice = priceMin === '' || priceNum >= priceMin;
    const matchesMaxPrice = priceMax === '' || priceNum <= priceMax;
    const matchesPrice = matchesPresetPrice && matchesMinPrice && matchesMaxPrice;

    // Geographic area matching:
    let matchesLocationArea = true;
    if (selectedArea !== 'all') {
      const areaDef = GEOGRAPHIC_AREAS.find(a => a.id === selectedArea);
      if (areaDef && areaDef.keywords.length > 0) {
        const textToSearch = `${loc.title} ${loc.description} ${loc.category}`.toLowerCase();
        const hasKeyword = areaDef.keywords.some(k => textToSearch.includes(k));
        const dLat = Math.abs(loc.lat - areaDef.center[0]);
        const dLng = Math.abs(loc.lng - areaDef.center[1]);
        const isNear = dLat < 0.055 && dLng < 0.055;
        matchesLocationArea = hasKeyword || isNear;
      }
    }

    // Radius matching from current map center:
    let matchesRadius = true;
    if (selectedRadius > 0) {
      const dist = calculateDistanceKm(mapCenter[0], mapCenter[1], loc.lat, loc.lng);
      matchesRadius = dist <= selectedRadius;
    }

    const titleVal = loc.title || '';
    const descVal = loc.description || '';
    const catVal = loc.category || '';
    const bNameVal = loc.businessName || '';
    const addrVal = loc.address || '';
    const handleVal = loc.ownerHandle || '';
    const query = searchQuery.trim().toLowerCase();
    
    const matchesSearch = !query || 
      titleVal.toLowerCase().includes(query) || 
      descVal.toLowerCase().includes(query) ||
      catVal.toLowerCase().includes(query) ||
      bNameVal.toLowerCase().includes(query) ||
      addrVal.toLowerCase().includes(query) ||
      handleVal.toLowerCase().includes(query) ||
      (loc.phone && loc.phone.toLowerCase().includes(query));
      
    return matchesFilter && matchesCategory && matchesRating && matchesPrice && matchesLocationArea && matchesRadius && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'relevance') {
      const query = searchQuery.trim().toLowerCase();
      let scoreA = 0;
      let scoreB = 0;
      if (a.isAppleMapsSponsored) scoreA += 4;
      if (b.isAppleMapsSponsored) scoreB += 4;
      if (a.isNew) scoreA += 2;
      if (b.isNew) scoreB += 2;
      if (query) {
        if (a.title.toLowerCase().includes(query)) scoreA += 10;
        if (b.title.toLowerCase().includes(query)) scoreB += 10;
        if (a.category?.toLowerCase().includes(query)) scoreA += 5;
        if (b.category?.toLowerCase().includes(query)) scoreB += 5;
      }
      return scoreB - scoreA;
    }
    if (sortBy === 'price_asc') {
      return parseNumericPrice(a.price) - parseNumericPrice(b.price);
    }
    if (sortBy === 'price_desc') {
      return parseNumericPrice(b.price) - parseNumericPrice(a.price);
    }
    if (sortBy === 'rating_desc') {
      return (b.rating || 0) - (a.rating || 0);
    }
    if (sortBy === 'date_oldest') {
      return 1; // preserved initial order
    }
    // date_desc by default
    return -1;
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
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        
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
                {/* Real-time Search Input with Voice Recognition */}
                <div className="space-y-2">
                  <div className="relative flex items-center w-full group/search">
                    <Search className="absolute left-4 w-4 h-4 text-zinc-400 group-focus-within/search:text-zinc-650 transition-colors pointer-events-none" />
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Type or tap mic to speak keywords (e.g. 'kitchen', 'toyota')..."
                      className="pl-11 pr-20 rounded-2xl h-12 bg-white border-zinc-100 shadow-sm focus:border-zinc-300 w-full text-xs font-bold tracking-tight text-zinc-800 placeholder:text-zinc-400 focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:ring-offset-0"
                    />
                    <div className="absolute right-2 flex items-center gap-1">
                      {searchQuery && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSearchQuery('')}
                          className="w-7 h-7 rounded-full hover:bg-zinc-100 flex items-center justify-center transition-colors text-zinc-400 hover:text-zinc-650 cursor-pointer"
                          title="Clear search"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      )}
                      <VoiceSearchButton
                        onSearchChange={(keyword) => setSearchQuery(keyword)}
                        currentValue={searchQuery}
                        suggestedKeywords={VOICE_SUGGESTED_KEYWORDS}
                        size="default"
                        variant="input-inline"
                      />
                    </div>
                  </div>

                  {/* Voice Search Feedback & Spoken Keyword Prompts */}
                  {searchQuery ? (
                    <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-zinc-600">
                      <div className="flex items-center gap-1.5 truncate">
                        <Mic className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="truncate">
                          Filtered by: <strong className="text-zinc-900 font-semibold">&ldquo;{searchQuery}&rdquo;</strong>
                          <span className="ml-1 text-zinc-400 font-normal">({filteredLocations.length} {filteredLocations.length === 1 ? 'result' : 'results'})</span>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="text-indigo-600 hover:text-indigo-800 text-[10px] font-bold ml-2 shrink-0 cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[10px] text-zinc-400">
                      <span className="font-semibold text-zinc-400 shrink-0 flex items-center gap-1">
                        <Mic className="w-3 h-3 text-indigo-500" /> Voice prompts:
                      </span>
                      {VOICE_SUGGESTED_KEYWORDS.slice(0, 4).map((kw) => (
                        <button
                          key={kw}
                          type="button"
                          onClick={() => setSearchQuery(kw)}
                          className="px-2 py-0.5 rounded-md bg-zinc-100/80 hover:bg-indigo-50 hover:text-indigo-600 text-zinc-600 font-medium transition-colors shrink-0 cursor-pointer"
                        >
                          &ldquo;{kw}&rdquo;
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Primary Type Tabs */}
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
                      className={`rounded-2xl h-10 px-4 text-[11px] font-bold tracking-tight shrink-0 transition-all cursor-pointer ${activeFilter === tab.id ? 'bg-zinc-900 text-white shadow-xl shadow-zinc-200' : 'bg-white border-zinc-100 hover:border-zinc-300 text-zinc-700'}`}
                      onClick={() => setActiveFilter(tab.id as any)}
                    >
                      {tab.label}
                    </Button>
                  ))}
                </div>

                {/* Geographic Area Filter */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-zinc-100 pt-3">
                  <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-zinc-400 shrink-0 mr-1">
                    <Compass className="w-3 h-3 text-indigo-600" />
                    <span>Area:</span>
                  </div>
                  {GEOGRAPHIC_AREAS.map(area => (
                    <button
                      key={area.id}
                      onClick={() => handleSelectArea(area.id)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                        selectedArea === area.id
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                      }`}
                    >
                      <span>{area.label}</span>
                    </button>
                  ))}
                </div>

                {/* Multi-Select Category Filters */}
                <div className="flex items-center gap-4 justify-between border-t border-zinc-100 pt-3">
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-1 items-center">
                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 shrink-0 mr-1">
                      Categories:
                    </div>
                    <Button
                      variant={selectedCategories.length === 0 ? 'outline' : 'ghost'}
                      size="sm"
                      className={`h-8 rounded-xl text-[10px] font-black uppercase tracking-widest px-3 shrink-0 cursor-pointer ${
                        selectedCategories.length === 0 
                          ? 'bg-zinc-900 text-white border-transparent shadow-sm' 
                          : 'text-zinc-500 hover:text-zinc-800'
                      }`}
                      onClick={clearAllCategories}
                    >
                      All Segments
                    </Button>
                    {categories.map((cat) => {
                      const isSelected = selectedCategories.includes(cat);
                      return (
                        <Button
                          key={cat}
                          variant={isSelected ? 'default' : 'outline'}
                          size="sm"
                          className={`h-8 rounded-xl text-[10px] font-bold px-3 shrink-0 cursor-pointer flex items-center gap-1.5 transition-all ${
                            isSelected 
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                              : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300'
                          }`}
                          onClick={() => toggleCategory(cat)}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                          <span>{cat}</span>
                        </Button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200 shrink-0">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-7 w-7 rounded-lg transition-all cursor-pointer ${viewMode === 'list' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400'}`}
                      onClick={() => setViewMode('list')}
                    >
                      <ListIcon className="w-3.5 h-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-7 w-7 rounded-lg transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400'}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Sorting Options Row */}
                <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-xs">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 shrink-0 flex items-center gap-1 mr-1">
                      <ArrowUpDown className="w-3 h-3 text-indigo-600" />
                      Sort:
                    </span>
                    {[
                      { id: 'relevance', label: 'Relevance' },
                      { id: 'date_desc', label: 'Newest' },
                      { id: 'date_oldest', label: 'Oldest' },
                      { id: 'price_asc', label: 'Price: Low → High' },
                      { id: 'price_desc', label: 'Price: High → Low' },
                      { id: 'rating_desc', label: 'Highest Rated ★' }
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSortBy(s.id as any)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                          sortBy === s.id
                            ? 'bg-zinc-900 text-white shadow-xs'
                            : 'bg-zinc-100/90 text-zinc-600 hover:bg-zinc-200'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className={`ml-2 px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 shrink-0 border transition-all cursor-pointer ${
                      showAdvancedFilters || priceMin !== '' || priceMax !== '' || selectedRadius > 0
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                    }`}
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    <span>Range</span>
                  </button>
                </div>

                {/* Advanced Filters Expandable Panel (Radius & Custom Price Min/Max) */}
                {showAdvancedFilters && (
                  <div className="p-3.5 bg-white rounded-2xl border border-zinc-200/90 shadow-sm space-y-3 text-xs animate-in fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Radius proximity filter */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 shrink-0">Radius:</span>
                        {[
                          { id: 0, label: 'All Regions' },
                          { id: 5, label: '≤ 5 km' },
                          { id: 15, label: '≤ 15 km' },
                          { id: 30, label: '≤ 30 km' },
                        ].map((rad) => (
                          <button
                            key={rad.id}
                            type="button"
                            onClick={() => setSelectedRadius(rad.id)}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                              selectedRadius === rad.id
                                ? 'bg-indigo-600 text-white'
                                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                            }`}
                          >
                            {rad.label}
                          </button>
                        ))}
                      </div>

                      {/* Custom Numeric Price Range */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 shrink-0">Custom $:</span>
                        <div className="flex items-center gap-1.5">
                          <Input
                            type="number"
                            placeholder="Min $"
                            value={priceMin}
                            onChange={(e) => setPriceMin(e.target.value ? parseInt(e.target.value, 10) : '')}
                            className="w-20 h-7 text-[11px] font-mono rounded-lg"
                          />
                          <span className="text-zinc-400 font-bold">-</span>
                          <Input
                            type="number"
                            placeholder="Max $"
                            value={priceMax}
                            onChange={(e) => setPriceMax(e.target.value ? parseInt(e.target.value, 10) : '')}
                            className="w-20 h-7 text-[11px] font-mono rounded-lg"
                          />
                          {(priceMin !== '' || priceMax !== '') && (
                            <button
                              type="button"
                              onClick={() => { setPriceMin(''); setPriceMax(''); }}
                              className="text-[10px] text-zinc-400 hover:text-rose-600 font-bold px-1"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Advanced Filters Row: Price & Rating */}
                <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-xs">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 shrink-0">Price:</span>
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'free', label: 'Free' },
                      { id: 'budget', label: 'Budget (≤$100)' },
                      { id: 'premium', label: 'Premium (>$100)' }
                    ].map(p => (
                      <button
                        key={p.id}
                        onClick={() => setPriceFilter(p.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
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
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
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

                {/* Active Filter Indicators & Clear Search Results Bar */}
                {(searchQuery || selectedCategories.length > 0 || selectedArea !== 'all' || priceFilter !== 'all' || minRating > 0 || activeFilter !== 'all') && (
                  <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200/80 flex flex-wrap items-center justify-between gap-2 text-xs animate-in fade-in duration-200">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-bold text-zinc-700">
                        Showing <strong className="text-zinc-950 font-black">{filteredLocations.length}</strong> matching results:
                      </span>
                      {searchQuery && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-zinc-200 text-[10px] font-mono text-zinc-700">
                          Keyword: &ldquo;{searchQuery}&rdquo;
                        </span>
                      )}
                      {selectedArea !== 'all' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-[10px] font-bold text-indigo-700">
                          {GEOGRAPHIC_AREAS.find(a => a.id === selectedArea)?.label}
                        </span>
                      )}
                      {selectedCategories.map(cat => (
                        <span 
                          key={cat} 
                          onClick={() => toggleCategory(cat)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-zinc-200 text-[10px] font-bold text-zinc-700 hover:bg-rose-50 hover:text-rose-600 cursor-pointer transition-colors"
                          title="Click to remove"
                        >
                          <span>{cat}</span>
                          <X className="w-2.5 h-2.5 text-zinc-400 hover:text-rose-600" />
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={resetAllFilters}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-[10px] font-extrabold transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Filters</span>
                    </button>
                  </div>
                )}
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
                            {(() => {
                              const stats = computeRatingStats(loc.reviews, loc.rating);
                              return stats.average > 0 ? (
                                <div className="flex items-center bg-zinc-900 text-white px-2.5 py-1 rounded-xl text-[10px] font-black shadow-lg shrink-0 ml-2">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-1" />
                                  <span>{stats.average.toFixed(1)}</span>
                                  <span className="text-zinc-400 text-[9px] font-normal ml-1">({stats.count})</span>
                                </div>
                              ) : null;
                            })()}
                          </div>
                          
                          <p className="text-sm text-zinc-500 line-clamp-2 mb-3 font-medium leading-relaxed">{loc.description}</p>
                          
                          {/* Provider Handle & Public Profile Link */}
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPublicProfile(loc);
                            }}
                            className="flex items-center gap-2 mb-4 py-1 px-2.5 rounded-xl bg-zinc-100/80 hover:bg-indigo-50 border border-zinc-200/60 transition-all cursor-pointer w-fit group/owner"
                            title="Click to view verified provider profile, skills, services & portfolio"
                          >
                            <div className="w-5 h-5 rounded-full overflow-hidden bg-zinc-200 border border-white shrink-0">
                              <img 
                                src={loc.ownerAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(loc.ownerName || loc.businessName || loc.title)}`} 
                                alt="Provider" 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <span className="text-[10px] font-mono font-bold text-zinc-700 group-hover/owner:text-indigo-600">
                              {loc.ownerHandle ? (loc.ownerHandle.startsWith('@') ? loc.ownerHandle : `@${loc.ownerHandle}`) : '@verified_provider'}
                            </span>
                            <span className="text-[8px] font-bold text-indigo-700 bg-indigo-100/80 px-1.5 py-0.5 rounded-md">
                              View Profile ↗
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
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
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveChatListing(loc);
                                  }}
                                  className="h-9 px-2.5 flex items-center justify-center gap-1 text-[10px] font-bold text-zinc-700 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 hover:scale-105 active:scale-95 transition-all shadow-xs cursor-pointer"
                                  title="Chat with provider regarding this listing"
                                >
                                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                                  <span className="hidden sm:inline">Message</span>
                                </button>
                                <GoogleAdsModal
                                  trigger={
                                    <button
                                      type="button"
                                      onClick={(e) => e.stopPropagation()}
                                      className="h-9 px-2.5 flex items-center justify-center gap-1 text-[10px] font-black text-indigo-700 bg-indigo-50 border border-indigo-200/80 rounded-xl hover:bg-indigo-100 hover:scale-105 active:scale-95 transition-all shadow-xs cursor-pointer"
                                      title="Deploy or syndicate this listing with Google Ads"
                                    >
                                      <Sparkles className="w-3 h-3 text-indigo-600" />
                                      <span className="hidden sm:inline">Google Ad</span>
                                    </button>
                                  }
                                />
                                {loc.externalUrl ? (
                                  <a 
                                    href={loc.externalUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="h-9 px-4 flex items-center justify-center text-[10px] font-black text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-100 uppercase tracking-widest"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    View on Provider
                                  </a>
                                ) : (
                                  <InstantBookingModal
                                    listingTitle={loc.title}
                                    listingPrice={loc.price}
                                    initialCategory={
                                      loc.category?.toLowerCase().includes('kitchen') ? 'kitchen_renovation' :
                                      loc.category?.toLowerCase().includes('car') ? 'cars_secondhand' :
                                      loc.category?.toLowerCase().includes('site') ? 'building_sites' : 'applications'
                                    }
                                    trigger={
                                      <button
                                        type="button"
                                        onClick={(e) => e.stopPropagation()}
                                        className="h-9 px-3.5 flex items-center justify-center gap-1.5 text-[10px] font-black text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all shadow-md uppercase tracking-wider cursor-pointer"
                                      >
                                        <CalendarIcon className="w-3.5 h-3.5" />
                                        <span>Book Now</span>
                                      </button>
                                    }
                                  />
                                )}
                              </div>
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
                onViewDetails={(loc) => {
                  setSelectedLocation(loc);
                  setMapCenter([loc.lat, loc.lng]);
                  setIsDetailOpen(true);
                }}
                onAdCreated={(newLoc) => {
                  setFirestoreListings((prev) => [newLoc, ...prev]);
                  setSelectedLocation(newLoc);
                  setMapCenter([newLoc.lat, newLoc.lng]);
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
        
        {/* Figma Design System & Flow Control Panel */}
        <FigmaDesignToolbar />

        <AIAssistant />
        <AcknowledgementFooter />

        <ListingDetailModal 
          location={isDetailOpen ? selectedLocation : null} 
          onClose={() => setIsDetailOpen(false)} 
        />

        {/* Verified Public User Profile Modal */}
        <PublicProfileModal
          isOpen={selectedPublicProfile !== null}
          onClose={() => setSelectedPublicProfile(null)}
          providerName={selectedPublicProfile?.ownerName || selectedPublicProfile?.businessName || selectedPublicProfile?.title}
          providerHandle={selectedPublicProfile?.ownerHandle || '@verified_provider'}
          providerAvatar={selectedPublicProfile?.ownerAvatar || selectedPublicProfile?.image}
          providerLocation={selectedPublicProfile?.address || 'Tarntanya / Adelaide'}
          providerBio={selectedPublicProfile?.description}
          providerReviews={selectedPublicProfile?.reviews}
          providerListings={allLocations.filter(l => (selectedPublicProfile?.ownerHandle && l.ownerHandle === selectedPublicProfile.ownerHandle) || (selectedPublicProfile?.id && l.id === selectedPublicProfile.id))}
          onOpenChat={(name, handle, title) => {
            const loc = selectedPublicProfile;
            setSelectedPublicProfile(null);
            setActiveChatListing(loc);
          }}
        />

        {/* In-App Direct Chat & Messaging Modal */}
        <ChatModal
          isOpen={activeChatListing !== null}
          onClose={() => setActiveChatListing(null)}
          listing={activeChatListing}
          recipientName={activeChatListing?.ownerName || activeChatListing?.businessName || activeChatListing?.title}
          recipientHandle={activeChatListing?.ownerHandle || '@provider'}
        />
      </div>
    </AuthProvider>
  );
}
