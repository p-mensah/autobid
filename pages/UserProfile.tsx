import React, { useState } from 'react';
import { User, Auction, Bid } from '../types';
import { UserCircle, Mail, Phone, MapPin, Calendar, Edit2, Settings, Gavel, Package, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserProfileProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  myBids: Bid[]; 
  myAuctions: Auction[];
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdateUser, myBids, myAuctions }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'bids' | 'auctions'>('info');
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      onUpdateUser({ ...user, avatar: imageUrl });
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
         {/* Cover Image */}
         <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
         
         <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
               <div className="relative group">
                  <div className="bg-white p-1 rounded-full">
                     <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white text-gray-400 overflow-hidden shadow-sm">
                        {user.avatar ? (
                           <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                           <UserCircle size={64} />
                        )}
                     </div>
                  </div>
                  
                  {/* Upload Button */}
                  <label 
                     htmlFor="avatar-upload" 
                     className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-lg border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-300 cursor-pointer transition-all z-10"
                     title="Change Profile Picture"
                  >
                     <Camera size={16} />
                     <input 
                        id="avatar-upload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload}
                     />
                  </label>
               </div>

               <Link 
                 to="/settings"
                 className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors text-gray-700"
               >
                  <Settings size={16} className="mr-2" />
                  Edit Profile
               </Link>
            </div>

            <div className="mb-6">
               <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
               <p className="text-gray-500 max-w-2xl mt-1">{user.bio || "No bio added yet. Go to Settings to add a bio."}</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
               <button 
                  onClick={() => setActiveTab('info')}
                  className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'info' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
               >
                  Overview
               </button>
               <button 
                  onClick={() => setActiveTab('bids')}
                  className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'bids' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
               >
                  Recent Bids ({myBids.length})
               </button>
               <button 
                  onClick={() => setActiveTab('auctions')}
                  className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'auctions' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
               >
                  Auctions ({myAuctions.length})
               </button>
            </div>

            {/* Content */}
            {activeTab === 'info' && (
                 <div className="space-y-6 max-w-4xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                       <div className="flex items-center text-gray-600 p-3 bg-gray-50 rounded-lg">
                          <Mail size={18} className="mr-3 text-gray-400" />
                          <span className="font-medium">{user.email}</span>
                       </div>
                       <div className="flex items-center text-gray-600 p-3 bg-gray-50 rounded-lg">
                          <Phone size={18} className="mr-3 text-gray-400" />
                          <span>{user.phone || "No phone number"}</span>
                       </div>
                       <div className="flex items-center text-gray-600 p-3 bg-gray-50 rounded-lg">
                          <MapPin size={18} className="mr-3 text-gray-400" />
                          <span>{user.address || "No address provided"}</span>
                       </div>
                       <div className="flex items-center text-gray-600 p-3 bg-gray-50 rounded-lg">
                          <Calendar size={18} className="mr-3 text-gray-400" />
                          <span>Member since {new Date(user.joinedDate).toLocaleDateString()}</span>
                       </div>
                    </div>
                 </div>
            )}

            {activeTab === 'bids' && (
               <div className="space-y-4">
                  {myBids.length === 0 ? (
                     <div className="text-center py-8 text-gray-500">You haven't placed any bids yet.</div>
                  ) : (
                     myBids.slice(0, 10).map(bid => (
                        <div key={bid.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                           <div className="flex items-center">
                              <div className="bg-blue-100 p-2 rounded-full mr-3 text-blue-600">
                                 <Gavel size={20} />
                              </div>
                              <div>
                                 <p className="font-medium text-gray-900">Bid on Auction #{bid.auctionId}</p>
                                 <p className="text-xs text-gray-500">{new Date(bid.timestamp).toLocaleString()}</p>
                              </div>
                           </div>
                           <span className="font-bold text-gray-900">${bid.amount.toLocaleString()}</span>
                        </div>
                     ))
                  )}
               </div>
            )}

            {activeTab === 'auctions' && (
               <div className="space-y-4">
                   {myAuctions.length === 0 ? (
                     <div className="text-center py-8 text-gray-500">You haven't listed any auctions yet.</div>
                  ) : (
                     myAuctions.map(auction => (
                        <div key={auction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                           <div className="flex items-center">
                              <div className="bg-purple-100 p-2 rounded-full mr-3 text-purple-600">
                                 <Package size={20} />
                              </div>
                              <div>
                                 <p className="font-medium text-gray-900">{auction.title}</p>
                                 <p className="text-xs text-gray-500">Status: {auction.status}</p>
                              </div>
                           </div>
                           <span className="font-bold text-gray-900">${auction.currentBid.toLocaleString()}</span>
                        </div>
                     ))
                  )}
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default UserProfile;