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
import { useAuth } from './AuthProvider';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface ListingDetailModalProps {
  location: Location | null;
  onClose: () => void;
}

export function ListingDetailModal({ location, onClose }: ListingDetailModalProps) {
  const { user } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedStar, setSelectedStar] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [localReviews, setLocalReviews] = useState<Review[]>([]);

  if (!location) return null;

  const allReviews = [...(location.reviews || []), ...localReviews];

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const newRev: Review = {
      id: 'rev-' + Date.now(),
      user: user?.name || 'Anonymous User',
      avatar: user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
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
        const updatedReviews = [newRev, ...allReviews];
        const avgRating = Number((updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length).toFixed(1));
        await setDoc(listingRef, { reviews: updatedReviews, rating: avgRating }, { merge: true });
      }
    } catch (err) {
      console.log("Review saved locally:", err);
    }
  };

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
                    {location.rating && (
                      <span className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {location.rating} Rating
                      </span>
                    )}
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
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">User Reviews & Ratings</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowReviewForm(!showReviewForm)}
                          className="rounded-xl h-8 border-zinc-200 font-bold text-[10px] cursor-pointer"
                        >
                          {showReviewForm ? 'Cancel' : 'Write Review'}
                        </Button>
                      </div>

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

                          <Button type="submit" className="rounded-xl h-10 px-5 bg-zinc-900 text-white font-bold text-xs">
                            <Send className="w-3.5 h-3.5 mr-1.5" /> Post Review
                          </Button>
                        </form>
                      )}

                      <div className="space-y-3">
                        {allReviews.length === 0 ? (
                          <p className="text-xs text-zinc-400 italic">No reviews yet. Be the first to review!</p>
                        ) : (
                          allReviews.map((review) => (
                            <div key={review.id} className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8 rounded-full">
                                    <AvatarImage src={review.avatar} />
                                    <AvatarFallback className="bg-zinc-900 text-white text-[10px] font-black">{review.user.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <span className="text-xs font-black text-zinc-900 uppercase tracking-tighter">{review.user}</span>
                                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{review.date}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-2.5 h-2.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'}`} />
                                  ))}
                                </div>
                              </div>
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
                  <div className="flex items-center gap-3">
                    <Button 
                      onClick={() => setIsChatOpen(true)}
                      className="flex-1 rounded-2xl h-12 bg-zinc-900 font-bold text-sm shadow-xl shadow-zinc-200 hover:bg-zinc-800 transition-all border-0 cursor-pointer"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      In-App Message
                    </Button>
                    {location.externalUrl && (
                      <a
                        href={location.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-background hover:bg-zinc-50 h-12 px-6 font-bold text-xs transition-all"
                      >
                        <ExternalLink className="w-4 h-4 mr-1.5" /> External Link
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
    </>
  );
}
