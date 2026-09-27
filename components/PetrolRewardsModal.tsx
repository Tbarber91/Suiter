'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { FuelCard, ServiceStation } from '@/lib/types';
import { 
  Fuel, 
  CreditCard, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  ExternalLink, 
  QrCode, 
  Navigation, 
  ShieldCheck,
  TrendingDown,
  Clock,
  Car,
  Zap
} from 'lucide-react';

interface PetrolRewardsModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
  onSelectStationOnMap?: (station: ServiceStation) => void;
}

export const ADELAIDE_SERVICE_STATIONS: ServiceStation[] = [
  {
    id: 'fuel_shell_cbd',
    name: 'Shell Coles Express Adelaide CBD',
    brand: 'Shell',
    address: '112 West Terrace',
    suburb: 'Adelaide CBD SA 5000',
    lat: -34.9285,
    lng: 138.5910,
    unleaded91: 179.9,
    diesel: 184.9,
    vpowerOrSupreme: 198.9,
    open24Hours: true,
    distanceKm: 0.8,
    hasCarWash: true,
    hasEvCharging: true
  },
  {
    id: 'fuel_mobil_mile_end',
    name: 'Mobil X Convenience Mile End',
    brand: 'Mobil',
    address: '140 South Road',
    suburb: 'Mile End SA 5031',
    lat: -34.9240,
    lng: 138.5720,
    unleaded91: 177.5,
    diesel: 182.9,
    vpowerOrSupreme: 196.9,
    open24Hours: true,
    distanceKm: 2.1,
    hasCarWash: true,
    hasEvCharging: false
  },
  {
    id: 'fuel_shell_norwood',
    name: 'Shell Coles Express Norwood',
    brand: 'Shell',
    address: '180 The Parade',
    suburb: 'Norwood SA 5067',
    lat: -34.9205,
    lng: 138.6360,
    unleaded91: 181.9,
    diesel: 185.9,
    vpowerOrSupreme: 199.9,
    open24Hours: true,
    distanceKm: 3.4,
    hasCarWash: false,
    hasEvCharging: true
  },
  {
    id: 'fuel_mobil_prospect',
    name: 'Mobil X Convenience Prospect',
    brand: 'Mobil',
    address: '245 Main North Road',
    suburb: 'Prospect SA 5082',
    lat: -34.8870,
    lng: 138.6020,
    unleaded91: 178.9,
    diesel: 183.9,
    vpowerOrSupreme: 197.9,
    open24Hours: true,
    distanceKm: 4.2,
    hasCarWash: true,
    hasEvCharging: false
  },
  {
    id: 'fuel_shell_unley',
    name: 'Shell Coles Express Unley',
    brand: 'Shell',
    address: '134 Unley Road',
    suburb: 'Unley SA 5061',
    lat: -34.9450,
    lng: 138.6040,
    unleaded91: 180.9,
    diesel: 184.9,
    vpowerOrSupreme: 199.5,
    open24Hours: false,
    distanceKm: 2.6,
    hasCarWash: false,
    hasEvCharging: true
  }
];

const INITIAL_CARDS: FuelCard[] = [
  {
    id: 'fc_shell_1',
    provider: 'shell',
    cardNumber: '7004 8821 9904 3182',
    cardHolderName: 'Marcus Vance Enterprise',
    pointsBalance: 4250,
    discountPerLiterCents: 8,
    tier: 'Platinum',
    linkedDate: 'September 2026'
  },
  {
    id: 'fc_mobil_1',
    provider: 'mobil',
    cardNumber: '6011 4902 8831 7712',
    cardHolderName: 'Marcus Vance Fleet',
    pointsBalance: 2980,
    discountPerLiterCents: 6,
    tier: 'Smiles',
    linkedDate: 'August 2026'
  }
];

export function PetrolRewardsModal({ isOpen, onOpenChange, trigger, onSelectStationOnMap }: PetrolRewardsModalProps) {
  const [cards, setCards] = useState<FuelCard[]>(INITIAL_CARDS);
  const [activeTab, setActiveTab] = useState<'cards' | 'stations' | 'link_new'>('cards');
  const [selectedBrand, setSelectedBrand] = useState<'shell' | 'mobil'>('shell');
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardHolder, setNewCardHolder] = useState('');
  const [filterBrand, setFilterBrand] = useState<'all' | 'Shell' | 'Mobil'>('all');
  const [activeCardBarcode, setActiveCardBarcode] = useState<FuelCard | null>(INITIAL_CARDS[0]);

  const handleLinkCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardNumber.trim()) return;

    const newCard: FuelCard = {
      id: `fc_${Date.now()}`,
      provider: selectedBrand,
      cardNumber: newCardNumber.trim(),
      cardHolderName: newCardHolder.trim() || 'Verified Fleet Member',
      pointsBalance: 1500, // welcome bonus points
      discountPerLiterCents: selectedBrand === 'shell' ? 8 : 6,
      tier: 'Gold',
      linkedDate: 'Just now'
    };

    setCards(prev => [newCard, ...prev]);
    setActiveCardBarcode(newCard);
    setNewCardNumber('');
    setNewCardHolder('');
    setActiveTab('cards');
  };

  const handleRemoveCard = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
    if (activeCardBarcode?.id === id) {
      setActiveCardBarcode(cards.find(c => c.id !== id) || null);
    }
  };

  const filteredStations = ADELAIDE_SERVICE_STATIONS.filter(s => {
    if (filterBrand === 'all') return true;
    return s.brand === filterBrand;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="sm:max-w-[840px] w-[95vw] max-h-[90vh] rounded-[2.5rem] border-0 bg-zinc-950 text-white p-0 overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 md:p-8 bg-zinc-900/90 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Fuel className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight">
                  Petrol Rewards & Fleet Fuel Cards
                </h3>
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px] uppercase font-bold tracking-wider">
                  Shell & Mobil Partner
                </Badge>
              </div>
              <p className="text-xs text-zinc-400">
                Link your Shell Card or Mobil Rewards for automatic fuel discounts, pump barcode scans, and live Adelaide petrol pricing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-zinc-950 p-1 rounded-xl border border-zinc-800 flex items-center text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('cards')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === 'cards' ? 'bg-amber-500 text-zinc-950 shadow-xs' : 'text-zinc-400 hover:text-white'
                }`}
              >
                My Fuel Cards ({cards.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('stations')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === 'stations' ? 'bg-amber-500 text-zinc-950 shadow-xs' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Nearby Stations
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('link_new')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === 'link_new' ? 'bg-amber-500 text-zinc-950 shadow-xs' : 'text-zinc-400 hover:text-white'
                }`}
              >
                + Link Card
              </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto max-h-[calc(90vh-140px)] p-6 space-y-6">
          {activeTab === 'cards' && (
            <div className="space-y-6">
              {/* Linked Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cards.map((card) => {
                  const isShell = card.provider === 'shell';
                  const isSelectedForScan = activeCardBarcode?.id === card.id;

                  return (
                    <div
                      key={card.id}
                      onClick={() => setActiveCardBarcode(card)}
                      className={`p-6 rounded-3xl relative overflow-hidden transition-all cursor-pointer border ${
                        isShell
                          ? 'bg-gradient-to-br from-amber-600 via-yellow-700 to-zinc-950 border-amber-500/40 text-white'
                          : 'bg-gradient-to-br from-blue-700 via-indigo-900 to-zinc-950 border-blue-500/40 text-white'
                      } ${isSelectedForScan ? 'ring-2 ring-white scale-[1.01]' : 'opacity-90 hover:opacity-100'}`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Fuel className="w-5 h-5 text-white" />
                          <span className="font-display font-black tracking-wider text-base uppercase">
                            {isShell ? 'Shell Card • GO+' : 'Mobil Smiles • Fleet'}
                          </span>
                        </div>
                        <Badge className="bg-white/20 text-white border-0 text-[10px] font-mono uppercase">
                          {card.tier} Tier
                        </Badge>
                      </div>

                      <div className="my-3 font-mono text-sm tracking-widest text-zinc-100">
                        {card.cardNumber}
                      </div>

                      <div className="flex items-end justify-between pt-2 border-t border-white/20">
                        <div>
                          <p className="text-[10px] uppercase font-mono tracking-wider opacity-80">Points Balance</p>
                          <p className="text-xl font-bold font-mono text-white">
                            {card.pointsBalance.toLocaleString()} <span className="text-xs font-normal opacity-80">pts</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase font-mono tracking-wider opacity-80">Fuel Discount</p>
                          <p className="text-base font-bold font-mono text-emerald-300">
                            {card.discountPerLiterCents}¢ / L off
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Digital Barcode Scanner Display for Selected Card */}
              {activeCardBarcode && (
                <div className="p-6 bg-zinc-900 rounded-3xl border border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-amber-400" />
                        Scan at Fuel Pump or Counter
                      </h4>
                      <p className="text-xs text-zinc-400">
                        Showing digital barcode for {activeCardBarcode.provider === 'shell' ? 'Shell Card' : 'Mobil Rewards'} ({activeCardBarcode.cardHolderName}).
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveCard(activeCardBarcode.id)}
                        className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-xl text-xs h-8"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove Card
                      </Button>
                    </div>
                  </div>

                  {/* High Contrast Barcode Container */}
                  <div className="bg-white p-6 rounded-2xl flex flex-col items-center justify-center space-y-3">
                    <p className="text-zinc-950 font-mono text-xs font-bold tracking-widest">
                      {activeCardBarcode.cardNumber}
                    </p>
                    {/* Simulated barcode SVG */}
                    <div className="w-full max-w-sm h-14 flex items-stretch justify-center gap-[2px] bg-white px-2">
                      {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 3, 1, 2, 4, 1, 3].map((w, i) => (
                        <div key={i} className="bg-zinc-950" style={{ width: `${w * 2}px` }} />
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-bold uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Ready to scan • {activeCardBarcode.discountPerLiterCents}¢/L active discount</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'stations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-xs text-zinc-400">
                  Participating service stations across Adelaide Metro honoring linked Shell & Mobil discounts.
                </p>
                <div className="flex gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setFilterBrand('all')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      filterBrand === 'all' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-400'
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterBrand('Shell')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      filterBrand === 'Shell' ? 'bg-amber-500 text-zinc-950 shadow-xs' : 'text-zinc-400'
                    }`}
                  >
                    Shell
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterBrand('Mobil')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      filterBrand === 'Mobil' ? 'bg-blue-600 text-white shadow-xs' : 'text-zinc-400'
                    }`}
                  >
                    Mobil
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredStations.map((station) => (
                  <div
                    key={station.id}
                    className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          station.brand === 'Shell' ? 'bg-amber-500 text-zinc-950' : 'bg-blue-600 text-white'
                        }`}>
                          {station.brand === 'Shell' ? 'S' : 'M'}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-white">{station.name}</h4>
                          <p className="text-[11px] text-zinc-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-zinc-500 shrink-0" />
                            {station.address}, {station.suburb}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-mono text-zinc-400 border-zinc-800">
                        {station.distanceKm} km
                      </Badge>
                    </div>

                    {/* Price board */}
                    <div className="grid grid-cols-3 gap-1.5 p-2 bg-zinc-950 rounded-xl text-center text-xs font-mono">
                      <div>
                        <span className="text-[9px] text-zinc-500 block">U91</span>
                        <span className="font-bold text-white">{station.unleaded91}¢</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 block">Diesel</span>
                        <span className="font-bold text-white">{station.diesel}¢</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 block">Premium</span>
                        <span className="font-bold text-amber-400">{station.vpowerOrSupreme}¢</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1">
                      <div className="flex items-center gap-3">
                        {station.open24Hours && <span className="text-emerald-400 font-bold">● 24 Hours</span>}
                        {station.hasCarWash && <span>• Car Wash</span>}
                        {station.hasEvCharging && <span className="text-sky-400">• EV Charging</span>}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          onSelectStationOnMap?.(station);
                          if (onOpenChange) onOpenChange(false);
                        }}
                        className="h-7 px-2 text-xs text-indigo-400 hover:text-white hover:bg-indigo-950/40 rounded-lg cursor-pointer"
                      >
                        <Navigation className="w-3 h-3 mr-1" /> View Map
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'link_new' && (
            <div className="p-6 bg-zinc-900 rounded-3xl border border-zinc-800 max-w-lg mx-auto space-y-4">
              <h4 className="font-bold text-sm text-white">Link New Shell or Mobil Card</h4>
              <p className="text-xs text-zinc-400">
                Enter your card details to synchronize your points balance and unlock automatic pump discounts.
              </p>

              <form onSubmit={handleLinkCard} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-mono text-zinc-400">Card Provider</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedBrand('shell')}
                      className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all cursor-pointer ${
                        selectedBrand === 'shell'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      Shell Card / Coles Express
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedBrand('mobil')}
                      className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all cursor-pointer ${
                        selectedBrand === 'mobil'
                          ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      Mobil Rewards / Smiles
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-mono text-zinc-400">16-Digit Card Number</Label>
                  <Input
                    required
                    placeholder="7004 0000 0000 0000"
                    value={newCardNumber}
                    onChange={(e) => setNewCardNumber(e.target.value)}
                    className="h-11 rounded-xl bg-zinc-950 border-zinc-800 font-mono text-white text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-mono text-zinc-400">Cardholder / Fleet Name</Label>
                  <Input
                    placeholder="e.g. Suiter Construction Fleet"
                    value={newCardHolder}
                    onChange={(e) => setNewCardHolder(e.target.value)}
                    className="h-11 rounded-xl bg-zinc-950 border-zinc-800 text-white text-xs font-semibold"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Link & Verify Fuel Card
                </Button>
              </form>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
