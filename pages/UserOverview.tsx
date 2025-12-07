import React, { useMemo } from 'react';
import { User, Auction, Bid, AuctionStatus } from '../types';
import { Wallet, Gavel, Clock, TrendingUp, AlertCircle, ArrowUpRight, Plus, User as UserIcon, CheckCircle, XCircle, ArrowRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserOverviewProps {
  user: User;
  auctions: Auction[];
  myBids: Bid[];
}

const UserOverview: React.FC<UserOverviewProps> = ({ user, auctions, myBids }) => {
  
  // 1. Sort bids by newest first for "Recent Activity"
  const sortedBids = useMemo(() => {
    return [...myBids].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [myBids]);

  // 2. Identify unique active auctions the user has bid on
  const activeParticipatingAuctions = useMemo(() => {
    const activeIds = new Set<string>();
    myBids.forEach(bid => {
      const auction = auctions.find(a => a.id === bid.auctionId);
      if (auction && auction.status === AuctionStatus.ACTIVE) {
        activeIds.add(auction.id);
      }
    });
    
    return Array.from(activeIds).map(id => {
      const auction = auctions.find(a => a.id === id)!;
      // Determine if user is winning
      const isWinning = auction.bids.length > 0 && auction.bids[auction.bids.length - 1].userId === user.id;
      return { ...auction, isWinning };
    }).sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime()); // Sort by ending soonest
  }, [auctions, myBids, user.id]);

  // 3. Calculate Stats
  const wonAuctionsCount = auctions.filter(a => 
    a.status === AuctionStatus.ENDED && 
    a.bids.length > 0 && 
    a.bids[a.bids.length - 1].userId === user.id
  ).length;

  const activeBidsCount = activeParticipatingAuctions.length;
  const watchlistCount = user.watchlist?.length || 0;

  // 4. Dynamic Alerts
  const alerts = [];
  if (!user.address) {
    alerts.push({
      id: 'addr',
      type: 'warning',
      title: 'Complete Profile',
      message: 'Add a shipping address to enable property bidding.',
      link: '/settings'
    });
  }
  if (!user.phone) {
    alerts.push({
      id: 'phone',
      type: 'warning',
      title: 'Verify Phone',
      message: 'Secure your account with 2FA.',
      link: '/settings'
    });
  }
  if (user.walletBalance < 1000 && activeBidsCount > 0) {
    alerts.push({
      id: 'bal',
      type: 'critical',
      title: 'Low Balance',
      message: 'Top up your wallet to ensure bids go through.',
      link: '/wallet'
    });
  }
  // Generic fallback if no alerts
  if (alerts.length === 0) {
    alerts.push({
      id: 'explore',
      type: 'info',
      title: 'Explore Categories',
      message: 'Check out the new Classic Cars section.',
      link: '/browse'
    });
  }

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome, {user.name.split(' ')[0]}</h1>
           <p className="text-gray-500">Here's what's happening with your auctions today.</p>
        </div>
        <Link to="/browse" className="w-full md:w-auto text-center bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition-colors flex items-center justify-center">
            <Plus size={18} className="mr-2" /> Find New Auctions
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
         {/* Wallet Card */}
         <div className="bg-gray-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[140px] group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Wallet size={80} /></div>
            <div>
               <p className="text-gray-400 font-medium mb-1 flex items-center gap-2 text-xs uppercase tracking-wider"><Wallet size={12} /> Balance</p>
               <h3 className="text-3xl font-bold tracking-tight">${user.walletBalance.toLocaleString()}</h3>
            </div>
            <Link to="/wallet" className="text-xs bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors font-semibold backdrop-blur-sm self-start mt-4 inline-flex items-center">
                Manage Funds <ArrowRight size={12} className="ml-1"/>
            </Link>
         </div>

         {/* Active Bids Card */}
         <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px] hover:border-blue-300 transition-colors">
            <div className="absolute top-0 right-0 p-4 text-blue-50"><Gavel size={80} /></div>
            <div>
               <p className="text-gray-500 font-medium mb-1 text-xs uppercase tracking-wider">Active Auctions</p>
               <h3 className="text-3xl font-bold text-gray-900">{activeBidsCount}</h3>
            </div>
            <Link to="/my-bids" className="text-blue-600 text-xs font-bold hover:underline flex items-center mt-4">
               View Status <ArrowRight size={12} className="ml-1" />
            </Link>
         </div>

         {/* Watchlist Card */}
         <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px] hover:border-purple-300 transition-colors">
             <div className="absolute top-0 right-0 p-4 text-purple-50"><Clock size={80} /></div>
            <div>
               <p className="text-gray-500 font-medium mb-1 text-xs uppercase tracking-wider">Watchlist</p>
               <h3 className="text-3xl font-bold text-gray-900">{watchlistCount}</h3>
            </div>
            <Link to="/watchlist" className="text-purple-600 text-xs font-bold hover:underline flex items-center mt-4">
               View Saved <ArrowRight size={12} className="ml-1" />
            </Link>
         </div>

         {/* Won Card */}
         <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px] hover:border-green-300 transition-colors">
             <div className="absolute top-0 right-0 p-4 text-green-50"><TrendingUp size={80} /></div>
            <div>
               <p className="text-gray-500 font-medium mb-1 text-xs uppercase tracking-wider">Auctions Won</p>
               <h3 className="text-3xl font-bold text-gray-900">{wonAuctionsCount}</h3>
            </div>
            <Link to="/my-bids?filter=WON" className="text-green-600 text-xs font-bold hover:underline flex items-center mt-4">
               History <ArrowRight size={12} className="ml-1" />
            </Link>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left Column: Live Status & Recent Activity */}
         <div className="lg:col-span-2 space-y-8">
            
            {/* Live Auction Status */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                   <h3 className="font-bold text-gray-900 flex items-center">
                       <Activity size={18} className="mr-2 text-blue-600" /> Live Status
                   </h3>
                   <span className="text-xs font-medium text-gray-500">Participating in {activeBidsCount} auctions</span>
                </div>
                
                {activeParticipatingAuctions.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Gavel size={32} className="text-gray-400" />
                        </div>
                        <p className="font-medium text-gray-900">No active bids</p>
                        <p className="text-sm mb-4">Start bidding to see live updates here.</p>
                        <Link to="/browse" className="text-blue-600 font-bold text-sm hover:underline">Browse Listings</Link>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {activeParticipatingAuctions.slice(0, 4).map(auction => (
                            <div key={auction.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-12 bg-gray-200 rounded-md overflow-hidden shrink-0">
                                        <img src={auction.images[0]} alt={auction.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <Link to={`/auction/${auction.id}`} className="font-bold text-gray-900 hover:text-blue-600 line-clamp-1 block mb-0.5">
                                            {auction.title}
                                        </Link>
                                        <div className="flex items-center text-xs">
                                            {auction.isWinning ? (
                                                <span className="text-green-600 font-bold flex items-center bg-green-50 px-2 py-0.5 rounded-full mr-2">
                                                    <CheckCircle size={10} className="mr-1" /> Winning
                                                </span>
                                            ) : (
                                                <span className="text-red-600 font-bold flex items-center bg-red-50 px-2 py-0.5 rounded-full mr-2">
                                                    <AlertCircle size={10} className="mr-1" /> Outbid
                                                </span>
                                            )}
                                            <span className="text-gray-400 flex items-center">
                                                <Clock size={10} className="mr-1" /> 
                                                Ends {new Date(auction.endsAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">${auction.currentBid.toLocaleString()}</p>
                                    {!auction.isWinning && (
                                        <Link to={`/auction/${auction.id}`} className="text-xs text-blue-600 font-bold hover:underline">
                                            Bid Now
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                        {activeParticipatingAuctions.length > 4 && (
                            <div className="p-3 text-center border-t border-gray-100">
                                <Link to="/my-bids" className="text-xs font-bold text-gray-500 hover:text-gray-900">View All Active Bids</Link>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Recent History Log */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                   <h3 className="font-bold text-gray-900">Recent History</h3>
                </div>
                <div className="divide-y divide-gray-100">
                   {sortedBids.length === 0 ? (
                      <div className="p-6 text-center text-sm text-gray-500">No recent activity.</div>
                   ) : (
                      sortedBids.slice(0, 5).map(bid => {
                          const auction = auctions.find(a => a.id === bid.auctionId);
                          return (
                             <div key={bid.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                   <div className="bg-blue-50 p-2 rounded-full text-blue-600 shrink-0 border border-blue-100">
                                      <Gavel size={16} />
                                   </div>
                                   <div>
                                      <p className="text-sm text-gray-900">
                                          Placed bid on <span className="font-medium">{auction?.title || 'Unknown Item'}</span>
                                      </p>
                                      <p className="text-xs text-gray-400">{new Date(bid.timestamp).toLocaleString()}</p>
                                   </div>
                                </div>
                                <span className="text-sm font-bold text-gray-900 font-mono">${bid.amount.toLocaleString()}</span>
                             </div>
                          );
                      })
                   )}
                </div>
            </div>
         </div>

         {/* Right Column: Notifications & Tasks */}
         <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                   <AlertCircle size={20} className="text-orange-500" />
                   Action Required
                </h3>
                <div className="space-y-3">
                   {alerts.map((alert, idx) => (
                       <Link to={alert.link} key={idx} className={`block p-3 rounded-lg border transition-all hover:shadow-md ${
                           alert.type === 'critical' ? 'bg-red-50 border-red-100' :
                           alert.type === 'warning' ? 'bg-orange-50 border-orange-100' :
                           'bg-blue-50 border-blue-100'
                       }`}>
                           <div className="flex justify-between items-start mb-1">
                               <p className={`text-sm font-bold ${
                                   alert.type === 'critical' ? 'text-red-800' :
                                   alert.type === 'warning' ? 'text-orange-800' :
                                   'text-blue-800'
                               }`}>{alert.title}</p>
                               <ArrowUpRight size={14} className={
                                   alert.type === 'critical' ? 'text-red-400' :
                                   alert.type === 'warning' ? 'text-orange-400' :
                                   'text-blue-400'
                               } />
                           </div>
                           <p className={`text-xs ${
                               alert.type === 'critical' ? 'text-red-600' :
                               alert.type === 'warning' ? 'text-orange-600' :
                               'text-blue-600'
                           }`}>{alert.message}</p>
                       </Link>
                   ))}
                </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="font-bold text-lg mb-2">Sell with Autobid</h3>
                    <p className="text-blue-100 text-sm mb-4">Turn your assets into cash. List your car or property today.</p>
                    <Link to="/create" className="inline-block bg-white text-blue-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors">
                        Create Listing
                    </Link>
                </div>
                <div className="absolute -bottom-4 -right-4 opacity-10">
                    <TrendingUp size={100} />
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default UserOverview;