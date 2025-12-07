import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Auction } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend,
  ComposedChart,
  Scatter,
  ScatterChart,
  ZAxis
} from 'recharts';
import { 
  Users, 
  DollarSign, 
  Gavel, 
  Settings, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  Search,
  Download,
  Lock,
  Webhook,
  X,
  Server,
  Plus,
  Mail,
  Send,
  Smartphone,
  ShieldAlert,
  Info,
  Inbox,
  Trash2,
  Paperclip,
  MoreVertical,
  Shield,
  Edit2,
  ToggleLeft,
  ToggleRight,
  Database,
  Globe,
  CreditCard,
  Bell,
  MapPin,
  Clock,
  Activity,
  TrendingUp,
  ChevronRight,
  CheckSquare,
  XSquare,
  Briefcase,
  Filter,
  ChevronUp,
  ChevronDown,
  Calendar,
  Zap,
  Scale,
  Search as SearchIcon,
  Eye,
  Flag,
  UserCheck,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { LoadingSpinner } from '../components/Loading';

// --- MOCK DATA ---
const REVENUE_DATA = [
  { name: 'Jan', revenue: 42000, expenses: 12000 },
  { name: 'Feb', revenue: 38000, expenses: 11000 },
  { name: 'Mar', revenue: 55000, expenses: 14000 },
  { name: 'Apr', revenue: 78000, expenses: 18000 },
  { name: 'May', revenue: 62000, expenses: 15000 },
  { name: 'Jun', revenue: 95000, expenses: 22000 },
];

const ANALYTICS_GROWTH_DATA = [
  { month: 'Jan', users: 1000, listings: 200, revenue: 15000 },
  { month: 'Feb', users: 1200, listings: 250, revenue: 18000 },
  { month: 'Mar', users: 1100, listings: 220, revenue: 16000 },
  { month: 'Apr', users: 1500, listings: 300, revenue: 22000 },
  { month: 'May', users: 1800, listings: 350, revenue: 28000 },
  { month: 'Jun', users: 2200, listings: 450, revenue: 35000 },
];

const ADVANCED_COHORT_DATA = [
  { x: 10, y: 30, z: 200, name: 'Jan Cohort' },
  { x: 30, y: 200, z: 260, name: 'Feb Cohort' },
  { x: 45, y: 100, z: 400, name: 'Mar Cohort' },
  { x: 50, y: 400, z: 280, name: 'Apr Cohort' },
  { x: 70, y: 150, z: 100, name: 'May Cohort' },
  { x: 100, y: 250, z: 500, name: 'Jun Cohort' },
];

const GEO_DATA = [
    { name: 'North America', value: 45 },
    { name: 'Europe', value: 30 },
    { name: 'Asia', value: 15 },
    { name: 'Other', value: 10 },
];

const CATEGORY_DATA = [
  { name: 'Automobiles', value: 65 },
  { name: 'Real Estate', value: 35 },
];

const AUDIT_LOGS = [
  { id: 1, action: 'SYSTEM_CONFIG_CHANGE', user: 'Alex Director', details: 'Updated Commission Rate to 4.5%', time: '10 mins ago', ip: '192.168.1.1' },
  { id: 2, action: 'USER_BAN', user: 'John Moderator', details: 'Banned user ID: u_882 (Fraud Risk)', time: '45 mins ago', ip: '10.0.0.42' },
  { id: 3, action: 'REFUND_APPROVE', user: 'Alex Director', details: 'Approved refund #ref_992 ($5,200)', time: '2 hours ago', ip: '192.168.1.1' },
  { id: 4, action: 'ROLE_UPDATE', user: 'Alex Director', details: 'Promoted user u_admin to Admin', time: '5 hours ago', ip: '192.168.1.1' },
  { id: 5, action: 'LOGIN_FAIL', user: 'System', details: 'Multiple failed login attempts for admin@autobid.com', time: '6 hours ago', ip: '45.22.11.9' },
];

const INITIAL_ALERTS = [
  { id: 1, type: 'CRITICAL', message: 'Payment Gateway Latency High (>2s)', source: 'Stripe API', time: '5m ago' },
  { id: 2, type: 'WARNING', message: 'Unusual sign-up spike from IP range 45.22.*', source: 'Security', time: '1h ago' },
];

const MOCK_DISPUTES = [
    { id: 'd1', auctionId: 'a1', complainant: 'Jane Buyer', respondent: 'Elon Fan', reason: 'Item not as described', status: 'OPEN', amount: 85500, date: '2023-10-25' },
    { id: 'd2', auctionId: 'a3', complainant: 'V8Lover', respondent: 'Classic Collectors', reason: 'Shipping damage', status: 'RESOLVED', amount: 185000, date: '2023-10-20' },
    { id: 'd3', auctionId: 'a7', complainant: 'EcoWarrior', respondent: 'Overland Outfitters', reason: 'Title issue', status: 'ESCALATED', amount: 68000, date: '2023-10-26' },
];

const MOCK_TRANSACTIONS = [
    { id: 'tx1', user: 'Jane Buyer', type: 'DEPOSIT', amount: 5000, status: 'COMPLETED', date: '2023-10-26 10:00', gateway: 'Stripe' },
    { id: 'tx2', user: 'SpeedRacer', type: 'PAYMENT', amount: 82000, status: 'COMPLETED', date: '2023-10-25 14:30', gateway: 'Wire' },
    { id: 'tx3', user: 'Elon Fan', type: 'PAYOUT', amount: 78000, status: 'PENDING', date: '2023-10-25 09:00', gateway: 'ACH' },
    { id: 'tx4', user: 'V8Lover', type: 'REFUND', amount: 500, status: 'COMPLETED', date: '2023-10-24 11:15', gateway: 'Stripe' },
];

const INITIAL_ROLES = [
    { id: 'super_admin', name: 'Super Admin', users: 2, permissions: ['ALL'] },
    { id: 'admin', name: 'Administrator', users: 5, permissions: ['view_users', 'edit_users', 'moderate_content', 'view_reports', 'ban_users'] },
    { id: 'moderator', name: 'Moderator', users: 12, permissions: ['moderate_content', 'view_users'] },
    { id: 'support', name: 'Support Agent', users: 8, permissions: ['view_users', 'manage_tickets'] },
];

const MOCK_ADMIN_USERS = [
    { id: '1', name: 'Alex Director', email: 'alex@autobid.com', role: 'Super Admin', status: 'Active', lastLogin: 'Today', joined: '2023-01-15', activityScore: 98 },
    { id: '2', name: 'John Moderator', email: 'john@autobid.com', role: 'Administrator', status: 'Active', lastLogin: 'Yesterday', joined: '2023-02-20', activityScore: 85 },
    { id: '3', name: 'Sarah Support', email: 'sarah@autobid.com', role: 'Support Agent', status: 'Active', lastLogin: '2 hrs ago', joined: '2023-03-10', activityScore: 92 },
    { id: '4', name: 'Mike Audit', email: 'mike@autobid.com', role: 'Moderator', status: 'Suspended', lastLogin: '5 days ago', joined: '2023-05-05', activityScore: 12 },
    { id: '5', name: 'Emily Finance', email: 'emily@autobid.com', role: 'Administrator', status: 'Active', lastLogin: '1 hour ago', joined: '2023-06-12', activityScore: 78 },
    { id: '6', name: 'Jane Buyer', email: 'jane@example.com', role: 'User', status: 'Active', lastLogin: '3 days ago', joined: '2023-04-10', activityScore: 45 },
    { id: '7', name: 'SpeedRacer', email: 'speed@example.com', role: 'User', status: 'Active', lastLogin: '1 week ago', joined: '2023-05-12', activityScore: 60 },
];

const INITIAL_ACCESS_REQUESTS = [
  { id: 1, user: 'New Seller LLC', type: 'SELLER_VERIFICATION', date: '2023-10-26', status: 'PENDING', details: 'Business License, ID submitted' },
  { id: 2, user: 'John Doe', type: 'BIDDER_LIMIT_INCREASE', date: '2023-10-25', status: 'PENDING', details: 'Requesting $50k limit' },
  { id: 3, user: 'Luxury Autos Inc', type: 'SELLER_VERIFICATION', date: '2023-10-24', status: 'APPROVED', details: 'Verified via Stripe' },
  { id: 4, user: 'Investor Group A', type: 'BIDDER_LIMIT_INCREASE', date: '2023-10-22', status: 'DENIED', details: 'Insufficient fund proof' },
];

const PERMISSION_KEYS = [
    { key: 'view_users', label: 'View Users' },
    { key: 'edit_users', label: 'Edit User Profiles' },
    { key: 'ban_users', label: 'Ban/Suspend Users' },
    { key: 'moderate_content', label: 'Moderate Content' },
    { key: 'view_reports', label: 'View Reports' },
    { key: 'delete_auctions', label: 'Delete Auctions' },
    { key: 'manage_tickets', label: 'Manage Tickets' },
    { key: 'view_financials', label: 'View Financials' },
    { key: 'manage_settings', label: 'System Settings' }
];

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

interface SuperAdminDashboardProps {
  auctions: Auction[];
}

type TabType = 'executive' | 'analytics' | 'advanced_analytics' | 'users' | 'roles' | 'buysell' | 'investigation' | 'financials' | 'configuration' | 'audit' | 'integrations' | 'alerts' | 'disputes' | 'communications';

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ auctions }) => {
  const [searchParams] = useSearchParams();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [configTab, setConfigTab] = useState<'general'|'security'|'payment'|'content'|'notifications'|'features'>('general');
  
  // Alert State
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  
  // Role Management State
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');

  // Buy/Sell Management State
  const [accessRequests, setAccessRequests] = useState(INITIAL_ACCESS_REQUESTS);

  // Investigation State
  const [investigationQuery, setInvestigationQuery] = useState('');
  const [investigationResult, setInvestigationResult] = useState<any>(null);
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [invStartDate, setInvStartDate] = useState('');
  const [invEndDate, setInvEndDate] = useState('');
  const [invActionFilter, setInvActionFilter] = useState('ALL');

  // Payment Config State
  const [paymentEmailProvider, setPaymentEmailProvider] = useState('sendgrid');
  const [paymentEmailApiKey, setPaymentEmailApiKey] = useState('');
  const [isTestingPaymentConnection, setIsTestingPaymentConnection] = useState(false);

  // SMS Config State
  const [smsProvider, setSmsProvider] = useState('twilio');
  const [smsApiKey, setSmsApiKey] = useState('');
  const [isTestingSms, setIsTestingSms] = useState(false);

  // Communications State
  const [commTab, setCommTab] = useState<'compose' | 'gateways'>('compose');
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastAudience, setBroadcastAudience] = useState('all');
  const [broadcastChannels, setBroadcastChannels] = useState<{email: boolean, sms: boolean}>({email: true, sms: false});
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);

  // User Admin State
  const [adminUsers, setAdminUsers] = useState(MOCK_ADMIN_USERS);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('ALL');
  const [userStatusFilter, setUserStatusFilter] = useState<string>('ALL');
  const [userDateFilter, setUserDateFilter] = useState<string>('');
  const [userSortOrder, setUserSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<any>(null);

  // Determine active tab from URL, default to 'executive'
  const activeTab = (searchParams.get('tab') as TabType) || 'executive';

  const handleRoleChange = (userId: string, newRole: string) => {
      setAdminUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const handleTogglePermission = (roleId: string, permKey: string) => {
      setRoles(roles.map(role => {
          if (role.id === roleId) {
              const hasPerm = role.permissions.includes(permKey);
              return {
                  ...role,
                  permissions: hasPerm 
                    ? role.permissions.filter(p => p !== permKey)
                    : [...role.permissions, permKey]
              };
          }
          return role;
      }));
  };

  const handleCreateRole = () => {
      if (newRoleName.trim()) {
          const id = newRoleName.toLowerCase().replace(/\s+/g, '_');
          setRoles([...roles, {
              id,
              name: newRoleName,
              users: 0,
              permissions: []
          }]);
          setNewRoleName('');
          setIsCreateRoleModalOpen(false);
      }
  };

  const handleRequestAction = (id: number, action: 'APPROVE' | 'DENY') => {
      setAccessRequests(prev => prev.map(req => req.id === id ? { ...req, status: action === 'APPROVE' ? 'APPROVED' : 'DENIED' } : req));
  };

  const toggleUserStatus = (userId: string) => {
      setAdminUsers(adminUsers.map(u => 
          u.id === userId ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u
      ));
  };

  const handleOpenEditUser = (user: any) => {
      setSelectedUserForEdit({ ...user });
      setIsEditUserModalOpen(true);
  };

  const handleSaveUserChanges = () => {
      if (selectedUserForEdit) {
          setAdminUsers(prev => prev.map(u => u.id === selectedUserForEdit.id ? selectedUserForEdit : u));
          setIsEditUserModalOpen(false);
          setSelectedUserForEdit(null);
      }
  };

  const handleTestPaymentConnection = () => {
      setIsTestingPaymentConnection(true);
      setTimeout(() => {
          setIsTestingPaymentConnection(false);
          alert(`Successfully connected to ${paymentEmailProvider.toUpperCase()}!`);
      }, 1500);
  };

  const handleTestSmsConnection = () => {
      setIsTestingSms(true);
      setTimeout(() => {
          setIsTestingSms(false);
          alert(`Successfully connected to ${smsProvider.toUpperCase()}!`);
      }, 1500);
  };

  const handleSendBroadcast = () => {
      if (!broadcastMessage || (!broadcastChannels.email && !broadcastChannels.sms)) {
          alert('Please enter a message and select at least one channel.');
          return;
      }
      setIsSendingBroadcast(true);
      setTimeout(() => {
          setIsSendingBroadcast(false);
          setBroadcastSubject('');
          setBroadcastMessage('');
          alert(`Broadcast sent successfully to ${broadcastAudience} users!`);
      }, 2000);
  };

  const handleInvestigate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!investigationQuery) return;
    setIsInvestigating(true);
    setInvStartDate('');
    setInvEndDate('');
    setInvActionFilter('ALL');
    
    // Simulate lookup
    setTimeout(() => {
        setInvestigationResult({
            id: 'u_suspicious_99',
            name: 'John Doe',
            email: investigationQuery,
            riskScore: 85,
            flaggedCount: 3,
            ipHistory: [
                { ip: '192.168.1.1', country: 'US', date: '2023-10-25' },
                { ip: '10.0.0.5', country: 'CN', date: '2023-10-24' },
                { ip: '45.22.11.9', country: 'RU', date: '2023-10-22' }
            ],
            recentActions: [
                { action: 'Failed Login', time: '10 mins ago', date: new Date(Date.now() - 10 * 60000).toISOString(), type: 'SECURITY' }, 
                { action: 'High Value Bid ($85k)', time: '2 hours ago', date: new Date(Date.now() - 2 * 3600000).toISOString(), type: 'BIDDING' }, 
                { action: 'Password Change', time: '1 day ago', date: new Date(Date.now() - 24 * 3600000).toISOString(), type: 'SECURITY' },
                { action: 'Suspicious IP Login', time: '2 days ago', date: new Date(Date.now() - 48 * 3600000).toISOString(), type: 'SECURITY' },
                { action: 'Profile Updated', time: '3 days ago', date: new Date(Date.now() - 72 * 3600000).toISOString(), type: 'PROFILE' }
            ],
            status: 'Active',
            joined: '2023-09-10'
        });
        setIsInvestigating(false);
    }, 800);
  };

  // Filtered Investigation Actions
  const filteredInvestigationActions = useMemo(() => {
      if (!investigationResult) return [];
      return investigationResult.recentActions.filter((item: any) => {
          const itemDate = new Date(item.date);
          const start = invStartDate ? new Date(invStartDate) : null;
          const end = invEndDate ? new Date(invEndDate) : null;
          
          if (end) end.setHours(23, 59, 59, 999);

          const matchesStart = start ? itemDate >= start : true;
          const matchesEnd = end ? itemDate <= end : true;
          
          // Map simplified filter types to action descriptions or types if available
          let matchesAction = true;
          if (invActionFilter !== 'ALL') {
              matchesAction = item.type === invActionFilter;
          }

          return matchesStart && matchesEnd && matchesAction;
      });
  }, [investigationResult, invStartDate, invEndDate, invActionFilter]);

  // Filtered and Sorted Users
  const filteredUsers = useMemo(() => {
      return adminUsers.filter(u => {
          const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                                u.email.toLowerCase().includes(userSearch.toLowerCase());
          const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
          const matchesStatus = userStatusFilter === 'ALL' || u.status === userStatusFilter;
          const matchesDate = !userDateFilter || new Date(u.joined) >= new Date(userDateFilter);
          
          return matchesSearch && matchesRole && matchesStatus && matchesDate;
      }).sort((a, b) => {
          const dateA = new Date(a.joined).getTime();
          const dateB = new Date(b.joined).getTime();
          return userSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
  }, [adminUsers, userSearch, userRoleFilter, userStatusFilter, userDateFilter, userSortOrder]);

  const toggleSortOrder = () => {
      setUserSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // --- TAB CONTENT RENDERERS ---

  const renderCommunications = () => (
      <div className="space-y-6 animate-fade-in">
          {/* Header & Tabs */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                  <h2 className="text-xl font-bold text-gray-900">Communications Center</h2>
                  <p className="text-gray-500 text-sm">Manage messaging gateways and send platform-wide broadcasts.</p>
              </div>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button 
                      onClick={() => setCommTab('compose')}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${commTab === 'compose' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                      Compose
                  </button>
                  <button 
                      onClick={() => setCommTab('gateways')}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${commTab === 'gateways' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                      Gateways
                  </button>
              </div>
          </div>

          {commTab === 'compose' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                  <h3 className="font-bold text-gray-900 mb-6 flex items-center"><Send size={20} className="mr-2 text-blue-600"/> New Broadcast</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                                  <select 
                                      value={broadcastAudience}
                                      onChange={(e) => setBroadcastAudience(e.target.value)}
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                  >
                                      <option value="all">All Users</option>
                                      <option value="sellers">Active Sellers</option>
                                      <option value="buyers">Verified Buyers</option>
                                      <option value="new">New Users (Last 30 Days)</option>
                                      <option value="inactive">Inactive Users</option>
                                  </select>
                              </div>
                              <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Channels</label>
                                  <div className="flex gap-4 pt-2">
                                      <label className="flex items-center cursor-pointer">
                                          <input 
                                              type="checkbox" 
                                              checked={broadcastChannels.email}
                                              onChange={(e) => setBroadcastChannels({...broadcastChannels, email: e.target.checked})}
                                              className="h-5 w-5 text-blue-600 rounded mr-2" 
                                          />
                                          <span className="text-gray-900">Email</span>
                                      </label>
                                      <label className="flex items-center cursor-pointer">
                                          <input 
                                              type="checkbox" 
                                              checked={broadcastChannels.sms}
                                              onChange={(e) => setBroadcastChannels({...broadcastChannels, sms: e.target.checked})}
                                              className="h-5 w-5 text-blue-600 rounded mr-2" 
                                          />
                                          <span className="text-gray-900">SMS</span>
                                      </label>
                                  </div>
                              </div>
                          </div>

                          {broadcastChannels.email && (
                              <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
                                  <input 
                                      type="text" 
                                      value={broadcastSubject}
                                      onChange={(e) => setBroadcastSubject(e.target.value)}
                                      placeholder="Enter email subject..."
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                  />
                              </div>
                          )}

                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Message Body</label>
                              <textarea 
                                  rows={6}
                                  value={broadcastMessage}
                                  onChange={(e) => setBroadcastMessage(e.target.value)}
                                  placeholder="Type your message here..."
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                              />
                              {broadcastChannels.sms && (
                                  <p className={`text-xs text-right mt-1 ${broadcastMessage.length > 160 ? 'text-orange-500 font-bold' : 'text-gray-500'}`}>
                                      {broadcastMessage.length} / 160 characters (SMS)
                                  </p>
                              )}
                          </div>

                          <div className="flex justify-end pt-4">
                              <button 
                                  onClick={handleSendBroadcast}
                                  disabled={isSendingBroadcast}
                                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg flex items-center disabled:opacity-70"
                              >
                                  {isSendingBroadcast ? <LoadingSpinner size={20} className="mr-2 text-white" /> : <Send size={20} className="mr-2" />}
                                  Send Broadcast
                              </button>
                          </div>
                      </div>

                      {/* Preview / Instructions */}
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit">
                          <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Best Practices</h4>
                          <ul className="space-y-3 text-sm text-gray-600">
                              <li className="flex items-start"><CheckCircle size={16} className="mr-2 text-green-500 mt-0.5"/>Keep SMS messages under 160 characters to avoid splitting.</li>
                              <li className="flex items-start"><CheckCircle size={16} className="mr-2 text-green-500 mt-0.5"/>Use variables like {'{first_name}'} to personalize content.</li>
                              <li className="flex items-start"><CheckCircle size={16} className="mr-2 text-green-500 mt-0.5"/>Avoid sending marketing blasts outside of business hours (9AM - 8PM).</li>
                              <li className="flex items-start"><CheckCircle size={16} className="mr-2 text-green-500 mt-0.5"/>Test your message layout on mobile before sending.</li>
                          </ul>
                          
                          <div className="mt-8 pt-6 border-t border-gray-200">
                              <h4 className="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wider">Estimated Reach</h4>
                              <div className="flex items-center justify-between">
                                  <span className="text-gray-600">Total Recipients</span>
                                  <span className="font-bold text-xl text-blue-600">12,405</span>
                              </div>
                              <p className="text-xs text-gray-400 mt-1">Based on "All Users" selection</p>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {commTab === 'gateways' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email Gateway Card */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                              <Mail size={24} />
                          </div>
                          <div>
                              <h3 className="font-bold text-gray-900">Email Gateway</h3>
                              <p className="text-sm text-gray-500">Transactional & Marketing Emails</p>
                          </div>
                      </div>
                      <div className="space-y-4">
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                              <select 
                                  value={paymentEmailProvider}
                                  onChange={(e) => setPaymentEmailProvider(e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                              >
                                  <option value="sendgrid">SendGrid</option>
                                  <option value="aws_ses">AWS SES</option>
                                  <option value="mailgun">Mailgun</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                              <input 
                                  type="password" 
                                  placeholder="Enter API Key" 
                                  value={paymentEmailApiKey}
                                  onChange={(e) => setPaymentEmailApiKey(e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                              />
                          </div>
                          <button 
                              onClick={handleTestPaymentConnection}
                              disabled={isTestingPaymentConnection}
                              className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 flex justify-center items-center mt-2"
                          >
                              {isTestingPaymentConnection ? <LoadingSpinner size={18} className="text-white" /> : 'Test Connection'}
                          </button>
                      </div>
                  </div>

                  {/* SMS Gateway Card */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                              <Smartphone size={24} />
                          </div>
                          <div>
                              <h3 className="font-bold text-gray-900">SMS Gateway</h3>
                              <p className="text-sm text-gray-500">OTP & Critical Alerts</p>
                          </div>
                      </div>
                      <div className="space-y-4">
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                              <select 
                                  value={smsProvider}
                                  onChange={(e) => setSmsProvider(e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                              >
                                  <option value="twilio">Twilio</option>
                                  <option value="messagebird">MessageBird</option>
                                  <option value="nexmo">Nexmo (Vonage)</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">API Key / Auth Token</label>
                              <input 
                                  type="password" 
                                  placeholder="Enter API Key" 
                                  value={smsApiKey}
                                  onChange={(e) => setSmsApiKey(e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                              />
                          </div>
                          <button 
                              onClick={handleTestSmsConnection}
                              disabled={isTestingSms}
                              className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 flex justify-center items-center mt-2"
                          >
                              {isTestingSms ? <LoadingSpinner size={18} className="text-white" /> : 'Test Connection'}
                          </button>
                      </div>
                  </div>
              </div>
          )}
      </div>
  );

  const renderExecutive = () => (
    <div className="space-y-8 animate-fade-in">
      {/* System Health Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-white to-gray-50">
         <div className="flex items-center mb-4 md:mb-0">
            <div className="relative">
                <div className={`h-4 w-4 rounded-full mr-4 ${alerts.some(a => a.type === 'CRITICAL') ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                {alerts.some(a => a.type === 'CRITICAL') && <div className="absolute top-0 left-0 h-4 w-4 rounded-full bg-red-500 animate-ping"></div>}
            </div>
            <div>
               <h3 className="font-bold text-gray-900 text-lg">System Status: {alerts.some(a => a.type === 'CRITICAL') ? 'Attention Required' : 'Operational'}</h3>
               <p className="text-sm text-gray-500">
                  {alerts.length > 0 ? `${alerts.length} active system alerts require review.` : 'All services running optimally. No incidents reported in 24h.'}
               </p>
            </div>
         </div>
         <div className="flex space-x-8 text-sm text-gray-600">
            <div className="text-center">
                <span className="block text-xs text-gray-400 uppercase tracking-wider">Uptime</span>
                <span className="font-bold text-gray-900">99.99%</span>
            </div>
            <div className="text-center">
                <span className="block text-xs text-gray-400 uppercase tracking-wider">Database</span>
                <span className="font-bold text-green-600">Healthy</span>
            </div>
            <div className="text-center">
                <span className="block text-xs text-gray-400 uppercase tracking-wider">Version</span>
                <span className="font-bold text-gray-900">v2.4.0</span>
            </div>
         </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Revenue</p>
                <h3 className="text-2xl font-bold text-gray-900">$2.35M</h3>
                <p className="text-xs mt-1 font-medium text-green-600 flex items-center"><TrendingUp size={12} className="mr-1"/> +12.5%</p>
            </div>
            <div className="p-3 rounded-full bg-green-50 text-green-600">
                <DollarSign size={24} />
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Active Users</p>
                <h3 className="text-2xl font-bold text-gray-900">12,345</h3>
                <p className="text-xs mt-1 font-medium text-blue-600 flex items-center"><TrendingUp size={12} className="mr-1"/> +8.2%</p>
            </div>
            <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                <Users size={24} />
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Active Auctions</p>
                <h3 className="text-2xl font-bold text-gray-900">{auctions.length}</h3>
                <p className="text-xs mt-1 font-medium text-gray-400">28 ending today</p>
            </div>
            <div className="p-3 rounded-full bg-purple-50 text-purple-600">
                <Gavel size={24} />
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Dispute Rate</p>
                <h3 className="text-2xl font-bold text-gray-900">1.2%</h3>
                <p className="text-xs mt-1 font-medium text-green-600 flex items-center"><TrendingUp size={12} className="mr-1 rotate-180"/> -0.3%</p>
            </div>
            <div className="p-3 rounded-full bg-orange-50 text-orange-600">
                <AlertTriangle size={24} />
            </div>
        </div>
      </div>

      {/* Primary Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Financial Performance</h3>
                <select className="text-xs font-medium border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-gray-50 px-2 py-1">
                    <option>Last 6 Months</option>
                    <option>YTD</option>
                </select>
            </div>
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={REVENUE_DATA} barGap={0} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} tickFormatter={(value) => `$${value/1000}k`} />
                    <Tooltip 
                        cursor={{fill: '#f9fafb'}}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="revenue" fill="#8b5cf6" name="Revenue" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" fill="#e2e8f0" name="Expenses" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Auction Categories</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={CATEGORY_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {CATEGORY_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-4">
                {CATEGORY_DATA.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></div>
                        {item.name}
                        </div>
                        <span className="font-bold">{item.value}%</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">User Growth & Engagement</h3>
                  <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={ANALYTICS_GROWTH_DATA}>
                              <defs>
                                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                  </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" />
                              <Line type="monotone" dataKey="listings" stroke="#10b981" strokeWidth={2} />
                          </AreaChart>
                      </ResponsiveContainer>
                  </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Trends</h3>
                  <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={ANALYTICS_GROWTH_DATA}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                          </BarChart>
                      </ResponsiveContainer>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderAdvancedAnalytics = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-gray-900">Bid Density vs Revenue (Cohort Analysis)</h3>
                      <button className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-600 font-bold">Export Data</button>
                  </div>
                  <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" dataKey="x" name="Bids" unit="" tick={{fontSize: 12}} />
                              <YAxis type="number" dataKey="y" name="Users" unit="" tick={{fontSize: 12}} />
                              <ZAxis type="number" dataKey="z" range={[60, 400]} name="Revenue" />
                              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                              <Legend />
                              <Scatter name="User Cohorts" data={ADVANCED_COHORT_DATA} fill="#8b5cf6" shape="circle" />
                          </ScatterChart>
                      </ResponsiveContainer>
                  </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">User Geography</h3>
                  <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                              <Pie
                                  data={GEO_DATA}
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label
                              >
                                  {GEO_DATA.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                          </PieChart>
                      </ResponsiveContainer>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderFinancials = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Financial Management</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700">Export Report</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <p className="text-sm text-gray-500 uppercase font-bold">Total Processed</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">$4.2M</h3>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <p className="text-sm text-gray-500 uppercase font-bold">Pending Payouts</p>
                  <h3 className="text-2xl font-bold text-orange-600 mt-1">$125k</h3>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <p className="text-sm text-gray-500 uppercase font-bold">Platform Fees (Net)</p>
                  <h3 className="text-2xl font-bold text-green-600 mt-1">$189k</h3>
              </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 font-bold text-gray-900">Recent Transactions</div>
              <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                      <tr>
                          <th className="px-6 py-3">Transaction ID</th>
                          <th className="px-6 py-3">User</th>
                          <th className="px-6 py-3">Type</th>
                          <th className="px-6 py-3">Amount</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3">Gateway</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                      {MOCK_TRANSACTIONS.map(tx => (
                          <tr key={tx.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 font-mono text-gray-600">{tx.id}</td>
                              <td className="px-6 py-4 font-bold text-gray-900">{tx.user}</td>
                              <td className="px-6 py-4">
                                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                                      tx.type === 'DEPOSIT' ? 'bg-green-100 text-green-700' :
                                      tx.type === 'PAYOUT' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                  }`}>{tx.type}</span>
                              </td>
                              <td className="px-6 py-4 font-bold text-gray-900">${tx.amount.toLocaleString()}</td>
                              <td className="px-6 py-4">
                                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                                      tx.status === 'COMPLETED' ? 'text-green-600' : 'text-orange-600'
                                  }`}>{tx.status}</span>
                              </td>
                              <td className="px-6 py-4 text-gray-500">{tx.gateway}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
  );

  const renderInvestigation = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">User Investigation Tool</h2>
              <form onSubmit={handleInvestigate} className="flex gap-4">
                  <input 
                      type="text" 
                      placeholder="Enter User Email, ID, or IP Address" 
                      value={investigationQuery}
                      onChange={(e) => setInvestigationQuery(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 flex items-center">
                      {isInvestigating ? <LoadingSpinner size={20} className="mr-2 text-white" /> : <SearchIcon size={20} className="mr-2" />}
                      Investigate
                  </button>
              </form>
          </div>

          {investigationResult && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                  <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                          <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                              investigationResult.riskScore > 80 ? 'bg-red-500' : 'bg-blue-500'
                          }`}>
                              {investigationResult.name.charAt(0)}
                          </div>
                          <div>
                              <h3 className="text-xl font-bold text-gray-900">{investigationResult.name}</h3>
                              <p className="text-sm text-gray-500">{investigationResult.email} • ID: {investigationResult.id}</p>
                          </div>
                      </div>
                      <div className="text-right">
                          <p className="text-xs text-gray-500 uppercase font-bold">Risk Score</p>
                          <p className={`text-3xl font-bold ${investigationResult.riskScore > 80 ? 'text-red-600' : 'text-green-600'}`}>{investigationResult.riskScore}/100</p>
                      </div>
                  </div>
                  
                  {/* Filters Toolbar */}
                  <div className="px-6 py-4 bg-white border-b border-gray-100 flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">Filter Activity:</span>
                          <input 
                              type="date" 
                              value={invStartDate}
                              onChange={(e) => setInvStartDate(e.target.value)}
                              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <span className="text-gray-400">-</span>
                          <input 
                              type="date" 
                              value={invEndDate}
                              onChange={(e) => setInvEndDate(e.target.value)}
                              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                      </div>
                      <div className="h-6 w-px bg-gray-300 hidden md:block"></div>
                      <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">Action Type:</span>
                          <select 
                              value={invActionFilter}
                              onChange={(e) => setInvActionFilter(e.target.value)}
                              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                          >
                              <option value="ALL">All Actions</option>
                              <option value="SECURITY">Security</option>
                              <option value="BIDDING">Bidding</option>
                              <option value="PROFILE">Profile</option>
                          </select>
                      </div>
                      {(invStartDate || invEndDate || invActionFilter !== 'ALL') && (
                          <button 
                              onClick={() => { setInvStartDate(''); setInvEndDate(''); setInvActionFilter('ALL'); }}
                              className="text-xs text-red-600 hover:text-red-800 font-medium ml-auto"
                          >
                              Clear Filters
                          </button>
                      )}
                  </div>

                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                          <h4 className="font-bold text-gray-900 mb-4 flex items-center"><Globe size={18} className="mr-2 text-gray-400"/> Known IP Addresses</h4>
                          <ul className="space-y-2">
                              {investigationResult.ipHistory.map((ip: any, idx: number) => (
                                  <li key={idx} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                                      <span className="font-mono">{ip.ip}</span>
                                      <span className="text-gray-500">{ip.country} • {ip.date}</span>
                                  </li>
                              ))}
                          </ul>
                      </div>
                      <div>
                          <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                              <Activity size={18} className="mr-2 text-gray-400"/> 
                              Recent Suspicious Activity
                              <span className="ml-2 text-xs font-normal text-gray-500">({filteredInvestigationActions.length})</span>
                          </h4>
                          <ul className="space-y-2 max-h-64 overflow-y-auto">
                              {filteredInvestigationActions.length === 0 ? (
                                  <li className="text-sm text-gray-500 p-2 italic">No actions match filter criteria.</li>
                              ) : (
                                  filteredInvestigationActions.map((action: any, idx: number) => (
                                      <li key={idx} className={`flex justify-between text-sm p-2 border-l-4 rounded-r ${
                                          action.type === 'SECURITY' ? 'border-red-400 bg-red-50' : 
                                          action.type === 'BIDDING' ? 'border-blue-400 bg-blue-50' : 'border-gray-400 bg-gray-50'
                                      }`}>
                                          <span className="font-bold text-gray-900">{action.action}</span>
                                          <div className="text-right">
                                              <span className="block text-xs text-gray-500">{new Date(action.date).toLocaleDateString()}</span>
                                              <span className="block text-xs text-gray-400">{action.time}</span>
                                          </div>
                                      </li>
                                  ))
                              )}
                          </ul>
                      </div>
                  </div>
                  <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                      <button className="px-4 py-2 border border-gray-300 bg-white text-gray-700 font-bold rounded hover:bg-gray-50">Freeze Account</button>
                      <button className="px-4 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700">Ban User</button>
                  </div>
              </div>
          )}
      </div>
  );

  const renderAudit = () => (
      <div className="space-y-6 animate-fade-in">
          <h2 className="text-xl font-bold text-gray-900">System Audit Logs</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="px-6 py-4">Timestamp</th>
                            <th className="px-6 py-4">Admin User</th>
                            <th className="px-6 py-4">Action</th>
                            <th className="px-6 py-4">Details</th>
                            <th className="px-6 py-4">IP Address</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {AUDIT_LOGS.map(log => (
                            <tr key={log.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-500 font-mono">{log.time}</td>
                                <td className="px-6 py-4 font-bold text-gray-900">{log.user}</td>
                                <td className="px-6 py-4">
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">{log.action}</span>
                                </td>
                                <td className="px-6 py-4 text-gray-700">{log.details}</td>
                                <td className="px-6 py-4 text-gray-500 font-mono">{log.ip}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
          </div>
      </div>
  );

  const renderDisputes = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Dispute Escalation</h2>
              <div className="flex gap-2">
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold flex items-center"><Scale size={14} className="mr-1"/> {MOCK_DISPUTES.filter(d => d.status === 'OPEN').length} Open</span>
              </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                      <tr>
                          <th className="px-6 py-4">Dispute ID</th>
                          <th className="px-6 py-4">Parties</th>
                          <th className="px-6 py-4">Reason</th>
                          <th className="px-6 py-4">Amount</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                      {MOCK_DISPUTES.map(dispute => (
                          <tr key={dispute.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 font-mono text-gray-500">{dispute.id}</td>
                              <td className="px-6 py-4">
                                  <div className="flex flex-col">
                                      <span className="font-bold text-gray-900">{dispute.complainant}</span>
                                      <span className="text-xs text-gray-500">vs. {dispute.respondent}</span>
                                  </div>
                              </td>
                              <td className="px-6 py-4 text-gray-700">{dispute.reason}</td>
                              <td className="px-6 py-4 font-bold text-gray-900">${dispute.amount.toLocaleString()}</td>
                              <td className="px-6 py-4">
                                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                                      dispute.status === 'OPEN' ? 'bg-red-100 text-red-700' :
                                      dispute.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                  }`}>{dispute.status}</span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                  <button className="text-blue-600 hover:text-blue-800 font-bold text-xs">View Case</button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
  );

  const renderBuySell = () => (
    <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h2 className="text-xl font-bold text-gray-900">Buy/Sell Management</h2>
                <p className="text-gray-500 text-sm">Manage seller verification requests and bidder limit increases.</p>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4">Request Type</th>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Details</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {accessRequests.map(request => (
                        <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                    request.type === 'SELLER_VERIFICATION' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                    {request.type === 'SELLER_VERIFICATION' ? 'Seller Access' : 'Limit Increase'}
                                </span>
                            </td>
                            <td className="px-6 py-4 font-bold text-gray-900">{request.user}</td>
                            <td className="px-6 py-4 text-gray-500">{request.date}</td>
                            <td className="px-6 py-4 text-gray-600">{request.details}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                    request.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                                    request.status === 'DENIED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {request.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                {request.status === 'PENDING' && (
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => handleRequestAction(request.id, 'APPROVE')}
                                            className="p-1.5 text-green-600 hover:bg-green-50 rounded border border-transparent hover:border-green-200 transition-colors"
                                            title="Approve"
                                        >
                                            <CheckSquare size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleRequestAction(request.id, 'DENY')}
                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-200 transition-colors"
                                            title="Deny"
                                        >
                                            <XSquare size={18} />
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  const renderUsers = () => (
      <div className="space-y-6 animate-fade-in relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">User Administration</h2>
            <p className="text-gray-500 text-sm">Manage user accounts, roles, and platform access.</p>
          </div>
          <div className="flex flex-wrap gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input 
                   type="text" 
                   placeholder="Search users..." 
                   value={userSearch}
                   onChange={(e) => setUserSearch(e.target.value)}
                   className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none w-full md:w-auto"
                />
             </div>
             
             <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <select 
                   value={userRoleFilter}
                   onChange={(e) => setUserRoleFilter(e.target.value)}
                   className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm appearance-none bg-white focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer"
                >
                   <option value="ALL">All Roles</option>
                   <option value="Super Admin">Super Admin</option>
                   <option value="Administrator">Administrator</option>
                   <option value="Moderator">Moderator</option>
                   <option value="Support Agent">Support Agent</option>
                   <option value="User">User</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
             </div>

             <div className="flex items-center gap-2">
                <input 
                    type="date"
                    value={userDateFilter}
                    onChange={(e) => setUserDateFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="Joined After"
                />
             </div>

             <select 
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer"
             >
                <option value="ALL">All Status</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Pending">Pending</option>
             </select>

             <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-purple-700 flex items-center">
                <Plus size={16} className="mr-2"/> Add User
             </button>
          </div>
        </div>

        {/* Edit User Modal */}
        {isEditUserModalOpen && selectedUserForEdit && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-purple-50">
                        <h3 className="font-bold text-purple-900 flex items-center gap-2">
                            <UserCheck size={20} /> Edit User Details
                        </h3>
                        <button onClick={() => { setIsEditUserModalOpen(false); setSelectedUserForEdit(null); }} className="text-purple-700 hover:text-purple-900">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-2xl">
                                {selectedUserForEdit.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900">{selectedUserForEdit.name}</h4>
                                <p className="text-sm text-gray-500">ID: {selectedUserForEdit.id}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    value={selectedUserForEdit.name}
                                    onChange={(e) => setSelectedUserForEdit({...selectedUserForEdit, name: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input 
                                    type="email" 
                                    value={selectedUserForEdit.email}
                                    onChange={(e) => setSelectedUserForEdit({...selectedUserForEdit, email: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select 
                                    value={selectedUserForEdit.role}
                                    onChange={(e) => setSelectedUserForEdit({...selectedUserForEdit, role: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm bg-white"
                                >
                                    <option value="Super Admin">Super Admin</option>
                                    <option value="Administrator">Administrator</option>
                                    <option value="Moderator">Moderator</option>
                                    <option value="Support Agent">Support Agent</option>
                                    <option value="User">User</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select 
                                    value={selectedUserForEdit.status}
                                    onChange={(e) => setSelectedUserForEdit({...selectedUserForEdit, status: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm bg-white"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Suspended">Suspended</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Activity Score</label>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                                <div 
                                    className={`h-2.5 rounded-full ${
                                        selectedUserForEdit.activityScore > 80 ? 'bg-green-500' : 
                                        selectedUserForEdit.activityScore > 50 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`} 
                                    style={{ width: `${selectedUserForEdit.activityScore}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-right text-gray-500">{selectedUserForEdit.activityScore}/100</p>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
                            <button 
                                onClick={() => { setIsEditUserModalOpen(false); setSelectedUserForEdit(null); }}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveUserChanges}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-bold shadow-md"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
           <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-200">
                     <tr>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Activity Score</th>
                        <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={toggleSortOrder}>
                            <div className="flex items-center">
                                Joined {userSortOrder === 'asc' ? <ChevronUp size={14} className="ml-1"/> : <ChevronDown size={14} className="ml-1"/>}
                            </div>
                        </th>
                        <th className="px-6 py-4">Last Login</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {filteredUsers.length === 0 ? (
                        <tr>
                           <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No users found matching filters.</td>
                        </tr>
                     ) : (
                        filteredUsers.map(user => (
                           <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4">
                                 <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold mr-3 border border-purple-200">
                                       {user.name.charAt(0)}
                                    </div>
                                    <div>
                                       <div className="font-bold text-gray-900">{user.name}</div>
                                       <div className="text-xs text-gray-500">{user.email}</div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="relative group inline-block">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        className={`appearance-none pl-3 pr-8 py-1 rounded-full text-xs font-bold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                        user.role === 'Super Admin' ? 'bg-purple-50 text-purple-700 border-purple-200 focus:ring-purple-500' :
                                        user.role === 'Administrator' ? 'bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-500' :
                                        user.role === 'Moderator' ? 'bg-orange-50 text-orange-700 border-orange-200 focus:ring-orange-500' :
                                        'bg-gray-50 text-gray-600 border-gray-200 focus:ring-gray-500'
                                        }`}
                                    >
                                        <option value="Super Admin">Super Admin</option>
                                        <option value="Administrator">Administrator</option>
                                        <option value="Moderator">Moderator</option>
                                        <option value="Support Agent">Support Agent</option>
                                        <option value="User">User</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                        <ChevronDown size={12} />
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <span className={`flex items-center text-xs font-bold ${
                                    user.status === 'Active' ? 'text-green-600' : 
                                    user.status === 'Suspended' ? 'text-red-600' : 'text-orange-600'
                                 }`}>
                                    {user.status === 'Active' && <CheckCircle size={14} className="mr-1.5" />}
                                    {user.status === 'Suspended' && <ShieldAlert size={14} className="mr-1.5" />}
                                    {user.status}
                                 </span>
                              </td>
                              <td className="px-6 py-4">
                                  <div className="w-24">
                                      <div className="flex justify-between mb-1">
                                          <span className="text-xs font-medium text-gray-700">{user.activityScore}%</span>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                                          <div className={`h-1.5 rounded-full ${user.activityScore > 70 ? 'bg-green-500' : user.activityScore > 30 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${user.activityScore}%` }}></div>
                                      </div>
                                  </div>
                              </td>
                              <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                                 {new Date(user.joined).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-gray-500 text-xs">
                                 {user.lastLogin}
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <div className="flex justify-end gap-2">
                                    <button 
                                        onClick={() => handleOpenEditUser(user)}
                                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" 
                                        title="Edit User"
                                    >
                                       <Edit2 size={16} />
                                    </button>
                                    {user.role !== 'Super Admin' && (
                                       <button 
                                          onClick={() => toggleUserStatus(user.id)}
                                          className={`p-1.5 rounded transition-colors ${
                                             user.status === 'Suspended' 
                                             ? 'text-green-600 hover:bg-green-50' 
                                             : 'text-red-500 hover:bg-red-50'
                                          }`}
                                          title={user.status === 'Suspended' ? 'Activate User' : 'Suspend User'}
                                       >
                                          {user.status === 'Suspended' ? <CheckCircle size={16} /> : <ShieldAlert size={16} />}
                                       </button>
                                    )}
                                 </div>
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
           </div>
        </div>
      </div>
  );

  const renderRoles = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Role Management</h2>
              <button 
                  onClick={() => setIsCreateRoleModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 flex items-center"
              >
                  <Plus size={16} className="mr-2"/> Create Role
              </button>
          </div>

          {/* Create Role Modal */}
          {isCreateRoleModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                  <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="font-bold text-lg">Create New Role</h3>
                          <button onClick={() => setIsCreateRoleModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                      </div>
                      <input 
                          type="text" 
                          placeholder="Role Name" 
                          value={newRoleName}
                          onChange={(e) => setNewRoleName(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <div className="flex justify-end gap-3">
                          <button onClick={() => setIsCreateRoleModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
                          <button onClick={handleCreateRole} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Create Role</button>
                      </div>
                  </div>
              </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roles.map(role => (
                  <div key={role.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                          <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${role.id === 'super_admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                  <Shield size={20} />
                              </div>
                              <div>
                                  <h3 className="font-bold text-gray-900">{role.name}</h3>
                                  <p className="text-xs text-gray-500">{role.users} Users Assigned</p>
                              </div>
                          </div>
                          <button 
                              onClick={() => setExpandedRole(expandedRole === role.id ? null : role.id)}
                              className="text-blue-600 text-xs font-bold hover:underline"
                          >
                              {expandedRole === role.id ? 'Hide Permissions' : 'Edit Permissions'}
                          </button>
                      </div>
                      {expandedRole === role.id && (
                          <div className="p-6 bg-white animate-in slide-in-from-top-2">
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Permissions</h4>
                              <div className="space-y-3">
                                  {role.permissions.includes('ALL') ? (
                                      <div className="flex items-center text-green-700 bg-green-50 p-3 rounded-lg border border-green-100">
                                          <ShieldCheck size={18} className="mr-2" />
                                          <span className="font-bold text-sm">Full System Access (Super Admin)</span>
                                      </div>
                                  ) : (
                                      <div className="grid grid-cols-1 gap-2">
                                          {PERMISSION_KEYS.map(perm => (
                                              <div key={perm.key} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                                  <span className="text-sm text-gray-700 font-medium">{perm.label}</span>
                                                  <button 
                                                      onClick={() => handleTogglePermission(role.id, perm.key)}
                                                      className={`w-10 h-5 rounded-full relative transition-colors ${role.permissions.includes(perm.key) ? 'bg-blue-600' : 'bg-gray-300'}`}
                                                  >
                                                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${role.permissions.includes(perm.key) ? 'translate-x-5' : ''}`}></span>
                                                  </button>
                                              </div>
                                          ))}
                                      </div>
                                  )}
                              </div>
                          </div>
                      )}
                  </div>
              ))}
          </div>
      </div>
  );

  const renderConfiguration = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">System Configuration</h2>
              <div className="flex items-center gap-2">
                 <span className="text-sm font-medium text-gray-700">Maintenance Mode</span>
                 <button 
                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${maintenanceMode ? 'bg-red-500' : 'bg-gray-300'}`}
                 >
                    <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${maintenanceMode ? 'translate-x-6' : ''}`}></span>
                 </button>
              </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row overflow-hidden min-h-[400px]">
              <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200 p-4">
                  <nav className="space-y-1">
                      {[
                          { id: 'general', label: 'General Settings', icon: Settings },
                          { id: 'security', label: 'Security Policies', icon: Lock },
                          { id: 'payment', label: 'Payment Gateways', icon: CreditCard },
                          { id: 'notifications', label: 'Notification Settings', icon: Bell },
                          { id: 'content', label: 'Content Filters', icon: FileText },
                      ].map(item => (
                          <button
                              key={item.id}
                              onClick={() => setConfigTab(item.id as any)}
                              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                  configTab === item.id ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                              }`}
                          >
                              <item.icon size={18} className="mr-3" />
                              {item.label}
                          </button>
                      ))}
                  </nav>
              </div>
              <div className="flex-1 p-8">
                  {configTab === 'general' && (
                      <div className="space-y-6">
                          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Platform Defaults</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
                                  <input type="text" defaultValue="Autobid" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                              </div>
                              <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                                  <input type="email" defaultValue="support@autobid.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                              </div>
                              <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
                                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                      <option>USD ($)</option>
                                      <option>EUR (€)</option>
                                      <option>GBP (£)</option>
                                  </select>
                              </div>
                              <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                      <option>UTC</option>
                                      <option>EST</option>
                                      <option>PST</option>
                                  </select>
                              </div>
                          </div>
                      </div>
                  )}
                  {configTab === 'payment' && (
                      <div className="space-y-8">
                          <div className="space-y-6">
                              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Payment Processing</h3>
                              <div className="space-y-4">
                                  <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Stripe API Key (Live)</label>
                                      <div className="flex gap-2">
                                          <input type="password" value="pk_live_................" disabled className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500" />
                                          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold text-sm">Update</button>
                                      </div>
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate (%)</label>
                                      <input type="number" defaultValue={4.5} className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                  </div>
                              </div>
                          </div>

                          <div className="space-y-6">
                              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Email Gateway</h3>
                              <div className="grid grid-cols-1 gap-4 max-w-lg">
                                  <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                                      <select 
                                          value={paymentEmailProvider}
                                          onChange={(e) => setPaymentEmailProvider(e.target.value)}
                                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                      >
                                          <option value="sendgrid">SendGrid</option>
                                          <option value="aws_ses">AWS SES</option>
                                          <option value="mailgun">Mailgun</option>
                                      </select>
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                                      <input 
                                          type="password" 
                                          placeholder="Enter API Key" 
                                          value={paymentEmailApiKey}
                                          onChange={(e) => setPaymentEmailApiKey(e.target.value)}
                                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                      />
                                  </div>
                                  <div>
                                      <button 
                                          onClick={handleTestPaymentConnection}
                                          disabled={isTestingPaymentConnection}
                                          className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 flex justify-center items-center"
                                      >
                                          {isTestingPaymentConnection ? <LoadingSpinner size={18} className="text-white" /> : 'Test Connection'}
                                      </button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}
                  {configTab === 'notifications' && (
                      <div className="space-y-6">
                          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">SMS Gateway Settings</h3>
                          <div className="grid grid-cols-1 gap-4 max-w-lg">
                              <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">SMS Provider</label>
                                  <select 
                                      value={smsProvider}
                                      onChange={(e) => setSmsProvider(e.target.value)}
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                  >
                                      <option value="twilio">Twilio</option>
                                      <option value="messagebird">MessageBird</option>
                                      <option value="nexmo">Nexmo (Vonage)</option>
                                  </select>
                              </div>
                              <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">API Key / Auth Token</label>
                                  <input 
                                      type="password" 
                                      placeholder="Enter API Key" 
                                      value={smsApiKey}
                                      onChange={(e) => setSmsApiKey(e.target.value)}
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                  />
                              </div>
                              <div>
                                  <button 
                                      onClick={handleTestSmsConnection}
                                      disabled={isTestingSms}
                                      className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 flex justify-center items-center"
                                  >
                                      {isTestingSms ? <LoadingSpinner size={18} className="text-white" /> : 'Test Connection'}
                                  </button>
                              </div>
                          </div>
                      </div>
                  )}
                  {/* Other tabs placeholders */}
                  {(configTab === 'security' || configTab === 'content') && (
                      <p className="text-gray-500 italic">Configuration settings for {configTab} would appear here.</p>
                  )}
              </div>
          </div>
      </div>
  );

  const renderIntegrations = () => (
      <div className="space-y-6 animate-fade-in">
          <h2 className="text-xl font-bold text-gray-900">Integrations & API</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                          <Mail size={24} />
                      </div>
                      <div>
                          <h3 className="font-bold text-gray-900">Email Service Provider</h3>
                          <p className="text-sm text-gray-500">Manage transactional emails</p>
                      </div>
                  </div>
                  <div className="space-y-4">
                      <select 
                          value={paymentEmailProvider}
                          onChange={(e) => setPaymentEmailProvider(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      >
                          <option value="sendgrid">SendGrid</option>
                          <option value="aws_ses">AWS SES</option>
                          <option value="mailgun">Mailgun</option>
                      </select>
                      <input 
                          type="password" 
                          placeholder="API Key" 
                          value={paymentEmailApiKey}
                          onChange={(e) => setPaymentEmailApiKey(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <button 
                          onClick={handleTestPaymentConnection}
                          disabled={isTestingPaymentConnection}
                          className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 flex justify-center items-center"
                      >
                          {isTestingPaymentConnection ? <LoadingSpinner size={18} className="text-white" /> : 'Test Connection'}
                      </button>
                  </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                          <Webhook size={24} />
                      </div>
                      <div>
                          <h3 className="font-bold text-gray-900">Webhooks</h3>
                          <p className="text-sm text-gray-500">Real-time event notifications</p>
                      </div>
                  </div>
                  <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <span className="text-sm font-medium text-gray-700">auction.ended</span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Active</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <span className="text-sm font-medium text-gray-700">bid.placed</span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Active</span>
                      </div>
                      <button className="text-blue-600 font-bold text-sm hover:underline">+ Add Endpoint</button>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderAlerts = () => (
      <div className="space-y-6 animate-fade-in">
          <h2 className="text-xl font-bold text-gray-900">Alerts & Monitoring</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                      <tr>
                          <th className="px-6 py-4">Severity</th>
                          <th className="px-6 py-4">Message</th>
                          <th className="px-6 py-4">Source</th>
                          <th className="px-6 py-4">Time</th>
                          <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                      {alerts.map(alert => (
                          <tr key={alert.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                                      alert.type === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                  }`}>
                                      {alert.type}
                                  </span>
                              </td>
                              <td className="px-6 py-4 font-medium text-gray-900">{alert.message}</td>
                              <td className="px-6 py-4 text-gray-500">{alert.source}</td>
                              <td className="px-6 py-4 text-gray-500">{alert.time}</td>
                              <td className="px-6 py-4 text-right">
                                  <button 
                                      onClick={() => setAlerts(alerts.filter(a => a.id !== alert.id))}
                                      className="text-gray-400 hover:text-green-600"
                                      title="Mark Resolved"
                                  >
                                      <CheckCircle size={18} />
                                  </button>
                              </td>
                          </tr>
                      ))}
                      {alerts.length === 0 && (
                          <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No active alerts. System healthy.</td></tr>
                      )}
                  </tbody>
              </table>
          </div>
      </div>
  );

  return (
    <div className="flex flex-col gap-8 w-full pb-10">
       <div className="mb-2">
         <h1 className="text-3xl font-bold text-gray-900 capitalize">
            {activeTab.replace('_', ' ')}
         </h1>
         <p className="text-gray-500 mt-1">Super Admin Control Panel</p>
      </div>

      {activeTab === 'executive' && renderExecutive()}
      {activeTab === 'analytics' && renderAnalytics()}
      {activeTab === 'advanced_analytics' && renderAdvancedAnalytics()}
      {activeTab === 'users' && renderUsers()}
      {activeTab === 'roles' && renderRoles()}
      {activeTab === 'buysell' && renderBuySell()}
      {activeTab === 'investigation' && renderInvestigation()}
      {activeTab === 'audit' && renderAudit()}
      {activeTab === 'disputes' && renderDisputes()}
      {activeTab === 'communications' && renderCommunications()}
      {activeTab === 'financials' && renderFinancials()}
      {activeTab === 'configuration' && renderConfiguration()}
      {activeTab === 'integrations' && renderIntegrations()}
      {activeTab === 'alerts' && renderAlerts()}
    </div>
  );
};

export default SuperAdminDashboard;