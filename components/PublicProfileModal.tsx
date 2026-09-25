'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { 
  ShieldCheck, 
  MapPin, 
  Star, 
  Clock, 
  MessageSquare, 
  Calendar, 
  Tag, 
  Briefcase, 
  Image as ImageIcon, 
  Award, 
  CheckCircle2, 
  Phone, 
  ExternalLink, 
  X,
  Layers,
  Sparkles,
  Lock
} from 'lucide-react';
import { UserProfile, Location, PortfolioItem, ServiceOffered, Review } from '@/lib/types';
import { InstantBookingModal } from './InstantBookingModal';

interface PublicProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: UserProfile | null;
  providerName?: string;
  providerHandle?: string;
  providerAvatar?: string;
  providerLocation?: string;
  providerBio?: string;
  providerSkills?: string[];
  providerServices?: ServiceOffered[];
  providerPortfolio?: PortfolioItem[];
  providerReviews?: Review[];
  providerListings?: Location[];
  onOpenChat?: (name: string, handle: string, listingTitle?: string) => void;
}

export function PublicProfileModal({
  isOpen,
  onClose,
  profile,
  providerName,
  providerHandle,
  providerAvatar,
  providerLocation,
  providerBio,
  providerSkills,
  providerServices,
  providerPortfolio,
  providerReviews,
  providerListings = [],
  onOpenChat,
}: PublicProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'portfolio' | 'reviews' | 'listings'>('overview');

  const displayName = profile?.name || providerName || 'Verified Merchant';
  const displayHandle = profile?.handle || providerHandle || '@merchant';
  const cleanHandle = displayHandle.startsWith('@') ? displayHandle : `@${displayHandle}`;
  const avatar = profile?.avatarUrl || providerAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`;
  const location = profile?.location || providerLocation || 'Tarntanya / Adelaide SA';
  const bio = profile?.bio || providerBio || 'Verified enterprise merchant and professional service provider operating in the greater Adelaide metropolitan area and across Kaurna Country.';

  const skills = profile?.skills || providerSkills || [
    'Bespoke Joinery',
    'Building Code AS 4386',
    '3D Spatial Scans',
    'Master Builder Certification',
    'Sustainable Architecture'
  ];

  const services: ServiceOffered[] = profile?.servicesProvided || providerServices || [
    {
      id: 'srv-1',
      title: 'Architectural Joinery & Custom Cabinetry Consultation',
      description: 'Comprehensive 3D laser survey, material sample review, and Australian Standard structural sign-off.',
      price: 'From $1,200',
      category: 'Kitchen Renovations',
      turnaround: '2-3 Weeks'
    },
    {
      id: 'srv-2',
      title: 'Statutory Building Code & Site Compliance Inspection',
      description: 'On-site feasibility appraisal, boundary contour check, and rapid builder certification report.',
      price: '$650 Fixed',
      category: 'Sites & Feasibility',
      turnaround: '48 Hours'
    }
  ];

  const portfolio: PortfolioItem[] = profile?.portfolio || providerPortfolio || [
    {
      id: 'p-1',
      title: 'Prestige Parade Heritage Kitchen Overhaul',
      description: 'Handcrafted walnut cabinetry with waterfall engineered quartz benchtops and concealed LED illumination.',
      image: 'https://picsum.photos/seed/norwoodkitchens/800/450',
      category: 'Kitchen Renovations',
      date: 'August 2026'
    },
    {
      id: 'p-2',
      title: 'Unley Architectural Contour & LiDAR Survey',
      description: 'Millimeter-accurate 3D point cloud scan for luxury double-storey residential extension.',
      image: 'https://picsum.photos/seed/constructionsiteunley/800/450',
      category: 'Sites & Feasibility',
      date: 'July 2026'
    }
  ];

  const reviews: Review[] = providerReviews || [
    {
      id: 'rev-1',
      user: 'Julian Hastings',
      rating: 5,
      comment: 'Exceptional craftsmanship and clear communication from design conception through to final handover.',
      date: '1 week ago',
      verifiedTransaction: true,
      aspectRatings: { communication: 5, quality: 5, punctuality: 5, value: 5 }
    },
    {
      id: 'rev-2',
      user: 'Sarah M.',
      rating: 5,
      comment: 'Prompt and highly professional. Delivered comprehensive documentation and flawless finish.',
      date: '3 weeks ago',
      verifiedTransaction: true,
      aspectRatings: { communication: 5, quality: 5, punctuality: 4, value: 5 }
    }
  ];

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  const handleStartChat = (listingTitle?: string) => {
    onClose();
    if (onOpenChat) {
      onOpenChat(displayName, cleanHandle, listingTitle);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[780px] rounded-[2.5rem] p-0 border-0 overflow-hidden shadow-2xl bg-white max-h-[92vh] flex flex-col">
        {/* Header Hero Banner */}
        <div className="relative bg-zinc-950 text-white p-6 pb-5 shrink-0 overflow-hidden">
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-white/40 shadow-xl ring-2 ring-white/10">
                <AvatarImage src={avatar} alt={displayName} className="object-cover" />
                <AvatarFallback className="bg-zinc-800 text-white font-bold text-lg">
                  {displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-display font-bold text-white tracking-tight">{displayName}</h2>
                  <Badge className="bg-emerald-500 text-zinc-950 font-black text-[9px] uppercase tracking-wider">
                    <ShieldCheck className="w-3 h-3 mr-1 inline" />
                    Verified Provider
                  </Badge>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-zinc-300 font-mono mt-1 flex-wrap">
                  <span className="text-indigo-400 font-semibold">{cleanHandle}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-zinc-300">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    {location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full text-[11px] font-bold border border-amber-400/30">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {avgRating} ({reviews.length} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleStartChat()}
                className="rounded-xl h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message Provider</span>
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mt-5 border-t border-zinc-800/80 pt-4 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'overview', label: 'Overview & Bio', icon: Briefcase },
              { id: 'services', label: `Services (${services.length})`, icon: Tag },
              { id: 'portfolio', label: `Portfolio (${portfolio.length})`, icon: ImageIcon },
              { id: 'reviews', label: `Reviews (${reviews.length})`, icon: Star },
              { id: 'listings', label: `Marketplace Ads (${providerListings.length})`, icon: Layers },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-white text-zinc-950 shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-zinc-900' : 'text-zinc-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Body */}
        <ScrollArea className="flex-1 p-6 bg-zinc-50/50">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Bio Card */}
              <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-2.5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                  About {displayName}
                </h3>
                <p className="text-xs text-zinc-700 leading-relaxed font-medium">
                  {bio}
                </p>
              </div>

              {/* Skills Offered */}
              <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                    Skills & Verified Capabilities
                  </h3>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {skills.length} Endorsed
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-indigo-50 hover:text-indigo-700 text-zinc-700 text-xs font-semibold border border-zinc-200/60 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Certification & Compliance Signals */}
              <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                  Trust & Security Credentials
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-950 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Certified Trader</span>
                    </div>
                    <span className="text-[10px] text-emerald-800">Verified Consumer & Business Services (CBS) status.</span>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200/80 text-indigo-950 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Lock className="w-4 h-4 text-indigo-600" />
                      <span>Secure Enclave</span>
                    </div>
                    <span className="text-[10px] text-indigo-800">E2EE communications & private compute vault.</span>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-950 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span>Fair Trading</span>
                    </div>
                    <span className="text-[10px] text-amber-800">Committed to South Australia Fair Trading Standards.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SERVICES PROVIDED */}
          {activeTab === 'services' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-between px-1">
                <p className="text-xs text-zinc-500">
                  Book directly or send an in-app enquiry to request a custom quote.
                </p>
                <span className="text-xs font-bold text-zinc-900">{services.length} services available</span>
              </div>

              {services.map((srv) => (
                <div 
                  key={srv.id}
                  className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-zinc-900">{srv.title}</h4>
                        {srv.category && (
                          <span className="text-[9px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                            {srv.category}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{srv.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-base font-black tracking-tight text-zinc-900">{srv.price}</span>
                      {srv.turnaround && (
                        <span className="block text-[10px] font-bold text-zinc-400">⏱ {srv.turnaround}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartChat(srv.title)}
                      className="rounded-xl h-8 px-3 text-xs font-bold border-zinc-200 text-zinc-700 hover:bg-zinc-50 cursor-pointer flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                      Enquire
                    </Button>
                    <InstantBookingModal
                      listingTitle={srv.title}
                      listingPrice={srv.price}
                      trigger={
                        <Button
                          size="sm"
                          className="rounded-xl h-8 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm cursor-pointer flex items-center gap-1"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          Book Now
                        </Button>
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: PORTFOLIO & WORK EXAMPLES */}
          {activeTab === 'portfolio' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-between px-1">
                <p className="text-xs text-zinc-500">Completed client projects and verified workmanship.</p>
                <span className="text-xs font-bold text-zinc-900">{portfolio.length} project showcases</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {portfolio.map((item) => (
                  <div
                    key={item.id}
                    className="group rounded-2xl overflow-hidden bg-white border border-zinc-200/80 shadow-sm hover:shadow-md transition-all flex flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {item.category && (
                        <span className="absolute top-2 left-2 text-[9px] font-black uppercase tracking-wider text-zinc-900 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-lg shadow-sm">
                          {item.category}
                        </span>
                      )}
                      {item.date && (
                        <span className="absolute bottom-2 right-2 text-[9px] font-bold text-white bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-lg">
                          {item.date}
                        </span>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-zinc-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-600 font-display font-black text-xl">
                    {avgRating}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900">Aggregate Client Rating</h4>
                    <p className="text-xs text-zinc-500">Based on {reviews.length} verified completed transactions</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7 border border-zinc-200">
                          <AvatarImage src={rev.avatar} />
                          <AvatarFallback className="text-[10px] font-bold">{rev.user.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-zinc-900">{rev.user}</span>
                            {rev.verifiedTransaction && (
                              <Badge className="bg-emerald-50 text-emerald-700 text-[8px] border-emerald-200 py-0">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <span className="text-[10px] text-zinc-400">{rev.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-600 italic leading-relaxed">&ldquo;{rev.comment}&rdquo;</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: LISTINGS */}
          {activeTab === 'listings' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-between px-1">
                <p className="text-xs text-zinc-500">Active ads and services pinned to the marketplace map.</p>
                <span className="text-xs font-bold text-zinc-900">{providerListings.length} active listings</span>
              </div>

              {providerListings.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl bg-white border border-dashed border-zinc-200 text-zinc-400 text-xs">
                  No public classified ads posted currently. Enquire directly through the services tab.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {providerListings.map((loc) => (
                    <div
                      key={loc.id}
                      className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-sm flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        {loc.image && (
                          <img src={loc.image} alt={loc.title} className="w-full h-28 object-cover rounded-xl" />
                        )}
                        <h4 className="font-bold text-xs text-zinc-900 line-clamp-1">{loc.title}</h4>
                        <p className="text-[11px] text-zinc-500 line-clamp-2">{loc.description}</p>
                      </div>
                      <div className="flex items-center justify-between pt-3 mt-2 border-t border-zinc-100 text-xs">
                        <span className="font-black text-zinc-900">{loc.price}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStartChat(loc.title)}
                          className="h-7 text-[10px] font-bold rounded-lg border-zinc-200"
                        >
                          Enquire
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
