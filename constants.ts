import { Auction, AuctionStatus, AuctionType, Review, User, UserRole } from './types';

export const MOCK_REGULAR_USER: User = {
  id: 'u_user',
  name: 'Jane Buyer',
  email: 'jane@example.com',
  role: UserRole.USER,
  joinedDate: '2023-04-10',
  walletBalance: 25000,
  watchlist: [],
  rating: 4.8,
  reviewCount: 12
};

export const MOCK_ADMIN: User = {
  id: 'u_admin',
  name: 'John Moderator',
  email: 'admin@autobid.com',
  role: UserRole.ADMIN,
  joinedDate: '2023-02-01',
  walletBalance: 0,
  watchlist: []
};

export const MOCK_SUPER_ADMIN: User = {
  id: 'u_super',
  name: 'Alex Director',
  email: 'director@autobid.com',
  role: UserRole.SUPER_ADMIN,
  joinedDate: '2023-01-15',
  walletBalance: 0,
  watchlist: []
};

// Default for backward compatibility if needed, though we will use specific ones in Login
export const CURRENT_USER: User = MOCK_SUPER_ADMIN;

export const MOCK_REVIEWS: Review[] = [
  { id: 'r1', reviewerId: 'u2', reviewerName: 'SpeedRacer', targetUserId: 's1', rating: 5, comment: 'Car was exactly as described. Smooth transaction!', date: '2023-09-15' },
  { id: 'r2', reviewerId: 'u3', reviewerName: 'EcoWarrior', targetUserId: 's1', rating: 4, comment: 'Great seller, but delivery took a day longer than expected.', date: '2023-08-20' },
  { id: 'r3', reviewerId: 'u4', reviewerName: 'V8Lover', targetUserId: 's3', rating: 5, comment: 'Incredible vehicle. The restoration work is top notch.', date: '2023-10-05' },
  { id: 'r4', reviewerId: 'u5', reviewerName: 'LuxuryHomeBuyer', targetUserId: 's6', rating: 5, comment: 'Professional agent, very transparent about the property details.', date: '2023-07-12' },
];

export const MOCK_AUCTIONS: Auction[] = [
  {
    id: 'a1',
    title: '2023 Tesla Model S Plaid',
    description: 'Pristine condition, low mileage, full self-driving capability included. One owner.',
    type: AuctionType.AUTOMOBILE,
    category: 'Sedan',
    images: ['https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800'],
    startingPrice: 80000,
    currentBid: 85500,
    status: AuctionStatus.ACTIVE,
    endsAt: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    sellerId: 's1',
    sellerName: 'Elon Fan',
    sellerRating: 4.5,
    sellerReviewCount: 2,
    watchers: 12,
    specs: {
      Year: 2023,
      Mileage: '4,500 mi',
      Color: 'Deep Blue Metallic',
      VIN: '5YJSA1E2...'
    },
    bids: [
      { id: 'b1', auctionId: 'a1', userId: 'u2', userName: 'SpeedRacer', amount: 82000, timestamp: '2023-10-01T10:00:00Z' },
      { id: 'b2', auctionId: 'a1', userId: 'u3', userName: 'EcoWarrior', amount: 85500, timestamp: '2023-10-01T12:30:00Z' }
    ]
  },
  {
    id: 'a2',
    title: 'Modern Downtown Loft',
    description: 'Spacious 2 bed, 2 bath loft in the heart of the city. Industrial chic design with exposed brick.',
    type: AuctionType.PROPERTY,
    category: 'Residential',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800'],
    startingPrice: 450000,
    currentBid: 450000,
    status: AuctionStatus.ACTIVE,
    endsAt: new Date(Date.now() + 86400000 * 5).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    sellerId: 's2',
    sellerName: 'Urban Living Realty',
    sellerRating: 4.9,
    sellerReviewCount: 156,
    watchers: 45,
    specs: {
      SqFt: 1250,
      Beds: 2,
      Baths: 2,
      Address: '123 Main St, Metropolis'
    },
    bids: []
  },
  {
    id: 'a3',
    title: '1967 Ford Mustang Shelby GT500',
    description: 'Classic muscle car, fully restored. Original engine numbers matching.',
    type: AuctionType.AUTOMOBILE,
    category: 'Classic',
    images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800'],
    startingPrice: 150000,
    currentBid: 185000,
    status: AuctionStatus.ACTIVE,
    endsAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour left
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    sellerId: 's3',
    sellerName: 'Classic Collectors',
    sellerRating: 5.0,
    sellerReviewCount: 42,
    watchers: 128,
    specs: {
      Year: 1967,
      Mileage: '89,000 mi',
      Engine: 'V8'
    },
    bids: [
      { id: 'b3', auctionId: 'a3', userId: 'u4', userName: 'V8Lover', amount: 185000, timestamp: '2023-10-02T14:15:00Z' }
    ]
  },
  {
    id: 'a4',
    title: 'Commercial Warehouse Space',
    description: 'Large industrial warehouse near the port. Ideal for logistics.',
    type: AuctionType.PROPERTY,
    category: 'Commercial',
    images: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'],
    startingPrice: 1200000,
    currentBid: 0,
    status: AuctionStatus.PENDING,
    endsAt: new Date(Date.now() + 86400000 * 10).toISOString(),
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    sellerId: 's4',
    sellerName: 'Logistics Pro',
    sellerRating: 4.2,
    sellerReviewCount: 8,
    watchers: 5,
    specs: {
      SqFt: 15000,
      Zoning: 'Industrial',
      LoadingDocks: 4
    },
    bids: []
  },
  {
    id: 'a5',
    title: '2022 Porsche 911 GT3',
    description: 'Track-ready performance. Shark Blue, ceramic brakes, front axle lift.',
    type: AuctionType.AUTOMOBILE,
    category: 'Sports',
    images: ['https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800'],
    startingPrice: 220000,
    currentBid: 245000,
    status: AuctionStatus.ACTIVE,
    endsAt: new Date(Date.now() + 86400000 * 1).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    sellerId: 's5',
    sellerName: 'Track Day Motors',
    sellerRating: 4.7,
    sellerReviewCount: 23,
    watchers: 89,
    specs: {
      Year: 2022,
      Mileage: '1,200 mi',
      Engine: '4.0L Flat-6',
      Transmission: 'PDK'
    },
    bids: []
  },
  {
    id: 'a6',
    title: 'Luxury Beachfront Villa',
    description: 'Private beach access, infinity pool, 5 bedrooms, smart home integration.',
    type: AuctionType.PROPERTY,
    category: 'Residential',
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800'],
    startingPrice: 3500000,
    currentBid: 3750000,
    status: AuctionStatus.ACTIVE,
    endsAt: new Date(Date.now() + 86400000 * 7).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    sellerId: 's6',
    sellerName: 'Coastal Estates',
    sellerRating: 5.0,
    sellerReviewCount: 89,
    watchers: 210,
    specs: {
      SqFt: 5500,
      Beds: 5,
      Baths: 6,
      Location: 'Malibu, CA'
    },
    bids: []
  },
  {
    id: 'a7',
    title: '2020 Land Rover Defender 110',
    description: 'Adventure ready, fully equipped with explorer pack and roof rack.',
    type: AuctionType.AUTOMOBILE,
    category: 'SUV',
    images: ['https://images.unsplash.com/photo-1618664654921-3e5f223789d3?auto=format&fit=crop&q=80&w=800'],
    startingPrice: 65000,
    currentBid: 68000,
    status: AuctionStatus.ACTIVE,
    endsAt: new Date(Date.now() + 86400000 * 3).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    sellerId: 's7',
    sellerName: 'Overland Outfitters',
    sellerRating: 4.6,
    sellerReviewCount: 15,
    watchers: 34,
    specs: {
      Year: 2020,
      Mileage: '25,000 mi',
      Color: 'Pangea Green'
    },
    bids: []
  },
  {
    id: 'a8',
    title: 'Development Land - 50 Acres',
    description: 'Prime development opportunity. Zoned for mixed-use. Utilities available at street.',
    type: AuctionType.PROPERTY,
    category: 'Land',
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800'],
    startingPrice: 850000,
    currentBid: 0,
    status: AuctionStatus.ACTIVE,
    endsAt: new Date(Date.now() + 86400000 * 14).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    sellerId: 's8',
    sellerName: 'Land Bank Corp',
    sellerRating: 4.0,
    sellerReviewCount: 5,
    watchers: 15,
    specs: {
      Acres: 50,
      Zoning: 'Mixed-Use',
      Topography: 'Flat'
    },
    bids: []
  }
];