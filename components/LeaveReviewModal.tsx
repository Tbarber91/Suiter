'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ThumbsUp, 
  Clock, 
  MessageSquare, 
  DollarSign, 
  Award,
  Send,
  X
} from 'lucide-react';
import { Transaction, Review, ReviewAspects, Location } from '@/lib/types';
import { submitTransactionReview, recordTransaction } from '@/lib/transactions';
import { useAuth } from './AuthProvider';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface LeaveReviewModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
  transaction?: Transaction | null;
  listing?: Location | null;
  onReviewSubmitted?: (review: Review, transaction: Transaction | null) => void;
}

const STAR_LABELS: Record<number, { title: string; desc: string; color: string }> = {
  1: { title: 'Disappointing', desc: 'Significant issues encountered with the service or ad', color: 'text-rose-500' },
  2: { title: 'Needs Improvement', desc: 'Below expected standards or missing elements', color: 'text-amber-500' },
  3: { title: 'Satisfactory', desc: 'Acceptable service delivery matching basic description', color: 'text-amber-600' },
  4: { title: 'Very Good', desc: 'High quality outcome with reliable communication', color: 'text-emerald-600' },
  5: { title: 'Exceptional', desc: 'Flawless execution, superior standard & highly recommended', color: 'text-emerald-600' },
};

export function LeaveReviewModal({
  isOpen,
  onOpenChange,
  trigger,
  transaction,
  listing,
  onReviewSubmitted
}: LeaveReviewModalProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState<number>(transaction?.rating || 5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>(transaction?.reviewComment || '');
  
  // Specific aspects (1-5)
  const [aspects, setAspects] = useState<ReviewAspects>({
    quality: 5,
    communication: 5,
    punctuality: 5,
    value: 5
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Derive listing title & transaction info
  const targetTitle = transaction?.listingTitle || listing?.title || 'Selected Service';
  const targetCategory = transaction?.serviceCategory || listing?.category || 'Professional Trade';
  const targetPrice = transaction?.amount || transaction?.listingPrice || listing?.price || 'Completed Engagement';
  const activeRating = hoverRating || rating;
  const ratingDetails = STAR_LABELS[activeRating] || STAR_LABELS[5];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);

    try {
      let targetTxId = transaction?.id;

      // If review is opened directly from a listing without an existing transaction, create a verified transaction record
      if (!targetTxId && listing) {
        const newTx = recordTransaction({
          listingId: listing.id,
          listingTitle: listing.title,
          listingType: listing.type,
          listingImage: listing.image,
          listingPrice: listing.price,
          sellerName: listing.businessName || listing.ownerName || 'Verified Merchant',
          buyerId: user?.id || 'demo-user',
          buyerName: user?.name || 'Verified Buyer',
          buyerEmail: user?.email || 'verified@adelaide.com.au',
          amount: listing.price || 'Service engagement',
          status: 'completed',
          serviceCategory: listing.category
        });
        targetTxId = newTx.id;
      }

      const { review, updatedTransaction } = submitTransactionReview(targetTxId || `tx-${Date.now()}`, {
        rating,
        comment: comment.trim(),
        aspectRatings: aspects,
        reviewerName: user?.name || 'Verified Client',
        reviewerId: user?.id || 'demo-user',
        reviewerAvatar: user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'Client')}`
      });

      // Update listing in Firestore if applicable
      if (listing && !listing.id.startsWith('mock-')) {
        try {
          const listingRef = doc(db, 'listings', listing.id);
          const currentReviews = listing.reviews || [];
          const updatedReviews = [review, ...currentReviews];
          const newAvg = Number((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1));
          await setDoc(listingRef, { reviews: updatedReviews, rating: newAvg }, { merge: true });
        } catch (err) {
          console.log('Listing reviews synced locally:', err);
        }
      }

      setIsSuccess(true);
      if (onReviewSubmitted) {
        onReviewSubmitted(review, updatedTransaction);
      }

      setTimeout(() => {
        setIsSuccess(false);
        if (onOpenChange) onOpenChange(false);
      }, 1800);
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="sm:max-w-[620px] rounded-[2.5rem] border-0 glass p-0 max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b bg-white shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
              <Star className="w-4 h-4 fill-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-display font-bold text-zinc-900 tracking-tight">
                Rate & Review Completed Transaction
              </DialogTitle>
              <p className="text-xs text-zinc-500 font-medium">
                Verified review tied to completed trade service or ad engagement
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 overflow-y-auto flex-1 bg-zinc-50/60 space-y-6">
          {/* Target Transaction Summary Card */}
          <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
              <img
                src={transaction?.listingImage || listing?.image || 'https://picsum.photos/seed/servicephoto/200/200'}
                alt={targetTitle}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified Transaction
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {transaction?.id || 'Direct Service'}
                </span>
              </div>
              <h4 className="text-sm font-bold text-zinc-900 truncate mt-1">
                {targetTitle}
              </h4>
              <p className="text-xs text-zinc-500 flex items-center gap-2 mt-0.5">
                <span>{targetCategory}</span>
                <span>•</span>
                <span className="font-semibold text-zinc-700">{targetPrice}</span>
              </p>
            </div>
          </div>

          {isSuccess ? (
            <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in fade-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-display font-bold text-emerald-950">
                Review Successfully Published!
              </h3>
              <p className="text-xs text-emerald-800 max-w-sm mx-auto leading-relaxed">
                Thank you for contributing to the Adelaide community trust standard. Your rating has updated the seller&apos;s verified score.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Star Rating Interactive Selector */}
              <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs text-center space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block">
                  Overall Star Rating (1 to 5)
                </Label>

                {/* Stars Row */}
                <div className="flex items-center justify-center gap-2.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = activeRating >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer transform ${
                          isFilled
                            ? 'bg-amber-400 text-white shadow-lg shadow-amber-400/25 scale-105'
                            : 'bg-zinc-100 text-zinc-300 hover:bg-zinc-200'
                        }`}
                      >
                        <Star className={`w-6 h-6 ${isFilled ? 'fill-white' : ''}`} />
                      </button>
                    );
                  })}
                </div>

                <div className="pt-1">
                  <span className={`text-sm font-bold block ${ratingDetails.color}`}>
                    {activeRating} Stars — {ratingDetails.title}
                  </span>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {ratingDetails.desc}
                  </p>
                </div>
              </div>

              {/* Aspect Ratings */}
              <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block">
                  Detailed Service Aspects
                </Label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'quality', label: 'Workmanship / Quality', icon: Award },
                    { key: 'communication', label: 'Communication & Responsiveness', icon: MessageSquare },
                    { key: 'punctuality', label: 'Punctuality & Reliability', icon: Clock },
                    { key: 'value', label: 'Fairness & Value for Money', icon: DollarSign },
                  ].map(({ key, label, icon: Icon }) => {
                    const currentVal = aspects[key as keyof ReviewAspects] || 5;
                    return (
                      <div key={key} className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 text-zinc-500" />
                          <span className="text-xs font-bold text-zinc-800">{label}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setAspects(prev => ({ ...prev, [key]: s }))}
                              className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center transition-colors cursor-pointer ${
                                currentVal >= s
                                  ? 'bg-amber-400 text-white'
                                  : 'bg-zinc-200 text-zinc-400 hover:bg-zinc-300'
                              }`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Written Review Textarea */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                    Written Review & Experience Summary
                  </Label>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {comment.length} / 500
                  </span>
                </div>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={500}
                  required
                  placeholder="Describe your firsthand experience. How was the trade workmanship, adherence to schedule, clean-up, and overall professionalism?"
                  className="rounded-2xl min-h-[110px] bg-white border-zinc-200 text-xs p-3.5 focus:border-zinc-900"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting || !comment.trim()}
                  className="w-full h-12 rounded-2xl bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Publishing Review...' : 'Submit Verified Review & Rating'}</span>
                </Button>
                <p className="text-[11px] text-zinc-400 text-center mt-2 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Your review will be marked with a &quot;Verified Completed Transaction&quot; trust badge.
                </p>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
