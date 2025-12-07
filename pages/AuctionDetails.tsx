import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Auction, Bid, User } from '../types';
import { Clock, ShieldCheck, User as UserIcon, AlertCircle, DollarSign, Calendar, Tag, Eye, EyeOff } from 'lucide-react';
import { SkeletonDetails, LoadingSpinner } from '../components/Loading';
import { StarRating } from '../components/StarRating';

interface AuctionDetailsProps {
  auctions: Auction[];
  user: User;
  onPlaceBid: (auctionId: string, amount: number) => Promise<void>;
  onToggleWatchlist: (auctionId: string) => void;
  watchlist: string[];
}

const AuctionDetails: React.FC<AuctionDetailsProps> = ({ auctions, user, onPlaceBid, onToggleWatchlist, watchlist }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const auction = auctions.find(a => a.id === id);
  const [bidAmount, setBidAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isBidding, setIsBidding] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [loading, setLoading] = useState(true);

  // Simulate initial data fetch
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [id]);

  // Real-time timer update
  useEffect(() => {
    if (!auction) return;
    const interval = setInterval(() => {
        const diff = new Date(auction.endsAt).getTime() - Date.now();
        if (diff <= 0) {
            setTimeLeft('Ended');
        } else {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
    }, 1000);
    return () => clearInterval(interval);
  }, [auction]);

  if (loading) return <SkeletonDetails />;

  if (!auction) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-2xl font-bold text-gray-800">Auction Not Found</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-blue-600 hover:underline">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const minBid = auction.currentBid + (auction.currentBid < 10000 ? 100 : 500);
  const isWatched = watchlist.includes(auction.id);

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const amount = parseFloat(bidAmount);
    if (isNaN(amount)) {
      setError("Please enter a valid amount.");
      return;
    }

    if (amount < minBid) {
      setError(`Bid must be at least $${minBid.toLocaleString()}`);
      return;
    }

    setIsBidding(true);
    await onPlaceBid(auction.id, amount);
    setIsBidding(false);
    
    setSuccess("Bid placed successfully!");
    setBidAmount('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
       {/* Breadcrumb / Back */}
       <button onClick={() => navigate('/')} className="text-sm text-gray-500 hover:text-gray-900 mb-2">
         &larr; Back to Listings
       </button>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left Column: Images & Details */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
              <img src={auction.images[0]} alt={auction.title} className="w-full h-96 object-cover" />
              <button 
                onClick={() => onToggleWatchlist(auction.id)}
                className={`absolute top-4 right-4 p-2 rounded-full shadow-lg transition-colors ${isWatched ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:text-blue-600'}`}
                title={isWatched ? "Remove from watchlist" : "Add to watchlist"}
              >
                  {isWatched ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {auction.images.length > 1 && (
                <div className="flex gap-2 p-2 overflow-x-auto">
                   {auction.images.map((img, idx) => (
                     <img key={idx} src={img} alt="Thumbnail" className="w-24 h-24 object-cover rounded-md cursor-pointer hover:opacity-80" />
                   ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
               <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
               <p className="text-gray-600 leading-relaxed whitespace-pre-line">{auction.description}</p>
               
               <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Specifications</h3>
               <div className="grid grid-cols-2 gap-4">
                 {Object.entries(auction.specs).map(([key, value]) => (
                   <div key={key} className="flex justify-between border-b border-gray-100 py-2">
                     <span className="text-gray-500">{key}</span>
                     <span className="font-medium text-gray-900">{value}</span>
                   </div>
                 ))}
               </div>
            </div>
         </div>

         {/* Right Column: Bidding Action */}
         <div className="space-y-6">
           <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sticky top-24">
              <div className="flex justify-between items-start mb-6">
                 <div>
                   <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2">{auction.title}</h1>
                   <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span className="flex items-center"><Tag size={14} className="mr-1"/> {auction.category}</span>
                      <span className="flex items-center"><Calendar size={14} className="mr-1"/> {new Date(auction.endsAt).toLocaleDateString()}</span>
                   </div>
                 </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-5 mb-6 border border-blue-100 animate-pulse-subtle">
                <p className="text-sm text-blue-800 font-medium mb-1">Current Bid</p>
                <div className="flex items-baseline text-4xl font-bold text-blue-900">
                  ${auction.currentBid.toLocaleString()}
                </div>
                <div className="flex items-center mt-2 text-blue-700 text-sm">
                   <Clock size={16} className="mr-1.5" />
                   <span className="font-medium font-mono">{timeLeft || 'Loading...'}</span>
                </div>
              </div>

              {/* Bid Form */}
              <form onSubmit={handleBid} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                       Your Bid (Min ${minBid.toLocaleString()})
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        className="block w-full pl-7 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder={minBid.toString()}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        disabled={isBidding}
                      />
                    </div>
                 </div>
                 
                 {error && (
                   <div className="flex items-center text-red-600 text-sm bg-red-50 p-2 rounded animate-fade-in">
                     <AlertCircle size={16} className="mr-2" />
                     {error}
                   </div>
                 )}
                  {success && (
                   <div className="flex items-center text-green-600 text-sm bg-green-50 p-2 rounded animate-fade-in">
                     <ShieldCheck size={16} className="mr-2" />
                     {success}
                   </div>
                 )}

                 <button 
                    type="submit"
                    disabled={isBidding}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm flex justify-center items-center"
                 >
                    {isBidding ? <LoadingSpinner size={20} className="text-white" /> : "Place Bid"}
                 </button>
              </form>

              {/* Seller Info */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-3">
                   <h4 className="text-sm font-semibold text-gray-900">Seller Information</h4>
                   <Link to={`/seller/${auction.sellerId}`} className="text-xs text-blue-600 hover:underline">View Profile</Link>
                </div>
                <div className="flex items-center space-x-3">
                   <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserIcon size={20} className="text-gray-500"/>
                   </div>
                   <div>
                      <Link to={`/seller/${auction.sellerId}`} className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
                        {auction.sellerName}
                      </Link>
                      {/* Display Star Rating */}
                      <StarRating 
                        rating={auction.sellerRating || 0} 
                        count={auction.sellerReviewCount || 0} 
                        size={16}
                        className="mt-1"
                      />
                   </div>
                </div>
              </div>
           </div>

           {/* Recent Bids */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
             <h3 className="font-bold text-gray-900 mb-4 flex justify-between items-center">
                Bid History
                <span className="text-xs font-normal text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center">
                   <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                   Live
                </span>
             </h3>
             <div className="space-y-4 max-h-60 overflow-y-auto">
               {auction.bids.length === 0 ? (
                 <p className="text-gray-500 text-sm italic">No bids yet. Be the first!</p>
               ) : (
                 [...auction.bids].reverse().slice(0, 10).map(bid => (
                   <div key={bid.id} className="flex justify-between items-center text-sm animate-slide-in">
                     <div className="flex items-center text-gray-600">
                        <div className="w-2 h-2 rounded-full bg-gray-300 mr-2"></div>
                        {bid.userName}
                     </div>
                     <div className="text-right">
                        <div className="font-semibold text-gray-900">${bid.amount.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">{new Date(bid.timestamp).toLocaleTimeString()}</div>
                     </div>
                   </div>
                 ))
               )}
             </div>
           </div>
         </div>
       </div>
    </div>
  );
};

export default AuctionDetails;