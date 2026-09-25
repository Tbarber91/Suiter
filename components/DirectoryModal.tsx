'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  BookOpen, 
  Search, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  ExternalLink, 
  Calendar, 
  Building2, 
  User, 
  Star,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { InstantBookingModal } from './InstantBookingModal';

interface DirectoryListing {
  id: string;
  name: string;
  type: 'yellow' | 'white';
  category: string;
  phone: string;
  address: string;
  suburb: string;
  postcode: string;
  rating?: number;
  verified: boolean;
  license?: string;
  description?: string;
  hours?: string;
}

const DIRECTORY_DATA: DirectoryListing[] = [
  // Yellow Pages (Commercial & Trades)
  {
    id: 'yp-1',
    name: 'Vance Custom Kitchens & Joinery',
    type: 'yellow',
    category: 'Kitchen Renovations & Trades',
    phone: '(08) 8234 5678',
    address: '142 King William St',
    suburb: 'Adelaide CBD',
    postcode: '5000',
    rating: 5.0,
    verified: true,
    license: 'BLD 294810',
    description: 'Master builder bespoke kitchen renovations, stone benchtops, 3D laser site survey.',
    hours: 'Mon-Fri: 7:30 AM - 5:00 PM'
  },
  {
    id: 'yp-2',
    name: 'Tarntanya Pre-Owned Motors & Inspections',
    type: 'yellow',
    category: 'Automotive & Second Hand Cars',
    phone: '(08) 8352 1100',
    address: '42 Main North Road',
    suburb: 'Prospect',
    postcode: '5082',
    rating: 4.8,
    verified: true,
    license: 'LMVD 4910',
    description: 'Pre-purchase mechanical inspections, certified second-hand vehicles under warranty, test drives.',
    hours: 'Mon-Sat: 8:30 AM - 5:30 PM'
  },
  {
    id: 'yp-3',
    name: 'Adelaide Central Plumbers & Gasfitters',
    type: 'yellow',
    category: 'Emergency Trades',
    phone: '(08) 8212 4455',
    address: '88 Grote St',
    suburb: 'Adelaide CBD',
    postcode: '5000',
    rating: 4.7,
    verified: true,
    license: 'PGE 19482',
    description: '24/7 burst pipe repairs, hot water installations, certified gas compliance certificates.',
    hours: '24/7 Emergency Service'
  },
  {
    id: 'yp-4',
    name: 'Light Square Legal & Commercial Conveyancing',
    type: 'yellow',
    category: 'Legal & Professional Services',
    phone: '(08) 8231 9900',
    address: '19 Light Square',
    suburb: 'Adelaide CBD',
    postcode: '5000',
    rating: 4.9,
    verified: true,
    license: 'SA-BAR-2041',
    description: 'Property settlements, small business contracts, and statutory marketplace escrow advice.',
    hours: 'Mon-Fri: 8:30 AM - 5:30 PM'
  },
  {
    id: 'yp-5',
    name: 'Rundle Mall Designer Collective',
    type: 'yellow',
    category: 'Retail & Boutiques',
    phone: '(08) 8410 5566',
    address: '120 Rundle Mall',
    suburb: 'Adelaide CBD',
    postcode: '5000',
    rating: 4.8,
    verified: true,
    license: 'RET-SA-8291',
    description: 'South Australian artisanal homewares, designer apparel, and lifestyle curators.',
    hours: 'Mon-Sun: 9:30 AM - 6:00 PM'
  },
  {
    id: 'yp-6',
    name: 'Norwood Building & Site Surveying',
    type: 'yellow',
    category: 'Building Sites & Trade Appraisals',
    phone: '(08) 8332 4000',
    address: '64 The Parade',
    suburb: 'Norwood',
    postcode: '5067',
    rating: 4.9,
    verified: true,
    license: 'SURV-SA-1029',
    description: 'Residential boundary surveys, building code inspection, soil tests, pre-build site measurement.',
    hours: 'Mon-Fri: 7:00 AM - 4:30 PM'
  },

  // White Pages (Residential & Community Contacts)
  {
    id: 'wp-1',
    name: 'Kaurna Cultural Heritage Liaison Office',
    type: 'white',
    category: 'Community & Cultural Elders',
    phone: '(08) 8212 9000',
    address: 'Tarntanya Cultural Precinct, Victoria Square',
    suburb: 'Adelaide',
    postcode: '5000',
    verified: true,
    description: 'Official representative contact for Kaurna cultural protocol, welcome to country, and community advisory.'
  },
  {
    id: 'wp-2',
    name: 'City of Adelaide Resident Support Services',
    type: 'white',
    category: 'Council & Civic Services',
    phone: '(08) 8203 7203',
    address: '25 Pirie St',
    suburb: 'Adelaide CBD',
    postcode: '5000',
    verified: true,
    description: 'Local government rates, waste collection, residential parking permits, and street verge maintenance.'
  },
  {
    id: 'wp-3',
    name: 'Consumer & Business Services (CBS) South Australia',
    type: 'white',
    category: 'Statutory Authority',
    phone: '131 882',
    address: '91 Grenfell St',
    suburb: 'Adelaide CBD',
    postcode: '5000',
    verified: true,
    description: 'Official regulatory body for builder licenses, consumer rights disputes, and trade compliance.'
  },
  {
    id: 'wp-4',
    name: 'Adelaide Hills Community Fire Brigade Volunteers',
    type: 'white',
    category: 'Emergency & Volunteer Services',
    phone: '(08) 8339 2200',
    address: 'Mount Barker Road',
    suburb: 'Stirling',
    postcode: '5152',
    verified: true,
    description: 'Volunteer bushfire awareness, regional preparedness meetings, and emergency volunteer coordination.'
  },
  {
    id: 'wp-5',
    name: 'South Australia State Emergency Service (SES) HQ',
    type: 'white',
    category: 'Emergency Services',
    phone: '132 500',
    address: '4 Hallwyl St',
    suburb: 'Adelaide',
    postcode: '5000',
    verified: true,
    description: 'Storm damage response, fallen trees, flash flooding mitigation across South Australia.'
  }
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

interface DirectoryModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
  onSelectListingForMap?: (address: string) => void;
}

export function DirectoryModal({ isOpen, onOpenChange, trigger, onSelectListingForMap }: DirectoryModalProps) {
  const [activeTab, setActiveTab] = useState<'yellow' | 'white'>('yellow');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredListings = DIRECTORY_DATA.filter(item => {
    if (item.type !== activeTab) return false;
    if (selectedLetter && !item.name.toUpperCase().startsWith(selectedLetter)) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    return (
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.suburb.toLowerCase().includes(query) ||
      item.postcode.includes(query) ||
      item.phone.includes(query) ||
      (item.description && item.description.toLowerCase().includes(query))
    );
  });

  const uniqueCategories = Array.from(new Set(DIRECTORY_DATA.filter(d => d.type === activeTab).map(d => d.category)));

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="sm:max-w-[980px] rounded-[2.5rem] border-0 glass p-0 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <DialogHeader className={`p-6 pb-4 border-b shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
          activeTab === 'yellow' ? 'bg-amber-400/90 text-zinc-950' : 'bg-zinc-100/95 text-zinc-900'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <DialogTitle className="text-2xl font-display font-bold tracking-tight">
                {activeTab === 'yellow' ? 'Yellow Pages Business & Trade Directory' : 'White Pages Community & Residential Directory'}
              </DialogTitle>
              <Badge className={`text-[9px] font-bold uppercase tracking-wider ${
                activeTab === 'yellow' ? 'bg-zinc-900 text-white' : 'bg-zinc-800 text-white'
              }`}>
                South Australia
              </Badge>
            </div>
            <p className={`text-xs ${activeTab === 'yellow' ? 'text-zinc-800 font-medium' : 'text-zinc-500'}`}>
              Search verified local businesses, licensed trades, emergency contacts, and residential community associations.
            </p>
          </div>

          <div className="flex bg-black/10 p-1 rounded-2xl shrink-0">
            <button
              type="button"
              onClick={() => {
                setActiveTab('yellow');
                setSelectedCategory('all');
                setSelectedLetter(null);
              }}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'yellow' ? 'bg-zinc-900 text-white shadow-md' : 'text-zinc-700 hover:text-zinc-950'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-amber-400" /> Yellow Pages
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('white');
                setSelectedCategory('all');
                setSelectedLetter(null);
              }}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'white' ? 'bg-white text-zinc-900 shadow-md' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <User className="w-3.5 h-3.5 text-blue-600" /> White Pages
            </button>
          </div>
        </DialogHeader>

        {/* Directory Search & Filter Controls */}
        <div className="p-4 bg-white border-b border-zinc-200 space-y-3 shrink-0">
          <div className="flex flex-col md:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={activeTab === 'yellow' ? "Search by trade, business name, license or suburb..." : "Search resident name, emergency service, or community department..."}
                className="pl-10 rounded-xl h-10 bg-zinc-50 border-zinc-200 text-xs font-semibold"
              />
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-bold px-3 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* A-Z Alphabetical Index Filter */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none pt-1">
            <button
              onClick={() => setSelectedLetter(null)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 transition-all ${
                selectedLetter === null ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:text-zinc-900'
              }`}
            >
              ALL
            </button>
            {ALPHABET.map(letter => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(selectedLetter === letter ? null : letter)}
                className={`w-6 h-6 rounded-md text-[10px] font-bold shrink-0 flex items-center justify-center transition-all ${
                  selectedLetter === letter ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:bg-zinc-100'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Listings List */}
        <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50 space-y-3.5">
          {filteredListings.map(item => (
            <div 
              key={item.id} 
              className={`p-5 rounded-2xl border transition-all duration-200 bg-white hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                activeTab === 'yellow' ? 'border-amber-200/80 hover:border-amber-300' : 'border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-display font-bold text-base text-zinc-900 leading-tight">{item.name}</h4>
                  <Badge className={`text-[9px] font-bold uppercase tracking-wider ${
                    activeTab === 'yellow' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-blue-50 text-blue-800 border-blue-200'
                  }`}>
                    {item.category}
                  </Badge>
                  {item.rating && (
                    <span className="flex items-center text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-1" />
                      {item.rating.toFixed(1)}
                    </span>
                  )}
                  {item.license && (
                    <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">
                      Lic: {item.license}
                    </span>
                  )}
                </div>

                {item.description && (
                  <p className="text-xs text-zinc-600 leading-relaxed max-w-2xl">{item.description}</p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 pt-1">
                  <span className="flex items-center gap-1 font-bold text-zinc-800">
                    <Phone className="w-3.5 h-3.5 text-zinc-400" />
                    <a href={`tel:${item.phone}`} className="hover:underline">{item.phone}</a>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    {item.address}, {item.suburb} {item.postcode}
                  </span>
                  {item.hours && (
                    <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                      <Clock className="w-3 h-3 text-zinc-400" />
                      {item.hours}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <InstantBookingModal
                  trigger={
                    <Button
                      size="sm"
                      className="rounded-xl h-9 px-3 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white cursor-pointer shadow-xs"
                    >
                      <Calendar className="w-3.5 h-3.5 mr-1.5" /> Book Inspection
                    </Button>
                  }
                />
                <a
                  href={`tel:${item.phone.replace(/[^0-9+]/g, '')}`}
                  className="h-9 px-3 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-xs font-bold flex items-center gap-1 text-zinc-800 transition-colors"
                >
                  <Phone className="w-3 h-3 text-emerald-600" /> Call
                </a>
              </div>
            </div>
          ))}

          {filteredListings.length === 0 && (
            <div className="p-8 text-center bg-white rounded-3xl border border-zinc-200">
              <BookOpen className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-zinc-600">No directory records found.</p>
              <p className="text-[10px] text-zinc-400 mt-1">Try clearing filters or search terms.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
