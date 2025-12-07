import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Gavel, ExternalLink, ArrowLeft, Menu, X, Search, ChevronDown, ChevronRight, HelpCircle, FileText, MessageCircle, TrendingUp, ShieldCheck, Briefcase } from 'lucide-react';

const StaticContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFaq = (index: number) => {
      setOpenFaq(openFaq === index ? null : index);
  };

  // FAQs data
  const faqs = [
      { q: "How do I place a bid?", a: "To place a bid, you must register and verify your account. Once verified, navigate to an auction page and enter your bid amount. You can also set a proxy bid to have the system bid for you up to a maximum amount." },
      { q: "Is my deposit refundable?", a: "Yes, any hold placed on your card for bidding eligibility is released immediately if you do not win the auction. If you win, it is applied to the final price." },
      { q: "How does vehicle inspection work?", a: "We encourage in-person inspections. You can contact the seller via the 'Ask a Question' button to arrange a viewing or hire a third-party inspector." },
      { q: "What are the buyer fees?", a: "Autobid charges a buyer's premium of 4.5% on the final hammer price, with a minimum of $500 and a maximum of $4,500." },
      { q: "Can I cancel a bid?", a: "Bids are binding contracts. However, in cases of obvious error (typo), you may contact support within 10 minutes of placing the bid to request a retraction." }
  ];

  // Content map based on route path
  const getContent = () => {
    switch(location.pathname) {
      case '/about':
        return {
          title: "About Us",
          content: (
            <div className="space-y-8 text-gray-600 animate-fade-in">
              <section>
                  <p className="text-lg leading-relaxed">Autobid is the world's premier digital marketplace for luxury automotive and real estate auctions. Founded in 2024, we bridge the gap between traditional auction houses and the digital age.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                      <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                          <h4 className="font-bold text-blue-900 mb-2">Transparency</h4>
                          <p className="text-sm">Clear fees, verified history, and direct communication.</p>
                      </div>
                      <div className="p-6 bg-purple-50 rounded-xl border border-purple-100">
                          <h4 className="font-bold text-purple-900 mb-2">Security</h4>
                          <p className="text-sm">Identity verification and secure escrow payments.</p>
                      </div>
                      <div className="p-6 bg-green-50 rounded-xl border border-green-100">
                          <h4 className="font-bold text-green-900 mb-2">Quality</h4>
                          <p className="text-sm">Curated listings reviewed by industry experts.</p>
                      </div>
                  </div>
              </section>

              {/* Careers Section */}
              <section className="pt-8 border-t border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <Briefcase className="mr-2 text-blue-600" size={24}/> Careers at Autobid
                  </h3>
                  <p className="mb-6">We are always looking for passionate individuals to join our global team. We offer competitive salaries, remote work options, and full benefits.</p>
                  
                  <div className="space-y-4">
                      <div className="bg-white p-5 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors flex justify-between items-center shadow-sm">
                          <div>
                              <h4 className="font-bold text-gray-900">Senior Auction Specialist (Automotive)</h4>
                              <p className="text-sm text-gray-500">Remote (US/EU) • Full-time</p>
                          </div>
                          <button className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg">Apply Now</button>
                      </div>
                      <div className="bg-white p-5 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors flex justify-between items-center shadow-sm">
                          <div>
                              <h4 className="font-bold text-gray-900">Real Estate Compliance Officer</h4>
                              <p className="text-sm text-gray-500">New York, NY • Hybrid</p>
                          </div>
                          <button className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg">Apply Now</button>
                      </div>
                      <div className="bg-white p-5 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors flex justify-between items-center shadow-sm">
                          <div>
                              <h4 className="font-bold text-gray-900">Senior React Engineer</h4>
                              <p className="text-sm text-gray-500">Remote • Full-time</p>
                          </div>
                          <button className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg">Apply Now</button>
                      </div>
                  </div>
              </section>
            </div>
          )
        };
      case '/contact':
        return {
          title: "Contact Us",
          content: (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                      <MessageCircle size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Customer Support</h3>
                  <p className="text-gray-600 mb-4 text-sm">For help with your account, bidding, or selling.</p>
                  <a href="mailto:support@autobid.com" className="text-blue-600 font-bold hover:underline">support@autobid.com</a>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-4">
                      <Gavel size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Partnerships & Press</h3>
                  <p className="text-gray-600 mb-4 text-sm">For auction house partnerships and media inquiries.</p>
                  <a href="mailto:partners@autobid.com" className="text-blue-600 font-bold hover:underline">partners@autobid.com</a>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-6 text-xl">Send us a message</h3>
                <form className="space-y-4 max-w-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" placeholder="Your name" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                        <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" placeholder="you@example.com" />
                    </div>
                  </div>
                   <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                    <textarea rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" placeholder="How can we help?" />
                  </div>
                  <button type="button" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg">Send Message</button>
                </form>
              </div>
            </div>
          )
        };
      case '/fees':
        return {
          title: "Fees & Shipping",
          content: (
            <div className="space-y-8 text-gray-600 animate-fade-in">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Buyer Premium</h3>
                  <p className="mb-4">Autobid charges a buyer's premium on the final hammer price. This fee is added to the winning bid amount.</p>
                  <div className="flex items-center gap-4 text-2xl font-bold text-blue-600 bg-blue-50 p-4 rounded-lg inline-block">
                      4.5% <span className="text-sm font-normal text-gray-500">(Min $500, Max $4,500)</span>
                  </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Seller Fees</h3>
                      <ul className="list-disc pl-5 space-y-2 text-sm">
                          <li><strong>Basic Listing:</strong> Free</li>
                          <li><strong>Premium Listing:</strong> $99 (Includes professional photography)</li>
                          <li><strong>Success Fee:</strong> None for sellers</li>
                      </ul>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Shipping</h3>
                      <p className="text-sm">Buyers are responsible for shipping. We partner with logistics providers to offer discounted rates for secure transport.</p>
                  </div>
              </div>
            </div>
          )
        };
      case '/selling':
        return {
            title: "Selling Guide",
            content: (
                <div className="space-y-8 animate-fade-in">
                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-6">How to Sell on Autobid</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { step: 1, title: 'Submit Info', desc: 'Provide basic details and photos of your asset via our simple form.' },
                                { step: 2, title: 'Curate', desc: 'Our team reviews your submission and writes the professional listing description.' },
                                { step: 3, title: 'Live Auction', desc: 'Your listing goes live for 7-14 days. Watch the bids roll in.' },
                                { step: 4, title: 'Transfer', desc: 'We handle the paperwork and facilitate the secure transfer of funds.' }
                            ].map((item) => (
                                <div key={item.step} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mb-4">
                                        {item.step}
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                                    <p className="text-sm text-gray-600">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <TrendingUp className="mr-2 text-green-600"/> Why Sell With Us?
                            </h3>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <ShieldCheck className="text-blue-500 mr-3 mt-0.5 shrink-0" size={18} />
                                    <span className="text-sm text-gray-600"><strong>Verified Bidders:</strong> Every bidder is ID-verified and has funds held.</span>
                                </li>
                                <li className="flex items-start">
                                    <TrendingUp className="text-blue-500 mr-3 mt-0.5 shrink-0" size={18} />
                                    <span className="text-sm text-gray-600"><strong>Global Reach:</strong> We market your asset to collectors in over 50 countries.</span>
                                </li>
                                <li className="flex items-start">
                                    <MessageCircle className="text-blue-500 mr-3 mt-0.5 shrink-0" size={18} />
                                    <span className="text-sm text-gray-600"><strong>Dedicated Support:</strong> An auction specialist guides you through every step.</span>
                                </li>
                            </ul>
                        </section>

                        <section className="bg-blue-50 p-8 rounded-xl border border-blue-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Preparation Checklist</h3>
                            <ul className="space-y-2 list-disc pl-5 text-gray-700 text-sm">
                                <li>Gather all maintenance records and documentation.</li>
                                <li>Take high-quality photos (min 20) or request our photography service.</li>
                                <li>Note any modifications, defects, or issues for full transparency.</li>
                                <li>Set a realistic reserve price using our free valuation tool.</li>
                            </ul>
                            <button onClick={() => navigate('/create')} className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                                Start Your Listing
                            </button>
                        </section>
                    </div>
                </div>
            )
        };
      case '/help':
        return {
            title: "Help Center",
            content: (
                <div className="space-y-8 animate-fade-in">
                    {/* Search Hero */}
                    <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center mb-8">
                        <h2 className="text-2xl font-bold mb-4">How can we help you?</h2>
                        <div className="max-w-xl mx-auto relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search articles..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-400/30"
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-900 flex items-center">
                                <HelpCircle className="mr-2 text-blue-600" size={20}/> Frequently Asked Questions
                            </h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {faqs.filter(f => f.q.toLowerCase().includes(searchQuery.toLowerCase())).map((faq, index) => (
                                <div key={index} className="group">
                                    <button 
                                        onClick={() => toggleFaq(index)}
                                        className="w-full text-left p-5 flex justify-between items-center hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="font-medium text-gray-900">{faq.q}</span>
                                        {openFaq === index ? <ChevronDown className="text-gray-400" size={20} /> : <ChevronRight className="text-gray-400" size={20} />}
                                    </button>
                                    {openFaq === index && (
                                        <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed animate-in slide-in-from-top-1">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {['Buying Guide', 'Selling Guide', 'Rules & Policies'].map((cat, i) => (
                            <div key={i} className="p-6 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group bg-white">
                                <FileText className="text-gray-400 group-hover:text-blue-600 mb-3" size={24} />
                                <h4 className="font-bold text-gray-900">{cat}</h4>
                                <p className="text-xs text-gray-500 mt-1">Read detailed documentation.</p>
                            </div>
                        ))}
                    </div>
                </div>
            )
        };
        case '/press':
            return {
                title: "Press & News",
                content: (
                    <div className="space-y-6 animate-fade-in">
                        <div className="space-y-4">
                            {[
                                { date: "Oct 12, 2024", title: "Autobid Reaches $100M in Monthly Volume", snippet: "The platform continues to grow at a record pace..." },
                                { date: "Sep 05, 2024", title: "Launching Real Estate Auctions", snippet: "We are proud to expand our offerings to include luxury properties..." }
                            ].map((news, i) => (
                                <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 transition-colors cursor-pointer">
                                    <p className="text-xs font-bold text-blue-600 uppercase mb-2">{news.date}</p>
                                    <h4 className="font-bold text-xl text-gray-900 mb-2">{news.title}</h4>
                                    <p className="text-gray-600">{news.snippet}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            };
      default:
        return {
          title: "Page Not Found",
          content: <p>The page you are looking for does not exist.</p>
        };
    }
  };

  const { title, content } = getContent();

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
       {/* Public Navigation (Simplified - Only if accessed directly) */}
       <nav className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="bg-blue-600 p-1.5 rounded-lg">
                 <Gavel className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold tracking-tight">Autobid</span>
            </div>
             <div className="hidden md:flex items-center space-x-8">
                <button onClick={() => navigate('/')} className="text-gray-300 hover:text-white font-medium">Home</button>
                <button onClick={() => navigate('/login')} className="bg-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">Sign In</button>
            </div>
             {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300 p-2">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 px-4 py-4 space-y-2">
             <button onClick={() => navigate('/')} className="block w-full text-left text-white py-2">Home</button>
             <button onClick={() => navigate('/login')} className="block w-full text-left text-blue-400 font-bold py-2">Sign In</button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors font-medium">
            <ArrowLeft size={18} className="mr-2" /> Back
        </button>
        
        <div className="bg-transparent">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 pb-4 border-b border-gray-200">{title}</h1>
            <div className="w-full">
                {content}
            </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-gray-400 py-12 px-4 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
           <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Gavel size={16} />
              <span className="font-bold text-white">Autobid</span>
           </div>
           <p>&copy; 2024 Autobid Auctions Inc.</p>
        </div>
      </footer>
    </div>
  );
};

export default StaticContent;