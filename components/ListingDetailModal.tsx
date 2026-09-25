'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, MapPin, Phone, Clock, Star, 
  ExternalLink, ShieldCheck, Share2, 
  MessageSquare, Heart, Navigation, Award, CheckCircle2, UserCheck, Send
} from 'lucide-react';
import { Location, Review } from '@/lib/types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { ChatModal } from './ChatModal';
import { PublicProfileModal } from './PublicProfileModal';
import { InstantBookingModal } from './InstantBookingModal';
import { Calendar } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { computeRatingStats } from '@/lib/transactions';
import { RatingDisplay } from './RatingDisplay';
import { LeaveReviewModal } from './LeaveReviewModal';

interface ListingDetailModalProps {
  location: Location | null;
  onClose: () => void;
}

export function ListingDetailModal({ location, onClose }: ListingDetailModalProps) {
  const { user } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPublicProfileOpen, setIsPublicProfileOpen] = useState(false);
  const [isLeaveReviewOpen, setIsLeaveReviewOpen] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedStar, setSelectedStar] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [localReviews, setLocalReviews] = useState<Review[]>([]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim() || !location) return;

    const timestamp = Date.now();
    const newRev: Review = {
      id: `rev-${timestamp}`,
      user: user?.name || 'Anonymous User',
      avatar: user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${timestamp}`,
      rating: selectedStar,
      comment: reviewComment.trim(),
      date: 'Just now'
    };

    setLocalReviews(prev => [newRev, ...prev]);
    setReviewComment('');
    setShowReviewForm(false);

    try {
      if (!location.id.startsWith('yp-') && !location.id.startsWith('mock-')) {
        const listingRef = doc(db, 'listings', location.id);
        const updatedReviews = [newRev, ...(location.reviews || []), ...localReviews];
        const avgRating = Number((updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length).toFixed(1));
        await setDoc(listingRef, { reviews: updatedReviews, rating: avgRating }, { merge: true });
      }
    } catch (err) {
      console.log("Review saved locally:", err);
    }
  };

  if (!location) return null;

  const allReviews = [...(location.reviews || []), ...localReviews];
  const ratingStats = computeRatingStats(allReviews, location.rating);

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl h-full max-h-[90vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden shadow-black/20"
          >
            <div className="flex h-full flex-col md:flex-row">
              {/* Left side: Hero Image */}
              <div className="relative w-full md:w-1/2 h-64 md:h-auto overflow-hidden group">
                <img 
                  src={location.image} 
                  alt={location.title}
                  className="w-full h-full object-cover grayscale-[10%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                
                <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                  <Badge className="bg-white/90 backdrop-blur-md text-zinc-900 border-0 text-[10px] font-black uppercase tracking-widest h-8 px-4 rounded-xl shadow-xl">
                    {location.type}
                  </Badge>
                  {location.source && (
                    <Badge className="bg-amber-500 text-white shadow-xl text-[10px] font-black uppercase tracking-widest h-8 px-4 rounded-xl border-0">
                      {location.source}
                    </Badge>
                  )}
                </div>

                <div className="absolute bottom-8 left-8 right-8">
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight drop-shadow-lg mb-2">
                    {location.title}
                  </h2>
                  <div className="flex items-center gap-3 text-white/90 text-sm font-medium flex-wrap">
                    <span className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs">
                      <MapPin className="w-3.5 h-3.5" />
                      Adelaide, SA
                    </span>
                    <span className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {ratingStats.average.toFixed(1)} Rating ({ratingStats.count} {ratingStats.count === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                </div>
              </div>

              {/* Right side: Information */}
              <div className="flex-1 flex flex-col bg-zinc-50/50">
                <header className="p-6 border-b border-zinc-100 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-zinc-900 flex items-center justify-center text-white shadow-lg">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded w-fit">Verified Listing</span>
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">Enterprise Registry</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="rounded-full h-9 w-9 border-zinc-100 hover:bg-zinc-50 shadow-sm">
                      <Share2 className="w-4 h-4 text-zinc-600" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full h-9 w-9 border-zinc-100 hover:bg-zinc-50 shadow-sm">
                      <Heart className="w-4 h-4 text-zinc-600" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-9 w-9 hover:bg-zinc-100 transition-all">
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </header>

                <ScrollArea className="flex-1">
                  <div className="p-8 space-y-8">
                    {/* Apple Maps Sponsored Banner */}
                    {location.isAppleMapsSponsored && (
                      <section className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white p-5 rounded-3xl border border-indigo-500/30 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-white text-xl font-black">
                              
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-display font-black text-sm text-white">Apple Maps Sponsored Listing</span>
                                <span className="text-[9px] bg-emerald-500 text-zinc-950 font-black uppercase px-2 py-0.5 rounded-md">
                                  {location.appleMapsBadge || 'Featured Pin'}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-300 mt-1">
                                {location.businessName ? `Direct advertising pinned to ${location.businessName}.` : 'Verified business location with direct Apple Maps navigation.'}
                              </p>
                              {location.address && (
                                <p className="text-[11px] text-zinc-400 font-mono mt-0.5 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-indigo-400" />
                                  {location.address}
                                </p>
                              )}
                            </div>
                          </div>
                          <a
                            href={`https://maps.apple.com/?ll=${location.lat},${location.lng}&q=${encodeURIComponent(location.title)}&daddr=${location.lat},${location.lng}&dirflg=d`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-bold flex items-center gap-1.5 shadow-md shrink-0 transition-all cursor-pointer"
                          >
                            <span className="font-bold text-sm"></span>
                            <span>Apple Maps</span>
                            <ExternalLink className="w-3 h-3 text-zinc-600" />
                          </a>
                        </div>
                      </section>
                    )}

                    {/* Merchant / Seller Profile Section */}
                    <section 
                      onClick={() => setIsPublicProfileOpen(true)}
                      className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200/80 shadow-sm cursor-pointer hover:border-indigo-300 hover:bg-zinc-100/70 transition-all group/seller"
                      title="Click to view detailed seller profile, skills, services & portfolio"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                          Seller & Business Profile
                        </h4>
                        <span className="text-[10px] font-bold text-indigo-600 group-hover/seller:translate-x-0.5 transition-transform flex items-center gap-1">
                          View Full Profile ↗
                        </span>
                      </div>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-14 w-14 border-2 border-white shadow-md ring-1 ring-zinc-200 shrink-0">
                          <AvatarImage 
                            src={location.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(location.businessName || location.title)}`} 
                            alt={location.businessName || location.title} 
                          />
                          <AvatarFallback className="bg-zinc-900 text-white font-bold text-sm">
                            {(location.businessName || location.title).charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-zinc-900 tracking-tight group-hover/seller:text-indigo-600 transition-colors">
                              {location.businessName || location.title.split(' ')[0] + ' Enterprises'}
                            </h4>
                            <span className="text-[9px] font-mono text-zinc-500 bg-white px-2 py-0.5 rounded border border-zinc-200">
                              {location.ownerHandle ? `@${location.ownerHandle.replace(/^@/, '')}` : '@verified_merchant'}
                            </span>
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Verified Identity
                            </span>
                          </div>
                          <p className="text-xs text-zinc-600 mt-1 line-clamp-2 leading-relaxed font-medium">
                            {location.address 
                              ? `Established business operating from ${location.address}. Specializing in ${location.category || 'local services and trade'}.`
                              : `Local verified operator based in Adelaide / Kaurna Country. Member of South Australia Fair Trading Code of Practice.`}
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Visual Badges for Certification & Compliance */}
                    <section className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3">Verification & Credentials</h4>
                      <div className="flex flex-wrap gap-2.5">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-black tracking-tight">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Certified</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-black tracking-tight">
                          <ShieldCheck className="w-4 h-4 text-indigo-600" />
                          <span>Regulatory Compliant</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black tracking-tight">
                          <UserCheck className="w-4 h-4 text-amber-600" />
                          <span>Verified Experience</span>
                        </div>
                      </div>
                    </section>

                    {/* Description Section */}
                    <section>
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-3">About Listing</h3>
                      <p className="text-base text-zinc-700 font-medium leading-relaxed">
                        {location.description}
                      </p>
                    </section>

                    {/* Contact & Meta Section */}
                    <div className="grid grid-cols-2 gap-4">
                      {location.phone && (
                        <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm">
                          <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900">
                            <Phone className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Phone</span>
                            <span className="font-bold text-xs text-zinc-900">{location.phone}</span>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm">
                        <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900">
                          <Navigation className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Location</span>
                          <span className="font-bold text-xs text-zinc-900">Adelaide CBD</span>
                        </div>
                      </div>
                    </div>

                    {/* Hours Section */}
                    {location.hours && (
                      <section className="bg-zinc-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                        <div className="relative z-10">
                           <div className="flex items-center gap-2 mb-4">
                             <Clock className="w-4 h-4 text-indigo-400" />
                             <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Trading Hours</h3>
                           </div>
                           <div className="space-y-2">
                             {location.hours.map((hour, idx) => (
                               <p key={idx} className="text-sm font-semibold tracking-tight border-b border-white/10 pb-1.5 flex justify-between">
                                 {hour}
                               </p>
                             ))}
                           </div>
                        </div>
                      </section>
                    )}

                    {/* Reviews Section */}
                    <section className="space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">User Reviews & Ratings</h3>
                          <p className="text-[11px] text-zinc-500 mt-0.5">Community feedback verified against local Adelaide engagements</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsLeaveReviewOpen(true)}
                            className="rounded-xl h-8 px-3 border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[11px] cursor-pointer shadow-xs flex items-center gap-1.5"
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span>Rate & Review (1-5★)</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowReviewForm(!showReviewForm)}
                            className="rounded-xl h-8 text-zinc-600 font-bold text-[10px] cursor-pointer"
                          >
                            {showReviewForm ? 'Cancel' : 'Quick Comment'}
                          </Button>
                        </div>
                      </div>

                      {/* Detailed Rating Breakdown Banner */}
                      <RatingDisplay 
                        stats={ratingStats} 
                        onOpenReviewModal={() => setIsLeaveReviewOpen(true)}
                      />

                      {showReviewForm && (
                        <form onSubmit={handleAddReview} className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 space-y-4 animate-in fade-in">
                          <div>
                            <span className="text-xs font-bold text-zinc-700 block mb-2">Select Rating:</span>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  type="button"
                                  key={star}
                                  onClick={() => setSelectedStar(star)}
                                  className={`p-2 rounded-lg border transition-all cursor-pointer ${
                                    selectedStar >= star ? 'bg-amber-100 border-amber-300 text-amber-600' : 'bg-white border-zinc-200 text-zinc-400'
                                  }`}
                                >
                                  <Star className={`w-4 h-4 ${selectedStar >= star ? 'fill-amber-400' : ''}`} />
                                </button>
                              ))}
                            </div>
                          </div>

                          <Textarea
                            placeholder="Share your experience with this service or product..."
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            className="bg-white border-zinc-200 rounded-xl text-xs min-h-[80px]"
                          />

                          <Button type="submit" className="rounded-xl h-10 px-5 bg-zinc-900 text-white font-bold text-xs cursor-pointer">
                            <Send className="w-3.5 h-3.5 mr-1.5" /> Post Review
                          </Button>
                        </form>
                      )}

                      <div className="space-y-3">
                        {allReviews.length === 0 ? (
                          <div className="text-center py-8 px-4 border-2 border-dashed border-zinc-200 rounded-2xl bg-white">
                            <Star className="w-6 h-6 text-zinc-300 mx-auto mb-1.5" />
                            <p className="text-xs text-zinc-600 font-bold">No verified reviews recorded yet</p>
                            <p className="text-[11px] text-zinc-400 mt-0.5">Be the first client or buyer to rate this service or ad.</p>
                            <Button
                              size="sm"
                              onClick={() => setIsLeaveReviewOpen(true)}
                              className="mt-3 rounded-xl h-8 px-3 bg-zinc-900 text-white font-bold text-[11px] cursor-pointer"
                            >
                              Leave First Review
                            </Button>
                          </div>
                        ) : (
                          allReviews.map((review) => (
                            <div key={review.id} className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm space-y-2.5">
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8 rounded-full">
                                    <AvatarImage src={review.avatar} />
                                    <AvatarFallback className="bg-zinc-900 text-white text-[10px] font-black">{review.user.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="text-xs font-black text-zinc-900 uppercase tracking-tighter">{review.user}</span>
                                      {(review.verifiedTransaction || review.transactionId) && (
                                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[8px] font-bold py-0 flex items-center gap-1">
                                          <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                                          Verified Transaction
                                        </Badge>
                                      )}
                                    </div>
                                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{review.date}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-2.5 h-2.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'}`} />
                                  ))}
                                  <span className="text-[10px] font-black text-amber-900 ml-1">{review.rating}.0</span>
                                </div>
                              </div>

                              {/* Aspect tags if present */}
                              {review.aspects && (
                                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                                  {review.aspects.quality && (
                                    <span className="text-[10px] font-semibold bg-zinc-50 border border-zinc-200 text-zinc-600 px-2 py-0.5 rounded-md">
                                      Quality: {review.aspects.quality}★
                                    </span>
                                  )}
                                  {review.aspects.communication && (
                                    <span className="text-[10px] font-semibold bg-zinc-50 border border-zinc-200 text-zinc-600 px-2 py-0.5 rounded-md">
                                      Communication: {review.aspects.communication}★
                                    </span>
                                  )}
                                  {review.aspects.punctuality && (
                                    <span className="text-[10px] font-semibold bg-zinc-50 border border-zinc-200 text-zinc-600 px-2 py-0.5 rounded-md">
                                      Punctuality: {review.aspects.punctuality}★
                                    </span>
                                  )}
                                  {review.aspects.value && (
                                    <span className="text-[10px] font-semibold bg-zinc-50 border border-zinc-200 text-zinc-600 px-2 py-0.5 rounded-md">
                                      Value: {review.aspects.value}★
                                    </span>
                                  )}
                                </div>
                              )}

                              <p className="text-xs text-zinc-600 font-medium leading-relaxed italic">
                                &quot;{review.comment}&quot;
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </section>
                  </div>
                </ScrollArea>

                <footer className="p-6 border-t border-zinc-100 bg-white">
                  <div className="flex flex-wrap items-center gap-3">
                    <InstantBookingModal
                      listingTitle={location.title}
                      listingPrice={location.price}
                      initialCategory={
                        location.category?.toLowerCase().includes('kitchen') ? 'kitchen_renovation' :
                        location.category?.toLowerCase().includes('car') || location.title?.toLowerCase().includes('car') ? 'cars_secondhand' :
                        location.category?.toLowerCase().includes('site') ? 'building_sites' : 'applications'
                      }
                      trigger={
                        <Button 
                          className="flex-1 rounded-2xl h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all border-0 cursor-pointer"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Instant Booking
                        </Button>
                      }
                    />
                    <Button 
                      onClick={() => setIsChatOpen(true)}
                      variant="outline"
                      className="rounded-2xl h-12 px-5 font-bold text-xs border-zinc-200 hover:bg-zinc-50 transition-all cursor-pointer"
                    >
                      <MessageSquare className="mr-2 h-4 w-4 text-indigo-600" />
                      In-App Message
                    </Button>
                    <a
                      href={`https://maps.apple.com/?ll=${location.lat},${location.lng}&q=${encodeURIComponent(location.title)}&daddr=${location.lat},${location.lng}&dirflg=d`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex shrink-0 items-center justify-center rounded-2xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-950 h-12 px-4 font-bold text-xs transition-all cursor-pointer"
                      title="Open in Apple Maps"
                    >
                      <span className="font-bold text-sm mr-1.5"></span>
                      <span>Apple Maps</span>
                    </a>
                    {location.externalUrl && (
                      <a
                        href={location.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-background hover:bg-zinc-50 h-12 px-5 font-bold text-xs transition-all"
                      >
                        <ExternalLink className="w-4 h-4 mr-1.5" /> Provider
                      </a>
                    )}
                  </div>
                </footer>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      <ChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        listing={location} 
      />

      <LeaveReviewModal
        isOpen={isLeaveReviewOpen}
        onClose={() => setIsLeaveReviewOpen(false)}
        listingId={location.id}
        listingTitle={location.title}
        onReviewSubmitted={(newReview) => {
          setLocalReviews((prev) => [newReview, ...prev]);
        }}
      />
    </>
  );
}
