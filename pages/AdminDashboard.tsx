import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Auction } from '../types';
import { 
  Users, Gavel, Activity, ShieldCheck, LifeBuoy, Sliders, 
  Search, Filter, ChevronDown, ChevronUp, CheckCircle, ShieldAlert,
  Eye, Ban, X
} from 'lucide-react';

interface AdminDashboardProps {
  auctions: Auction[];
}

const MOCK_USERS_DATA = [
    { id: '1', name: 'Alex Director', email: 'alex@autobid.com', role: 'Super Admin', status: 'Active', lastLogin: 'Today', joined: '2023-01-15', riskScore: 10, totalSpent: 0 },
    { id: '2', name: 'John Moderator', email: 'john@autobid.com', role: 'Administrator', status: 'Active', lastLogin: 'Yesterday', joined: '2023-02-20', riskScore: 5, totalSpent: 0 },
    { id: '6', name: 'Jane Buyer', email: 'jane@example.com', role: 'User', status: 'Active', lastLogin: '3 days ago', joined: '2023-04-10', riskScore: 45, totalSpent: 12500 },
    { id: '7', name: 'SpeedRacer', email: 'speed@example.com', role: 'User', status: 'Active', lastLogin: '1 week ago', joined: '2023-05-12', riskScore: 60, totalSpent: 85000 },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ auctions }) => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  
  // State for Users Tab
  const [users, setUsers] = useState(MOCK_USERS_DATA);
  const [userSearch, setUserSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [blockModal, setBlockModal] = useState<{ isOpen: boolean; userId: string | null }>({ isOpen: false, userId: null });

  // Sorting logic
  const sortedUsers = useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig !== null) {
      sortableUsers.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers.filter(u => 
        u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
        u.email.toLowerCase().includes(userSearch.toLowerCase())
    );
  }, [users, sortConfig, userSearch]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleBlockUser = () => {
      if(blockModal.userId) {
          setUsers(users.map(u => u.id === blockModal.userId ? {...u, status: 'Suspended'} : u));
          setBlockModal({ isOpen: false, userId: null });
      }
  }

  // Placeholder for view user detail
  const handleOpenEditUser = (user: any) => {
      // Logic to view user details or open a modal
      console.log("View user", user);
  }

  const SortHeader = ({ label, sortKey }: { label: string, sortKey: string }) => (
      <button 
        onClick={() => requestSort(sortKey)}
        className="flex items-center hover:text-gray-700 font-semibold uppercase text-xs"
      >
          {label}
          {sortConfig?.key === sortKey && (
              sortConfig.direction === 'asc' ? <ChevronUp size={14} className="ml-1"/> : <ChevronDown size={14} className="ml-1"/>
          )}
      </button>
  );

  // Renderers
  const renderUsers = () => (
     <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">User Management</h2>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input 
                   type="text" 
                   placeholder="Search users..." 
                   value={userSearch}
                   onChange={(e) => setUserSearch(e.target.value)}
                   className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
           <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-200">
                 <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">
                       <SortHeader label="Status" sortKey="status" />
                    </th>
                    <th className="px-6 py-4">
                       <SortHeader label="Risk Score" sortKey="riskScore" />
                    </th>
                    <th className="px-6 py-4">
                       <SortHeader label="Joined" sortKey="joined" />
                    </th>
                    <th className="px-6 py-4">
                       <SortHeader label="Last Active" sortKey="lastActive" />
                    </th>
                    <th className="px-6 py-4">
                       <SortHeader label="Total Spent" sortKey="totalSpent" />
                    </th>
                    <th className="px-6 py-4 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                 {sortedUsers.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50">
                       <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                       </td>
                       <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                             u.status === 'Active' ? 'bg-green-100 text-green-700' : 
                             u.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                           }`}>
                             {u.status}
                          </span>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                             <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                <div className={`h-1.5 rounded-full ${u.riskScore > 70 ? 'bg-red-500' : u.riskScore > 30 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${u.riskScore}%` }}></div>
                             </div>
                             <span className="text-xs font-bold">{u.riskScore}</span>
                          </div>
                       </td>
                       <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                           {new Date(u.joined).toLocaleDateString()}
                       </td>
                       <td className="px-6 py-4 text-gray-500">{u.lastLogin}</td>
                       <td className="px-6 py-4 font-mono font-medium text-gray-900">
                           ${u.totalSpent.toLocaleString()}
                       </td>
                       <td className="px-6 py-4 text-right relative">
                          <div className="flex justify-end gap-2 items-center">
                             <button 
                                onClick={() => handleOpenEditUser(u)}
                                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold flex items-center transition-colors border border-blue-200"
                             >
                                <Eye size={14} className="mr-1" /> View
                             </button>
                             <button 
                                onClick={() => setBlockModal({ isOpen: true, userId: u.id })}
                                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold flex items-center transition-colors border border-red-200"
                             >
                                <Ban size={14} className="mr-1" /> Suspend
                             </button>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>

        {/* Suspend User Modal */}
        {blockModal.isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Suspend User?</h3>
                    <p className="text-gray-500 text-sm mb-6">Are you sure you want to suspend this user? They will not be able to log in or place bids.</p>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setBlockModal({isOpen: false, userId: null})} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-bold">Cancel</button>
                        <button onClick={handleBlockUser} className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-bold">Suspend User</button>
                    </div>
                </div>
            </div>
        )}
     </div>
  );

  const renderOverview = () => (
      <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Auctions</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{auctions.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Active Users</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{users.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Pending Reports</h3>
                  <p className="text-3xl font-bold text-orange-600 mt-2">3</p>
              </div>
          </div>
      </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h1>
            <p className="text-gray-500">Admin Dashboard</p>
        </div>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab !== 'overview' && activeTab !== 'users' && (
            <div className="p-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                <p>Module <strong>{activeTab}</strong> is under development.</p>
            </div>
        )}
    </div>
  );
};

export default AdminDashboard;