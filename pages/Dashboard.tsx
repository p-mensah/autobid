import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Clock, DollarSign, Car, Home, X, SlidersHorizontal, User, Sparkles, Loader2, ExternalLink, TrendingUp } from 'lucide-react';
import { Auction, AuctionStatus, AuctionType, FilterState } from '../types';
import { SkeletonCard } from '../components/Loading';
import { getMarketInsights, MarketInsight } from '../services/geminiService';

interface DashboardProps {
  auctions: Auction[];
  loading?: boolean;
}

// Helper Functions
const getStatusColor = (status: AuctionStatus) => {
  switch (status) {
    case AuctionStatus.ACTIVE:
      return 'bg-green-600 text-white border-green-700';
    case AuctionStatus.PENDING:
      return 'bg-amber-500 text-white border-amber-600';
    case AuctionStatus.ENDED:
      return 'bg-gray-600 text-white border-gray-700';
    case AuctionStatus.CANCELLED:
      return 'bg-red-600 text-white border-red-700';
    default:
      return 'bg-gray-600 text-white border-gray-700';
  }
};

const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

const getHoursRemaining = (endDate: string) => {
  return (new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60);
};

const getTimeRemainingLabel = (endDate: string) => {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return 'Ended';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days === 0) return `${hours}h remaining`;
  return `${days}d ${hours}h left`;
};

// Filter Bar Component extracted to prevent re-renders losing focus
const DesktopFilterBar: React.FC<{
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  categories: string[];
  onResearch: () => void;
  isResearching: boolean;
}> = ({ filters, setFilters, categories, onResearch, isResearching }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 justify-between w-full">
      {/* Search & Type */}
      <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search assets..." 
              className="pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
              value={filters.keyword}
              onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && filters.keyword && onResearch()}
            />
            {filters.keyword && (
              <button 
                onClick={onResearch}
                disabled={isResearching}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-md transition-colors ${
                    isResearching ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                }`}
                title="Get Real-Time Market Insights"
              >
                {isResearching ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              </button>
            )}
          </div>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['ALL', AuctionType.AUTOMOBILE, AuctionType.PROPERTY] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilters(prev => ({ ...prev, type, category: '' }))}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex-1 sm:flex-none ${
                  filters.type === type ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {type === 'ALL' ? 'All' : type === AuctionType.AUTOMOBILE ? 'Cars' : 'Properties'}
              </button>
            ))}
          </div>
      </div>

      {/* Secondary Filters & Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
          {/* Category Dropdown - Only if type selected */}
          {filters.type !== 'ALL' && (
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white"
          >
            <option value={AuctionStatus.ACTIVE}>Active Auctions</option>
            <option value="ENDING_SOON">Ending Soon (&lt; 24h)</option>
            <option value="ALL">All Status</option>
          </select>

          <div className="flex items-center gap-2 border-l border-gray-200 pl-3 ml-1">
            <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white font-medium w-full sm:w-auto"
            >
              <option value="NEWEST">Newest Listed</option>
              <option value="ENDING_SOON">Ending Soonest</option>
              <option value="HIGHEST_BID">Highest Bid</option>
              <option value="LOWEST_BID">Lowest Bid</option>
              <option value="SELLER_RATING">Highest Rated Seller</option>
            </select>
          </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ auctions, loading = false }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [marketInsight, setMarketInsight] = useState<MarketInsight | null>(null);
  const [isResearching, setIsResearching] = useState(false);
  
  // Initialize state from URL Params OR Local Storage OR Defaults
  const [filters, setFilters] = useState<FilterState>(() => {
    const urlKeyword = searchParams.get('keyword');
    const urlType = searchParams.get('type');
    
    // If URL has params, prioritize them
    if (urlKeyword || urlType || searchParams.has('status')) {
      return {
        keyword: urlKeyword || '',
        type: (urlType as AuctionType | 'ALL') || 'ALL',
        category: searchParams.get('category') || '',
        status: (searchParams.get('status') as any) || AuctionStatus.ACTIVE,
        sortBy: (searchParams.get('sort') as any) || 'NEWEST'
      };
    }

    // Fallback to LocalStorage
    const saved = localStorage.getItem('dashboard_filters');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved filters", e);
      }
    }

    // Default
    return {
      keyword: '',
      type: 'ALL',
      category: '',
      status: AuctionStatus.ACTIVE,
      sortBy: 'NEWEST'
    };
  });

  // Sync filters to URL search params AND LocalStorage
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.keyword) params.set('keyword', filters.keyword);
    if (filters.type !== 'ALL') params.set('type', filters.type);
    if (filters.category) params.set('category', filters.category);
    if (filters.status !== AuctionStatus.ACTIVE) params.set('status', filters.status);
    if (filters.sortBy !== 'NEWEST') params.set('sort', filters.sortBy);

    // Update URL without adding to history stack every keypress
    setSearchParams(params, { replace: true });
    
    // Save to local storage for session persistence
    localStorage.setItem('dashboard_filters', JSON.stringify(filters));
  }, [filters, setSearchParams]);

  const [tick, setTick] = useState(0); // Forcing re-render for timers

  // Force re-render every minute to update "time remaining" and list status
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  // Lock body scroll when mobile filters are open
  useEffect(() => {
    if (isMobileFiltersOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileFiltersOpen]);

  // Handler for AI Market Research
  const handleResearch = async () => {
    if (!filters.keyword) return;
    setIsResearching(true);
    setMarketInsight(null);
    try {
      const result = await getMarketInsights(filters.keyword);
      setMarketInsight(result);
    } catch (error) {
      console.error("Research failed:", error);
    } finally {
      setIsResearching(false);
    }
  };

  const filteredAuctions = useMemo(() => {
    let result = auctions.filter(auction => {
      const matchesKeyword = auction.title.toLowerCase().includes(filters.keyword.toLowerCase()) || 
                             auction.description.toLowerCase().includes(filters.keyword.toLowerCase());
      const matchesType = filters.type === 'ALL' || auction.type === filters.type;
      const matchesCategory = filters.category === '' || auction.category === filters.category;
      
      let matchesStatus = true;
      if (filters.status === 'ALL') {
        matchesStatus = true;
      } else if (filters.status === 'ENDING_SOON') {
        // Less than 24 hours
        matchesStatus = auction.status === AuctionStatus.ACTIVE && getHoursRemaining(auction.endsAt) < 24 && getHoursRemaining(auction.endsAt) > 0;
      } else {
        matchesStatus = auction.status === filters.status;
      }
      
      return matchesKeyword && matchesType && matchesCategory && matchesStatus;
    });

    // Sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'NEWEST':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'ENDING_SOON':
          return new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime();
        case 'HIGHEST_BID':
          return b.currentBid - a.currentBid;
        case 'LOWEST_BID':
          return a.currentBid - b.currentBid;
        case 'SELLER_RATING':
          return (b.sellerRating || 0) - (a.sellerRating || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [auctions, filters, tick]);

  const categories = useMemo(() => {
    if (filters.type === 'ALL') return [];
    if (filters.type === AuctionType.AUTOMOBILE) return ['Sedan', 'SUV', 'Sports', 'Classic', 'Truck'];
    if (filters.type === AuctionType.PROPERTY) return ['Residential', 'Commercial', 'Land', 'Industrial'];
    return [];
  }, [filters.type]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Browse Auctions</h1>
          <p className="text-gray-500 mt-1">Find your next investment</p>
        </div>
        <button 
          onClick={() => setIsMobileFiltersOpen(true)}
          className="md:hidden flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 font-medium hover:bg-gray-50"
        >
          <SlidersHorizontal size={18} className="mr-2" />
          Filters
        </button>
      </div>

      {/* Desktop Filter Bar */}
      <div className="hidden md:block bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <DesktopFilterBar 
          filters={filters} 
          setFilters={setFilters} 
          categories={categories} 
          onResearch={handleResearch}
          isResearching={isResearching}
        />
        
        {/* Active Filter Tags */}
        {(filters.keyword || filters.category || filters.status !== AuctionStatus.ACTIVE) && (
          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
             <span className="text-xs text-gray-500 self-center mr-2">Active Filters:</span>
             {filters.keyword && (
               <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full flex items-center">
                 "{filters.keyword}"
                 <button onClick={() => setFilters(prev => ({ ...prev, keyword: '' }))}><X size={12} className="ml-1"/></button>
               </span>
             )}
             {filters.category && (
               <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full flex items-center">
                 {filters.category}
                 <button onClick={() => setFilters(prev => ({ ...prev, category: '' }))}><X size={12} className="ml-1"/></button>
               </span>
             )}
             {filters.status !== AuctionStatus.ACTIVE && (
               <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full flex items-center">
                 {filters.status === 'ENDING_SOON' ? 'Ending Soon' : formatStatus(filters.status)}
                 <button onClick={() => setFilters(prev => ({ ...prev, status: AuctionStatus.ACTIVE }))}><X size={12} className="ml-1"/></button>
               </span>
             )}
             <button 
               onClick={() => {
                 setFilters({ keyword: '', type: 'ALL', category: '', status: AuctionStatus.ACTIVE, sortBy: 'NEWEST' });
                 setMarketInsight(null);
               }}
               className="text-xs text-gray-500 hover:text-red-500 underline ml-auto"
             >
               Clear All
             </button>
          </div>
        )}
      </div>

      {/* Market Intelligence Card */}
      {marketInsight && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-blue-100 rounded-xl p-6 mb-6 animate-fade-in relative shadow-md">
            <button 
              onClick={() => setMarketInsight(null)} 
              className="absolute top-4 right-4 text-blue-400 hover:text-blue-700 hover:bg-blue-100 rounded-full p-1.5 transition-colors"
            >
              <X size={18} />
            </button>
            <div className="flex items-start gap-5">
                <div className="bg-white p-3 rounded-full shadow-sm text-blue-600 mt-1 shrink-0 ring-4 ring-blue-50">
                    <TrendingUp size={24} />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-3 flex items-center">
                      Market Pulse: <span className="text-blue-700 ml-1.5 capitalize">{filters.keyword}</span>
                      <span className="ml-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white uppercase tracking-wider shadow-sm flex items-center">
                          <Sparkles size={10} className="mr-1" />
                          Live Insights
                      </span>
                    </h3>
                    <div className="text-gray-700 text-sm leading-relaxed mb-4 max-w-4xl bg-white/50 p-4 rounded-lg border border-blue-100/50">
                        {marketInsight.text}
                    </div>
                    {marketInsight.sources && marketInsight.sources.length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sources & Real-time Listings</p>
                            <div className="flex flex-wrap gap-2">
                                {marketInsight.sources.map((source, idx) => (
                                    source.web?.uri ? (
                                        <a 
                                            key={idx} 
                                            href={source.web.uri} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="group flex items-center text-xs bg-white text-gray-700 px-3 py-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                                        >
                                            <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <ExternalLink size={10} />
                                            </div>
                                            <span className="max-w-[150px] truncate">{source.web.title || 'View Source'}</span>
                                        </a>
                                    ) : null
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* Mobile Filter Modal Overlay */}
      {isMobileFiltersOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end justify-center sm:items-center">
           {/* Backdrop */}
           <div 
             className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
             onClick={() => setIsMobileFiltersOpen(false)}
           />
           
           {/* Modal Panel */}
           <div className="relative w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-300">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                 <h2 className="text-lg font-bold text-gray-900 flex items-center">
                    <Filter size={18} className="mr-2 text-blue-600"/> Filters & Sort
                 </h2>
                 <button 
                    onClick={() => setIsMobileFiltersOpen(false)} 
                    className="p-2 bg-white hover:bg-gray-100 rounded-full text-gray-500 border border-gray-200 transition-colors"
                 >
                    <X size={20} />
                 </button>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-6">
                 <div className="space-y-4">
                    <label className="text-sm font-semibold text-gray-700 block">Keywords</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search..." 
                        className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none w-full bg-gray-50 focus:bg-white transition-colors"
                        value={filters.keyword}
                        onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
                      />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-sm font-semibold text-gray-700 block">Asset Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['ALL', AuctionType.AUTOMOBILE, AuctionType.PROPERTY] as const).map(type => (
                        <button
                          key={type}
                          onClick={() => setFilters(prev => ({ ...prev, type, category: '' }))}
                          className={`px-2 py-3 rounded-xl text-sm font-medium transition-all border ${
                            filters.type === type 
                              ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-900/20' 
                              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {type === 'ALL' ? 'All' : type === AuctionType.AUTOMOBILE ? 'Cars' : 'Property'}
                        </button>
                      ))}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-sm font-semibold text-gray-700 block">Category & Status</label>
                    <div className="grid grid-cols-1 gap-3">
                        {filters.type !== 'ALL' && (
                          <select
                            value={filters.category}
                            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                          >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        )}
                        <select
                          value={filters.status}
                          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                        >
                          <option value={AuctionStatus.ACTIVE}>Active Auctions</option>
                          <option value="ENDING_SOON">Ending Soon (&lt; 24h)</option>
                          <option value="ALL">All Status</option>
                        </select>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-sm font-semibold text-gray-700 block">Sort Order</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium"
                    >
                      <option value="NEWEST">Newest Listed</option>
                      <option value="ENDING_SOON">Ending Soonest</option>
                      <option value="HIGHEST_BID">Highest Bid</option>
                      <option value="LOWEST_BID">Lowest Bid</option>
                      <option value="SELLER_RATING">Highest Rated Seller</option>
                    </select>
                 </div>
              </div>

              <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl pb-6 sm:pb-4">
                 <button 
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-900/20 active:scale-95 flex justify-center items-center"
                 >
                    Show {filteredAuctions.length} Results
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {[1,2,3,4,5,6,7,8].map(i => <SkeletonCard key={i} />)}
         </div>
      ) : filteredAuctions.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <Filter size={48} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No auctions found</h3>
          <p className="text-gray-500">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAuctions.map(auction => (
            <div key={auction.id} className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden flex flex-col h-full">
               <Link to={`/auction/${auction.id}`} className="block relative h-48 overflow-hidden shrink-0">
                <img 
                  src={auction.images[0]} 
                  alt={auction.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                   <div className={`px-2.5 py-1 rounded-md text-xs font-bold shadow-sm border ${getStatusColor(auction.status)}`}>
                      {formatStatus(auction.status)}
                   </div>
                   <div className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center">
                      {auction.type === AuctionType.AUTOMOBILE ? <Car size={12} className="mr-1" /> : <Home size={12} className="mr-1" />}
                      {auction.category}
                   </div>
                </div>
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-bold shadow-sm ${
                   getHoursRemaining(auction.endsAt) < 24 ? 'bg-red-100 text-red-800' : 'bg-white/90 text-gray-800'
                }`}>
                  {getTimeRemainingLabel(auction.endsAt)}
                </div>
              </Link>
              
              <div className="p-4 flex flex-col flex-1">
                <Link to={`/auction/${auction.id}`} className="block">
                    <h3 className="font-bold text-gray-900 truncate mb-1" title={auction.title}>{auction.title}</h3>
                </Link>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">{auction.description}</p>
                
                {/* Seller Link */}
                <div className="mb-3 flex items-center text-xs text-gray-500">
                    <User size={12} className="mr-1" />
                    <span>Seller: </span>
                    <Link to={`/seller/${auction.sellerId}`} className="ml-1 text-blue-600 hover:underline">
                        {auction.sellerName}
                    </Link>
                </div>

                <div className="flex items-end justify-between pt-4 border-t border-gray-100 mt-auto">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Current Bid</p>
                    <p className="text-lg font-bold text-blue-600 flex items-center">
                      <DollarSign size={16} strokeWidth={3} />
                      {auction.currentBid.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-0.5">Bids</p>
                    <p className="text-sm font-medium text-gray-700">{auction.bids.length}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;