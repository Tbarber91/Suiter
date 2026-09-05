export interface Review {
  id: string;
  user: string;
  avatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  handle?: string;
  bio?: string;
  phone?: string;
  avatarUrl?: string;
  role?: 'admin' | 'management' | 'investor' | 'user';
  isGateLocked?: boolean;
  encryptedAuthToken?: string;
  isCertified?: boolean;
  isRegulatoryCompliant?: boolean;
  isVerifiedExperience?: boolean;
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

