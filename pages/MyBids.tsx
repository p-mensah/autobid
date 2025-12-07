import React, { useState } from 'react';
import { Bid, Auction, AuctionStatus } from '../types';
import { Link } from 'react-router-dom';
import { Gavel, Clock, CheckCircle, XCircle, Star, MessageSquare } from 'lucide-react';

interface MyBidsProps {
  bids: Bid[];
  auctions: Auction[];
}

const MyBids: React.FC<MyBidsProps> = ({ bids, auctions }) => {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'WON' | 'LOST'>('ALL');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedAuctionId, setSelectedAuctionId] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const getBidStatus = (bid: Bid, auction: Auction) => {
    if (auction.status === AuctionStatus.ACTIVE) {
      return auction.currentBid === bid.amount ? 'WINNING' : 'OUTBID';
    }
    // Ended
    if (auction.bids[auction.bids.length - 1].userId === bid.userId) {
      return 'WON';
    }
    return 'LOST';
  };

  const filteredBids = bids.filter(bid => {
    const auction = auctions.find(a => a.id === bid.auctionId);
    if (!auction) return false;
    const status = getBidStatus(bid, auction);
    
    if (filter === 'ACTIVE') return status === 'WINNING' || status === 'OUTBID';
    if (filter === 'WON') return status === 'WON';
    if (filter === 'LOST') return status === 'LOST';
    return true;
  });

  const handleOpenReview = (auctionId: string) => {
    setSelectedAuctionId(auctionId);
    setRating(0);
    setComment('');
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    alert("Review submitted successfully!");
    setIsReviewModalOpen(false);
  };

  // Sort by newest
  const sortedBids = [...filteredBids].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Bids</h1>
        <div className="flex space-x-2 bg-white p-1 rounded-lg border border-gray-200">
           {(['ALL', 'ACTIVE', 'WON', 'LOST'] as const).map(f => (
             <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${filter === f ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'}`}
             >
                {f}
             </button>
           ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {sortedBids.length === 0 ? (
           <div className="p-12 text-center text-gray-500">
             <Gavel size={48} className="mx-auto mb-4 opacity-20" />
             <p>No bids found matching this filter.</p>
             <Link to="/browse" className="text-blue-600 font-bold hover:underline mt-2 inline-block">Start Bidding</Link>
           </div>
        ) : (
          <div className="divide-y divide-gray-100">
             {sortedBids.map(bid => {
                const auction = auctions.find(a => a.id === bid.auctionId)!;
                const status = getBidStatus(bid, auction);
                
                return (
                  <div key={bid.id} className="p-6 flex flex-col md:flex-row items-center justify-between hover:bg-gray-50 transition-colors">
                     <div className="flex items-center gap-4 flex-1 w-full md:w-auto mb-4 md:mb-0">
                        <img src={auction.images[0]} className="w-20 h-20 rounded-lg object-cover" alt="Thumb" />
                        <div>
                           <Link to={`/auction/${auction.id}`} className="font-bold text-gray-900 hover:text-blue-600 text-lg">
                              {auction.title}
                           </Link>
                           <p className="text-sm text-gray-500">{new Date(bid.timestamp).toLocaleString()}</p>
                           <div className="mt-2">
                              {status === 'WINNING' && <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">Highest Bidder</span>}
                              {status === 'OUTBID' && <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded">Outbid</span>}
                              {status === 'WON' && <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">Won</span>}
                              {status === 'LOST' && <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">Lost</span>}
                           </div>
                        </div>
                     </div>
                     <div className="text-right min-w-[150px] flex flex-col items-end gap-2">
                        <div>
                           <p className="text-sm text-gray-500 mb-1">Your Bid</p>
                           <p className="text-xl font-bold text-gray-900">${bid.amount.toLocaleString()}</p>
                           <p className="text-xs text-gray-400 mt-1">Current: ${auction.currentBid.toLocaleString()}</p>
                        </div>
                        {status === 'WON' && (
                           <button 
                              onClick={() => handleOpenReview(auction.id)}
                              className="text-xs flex items-center bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full border border-yellow-200 hover:bg-yellow-100 transition-colors font-medium"
                           >
                              <Star size={12} className="mr-1" /> Leave Review
                           </button>
                        )}
                     </div>
                  </div>
                );
             })}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Rate Seller</h3>
                  <button onClick={() => setIsReviewModalOpen(false)} className="text-gray-400 hover:text-gray-600"><XCircle size={24} /></button>
               </div>
               
               <form onSubmit={handleSubmitReview}>
                  <div className="mb-6 flex justify-center space-x-2">
                     {[1, 2, 3, 4, 5].map((star) => (
                        <button
                           key={star}
                           type="button"
                           onClick={() => setRating(star)}
                           className={`transition-transform hover:scale-110 focus:outline-none ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                           <Star size={32} fill="currentColor" />
                        </button>
                     ))}
                  </div>

                  <div className="mb-6">
                     <label className="block text-sm font-medium text-gray-700 mb-2">Write a review</label>
                     <textarea
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                        placeholder="Describe your experience with the seller and the item..."
                        required
                     ></textarea>
                  </div>

                  <button
                     type="submit"
                     disabled={rating === 0}
                     className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors"
                  >
                     Submit Review
                  </button>
               </form>
            </div>
         </div>
      )}
    </div>
  );
};

export default MyBids;