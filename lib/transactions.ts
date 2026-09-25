'use client';

import { Transaction, Review, ReviewAspects, Location } from './types';
import { db } from './firebase';
import { doc, setDoc, getDocs, collection, query, where, updateDoc } from 'firebase/firestore';

const LOCAL_STORAGE_TRANSACTIONS_KEY = 'suiter_marketplace_transactions_v1';
const LOCAL_STORAGE_REVIEWS_KEY = 'suiter_marketplace_reviews_v1';

// Pre-seeded high quality initial completed transactions
const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-norwood-01',
    listingId: 'apple-pin-norwood',
    listingTitle: 'The Parade Prestige Kitchens & Joinery Showroom',
    listingType: 'ad',
    listingImage: 'https://picsum.photos/seed/norwoodkitchens/800/450',
    listingPrice: 'Free 3D Consult',
    sellerId: 'user-vance-norwood',
    sellerName: 'Norwood Architectural Joinery',
    sellerHandle: 'norwood_joinery',
    buyerId: 'demo-user-1',
    buyerName: 'Tamara Barber',
    buyerEmail: 'tarotwithtamara@gmail.com',
    amount: 'Complimentary On-Site Survey',
    date: '10 Sep 2026',
    status: 'completed',
    serviceCategory: 'Kitchen Renovations',
    reviewId: 'rev-tx-norwood-01',
    rating: 5,
    reviewComment: 'Exceptional craftsmanship and precision laser measurements. The 3D cabinet visualization was delivered the very next morning.',
    reviewedAt: '10 Sep 2026'
  },
  {
    id: 'tx-toyota-02',
    listingId: 'toyota-rav4-hybrid',
    listingTitle: '2022 Toyota RAV4 Cruiser Hybrid (Second Hand / LMVD Certified)',
    listingType: 'product',
    listingImage: 'https://picsum.photos/seed/toyotarav4hybrid/800/450',
    listingPrice: '$38,900',
    sellerId: 'user-toyota-adelaide',
    sellerName: 'City West Toyota Certified LMVD',
    sellerHandle: 'citywest_toyota',
    buyerId: 'demo-user-1',
    buyerName: 'Tamara Barber',
    buyerEmail: 'tarotwithtamara@gmail.com',
    amount: '$38,900 AUD (Title Transferred)',
    date: '02 Sep 2026',
    status: 'completed',
    serviceCategory: 'Automotive & LMVD',
    reviewId: 'rev-tx-toyota-02',
    rating: 5,
    reviewComment: 'Seamless transaction with statutory mechanical check and clear PPSR certificate provided immediately. Highly recommended dealership.',
    reviewedAt: '03 Sep 2026'
  },
  {
    id: 'tx-reno-03',
    listingId: 'reno-1',
    listingTitle: 'Vance Joinery & Custom Kitchen Renovation Master Suite',
    listingType: 'service',
    listingImage: 'https://picsum.photos/seed/adelaidekitchenreno/800/450',
    listingPrice: 'From $12,500',
    sellerId: 'user-vance-builder',
    sellerName: 'Vance Joinery & Stone Studio',
    sellerHandle: 'vance_joinery',
    buyerId: 'demo-user-1',
    buyerName: 'Tamara Barber',
    buyerEmail: 'tarotwithtamara@gmail.com',
    amount: '$14,200 AUD (Stage 1 Completed)',
    date: 'Yesterday at 3:30 PM',
    status: 'completed',
    serviceCategory: 'Kitchen Renovations'
    // Intentionally unreviewed so the user can immediately test rating & reviewing!
  },
  {
    id: 'tx-solar-04',
    listingId: '2',
    listingTitle: 'Solar Panel Maintenance & Thermal Inverter Diagnostics',
    listingType: 'service',
    listingImage: 'https://picsum.photos/seed/solar/800/450',
    listingPrice: '$75/hr',
    sellerId: 'user-solar-sa',
    sellerName: 'SA Sustainable Energy Techs',
    sellerHandle: 'cleanenergy_sa',
    buyerId: 'demo-user-1',
    buyerName: 'Tamara Barber',
    buyerEmail: 'tarotwithtamara@gmail.com',
    amount: '$225 AUD (3 hr service)',
    date: '28 Aug 2026',
    status: 'completed',
    serviceCategory: 'Sustainability'
    // Intentionally unreviewed so user can leave a review
  },
  {
    id: 'tx-luxe-05',
    listingId: '1',
    listingTitle: 'Adelaide Central Market Artisan Collective',
    listingType: 'shop',
    listingImage: 'https://picsum.photos/seed/marketadelaide/800/450',
    listingPrice: 'Varies',
    sellerId: 'user-market-curator',
    sellerName: 'Artisan Producers Guild',
    sellerHandle: 'adelaide_artisan',
    buyerId: 'demo-user-1',
    buyerName: 'Tamara Barber',
    buyerEmail: 'tarotwithtamara@gmail.com',
    amount: '$84 AUD (Artisan produce box)',
    date: '15 Aug 2026',
    status: 'completed',
    serviceCategory: 'Gourmet & Retail',
    reviewId: 'rev-tx-luxe-05',
    rating: 4,
    reviewComment: 'Outstanding organic produce and handmade sourdough. Pickup was swift and friendly.',
    reviewedAt: '16 Aug 2026'
  }
];

export function getStoredTransactions(): Transaction[] {
  if (typeof window === 'undefined') return INITIAL_TRANSACTIONS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TRANSACTIONS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_TRANSACTIONS_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    const parsed: Transaction[] = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_TRANSACTIONS;
  } catch (e) {
    console.error('Error reading stored transactions:', e);
    return INITIAL_TRANSACTIONS;
  }
}

export function saveStoredTransactions(transactions: Transaction[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_TRANSACTIONS_KEY, JSON.stringify(transactions));
  } catch (e) {
    console.error('Error saving stored transactions:', e);
  }
}

/**
 * Record a new completed or booked transaction
 */
export function recordTransaction(tx: Omit<Transaction, 'id' | 'date'> & { id?: string; date?: string }): Transaction {
  const all = getStoredTransactions();
  const newTx: Transaction = {
    ...tx,
    id: tx.id || `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    date: tx.date || new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: tx.status || 'completed'
  };

  const updated = [newTx, ...all.filter(t => t.id !== newTx.id)];
  saveStoredTransactions(updated);

  // Sync to Firestore in background
  try {
    const txRef = doc(db, 'transactions', newTx.id);
    setDoc(txRef, newTx, { merge: true }).catch(() => {});
  } catch {}

  return newTx;
}

/**
 * Submit rating and written review for an engaged transaction
 */
export function submitTransactionReview(
  transactionId: string,
  data: {
    rating: number; // 1 - 5
    comment: string;
    aspectRatings?: ReviewAspects;
    reviewerName: string;
    reviewerId?: string;
    reviewerAvatar?: string;
  }
): { review: Review; updatedTransaction: Transaction | null } {
  const transactions = getStoredTransactions();
  const txIndex = transactions.findIndex(t => t.id === transactionId);
  const targetTx = txIndex >= 0 ? transactions[txIndex] : null;

  const reviewId = `rev-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const dateStr = 'Just now';

  const newReview: Review = {
    id: reviewId,
    transactionId: transactionId,
    listingId: targetTx?.listingId || 'general',
    user: data.reviewerName,
    userId: data.reviewerId,
    avatar: data.reviewerAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.reviewerName)}`,
    rating: Math.min(5, Math.max(1, data.rating)),
    comment: data.comment.trim(),
    date: dateStr,
    verifiedTransaction: true,
    aspectRatings: data.aspectRatings
  };

  let updatedTransaction: Transaction | null = null;

  if (targetTx) {
    updatedTransaction = {
      ...targetTx,
      status: 'completed',
      reviewId: reviewId,
      rating: newReview.rating,
      reviewComment: newReview.comment,
      reviewedAt: dateStr
    };
    transactions[txIndex] = updatedTransaction;
    saveStoredTransactions(transactions);

    // Sync to Firestore
    try {
      const txRef = doc(db, 'transactions', targetTx.id);
      setDoc(txRef, updatedTransaction, { merge: true }).catch(() => {});
    } catch {}
  }

  // Also save review to Firestore
  try {
    const revRef = doc(db, 'reviews', reviewId);
    setDoc(revRef, newReview, { merge: true }).catch(() => {});
  } catch {}

  return { review: newReview, updatedTransaction };
}

/**
 * Compute average rating, total review count, and star distribution for any listing
 */
export function computeRatingStats(reviews?: Review[], fallbackRating: number | null = 5.0): {
  average: number;
  count: number;
  breakdown: Record<number, number>;
  percentageBreakdown: Record<number, number>;
  verifiedCount: number;
} {
  const list = reviews || [];
  const breakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let verifiedCount = 0;

  if (list.length === 0) {
    const defaultAvg = fallbackRating !== null ? Number(fallbackRating) : 5.0;
    return {
      average: defaultAvg,
      count: 0,
      breakdown,
      percentageBreakdown: { 5: 100, 4: 0, 3: 0, 2: 0, 1: 0 },
      verifiedCount: 0
    };
  }

  let totalStars = 0;
  list.forEach(r => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
    breakdown[star] = (breakdown[star] || 0) + 1;
    totalStars += (r.rating || 5);
    if (r.verifiedTransaction || r.transactionId) {
      verifiedCount++;
    }
  });

  const average = Number((totalStars / list.length).toFixed(1));
  const percentageBreakdown: Record<number, number> = {
    5: Math.round(((breakdown[5] || 0) / list.length) * 100),
    4: Math.round(((breakdown[4] || 0) / list.length) * 100),
    3: Math.round(((breakdown[3] || 0) / list.length) * 100),
    2: Math.round(((breakdown[2] || 0) / list.length) * 100),
    1: Math.round(((breakdown[1] || 0) / list.length) * 100),
  };

  return {
    average,
    count: list.length,
    breakdown,
    percentageBreakdown,
    verifiedCount
  };
}

/**
 * Compute overall seller or merchant rating statistics across all listings and transactions
 */
export function computeUserRatingOverview(
  userListings: Location[] = [],
  userTransactions: Transaction[] = []
): {
  averageRating: number;
  totalReviewsReceived: number;
  totalCompletedTransactions: number;
  starBreakdown: Record<number, number>;
  satisfactionRate: number;
} {
  let allReviews: Review[] = [];
  userListings.forEach(listing => {
    if (listing.reviews && listing.reviews.length > 0) {
      allReviews = allReviews.concat(listing.reviews);
    }
  });

  // Also include reviewed transactions where this user was the seller
  const reviewedTx = userTransactions.filter(t => t.status === 'completed' && t.rating);
  
  const starBreakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalRatingSum = 0;
  let count = 0;

  allReviews.forEach(r => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
    starBreakdown[star] = (starBreakdown[star] || 0) + 1;
    totalRatingSum += (r.rating || 5);
    count++;
  });

  reviewedTx.forEach(t => {
    if (t.rating) {
      const star = Math.min(5, Math.max(1, Math.round(t.rating)));
      starBreakdown[star] = (starBreakdown[star] || 0) + 1;
      totalRatingSum += t.rating;
      count++;
    }
  });

  const completedCount = userTransactions.filter(t => t.status === 'completed').length || 18; // default baseline

  if (count === 0) {
    return {
      averageRating: 4.9,
      totalReviewsReceived: 12,
      totalCompletedTransactions: completedCount,
      starBreakdown: { 5: 10, 4: 2, 3: 0, 2: 0, 1: 0 },
      satisfactionRate: 98
    };
  }

  const averageRating = Number((totalRatingSum / count).toFixed(1));
  const positiveCount = (starBreakdown[5] || 0) + (starBreakdown[4] || 0);
  const satisfactionRate = Math.round((positiveCount / count) * 100);

  return {
    averageRating,
    totalReviewsReceived: count,
    totalCompletedTransactions: completedCount,
    starBreakdown,
    satisfactionRate
  };
}
