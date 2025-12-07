
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum AuctionType {
  AUTOMOBILE = 'AUTOMOBILE',
  PROPERTY = 'PROPERTY'
}

export enum AuctionStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  ENDED = 'ENDED',
  CANCELLED = 'CANCELLED'
}

export type SortOption = 'NEWEST' | 'ENDING_SOON' | 'HIGHEST_BID' | 'LOWEST_BID' | 'SELLER_RATING';

export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  targetUserId: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface NotificationChannel {
  email: boolean;
  sms: boolean;
  push: boolean;
}

export interface NotificationPreferences {
  outbid: NotificationChannel;
  endingSoon: NotificationChannel;
  marketing: NotificationChannel;
  systemUpdates: NotificationChannel;
  newMessages: NotificationChannel;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  joinedDate: string;
  walletBalance: number;
  // New profile fields
  phone?: string;
  address?: string;
  bio?: string;
  watchlist: string[]; // Array of Auction IDs
  rating?: number;
  reviewCount?: number;
  notificationPreferences?: NotificationPreferences;
  twoFactorEnabled?: boolean;
}

export interface Bid {
  id: string;
  auctionId: string;
  userId: string;
  userName: string;
  amount: number;
  timestamp: string;
}

export interface Auction {
  id: string;
  title: string;
  description: string;
  type: AuctionType;
  category: string; // e.g., 'SUV', 'Residential'
  images: string[];
  startingPrice: number;
  currentBid: number;
  reservePrice?: number;
  status: AuctionStatus;
  endsAt: string;
  createdAt: string;
  sellerId: string;
  sellerName: string;
  sellerRating?: number; // Denormalized for display
  sellerReviewCount?: number;
  bids: Bid[];
  specs: Record<string, string | number>; // Dynamic specs based on type
  watchers: number;
}

export interface FilterState {
  keyword: string;
  type: AuctionType | 'ALL';
  category: string;
  status: AuctionStatus | 'ENDING_SOON' | 'ALL';
  sortBy: SortOption;
}