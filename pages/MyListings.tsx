import React from 'react';
import { Auction } from '../types';
import { Link } from 'react-router-dom';
import { Package, Edit2, Eye, Trash2 } from 'lucide-react';

interface MyListingsProps {
  auctions: Auction[];
}

const MyListings: React.FC<MyListingsProps> = ({ auctions }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
         <Link to="/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-blue-700">
            Create New Listing
         </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
         {auctions.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
               <Package size={48} className="mx-auto mb-4 opacity-20" />
               <p>You haven't listed any items yet.</p>
            </div>
         ) : (
            <div className="divide-y divide-gray-100">
               {auctions.map(auction => (
                  <div key={auction.id} className="p-6 flex flex-col md:flex-row items-center justify-between">
                     <div className="flex items-center gap-4 flex-1">
                        <div className="w-24 h-16 bg-gray-200 rounded-lg overflow-hidden relative">
                           <img src={auction.images[0]} className="w-full h-full object-cover" alt="Thumb"/>
                        </div>
                        <div>
                           <h3 className="font-bold text-gray-900 text-lg">{auction.title}</h3>
                           <p className="text-sm text-gray-500">Listed: {new Date(auction.createdAt).toLocaleDateString()}</p>
                           <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-bold rounded capitalize ${
                              auction.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                           }`}>
                              {auction.status}
                           </span>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-8 mt-4 md:mt-0">
                        <div className="text-right">
                           <p className="text-sm text-gray-500">Current Bid</p>
                           <p className="font-bold text-gray-900">${auction.currentBid.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-sm text-gray-500">Bids</p>
                           <p className="font-bold text-gray-900">{auction.bids.length}</p>
                        </div>
                        <div className="flex gap-2">
                           <Link to={`/auction/${auction.id}`} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full" title="View">
                              <Eye size={20} />
                           </Link>
                           <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full" title="Edit">
                              <Edit2 size={20} />
                           </button>
                           <button className="p-2 text-red-500 hover:bg-red-50 rounded-full" title="Delete">
                              <Trash2 size={20} />
                           </button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
    </div>
  );
};

export default MyListings;