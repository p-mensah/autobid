import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Search, Eye, Gavel, Package, Wallet, Settings, 
  LogOut, Menu, X, Bell, User as UserIcon, Shield, Activity, 
  BarChart, Users, FileText, AlertTriangle, ShieldCheck, 
  Scale, AlertOctagon, MessageSquare, Sliders, Webhook,
  Lock, Globe, Database, TrendingUp, ChevronDown, LifeBuoy,
  Zap, Layers, GitPullRequest, Headphones, Radio
} from 'lucide-react';
import { User, UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  // Enhanced active check to handle query parameters for tabs
  const isActive = (to: string) => {
    // For dashboard tabs (containing '?'), we need exact match on search params
    if (to.includes('?')) {
       return location.pathname + location.search === to;
    }
    // For standard routes, check if path starts with the link
    return location.pathname === to || (to !== '/' && location.pathname.startsWith(`${to}/`));
  };

  // Define navigation based on role
  const getNavItems = () => {
    const common = [
       { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
       { to: '/browse', icon: Search, label: 'Browse Auctions' },
    ];

    const userItems = [
       { to: '/watchlist', icon: Eye, label: 'Watchlist' },
       { to: '/my-bids', icon: Gavel, label: 'My Bids' },
       { to: '/my-listings', icon: Package, label: 'My Listings' },
       { to: '/wallet', icon: Wallet, label: 'Wallet' },
       { to: '/support', icon: LifeBuoy, label: 'Support Center' },
       { to: '/settings', icon: Settings, label: 'Settings' },
    ];

    // Redesigned Admin Sidebar Structure
    const adminItems = [
       { 
         title: 'Admin Portal', 
         items: [
            { to: '/admin?tab=overview', icon: LayoutDashboard, label: 'Dashboard Overview' },
            { to: '/admin?tab=activity', icon: Activity, label: 'Activity Logs' },
         ]
       },
       { 
         title: 'Moderator Access', 
         items: [
            { to: '/admin?tab=users', icon: Users, label: 'User Management' },
            { to: '/admin?tab=moderation', icon: ShieldCheck, label: 'Moderation Queue' },
            { to: '/admin?tab=support', icon: LifeBuoy, label: 'Support Tickets' },
         ]
       },
       { 
         title: 'System Controller', 
         items: [
            { to: '/admin?tab=auctions', icon: Gavel, label: 'Enlisted Assets' },
            { to: '/admin?tab=settings', icon: Sliders, label: 'Platform Settings' },
         ]
       },
    ];

    // Completely Restructured Super Admin Sidebar
    const superAdminItems = [
       { 
         title: 'Intelligence', 
         items: [
            { to: '/super-admin?tab=executive', icon: Activity, label: 'Executive Overview' },
            { to: '/super-admin?tab=analytics', icon: BarChart, label: 'Platform Analytics' },
            { to: '/super-admin?tab=advanced_analytics', icon: TrendingUp, label: 'Advanced Metrics' },
         ]
       },
       { 
         title: 'User & Access', 
         items: [
            { to: '/super-admin?tab=users', icon: Users, label: 'User Administration' },
            { to: '/super-admin?tab=roles', icon: Shield, label: 'Roles & Permissions' },
            { to: '/super-admin?tab=buysell', icon: FileText, label: 'Verification Requests' },
            { to: '/super-admin?tab=investigation', icon: Search, label: 'Fraud Investigation' },
         ]
       },
       { 
         title: 'Marketplace Ops', 
         items: [
            { to: '/super-admin?tab=auctions', icon: Gavel, label: 'Auction Management' },
            { to: '/super-admin?tab=disputes', icon: Scale, label: 'Disputes & Appeals' },
            { to: '/super-admin?tab=financials', icon: Database, label: 'Financial Overview' },
         ]
       },
       { 
         title: 'Communications', 
         items: [
            { to: '/super-admin?tab=communications', icon: Radio, label: 'Messaging & Broadcasts' },
            { to: '/super-admin?tab=support', icon: Headphones, label: 'Support Tickets' },
         ]
       },
       { 
         title: 'System & Config', 
         items: [
            { to: '/super-admin?tab=configuration', icon: Sliders, label: 'Global Configuration' },
            { to: '/super-admin?tab=integrations', icon: Webhook, label: 'API Integrations' },
            { to: '/super-admin?tab=alerts', icon: AlertOctagon, label: 'System Alerts' },
            { to: '/super-admin?tab=audit', icon: Layers, label: 'Audit Logs' },
         ]
       },
    ];

    if (user.role === UserRole.SUPER_ADMIN) {
       return superAdminItems;
    } else if (user.role === UserRole.ADMIN) {
       return adminItems;
    } else {
       return [...common, ...userItems];
    }
  };

  const navItems = getNavItems();

  const renderNavItem = (item: any) => (
    <Link 
      key={item.to} 
      to={item.to}
      onClick={() => setIsSidebarOpen(false)}
      className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 mb-1 group ${
        isActive(item.to) 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <item.icon 
        size={18} 
        className={`mr-3 transition-colors ${
          isActive(item.to) ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
        }`} 
      />
      {item.label}
    </Link>
  );

  const isGrouped = (items: any[]): items is { title: string, items: any[] }[] => {
      return items.length > 0 && 'title' in items[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop (Static) / Mobile (Fixed Overlay) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 h-full
        transform transition-transform duration-300 ease-in-out 
        lg:translate-x-0 lg:static lg:inset-auto flex flex-col
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full shadow-none'}
      `}>
         <div className="h-16 flex items-center px-6 border-b border-gray-100 shrink-0">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-1.5 rounded-lg mr-3 shadow-sm">
               <Gavel className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Autobid</span>
            <button 
               onClick={() => setIsSidebarOpen(false)} 
               className="ml-auto lg:hidden text-gray-500 hover:text-gray-700 p-1.5 rounded-md hover:bg-gray-100"
            >
               <X size={20} />
            </button>
         </div>

         <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {/* User Profile Summary in Sidebar */}
            <div className="mb-6 p-3 bg-gray-50 rounded-xl border border-gray-100">
               <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-3 text-sm ring-2 ring-white shadow-sm overflow-hidden">
                     {user.avatar ? <img src={user.avatar} className="h-full w-full object-cover" /> : user.name.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                     <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                     <p className="text-xs text-gray-500 truncate font-medium flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${user.role === UserRole.SUPER_ADMIN ? 'bg-purple-500' : 'bg-green-500'}`}></span>
                        {user.role.toLowerCase().replace('_', ' ')}
                     </p>
                  </div>
               </div>
            </div>

            <nav className="space-y-1">
               {isGrouped(navItems) ? (
                 navItems.map((group, idx) => (
                    <div key={idx} className="mb-6 last:mb-0">
                       <h3 className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center">
                          {group.title}
                          <div className="ml-2 h-px bg-gray-100 flex-1"></div>
                       </h3>
                       <div className="space-y-0.5">
                          {group.items.map((item: any) => renderNavItem(item))}
                       </div>
                    </div>
                 ))
               ) : (
                 navItems.map((item) => renderNavItem(item))
               )}
            </nav>
         </div>

         <div className="p-4 border-t border-gray-200 shrink-0">
            <button 
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors group"
            >
                <LogOut size={18} className="mr-3 group-hover:scale-110 transition-transform" />
                Sign Out
            </button>
         </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
         {/* Top Header - Mobile Only */}
         <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:hidden shrink-0 z-40 sticky top-0">
            <div className="flex items-center">
               <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none mr-3 p-2 -ml-2 rounded-md hover:bg-gray-100"
               >
                  <Menu size={24} />
               </button>
               <span className="text-lg font-bold text-gray-900">Autobid</span>
            </div>
            <div className="flex items-center gap-3">
                <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                   <Bell size={20} />
                   <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
            </div>
         </header>

         {/* Content Scrollable Area */}
         <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/50">
            <div className="max-w-7xl mx-auto h-full">
               {children}
            </div>
         </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
         <div 
            className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden transition-opacity duration-300 animate-in fade-in"
            onClick={() => setIsSidebarOpen(false)}
         />
      )}
    </div>
  );
};

export default Layout;