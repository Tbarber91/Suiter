'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Mail, 
  Send, 
  Search, 
  Sparkles, 
  MapPin, 
  Layers, 
  CheckCircle2, 
  Magnet, 
  TrendingUp, 
  Truck, 
  Calendar, 
  PhoneCall,
  DollarSign,
  ShieldCheck,
  Flame
} from 'lucide-react';

interface AdvertisingDirectMailModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
}

const ADELAIDE_POSTCODES = [
  { code: '5000', name: 'Adelaide CBD / City', households: '12,400', avgIncome: '$98k' },
  { code: '5006', name: 'North Adelaide', households: '4,600', avgIncome: '$115k' },
  { code: '5067', name: 'Norwood & Rose Park', households: '7,800', avgIncome: '$124k' },
  { code: '5045', name: 'Glenelg & Brighton Beach', households: '9,500', avgIncome: '$105k' },
  { code: '5066', name: 'Burnside & Adelaide Hills', households: '8,200', avgIncome: '$138k' },
  { code: '5082', name: 'Prospect & Medindie', households: '6,400', avgIncome: '$112k' }
];

const COLLATERAL_TYPES = [
  {
    id: 'flyer_dl',
    title: 'DL Glossy Direct Mail Flyers',
    desc: 'Premium 150gsm double-sided gloss flyer dropped directly into targeted residential letterboxes.',
    unitRate: 0.18,
    minQty: 1000,
    icon: Mail,
    popular: true
  },
  {
    id: 'magnet_fridge',
    title: 'Custom Fridge Magnets',
    desc: 'Heavy-duty 0.4mm full magnetic backing. Sticks on homeowner refrigerators for 3+ years of daily visibility.',
    unitRate: 0.42,
    minQty: 500,
    icon: Magnet,
    popular: true
  },
  {
    id: 'postcard_luxe',
    title: 'Oversized Silk Postcards',
    desc: '350gsm matte laminated cards with spot UV finish for high-value architectural & auto offerings.',
    unitRate: 0.28,
    minQty: 1000,
    icon: Layers,
    popular: false
  }
];

export function AdvertisingDirectMailModal({ isOpen, onOpenChange, trigger }: AdvertisingDirectMailModalProps) {
  const [activeTab, setActiveTab] = useState<'letterbox' | 'seo' | 'orders'>('letterbox');
  const [selectedFormat, setSelectedFormat] = useState('magnet_fridge');
  const [selectedPostcodes, setSelectedPostcodes] = useState<string[]>(['5000', '5067']);
  const [quantity, setQuantity] = useState(2500);
  const [headline, setHeadline] = useState('$500 Off Bespoke Kitchen Renovations');
  const [subtext, setSubtext] = useState('Adelaide Licensed Master Builders • On-Site Laser Measure & Quote');
  const [phone, setPhone] = useState('(08) 8234 5678');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [seoKeyword, setSeoKeyword] = useState('Kitchen Renovations Adelaide, Second Hand Cars Unley, 24/7 Trades SA');

  const currentFormat = COLLATERAL_TYPES.find(c => c.id === selectedFormat) || COLLATERAL_TYPES[0];
  const printCost = quantity * currentFormat.unitRate;
  const distributionFee = quantity * 0.12; // 12 cents per delivery
  const subtotal = printCost + distributionFee;
  const gst = subtotal * 0.1;
  const total = subtotal + gst;

  const togglePostcode = (code: string) => {
    setSelectedPostcodes(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const handleLaunchCampaign = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setActiveTab('orders');
    }, 1800);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="sm:max-w-[940px] rounded-[2.5rem] border-0 glass p-0 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header Bar */}
        <DialogHeader className="p-6 pb-4 border-b bg-white/80 backdrop-blur-md shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <DialogTitle className="text-2xl font-display font-bold tracking-tight text-zinc-900">
                Direct Advertising & Letterbox Drops
              </DialogTitle>
              <Badge className="bg-amber-50 text-amber-800 border-amber-200 text-[10px] font-bold">
                <Flame className="w-3 h-3 mr-1 inline text-amber-600" /> Physical & SEO Marketing
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              We handle printing, direct Australia Post letterbox delivery, fridge magnets, and regional SEO rank booster.
            </p>
          </div>

          <div className="flex bg-zinc-100 p-1 rounded-2xl shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('letterbox')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'letterbox' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Mail className="w-3.5 h-3.5" /> Letterbox Drops & Magnets
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('seo')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'seo' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" /> SEO & Search Placement
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'orders' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Truck className="w-3.5 h-3.5" /> Active Drops
            </button>
          </div>
        </DialogHeader>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50">
          {activeTab === 'letterbox' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Config */}
              <div className="lg:col-span-7 space-y-5">
                {/* Collateral Type Selection */}
                <div>
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    1. Choose Material to Mail Out
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mt-2">
                    {COLLATERAL_TYPES.map(col => {
                      const Icon = col.icon;
                      const isSelected = selectedFormat === col.id;
                      return (
                        <button
                          key={col.id}
                          type="button"
                          onClick={() => setSelectedFormat(col.id)}
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                            isSelected
                              ? 'bg-zinc-900 text-white border-zinc-900 shadow-md'
                              : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-300'
                          }`}
                        >
                          {col.popular && (
                            <Badge className="absolute -top-2 right-2 text-[8px] bg-amber-500 text-white border-0 px-1.5 py-0 uppercase font-black">
                              Top ROI
                            </Badge>
                          )}
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-800'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold leading-tight">{col.title}</p>
                            <p className={`text-[10px] mt-1 leading-snug line-clamp-2 ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                              {col.desc}
                            </p>
                            <p className="text-xs font-bold font-mono mt-2">
                              ${col.unitRate.toFixed(2)}/unit
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Postcodes Targeted */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      2. Select Target Adelaide Postcodes
                    </Label>
                    <span className="text-[10px] font-bold text-emerald-700">
                      {selectedPostcodes.length} Suburbs Selected
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {ADELAIDE_POSTCODES.map(pc => {
                      const isChecked = selectedPostcodes.includes(pc.code);
                      return (
                        <button
                          key={pc.code}
                          type="button"
                          onClick={() => togglePostcode(pc.code)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                            isChecked
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                              : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                          }`}
                        >
                          <div>
                            <p className="text-xs font-bold font-mono leading-tight">{pc.code} • {pc.name}</p>
                            <p className="text-[9px] text-zinc-400 mt-0.5">{pc.households} homes • {pc.avgIncome}</p>
                          </div>
                          <div className={`w-4 h-4 rounded-md flex items-center justify-center ${
                            isChecked ? 'bg-emerald-600 text-white' : 'border border-zinc-300'
                          }`}>
                            {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Campaign Custom Copy */}
                <div className="space-y-3 bg-white p-4 rounded-2xl border border-zinc-200">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    3. Custom Offer & Call-to-Action
                  </Label>
                  <div className="grid gap-2">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-medium">Hero Headline on Flyer/Magnet</span>
                      <Input
                        value={headline}
                        onChange={e => setHeadline(e.target.value)}
                        className="rounded-xl h-9 text-xs font-bold mt-1"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 font-medium">Supporting Trade Guarantee / Offer</span>
                      <Input
                        value={subtext}
                        onChange={e => setSubtext(e.target.value)}
                        className="rounded-xl h-9 text-xs mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-zinc-500 font-medium">Direct Booking Phone</span>
                        <Input
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          className="rounded-xl h-9 text-xs font-mono mt-1"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 font-medium">Household Quantity</span>
                        <select
                          value={quantity}
                          onChange={e => setQuantity(parseInt(e.target.value))}
                          className="w-full h-9 mt-1 rounded-xl border border-zinc-200 bg-white text-xs font-bold px-2 focus:outline-none"
                        >
                          <option value={1000}>1,000 households</option>
                          <option value={2500}>2,500 households</option>
                          <option value={5000}>5,000 households</option>
                          <option value={10000}>10,000 households</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Live Visual Magnet / Flyer Mockup & Pricing */}
              <div className="lg:col-span-5 space-y-4">
                {/* Live Mockup */}
                <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs flex flex-col items-center">
                  <div className="w-full flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      Live Mailer / Magnet Render
                    </span>
                    <Badge className="bg-zinc-900 text-white text-[9px] font-mono">
                      {selectedFormat === 'magnet_fridge' ? 'Fridge Magnet' : 'DL Flyer'}
                    </Badge>
                  </div>

                  {/* Magnet Visual Box */}
                  <div className="w-full max-w-[320px] aspect-[1.4/1] bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white rounded-2xl p-5 shadow-2xl border-4 border-zinc-800 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-emerald-500/20 blur-xl pointer-events-none" />
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400">
                          Verified Local Merchant
                        </span>
                        <div className="flex items-center gap-1 text-[8px] font-mono text-zinc-400">
                          <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                          ADELAIDE METRO
                        </div>
                      </div>
                      <h4 className="text-base font-display font-bold text-white tracking-tight leading-snug">
                        {headline}
                      </h4>
                      <p className="text-[9.5px] text-zinc-400 mt-1 leading-relaxed">
                        {subtext}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-white font-mono text-xs font-bold">
                        <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{phone}</span>
                      </div>
                      <span className="text-[8px] bg-emerald-500 text-zinc-950 px-2 py-0.5 rounded-full font-black uppercase">
                        Direct Booking
                      </span>
                    </div>
                  </div>

                  <p className="text-[10px] text-zinc-400 text-center mt-3 font-medium">
                    {selectedFormat === 'magnet_fridge' 
                      ? 'Full magnetic back adheres directly to residential kitchen fridges for daily recall.' 
                      : 'Delivered by Australia Post verified delivery contractors to certified residential slots.'}
                  </p>
                </div>

                {/* Campaign Quotation Summary */}
                <div className="bg-zinc-900 text-white p-5 rounded-3xl shadow-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Campaign Order Summary
                    </span>
                    <Badge className="bg-emerald-500 text-zinc-950 font-bold text-[9px]">Turnkey Delivery</Badge>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-zinc-400">
                      <span>Full Color Commercial Printing ({quantity.toLocaleString()} units):</span>
                      <span className="font-mono text-white">${printCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Direct Letterbox Delivery (Australia Post verified):</span>
                      <span className="font-mono text-white">${distributionFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>GST (10%):</span>
                      <span className="font-mono text-white">${gst.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-zinc-800 text-sm font-bold text-white">
                      <span>Total Campaign Cost:</span>
                      <span className="font-mono text-emerald-400 font-black">${total.toFixed(2)} AUD</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleLaunchCampaign}
                    disabled={isSubmitted}
                    className="w-full rounded-2xl h-11 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs shadow-lg transition-all mt-2 cursor-pointer"
                  >
                    {isSubmitted ? (
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 animate-spin" /> Scheduling Route & Print...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-3.5 h-3.5" /> Book Letterbox Drop & Print
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SEO BOOSTER */}
          {activeTab === 'seo' && (
            <div className="max-w-2xl mx-auto space-y-6 bg-white p-6 rounded-3xl border border-zinc-200">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-display font-bold text-zinc-900">Regional SEO & Search Booster</h3>
                  <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">Active Engine</Badge>
                </div>
                <p className="text-xs text-zinc-500">
                  Target local customer searches across Google Search, Maps, and Yellow/White Pages sponsored tiers.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Target SEO Keywords</Label>
                  <Input
                    value={seoKeyword}
                    onChange={e => setSeoKeyword(e.target.value)}
                    className="rounded-xl h-10 mt-1 text-xs font-semibold"
                  />
                  <p className="text-[10px] text-zinc-400 mt-1">Comma-separated key search queries you want to rank #1 for in South Australia.</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-center">
                    <p className="text-[10px] font-bold uppercase text-zinc-400">Monthly Local Searches</p>
                    <p className="text-xl font-black text-zinc-900 mt-1 font-mono">18,400+</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-center">
                    <p className="text-[10px] font-bold uppercase text-zinc-400">Yellow Pages Boost</p>
                    <p className="text-xl font-black text-emerald-600 mt-1 font-mono">Top 3 Rank</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-center">
                    <p className="text-[10px] font-bold uppercase text-zinc-400">Avg Lead Cost</p>
                    <p className="text-xl font-black text-indigo-600 mt-1 font-mono">$4.20 AUD</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Included in your Merchant Membership</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    All listings published on Suiter Marketplace automatically receive JSON-LD schema markup for Google Search, canonical geolocation coordinates for Google Maps indexing, and instant synchronization with regional Yellow Pages directories.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ACTIVE ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Scheduled Mailer Dispatches</h4>
              
              <div className="space-y-3">
                {[
                  {
                    id: 'LBD-9821',
                    type: 'Fridge Magnets (0.4mm Vinyl)',
                    qty: '2,500 Units',
                    zones: '5000 Adelaide CBD, 5067 Norwood',
                    status: 'In Production & Sorting',
                    date: 'September 12, 2026',
                    tracking: 'AUPOST-REG-94819'
                  },
                  {
                    id: 'LBD-9740',
                    type: 'DL Full Color Gloss Flyers',
                    qty: '5,000 Units',
                    zones: '5045 Glenelg, 5066 Burnside',
                    status: 'Delivered to Letterboxes',
                    date: 'August 24, 2026',
                    tracking: 'AUPOST-REG-84712'
                  }
                ].map(order => (
                  <div key={order.id} className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center shrink-0">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-900">{order.id}</span>
                          <Badge className="text-[9px] bg-emerald-50 text-emerald-700 border-emerald-200">
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-zinc-600 mt-0.5">{order.type} • {order.qty}</p>
                        <p className="text-[9.5px] text-zinc-400 font-mono mt-0.5">Target: {order.zones}</p>
                      </div>
                    </div>
                    <div className="text-right text-[10px] text-zinc-400 font-mono">
                      <p>Dispatch: {order.date}</p>
                      <p className="text-emerald-700 font-semibold">{order.tracking}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
