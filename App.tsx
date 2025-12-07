import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard'; // This is now the "Browse" page
import UserOverview from './pages/UserOverview'; // User Dashboard Overview
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AuctionDetails from './pages/AuctionDetails';
import CreateAuction from './pages/CreateAuction';
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import Watchlist from './pages/Watchlist';
import Wallet from './pages/Wallet';
import MyBids from './pages/MyBids';
import MyListings from './pages/MyListings';
import Settings from './pages/Settings';
import SupportCenter from './pages/SupportCenter';
import StaticContent from './pages/StaticContent';
import SellerProfile from './pages/SellerProfile';
import { MOCK_REGULAR_USER, MOCK_AUCTIONS } from './constants';
import { User, Auction, Bid, UserRole, AuctionStatus } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [auctions, setAuctions] = useState<Auction[]>(MOCK_AUCTIONS);
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Login Handler now accepts a specific user profile
  const handleLogin = (selectedUser: User) => {
    setIsDataLoading(true);
    setTimeout(() => {
        // Initialize watchlist from mock user data or empty
        const initialUser = { ...selectedUser, watchlist: selectedUser.watchlist || [] };
        setUser(initialUser);
        setIsDataLoading(false);
    }, 800);
  };

  // Mock Logout Handler
  const handleLogout = () => {
    setUser(null);
  };

  // Mock Place Bid Handler
  const handlePlaceBid = async (auctionId: string, amount: number) => {
    if (!user) return;
    
    // Simulate API Delay
    await new Promise(resolve => setTimeout(resolve, 800));

    setAuctions(prevAuctions => 
      prevAuctions.map(auction => {
        if (auction.id === auctionId) {
          const newBid: Bid = {
            id: `b${Date.now()}`,
            auctionId,
            userId: user.id,
            userName: user.name,
            amount,
            timestamp: new Date().toISOString()
          };
          return {
            ...auction,
            currentBid: amount,
            bids: [...auction.bids, newBid]
          };
        }
        return auction;
      })
    );
  };

  const handleUpdateUser = (updatedUser: User) => {
      setUser(updatedUser);
  };

  const handleToggleWatchlist = (auctionId: string) => {
    if (!user) return;
    const currentWatchlist = user.watchlist || [];
    let newWatchlist;
    
    if (currentWatchlist.includes(auctionId)) {
        newWatchlist = currentWatchlist.filter(id => id !== auctionId);
    } else {
        newWatchlist = [...currentWatchlist, auctionId];
    }
    
    setUser({ ...user, watchlist: newWatchlist });
  };

  // Determine landing page based on role
  const getLandingPage = () => {
    if (!user) return <Welcome />;
    switch (user.role) {
      case UserRole.SUPER_ADMIN:
        return <Navigate to="/super-admin?tab=executive" replace />;
      case UserRole.ADMIN:
        return <Navigate to="/admin?tab=overview" replace />;
      case UserRole.USER:
      default:
        return <Navigate to="/dashboard" replace />;
    }
  };

  // Helpers for filtering user content
  const myBids = auctions.flatMap(a => a.bids).filter(b => b.userId === user?.id);
  const myAuctions = auctions.filter(a => a.sellerId === user?.id);

  return (
    <Router>
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        
        {/* Public Static Routes */}
        <Route path="/about" element={<StaticContent />} />
        <Route path="/contact" element={<StaticContent />} />
        <Route path="/help" element={<StaticContent />} />
        <Route path="/fees" element={<StaticContent />} />
        <Route path="/press" element={<StaticContent />} />
        <Route path="/selling" element={<StaticContent />} />

        <Route path="/login" element={
          user ? getLandingPage() : <Login onLogin={handleLogin} />
        } />
        
        {/* Redirect root to landing page logic */}
        <Route path="/" element={getLandingPage()} />

        <Route path="/*" element={
          user ? (
            <Layout user={user} onLogout={handleLogout}>
              <Routes>
                {/* User Dashboard Overview */}
                <Route path="/dashboard" element={<UserOverview user={user!} auctions={auctions} myBids={myBids} />} />

                {/* Browse Auctions */}
                <Route path="/browse" element={<Dashboard auctions={auctions} loading={isDataLoading} />} />
                
                {/* Watchlist & History */}
                <Route path="/watchlist" element={
                   <Watchlist 
                      auctions={auctions} 
                      watchlistIds={user?.watchlist || []} 
                      onRemoveFromWatchlist={handleToggleWatchlist} 
                   />
                } />

                 {/* Profile Route */}
                 <Route path="/profile" element={
                   <Settings user={user!} onUpdateUser={handleUpdateUser} />
                } />
                
                {/* Features Pages */}
                <Route path="/settings" element={<Settings user={user!} onUpdateUser={handleUpdateUser} />} />
                <Route path="/wallet" element={<Wallet user={user!} />} />
                <Route path="/support" element={<SupportCenter user={user!} />} />
                <Route path="/alerts" element={<UserOverview user={user!} auctions={auctions} myBids={myBids} />} />
                <Route path="/my-bids" element={<MyBids bids={myBids} auctions={auctions} />} />
                <Route path="/my-listings" element={<MyListings auctions={myAuctions} />} />
                <Route path="/seller/:id" element={<SellerProfile auctions={auctions} />} />
                
                {/* Specific Role Dashboards */}
                <Route path="/admin" element={
                   (user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN) 
                   ? <AdminDashboard auctions={auctions} /> 
                   : <Navigate to="/dashboard" />
                } />
                <Route path="/super-admin" element={
                   user?.role === UserRole.SUPER_ADMIN 
                   ? <SuperAdminDashboard auctions={auctions} /> 
                   : <Navigate to="/dashboard" />
                } />

                {/* Common Protected Routes */}
                <Route path="/auction/:id" element={
                   <AuctionDetails 
                      auctions={auctions} 
                      user={user!} 
                      onPlaceBid={handlePlaceBid} 
                      onToggleWatchlist={handleToggleWatchlist}
                      watchlist={user?.watchlist || []}
                   />
                } />
                <Route path="/create" element={<CreateAuction />} />
                
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          ) : (
             <Navigate to="/login" replace />
          )
        } />
      </Routes>
    </Router>
  );
};

export default App;