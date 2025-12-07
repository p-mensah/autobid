import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Gavel, Car, Home, ShieldCheck, ArrowRight, Zap, Trophy, Users, Star, 
  Menu, X, Clock, DollarSign, TrendingUp, ChevronRight, ExternalLink, Mail, Quote, MapPin 
} from 'lucide-react';
import { MOCK_AUCTIONS } from '../constants';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Use up to 6 mock auctions for the "Live" section to populate models
  const featuredAuctions = MOCK_AUCTIONS.slice(0, 6);

  const navLinks = [
    { name: 'Auctions', action: () => document.getElementById('live-auctions')?.scrollIntoView({ behavior: 'smooth' }) },
    { name: 'How It Works', action: () => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }) },
    { name: 'Sell Your Asset', action: () => navigate('/login') },
    { name: 'About', action: () => navigate('/about') },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-gray-900/95 backdrop-blur-md text-white border-b border-gray-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="bg-blue-600 p-1.5 rounded-lg">
                 <Gavel className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight">Autobid</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <button 
                  key={link.name} 
                  onClick={link.action}
                  className="text-gray-300 hover:text-white font-medium transition-colors text-sm uppercase tracking-wide"
                >
                  {link.name}
                </button>
              ))}
              <div className="h-6 w-px bg-gray-700 mx-2"></div>
              <button
                onClick={() => navigate('/login')}
                className="text-white font-medium hover:text-blue-400 transition-colors text-sm"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-all shadow-lg hover:shadow-blue-900/50 transform hover:-translate-y-0.5 text-sm"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white p-2"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-800 absolute w-full shadow-2xl">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    link.action();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-4 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md border-b border-gray-800"
                >
                  {link.name}
                </button>
              ))}
              <div className="pt-4 flex flex-col space-y-3 px-3">
                 <button
                  onClick={() => navigate('/login')}
                  className="w-full py-3 text-center text-white font-medium bg-gray-800 rounded-lg"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-3 text-center bg-blue-600 text-white font-bold rounded-lg"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative pt-16 bg-gray-900 text-white min-h-[65vh] md:min-h-[75vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920"
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/40 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12">
          <div className="max-w-2xl animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>Live Bidding Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6">
              Acquire the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Extraordinary</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-lg">
              Participate in exclusive auctions for high-end automobiles and premier real estate properties from verified sellers worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/login')} 
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-lg flex items-center justify-center transition-all hover:scale-105 shadow-xl shadow-blue-900/30"
              >
                Browse Auctions <ArrowRight className="ml-2" size={20} />
              </button>
              <button
                 onClick={() => navigate('/login')}
                 className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl font-bold text-lg text-white transition-all flex items-center justify-center"
              >
                Sell with Us
              </button>
            </div>
            
            <div className="mt-10 grid grid-cols-3 gap-8 border-t border-gray-800 pt-6">
              <div>
                <div className="text-3xl font-bold text-white">$450M+</div>
                <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Volume Traded</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">12k+</div>
                <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Active Bidders</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Verified Items</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted Partners Strip */}
      <div className="bg-white border-b border-gray-100 py-6">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Trusted by industry leaders</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
               {['Sotheby\'s', 'Christie\'s', 'Barrett-Jackson', 'Mecum', 'Porsche Club'].map((partner, i) => (
                  <span key={i} className="text-lg md:text-xl font-bold text-gray-600 cursor-default">{partner}</span>
               ))}
            </div>
         </div>
      </div>

      {/* Live Trending Auctions */}
      <section id="live-auctions" className="py-12 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="text-red-500" /> Live & Trending
              </h2>
              <p className="text-gray-600 mt-1">Don't miss out on these auctions ending soon.</p>
            </div>
            <button 
              onClick={() => navigate('/login')}
              className="text-blue-600 font-bold hover:text-blue-800 flex items-center group text-sm"
            >
              View All Auctions <ChevronRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAuctions.map((auction) => (
              <div key={auction.id} className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden flex flex-col h-full transform hover:-translate-y-1">
                {/* Image Section */}
                <div className="relative h-52 overflow-hidden">
                  <img 
                    src={auction.images[0]} 
                    alt={auction.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Overlay Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                     <span className="bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center shadow-sm">
                        {auction.type === 'AUTOMOBILE' ? <Car size={12} className="mr-1 text-blue-600" /> : <Home size={12} className="mr-1 text-purple-600" />}
                        {auction.category}
                     </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center shadow-sm animate-pulse">
                       <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5"></span>
                       LIVE
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                     <div className="flex items-center text-white text-xs font-medium">
                        <Clock size={14} className="mr-1.5 text-yellow-400" />
                        <span>Ending soon</span>
                     </div>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {auction.title}
                  </h3>
                  <p className="text-gray-500 text-xs line-clamp-2 mb-4">
                    {auction.description}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Current Bid</p>
                      <p className="text-xl font-bold text-gray-900 flex items-center">
                        ${auction.currentBid.toLocaleString()}
                      </p>
                    </div>
                    <button 
                      onClick={() => navigate('/login')}
                      className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-blue-600 transition-colors"
                    >
                      Bid Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Visual Grid */}
      <section className="py-12 bg-white px-4 sm:px-6 lg:px-8">
         <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Explore Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               {[
                  { title: "Supercars", img: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=800", count: "12 Active" },
                  { title: "Luxury Estates", img: "https://images.unsplash.com/photo-1600596542815-60c37c65b567?auto=format&fit=crop&q=80&w=800", count: "8 Active" },
                  { title: "Classics", img: "https://images.unsplash.com/photo-1583121274602-3e2820c698d9?auto=format&fit=crop&q=80&w=800", count: "24 Active" },
                  { title: "Commercial", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800", count: "5 Active" }
               ].map((cat, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden cursor-pointer h-64" onClick={() => navigate('/login')}>
                     <img src={cat.img} alt={cat.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                     <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
                     <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <h3 className="text-xl font-bold text-white mb-0.5">{cat.title}</h3>
                        <p className="text-gray-300 text-xs opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                           {cat.count} Auctions
                        </p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* How it Works (Visual Steps) */}
      <section id="how-it-works" className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto relative z-10">
           <div className="text-center mb-10 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">The Smartest Way to Bid</h2>
            <p className="text-gray-600">Our AI-powered platform makes buying and selling seamless.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
             {/* Connecting Line (Desktop) */}
             <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-0.5 bg-gray-200 z-0"></div>

             <div className="text-center relative z-10">
                <div className="w-20 h-20 bg-white border-4 border-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                   <Users size={28} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">1. Register & Verify</h3>
                <p className="text-gray-500 text-sm leading-relaxed px-4">Create your account and complete our secure identity verification process in under 2 minutes.</p>
             </div>
             <div className="text-center relative z-10">
                <div className="w-20 h-20 bg-white border-4 border-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                   <Gavel size={28} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">2. Smart Bidding</h3>
                <p className="text-gray-500 text-sm leading-relaxed px-4">Place real-time bids or set a max proxy bid. Our system handles the rest instantly.</p>
             </div>
             <div className="text-center relative z-10">
                <div className="w-20 h-20 bg-white border-4 border-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                   <Trophy size={28} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">3. Secure Transfer</h3>
                <p className="text-gray-500 text-sm leading-relaxed px-4">Win the auction and pay securely via escrow. We assist with title transfer and logistics.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-white px-4 sm:px-6 lg:px-8">
         <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">What Our Clients Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                  { name: "Michael T.", role: "Car Collector", text: "Autobid is simply the best platform I've used. The verification process gives me total peace of mind." },
                  { name: "Sarah L.", role: "Real Estate Investor", text: "Found a gem of a property in Miami. The transaction was smoother than any traditional brokerage deal." },
                  { name: "David R.", role: "Dealer Principal", text: "Selling our inventory on Autobid has opened up a global market we couldn't reach before." }
               ].map((t, i) => (
                  <div key={i} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 relative">
                     <Quote className="text-blue-200 absolute top-4 left-4" size={32} />
                     <p className="text-gray-600 mb-4 relative z-10 italic text-sm">"{t.text}"</p>
                     <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                        <div>
                           <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                           <p className="text-[10px] text-blue-600 font-bold uppercase">{t.role}</p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-12 bg-gray-900 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
         <div className="absolute inset-0 bg-blue-600/10"></div>
         <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-2xl font-bold text-white mb-3">Stay Ahead of the Market</h2>
            <p className="text-gray-400 mb-8 text-sm">Get weekly insights on rare cars and luxury properties delivered to your inbox.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
               <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="flex-1 px-5 py-3 rounded-lg border-none focus:ring-2 focus:ring-blue-500 bg-white/10 text-white placeholder-gray-400 backdrop-blur-sm text-sm"
               />
               <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/50 text-sm">
                  Subscribe
               </button>
            </form>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-600 p-1 rounded-md">
                 <Gavel className="text-white" size={18} />
              </div>
              <span className="text-lg font-bold text-white">Autobid</span>
            </div>
            <p className="text-xs leading-relaxed mb-6 max-w-sm text-gray-500">
               The premier marketplace for luxury automotive and real estate auctions. Secure, transparent, and global.
            </p>
            <div className="mt-4">
                <h5 className="text-white font-bold mb-2 text-xs">Location</h5>
                <div className="flex items-start space-x-2 text-xs">
                    <MapPin size={14} className="mt-0.5 text-blue-500" />
                    <span>No.13,,Buro house. Osu<br/>labone, CA 94105</span>
                </div>
            </div>
          </div>
          
          <div>
             <h4 className="text-white font-bold mb-4 text-sm">Auctions</h4>
             <ul className="space-y-2 text-xs">
                <li><button onClick={() => navigate('/login?sort=ACTIVE')} className="hover:text-blue-400 transition-colors">Live Auctions</button></li>
                <li><button onClick={() => navigate('/login?sort=ENDING_SOON')} className="hover:text-blue-400 transition-colors">Ending Soon</button></li>
                <li><button onClick={() => navigate('/login?sort=NEWEST')} className="hover:text-blue-400 transition-colors">Just Listed</button></li>
                <li><button onClick={() => navigate('/login')} className="hover:text-blue-400 transition-colors">Past Results</button></li>
             </ul>
          </div>

          <div>
             <h4 className="text-white font-bold mb-4 text-sm">Support</h4>
             <ul className="space-y-2 text-xs">
                <li><button onClick={() => navigate('/help')} className="hover:text-blue-400 transition-colors">Help Center</button></li>
                <li><button onClick={() => navigate('/selling')} className="hover:text-blue-400 transition-colors">Selling Guide</button></li>
                <li><button onClick={() => navigate('/fees')} className="hover:text-blue-400 transition-colors">Fees & Shipping</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-blue-400 transition-colors">Contact Support</button></li>
             </ul>
          </div>

          <div>
             <h4 className="text-white font-bold mb-4 text-sm">Company</h4>
             <ul className="space-y-2 text-xs">
                <li><button onClick={() => navigate('/about')} className="hover:text-blue-400 transition-colors">About Us</button></li>
                <li><button onClick={() => navigate('/about')} className="hover:text-blue-400 transition-colors">Careers</button></li>
                <li><button onClick={() => navigate('/press')} className="hover:text-blue-400 transition-colors">Press</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-blue-400 transition-colors">Partnerships</button></li>
             </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
          <p>&copy; 2024 Autobid Auctions Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
             <button onClick={() => navigate('/about')} className="hover:text-white">Privacy Policy</button>
             <button onClick={() => navigate('/about')} className="hover:text-white">Terms of Service</button>
             <button onClick={() => navigate('/about')} className="hover:text-white">Sitemap</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;