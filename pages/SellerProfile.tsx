import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Auction, Review } from '../types';
import { UserCircle, MapPin, Calendar, CheckCircle, Mail, Star, MessageCircle, ShoppingBag } from 'lucide-react';
import { StarRating } from '../components/StarRating';
import { MOCK_REVIEWS } from '../constants';

interface SellerProfileProps {
  auctions: Auction[];
}

// Mock Recent Sales Data
const recentSales = [
    { id: 's1', title: '2020 BMW M2 Competition', price: 58500, date: '2023-10-10' },
    { id: 's2', title: 'Downtown Studio Apt', price: 320000, date: '2023-09-25' },
    { id: 's3', title: 'Rolex Submariner', price: 14500, date: '2023-09-15' },
];

const SellerProfile: React.FC<SellerProfileProps> = ({ auctions }) => {
  const { id } = useParams<{ id: string }>();
  
  // Mock seller lookup - in real app would come from API
  // Finding an auction by this seller to get basic info
  const sellerAuctions = auctions.filter(a => a.sellerId === id);
  const sellerInfo = sellerAuctions.length > 0 ? {
    name: sellerAuctions[0].sellerName,
    rating: sellerAuctions[0].sellerRating || 0,
    reviews: sellerAuctions[0].sellerReviewCount || 0,
    joined: '2023'
  } : {
    name: 'Unknown Seller',
    rating: 0,
    reviews: 0,
    joined: 'Unknown'
  };

  // Mock getting reviews for this seller
  const reviews = MOCK_REVIEWS.filter(r => r.targetUserId === id);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Seller Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-gray-800 to-gray-900"></div>
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-end -mt-12">
            <div className="flex items-end">
              <div className="bg-white p-1 rounded-full mr-4">
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white text-gray-400">
                  <UserCircle size={64} />
                </div>
              </div>
              <div className="mb-2">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  {sellerInfo.name}
                  {sellerInfo.rating >= 4.5 && (
                    <span title="Verified Top Seller" className="ml-2 text-blue-500 flex items-center">
                      <CheckCircle size={18} />
                    </span>
                  )}
                </h1>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <StarRating rating={sellerInfo.rating} count={sellerInfo.reviews} size={16} />
                  <span className="mx-2">•</span>
                  <span className="flex items-center"><Calendar size={14} className="mr-1"/> Joined {sellerInfo.joined}</span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center"><MapPin size={14} className="mr-1"/> Verified Seller</span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
               <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  <Mail size={16} className="mr-2" />
                  Contact Seller
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left Column: Stats & Reviews */}
         <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
               <h3 className="font-bold text-gray-900 mb-4">Reputation</h3>
               <div className="flex items-center mb-6">
                  <div className="text-4xl font-bold text-gray-900 mr-4">{sellerInfo.rating.toFixed(1)}</div>
                  <div>
                     <StarRating rating={sellerInfo.rating} showCount={false} size={20} />
                     <p className="text-sm text-gray-500 mt-1">Based on {sellerInfo.reviews} reviews</p>
                  </div>
               </div>
               
               <div className="space-y-4">
                  {reviews.length > 0 ? reviews.map(review => (
                     <div key={review.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                        <div className="flex justify-between items-start mb-1">
                           <span className="font-medium text-sm text-gray-900">{review.reviewerName}</span>
                           <span className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                        <StarRating rating={review.rating} showCount={false} size={12} className="mb-2" />
                        <p className="text-sm text-gray-600">{review.comment}</p>
                     </div>
                  )) : (
                     <p className="text-gray-500 text-sm italic">No detailed reviews available yet.</p>
                  )}
               </div>
            </div>

            {/* Seller Performance Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Seller Performance</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                            <MessageCircle size={18} className="mr-2" />
                            <span className="text-sm">Response Time</span>
                        </div>
                        <span className="font-bold text-gray-900 text-sm">~ 1 Hour</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                            <ShoppingBag size={18} className="mr-2" />
                            <span className="text-sm">Total Sales</span>
                        </div>
                        <span className="font-bold text-gray-900 text-sm">45</span>
                    </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                            <CheckCircle size={18} className="mr-2" />
                            <span className="text-sm">Completion Rate</span>
                        </div>
                        <span className="font-bold text-green-600 text-sm">98%</span>
                    </div>
                </div>
            </div>
         </div>

         {/* Right Column: Active Listings & History */}
         <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Active Listings ({sellerAuctions.length})</h2>
            {sellerAuctions.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sellerAuctions.map(auction => (
                     <Link key={auction.id} to={`/auction/${auction.id}`} className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-48 overflow-hidden relative">
                           <img src={auction.images[0]} alt={auction.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                           <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold">
                              ${auction.currentBid.toLocaleString()}
                           </div>
                        </div>
                        <div className="p-4">
                           <h3 className="font-bold text-gray-900 truncate mb-1">{auction.title}</h3>
                           <p className="text-xs text-gray-500 mb-3">{auction.category} • Ends {new Date(auction.endsAt).toLocaleDateString()}</p>
                           <span className={`text-xs font-bold px-2 py-1 rounded capitalize ${
                              auction.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                           }`}>
                              {auction.status}
                           </span>
                        </div>
                     </Link>
                  ))}
               </div>
            ) : (
               <div className="bg-white rounded-xl p-12 text-center text-gray-500 border border-dashed border-gray-300">
                  <p>No active listings found.</p>
               </div>
            )}

            {/* Recent Sales History */}
            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Sales History</h2>
                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="divide-y divide-gray-100">
                        {recentSales.map(sale => (
                            <div key={sale.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">{sale.title}</p>
                                    <p className="text-xs text-gray-500">{new Date(sale.date).toLocaleDateString()}</p>
                                </div>
                                 <span className="font-bold text-gray-900 text-sm">${sale.price.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                 </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SellerProfile;