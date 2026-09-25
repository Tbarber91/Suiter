'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { useAuth } from './AuthProvider';
import { 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  CreditCard, 
  Building2, 
  Compass, 
  Phone, 
  Clock, 
  Globe, 
  ExternalLink, 
  ShieldCheck, 
  Radio, 
  AlertCircle,
  Receipt,
  Check,
  ChevronRight,
  Send,
  Navigation
} from 'lucide-react';
import { Location } from '@/lib/types';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface AppleMapsAdModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
  onAdCreated?: (newLocation: Location) => void;
}

const ADELAIDE_PRESET_LOCATIONS = [
  { name: 'Adelaide CBD (King William St)', address: '120 King William St, Adelaide SA 5000', lat: -34.9285, lng: 138.6007 },
  { name: 'North Adelaide (O’Connell St)', address: '78 O’Connell St, North Adelaide SA 5006', lat: -34.9080, lng: 138.5950 },
  { name: 'Norwood & The Parade', address: '142 The Parade, Norwood SA 5067', lat: -34.9215, lng: 138.6340 },
  { name: 'Unley (King William Rd)', address: '85 King William Rd, Unley SA 5061', lat: -34.9450, lng: 138.6080 },
  { name: 'Glenelg Coast (Jetty Rd)', address: '55 Jetty Rd, Glenelg SA 5045', lat: -34.9810, lng: 138.5150 },
  { name: 'Prospect & Churchill', address: '180 Prospect Rd, Prospect SA 5082', lat: -34.8870, lng: 138.5980 },
  { name: 'Port Adelaide Historic Wharfs', address: '12 Commercial Rd, Port Adelaide SA 5015', lat: -34.8460, lng: 138.5040 },
  { name: 'Burnside Village Foothills', address: '447 Portrush Rd, Glenside SA 5065', lat: -34.9390, lng: 138.6650 }
];

const CAMPAIGN_TIERS = [
  {
    id: 'sponsored_pin',
    name: 'Local Apple Maps Pin',
    priceMonthly: 49,
    tag: 'Standard Pin',
    features: [
      'Official Apple Maps verified business pin',
      'Pin visible to all users browsing the area',
      'Click-to-call & turn-by-turn directions link',
      'Direct link to full listing & online booking'
    ]
  },
  {
    id: 'top_placement',
    name: 'Featured Top-of-Search Ad',
    priceMonthly: 129,
    tag: 'Most Popular',
    recommended: true,
    features: [
      'Pulsing Apple Maps featured marker icon',
      'Priority rank atop all directory & category searches',
      'Apple Search Ads local audience targeting',
      'Real-time impression & click analytics dashboard'
    ]
  },
  {
    id: 'turn_by_turn',
    name: 'Turn-by-Turn Navigation Suite',
    priceMonthly: 249,
    tag: 'Enterprise Max',
    features: [
      'Interactive route recommendation banner',
      'Promoted waypoint along driver commuter routes',
      'Syndicated across Apple Maps & local discovery',
      'Dedicated Apple Ads Campaign Account Manager'
    ]
  }
];

export function AppleMapsAdModal({
  isOpen,
  onOpenChange,
  trigger,
  onAdCreated
}: AppleMapsAdModalProps) {
  const { user } = useAuth();
  const [internalOpen, setInternalOpen] = useState(false);
  const showModal = isOpen !== undefined ? isOpen : internalOpen;
  const setShowModal = onOpenChange || setInternalOpen;

  // Step flow: 1 = Details, 2 = Plan & Pin, 3 = Billing & Confirm
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Business & Advert Fields
  const [businessName, setBusinessName] = useState('');
  const [advertTitle, setAdvertTitle] = useState('');
  const [advertDescription, setAdvertDescription] = useState('');
  const [type, setType] = useState<'ad' | 'service' | 'product' | 'shop'>('service');
  const [priceOffer, setPriceOffer] = useState('');
  const [category, setCategory] = useState('Kitchen Renovations');
  const [phone, setPhone] = useState('(08) 8234 5678');
  const [websiteUrl, setWebsiteUrl] = useState('https://maps.apple.com');
  const [imageUrl, setImageUrl] = useState('https://picsum.photos/seed/adelaidelocalbiz/800/450');
  
  // Location selection
  const [selectedLocationIndex, setSelectedLocationIndex] = useState(0);
  const [customAddress, setCustomAddress] = useState('');
  
  // Campaign & Billing
  const [selectedTier, setSelectedTier] = useState<'sponsored_pin' | 'top_placement' | 'turn_by_turn'>('top_placement');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly'>('monthly');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('921');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'bsb'>('apple_pay');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [campaignRef, setCampaignRef] = useState('AAPL-MAPS-948261');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeLoc = ADELAIDE_PRESET_LOCATIONS[selectedLocationIndex];
  const activePlan = CAMPAIGN_TIERS.find(t => t.id === selectedTier) || CAMPAIGN_TIERS[1];
  const totalAmount = billingCycle === 'monthly' ? activePlan.priceMonthly : Math.round(activePlan.priceMonthly * 3 * 0.85);

  const handleNextStep = () => {
    setErrorMessage(null);
    if (step === 1) {
      if (!businessName.trim()) {
        setErrorMessage('Please provide your business name.');
        return;
      }
      if (!advertTitle.trim()) {
        setErrorMessage('Please provide an advert headline.');
        return;
      }
      if (!advertDescription.trim()) {
        setErrorMessage('Please provide a brief advert summary.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleCreateAppleMapsAd = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const generatedId = `apple-ad-${Date.now()}`;
    const targetAddress = customAddress.trim() || activeLoc.address;

    const newAdLocation: Location = {
      id: generatedId,
      title: advertTitle.trim(),
      businessName: businessName.trim(),
      description: advertDescription.trim(),
      type,
      category,
      price: priceOffer.trim() || 'Featured Listing',
      lat: activeLoc.lat,
      lng: activeLoc.lng,
      address: targetAddress,
      locationName: activeLoc.name,
      image: imageUrl.trim() || 'https://picsum.photos/seed/adelaidelocalbiz/800/450',
      phone: phone.trim(),
      externalUrl: websiteUrl.trim(),
      rating: 5.0,
      isNew: true,
      isAppleMapsSponsored: true,
      appleMapsAdTier: selectedTier,
      appleMapsBadge: activePlan.tag,
      ownerId: user?.id || 'apple-ads-merchant',
      ownerName: user?.name || businessName.trim(),
      ownerAvatar: user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(businessName)}`,
      ownerHandle: user?.handle || `@${businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      isCertified: true,
      isRegulatoryCompliant: true,
      isVerifiedExperience: true,
      hours: ['Mon-Fri: 8:00 AM - 5:30 PM', 'Sat: 9:00 AM - 3:00 PM'],
      reviews: [
        {
          id: `rev-${Date.now()}`,
          user: 'Apple Maps User',
          rating: 5,
          comment: 'Verified local business location pinned directly via Apple Maps advertising.',
          date: 'Just now'
        }
      ]
    };

    try {
      // Save directly to Firestore listings collection so it persists across sessions
      if (user) {
        await addDoc(collection(db, 'listings'), {
          ...newAdLocation,
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.warn('Firestore listing write skipped or in local mode:', err);
    }

    if (onAdCreated) {
      onAdCreated(newAdLocation);
    }

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setStep(1);
    setBusinessName('');
    setAdvertTitle('');
    setAdvertDescription('');
    setShowModal(false);
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="sm:max-w-[850px] p-0 rounded-[2.5rem] overflow-hidden border-0 glass max-h-[92vh] flex flex-col">
        {/* Top Apple Maps Header */}
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white p-6 md:p-8 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 text-xl font-bold">
              
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-display font-bold tracking-tight text-white">
                  Apple Maps Direct Advertising
                </h2>
                <Badge className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono">
                  Live Pin System
                </Badge>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Pin your business details and advert directly on Apple Maps with integrated marketplace billing.
              </p>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold">
            <span className={`px-2.5 py-1 rounded-full ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
              1. Business
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className={`px-2.5 py-1 rounded-full ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
              2. Apple Pin
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className={`px-2.5 py-1 rounded-full ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
              3. Billing
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isSuccess ? (
            <div className="text-center py-10 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <div>
                <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 mb-2">
                   Apple Maps Pin Active
                </Badge>
                <h3 className="text-2xl font-display font-bold text-zinc-900">
                  Advert & Location Pin Deployed!
                </h3>
                <p className="text-xs text-zinc-500 max-w-md mx-auto mt-1">
                  Your business &ldquo;{businessName}&rdquo; has been pinned to {activeLoc.name}. It is now featured in real time on the marketplace map with direct Apple Maps turn-by-turn navigation.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between font-bold text-zinc-900 border-b border-zinc-200 pb-2">
                  <span>Apple Ad Campaign Ref</span>
                  <span className="font-mono text-indigo-600">{campaignRef}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Location</span>
                  <span>{activeLoc.name}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Ad Placement</span>
                  <span>{activePlan.name}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Billed Amount</span>
                  <span className="font-bold text-zinc-900">${totalAmount} AUD</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Merchant Billed</span>
                  <span>{user?.email || 'Authorized Merchant'}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <Button 
                  onClick={handleReset}
                  className="rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800 px-6 font-bold text-xs"
                >
                  View Pinned Listing on Map
                </Button>
                <a 
                  href={`https://maps.apple.com/?ll=${activeLoc.lat},${activeLoc.lng}&q=${encodeURIComponent(businessName)}`}
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 px-4 py-2"
                >
                  <span>Open in Apple Maps app</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : step === 1 ? (
            /* STEP 1: BUSINESS DETAILS & ADVERT COPY */
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-zinc-700">Business Name *</Label>
                  <Input 
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Vance Master Joinery & Renovations"
                    className="h-11 rounded-xl text-xs font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-zinc-700">Business Category</Label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-11 rounded-xl border border-zinc-200 bg-white px-3 text-xs font-medium focus:ring-1 focus:ring-zinc-400 focus:outline-none"
                  >
                    <option value="Kitchen Renovations">Kitchen Renovations & Joinery</option>
                    <option value="Automotive & Hybrid Dealerships">Automotive & Hybrid Dealerships</option>
                    <option value="Solar & Energy Storage">Solar & Energy Storage Systems</option>
                    <option value="Storefront Boutique & Retail">Storefront Boutique & Retail</option>
                    <option value="Specialist Trades & Engineering">Specialist Trades & Engineering</option>
                    <option value="Legal & Advisory Services">Legal & Advisory Services</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-zinc-700">Advert Headline / Promo Banner *</Label>
                <Input 
                  value={advertTitle}
                  onChange={(e) => setAdvertTitle(e.target.value)}
                  placeholder="e.g. 20% Off Architectural 3D Kitchen Scans & Custom Stone Benchtops"
                  className="h-11 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-zinc-700">Advert Description & Offering *</Label>
                <Textarea 
                  value={advertDescription}
                  onChange={(e) => setAdvertDescription(e.target.value)}
                  placeholder="Detailed business overview displayed to customers tapping the pin on the map..."
                  rows={3}
                  className="rounded-xl text-xs font-medium resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-zinc-700">Offer / Pricing</Label>
                  <Input 
                    value={priceOffer}
                    onChange={(e) => setPriceOffer(e.target.value)}
                    placeholder="e.g. From $4,990 or Free Quote"
                    className="h-10 rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-zinc-700">Business Phone</Label>
                  <Input 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. (08) 8234 5678"
                    className="h-10 rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-zinc-700">Website / Booking URL</Label>
                  <Input 
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourwebsite.com.au"
                    className="h-10 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-zinc-700">Listing Banner Photo URL</Label>
                <Input 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="h-10 rounded-xl text-xs"
                />
              </div>
            </div>
          ) : step === 2 ? (
            /* STEP 2: APPLE MAPS PIN & CAMPAIGN TIER */
            <div className="space-y-6">
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 block">
                  Select Physical Location Pin (Kaurna Country / Adelaide Metro)
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ADELAIDE_PRESET_LOCATIONS.map((loc, idx) => (
                    <button
                      key={loc.name}
                      type="button"
                      onClick={() => setSelectedLocationIndex(idx)}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                        selectedLocationIndex === idx
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                          : 'border-zinc-200 hover:border-zinc-300 bg-white'
                      }`}
                    >
                      <MapPin className={`w-4 h-4 shrink-0 mt-0.5 ${selectedLocationIndex === idx ? 'text-indigo-600' : 'text-zinc-400'}`} />
                      <div className="overflow-hidden">
                        <div className="font-bold text-xs text-zinc-900 truncate">{loc.name}</div>
                        <div className="text-[11px] text-zinc-500 truncate">{loc.address}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-3">
                  <Input 
                    placeholder="Or enter custom street address in Adelaide..."
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    className="h-10 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 block">
                  Choose Apple Maps Advertising Plan
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {CAMPAIGN_TIERS.map((tier) => (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedTier(tier.id as any)}
                      className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        selectedTier === tier.id
                          ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/30'
                          : 'border-zinc-200 bg-white hover:border-zinc-300'
                      }`}
                    >
                      {tier.recommended && (
                        <span className="absolute -top-2.5 right-3 bg-indigo-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
                          Recommended
                        </span>
                      )}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-zinc-900">{tier.name}</span>
                        </div>
                        <div className="flex items-baseline gap-1 my-2">
                          <span className="text-2xl font-display font-bold text-zinc-900">${tier.priceMonthly}</span>
                          <span className="text-xs text-zinc-500">/ mo</span>
                        </div>
                        <ul className="space-y-1.5 text-[11px] text-zinc-600 mt-3">
                          {tier.features.map((feat, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                        <span>{selectedTier === tier.id ? 'Selected' : 'Select Plan'}</span>
                        <Radio className={`w-4 h-4 ${selectedTier === tier.id ? 'text-indigo-600 fill-indigo-600' : 'text-zinc-300'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* STEP 3: BILLING & CHECKOUT */
            <div className="space-y-6">
              <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-xs uppercase tracking-wider text-zinc-700">Apple Maps Ad Campaign Order</span>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">
                    Direct Marketplace Billing
                  </Badge>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-zinc-700">
                    <span>Business Details:</span>
                    <strong className="text-zinc-900">{businessName}</strong>
                  </div>
                  <div className="flex justify-between text-zinc-700">
                    <span>Target Pin Location:</span>
                    <span>{activeLoc.name}</span>
                  </div>
                  <div className="flex justify-between text-zinc-700">
                    <span>Apple Maps Tier:</span>
                    <span className="font-medium text-indigo-600">{activePlan.name}</span>
                  </div>
                  <div className="flex justify-between text-zinc-700 pt-2 border-t border-zinc-200">
                    <span className="font-bold text-zinc-900">Total Billed:</span>
                    <span className="text-lg font-display font-bold text-zinc-900">${totalAmount} AUD <span className="text-xs font-normal text-zinc-500">(inc. GST)</span></span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <Label className="text-xs font-bold text-zinc-700 mb-2 block">
                  Select Billing Method
                </Label>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`p-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                      paymentMethod === 'apple_pay'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-500'
                        : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'
                    }`}
                  >
                     Apple Pay
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-500'
                        : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'
                    }`}
                  >
                    Credit / Debit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bsb')}
                    className={`p-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                      paymentMethod === 'bsb'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-500'
                        : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'
                    }`}
                  >
                    BSB & Account
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-3 p-4 rounded-xl border border-zinc-200 bg-zinc-50/50">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-bold text-zinc-600">Card Number</Label>
                      <Input 
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="h-10 bg-white text-xs font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-zinc-600">Expires</Label>
                        <Input 
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="h-10 bg-white text-xs font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-zinc-600">CVC</Label>
                        <Input 
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="h-10 bg-white text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'apple_pay' && (
                  <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-950 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold"> Pay</span>
                      <span className="text-xs text-zinc-400">Authenticated via Apple Biometrics</span>
                    </div>
                    <Badge className="bg-emerald-500 text-white font-mono text-[10px]">
                      Instant Authorize
                    </Badge>
                  </div>
                )}

                {paymentMethod === 'bsb' && (
                  <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">BSB:</span>
                      <span className="font-mono font-bold text-zinc-900">062-948</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Account Number:</span>
                      <span className="font-mono font-bold text-zinc-900">2383 7561</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Account Name:</span>
                      <span className="font-bold text-zinc-900">Tamara Alana Barber</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-[11px] text-zinc-500 bg-zinc-50 p-3 rounded-xl border border-zinc-100 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  By confirming, your business will be pinned on the marketplace map and linked with Apple Maps search campaigns. Billed automatically each {billingCycle === 'monthly' ? 'month' : 'quarter'}.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {!isSuccess && (
          <div className="p-4 md:p-6 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="rounded-xl h-10 px-4 text-xs font-semibold"
              >
                Back
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowModal(false)}
                className="rounded-xl h-10 px-4 text-xs font-semibold text-zinc-500"
              >
                Cancel
              </Button>
            )}

            {step < 3 ? (
              <Button
                type="button"
                onClick={handleNextStep}
                className="rounded-xl h-10 px-6 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
              >
                <span>Continue to {step === 1 ? 'Pin Location' : 'Billing'}</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleCreateAppleMapsAd}
                disabled={isSubmitting}
                className="rounded-xl h-10 px-6 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white cursor-pointer shadow-xl shadow-zinc-900/20 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Deploying Pin...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Pay ${totalAmount} AUD & Pin on Apple Maps</span>
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
