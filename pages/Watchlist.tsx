import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Auction, AuctionType, AuctionStatus } from '../types';
import { Car, Home, Clock, Trash2, Eye, History } from 'lucide-react';

interface WatchlistProps {
  auctions: Auction[];
  watchlistIds: string[];
  onRemoveFromWatchlist: (id: string) => void;
  userHistory?: boolean; // If viewing as history
}

interface AuctionCardProps {
  auction: Auction;
  isWatchlist: boolean;
  onRemoveFromWatchlist: (id: string) => void;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ auction, isWatchlist, onRemoveFromWatchlist }) => (
  <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden flex flex-col h-full relative">
     <Link to={`/auction/${auction.id}`} className="block relative h-48 overflow-hidden shrink-0">
        <img 
           src={auction.images[0]} 
           alt={auction.title} 
           className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center">
           {auction.type === AuctionType.AUTOMOBILE ? <Car size={12} className="mr-1" /> : <Home size={12} className="mr-1" />}
           {auction.category}
        </div>
     </Link>

     {isWatchlist && (
       <button 
          onClick={(e) => {
             e.preventDefault();
             onRemoveFromWatchlist(auction.id);
          }}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50 transition-colors z-10"
          title="Remove from Watchlist"
       >
          <Trash2 size={16} />
       </button>
     )}
     
     <div className="p-4 flex flex-col flex-1">
        <Link to={`/auction/${auction.id}`} className="block">
           <h3 className="font-bold text-gray-900 truncate mb-1">{auction.title}</h3>
        </Link>
        
        <div className="flex justify-between items-center mb-4">
           <div className="flex items-center text-xs text-gray-500">
              <Clock size={12} className="mr-1" />
              {new Date(auction.endsAt) > new Date() 
                ? `Ends ${new Date(auction.endsAt).toLocaleDateString()}` 
                : <span className="text-red-500 font-bold">Ended</span>
              }
           </div>
           <div className="text-sm font-bold text-blue-600">
              ${auction.currentBid.toLocaleString()}
           </div>
        </div>
        
        <div className="mt-auto pt-3 border-t border-gray-100">
           <Link to={`/auction/${auction.id}`} className="block w-full text-center py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-900 transition-colors">
              View Details
           </Link>
        </div>
     </div>
  </div>
);

const Watchlist: React.FC<WatchlistProps> = ({ auctions, watchlistIds, onRemoveFromWatchlist }) => {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'history'>('watchlist');

  // Filter actual watchlist
  const watchedAuctions = auctions.filter(a => watchlistIds.includes(a.id));
  
  // Mock history - In a real app this would come from user bids
  const historyAuctions = auctions.filter(a => a.status === AuctionStatus.ENDED); 

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h1 className="text-2xl font-bold text-gray-900">Activity</h1>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        <button 
           onClick={() => setActiveTab('watchlist')}
           className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center ${activeTab === 'watchlist' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
           <Eye size={16} className="mr-2"/> Watchlist
        </button>
        <button 
           onClick={() => setActiveTab('history')}
           className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center ${activeTab === 'history' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
           <History size={16} className="mr-2"/> Recently Viewed / History
        </button>
      </div>

      {activeTab === 'watchlist' ? (
         watchedAuctions.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
               <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                  <Eye size={32} />
               </div>
               <h3 className="text-lg font-medium text-gray-900">Your watchlist is empty</h3>
               <p className="text-gray-500 mt-2 mb-6">Start browsing auctions to add items here.</p>
               <Link to="/browse" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Browse Auctions
               </Link>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {watchedAuctions.map(auction => (
                  <AuctionCard 
                    key={auction.id} 
                    auction={auction} 
                    isWatchlist={true} 
                    onRemoveFromWatchlist={onRemoveFromWatchlist}
                  />
               ))}
            </div>
         )
      ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {historyAuctions.map(auction => (
               <AuctionCard 
                 key={auction.id} 
                 auction={auction} 
                 isWatchlist={false} 
                 onRemoveFromWatchlist={onRemoveFromWatchlist}
               />
            ))}
         </div>
      )}
    </div>
  );
};

export default Watchlist;