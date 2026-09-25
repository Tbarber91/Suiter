export interface ReviewAspects {
  communication?: number;
  quality?: number;
  punctuality?: number;
  value?: number;
}

export interface Review {
  id: string;
  transactionId?: string;
  listingId?: string;
  user: string;
  userId?: string;
  avatar?: string;
  rating: number; // 1 - 5
  comment: string;
  date: string;
  verifiedTransaction?: boolean;
  aspectRatings?: ReviewAspects;
}

export interface Transaction {
  id: string;
  listingId: string;
  listingTitle: string;
  listingType: 'ad' | 'service' | 'product' | 'shop';
  listingImage?: string;
  listingPrice?: string;
  sellerId?: string;
  sellerName?: string;
  sellerHandle?: string;
  buyerId: string;
  buyerName: string;
  buyerEmail?: string;
  amount?: string;
  date: string;
  status: 'completed' | 'in_progress' | 'cancelled';
  serviceCategory?: string;
  reviewId?: string;
  rating?: number;
  reviewComment?: string;
  reviewedAt?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category?: string;
  date?: string;
  link?: string;
}

export interface ServiceOffered {
  id: string;
  title: string;
  description: string;
  price: string;
  category?: string;
  turnaround?: string;
}

export interface EngagedItem {
  id: string;
  title: string;
  type: 'ad' | 'service' | 'product' | 'shop';
  providerName: string;
  providerHandle?: string;
  date: string;
  status: 'active' | 'completed' | 'inquiry';
  price?: string;
}

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  youtube?: string;
  facebook?: string;
  whatsapp?: string;
}

export interface BankPayoutDetails {
  accountName: string;
  bsb: string;
  accountNumber: string;
  bankName: string;
  payId?: string;
  payoutSchedule: 'instant' | 'daily' | 'weekly';
  currency: string;
  isVerified: boolean;
  visaDirectEnabled?: boolean;
  mastercardSendEnabled?: boolean;
  appleWalletEnabled?: boolean;
  googleWalletEnabled?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  handle?: string;
  bio?: string;
  phone?: string;
  location?: string;
  avatarUrl?: string;
  website?: string;
  contactEmail?: string;
  socialLinks?: SocialLinks;
  bankDetails?: BankPayoutDetails;
  role?: 'admin' | 'management' | 'investor' | 'user';
  isGateLocked?: boolean;
  encryptedAuthToken?: string;
  isCertified?: boolean;
  isRegulatoryCompliant?: boolean;
  isVerifiedExperience?: boolean;
  skills?: string[];
  servicesProvided?: ServiceOffered[];
  portfolio?: PortfolioItem[];
  historyEngaged?: EngagedItem[];
  averageRating?: number;
  totalReviews?: number;
  completedTransactionsCount?: number;
  createdAt?: string;
}

export interface Location {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  type: 'ad' | 'service' | 'product' | 'shop';
  price?: string;
  rating?: number | null;
  image?: string;
  isNew?: boolean;
  stock?: number;
  externalUrl?: string;
  category?: string;
  isSynced?: boolean;
  source?: string;
  phone?: string;
  hours?: string[];
  reviews?: Review[];
  syndicatedChannels?: string[];
  ownerId?: string;
  ownerName?: string;
  ownerAvatar?: string;
  ownerHandle?: string;
  isCertified?: boolean;
  isRegulatoryCompliant?: boolean;
  isVerifiedExperience?: boolean;
  locationName?: string;
  isAppleMapsSponsored?: boolean;
  appleMapsAdTier?: 'sponsored_pin' | 'top_placement' | 'turn_by_turn';
  appleMapsBadge?: string;
  businessName?: string;
  address?: string;
  createdAt?: any;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  recipientId: string;
  listingId?: string;
  listingTitle?: string;
  text: string;
  timestamp: string;
}

