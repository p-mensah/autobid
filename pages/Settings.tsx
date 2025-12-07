import React, { useState } from 'react';
import { User, NotificationPreferences } from '../types';
import { 
  UserCircle, Lock, Bell, Shield, CheckCircle, Mail, 
  MessageSquare, Smartphone, CreditCard, Globe, MapPin, 
  Camera, Plus, Trash2, AlertTriangle, Home, Briefcase, X, Calendar, AlertCircle 
} from 'lucide-react';
import { LoadingSpinner } from '../components/Loading';

interface SettingsProps {
  user: User;
  onUpdateUser: (u: User) => void;
}

const DEFAULT_NOTIFICATIONS: NotificationPreferences = {
   outbid: { email: true, sms: true, push: true },
   endingSoon: { email: true, sms: false, push: true },
   marketing: { email: true, sms: false, push: false },
   systemUpdates: { email: true, sms: false, push: false },
   newMessages: { email: true, sms: true, push: true }
};

interface Address {
  id: string;
  type: 'Billing' | 'Shipping' | 'Pickup';
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

interface PaymentMethod {
    id: string;
    type: 'Visa' | 'Mastercard' | 'Amex';
    last4: string;
    expiry: string;
    isDefault: boolean;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'addresses' | 'security' | 'notifications' | 'billing'>('profile');
  
  // Modals
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Local state for features not in core User type for demo purposes
  const [preferences, setPreferences] = useState({
      language: 'English (US)',
      timezone: 'UTC',
      currency: 'USD ($)',
  });

  const [addresses, setAddresses] = useState<Address[]>([
      { id: '1', type: 'Shipping', label: 'Home', line1: user.address || '123 Main St', city: 'San Francisco', state: 'CA', zip: '94105', country: 'USA', isDefault: true },
      { id: '2', type: 'Billing', label: 'Office', line1: '456 Market St', line2: 'Suite 200', city: 'San Francisco', state: 'CA', zip: '94103', country: 'USA', isDefault: false }
  ]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
      { id: '1', type: 'Visa', last4: '4242', expiry: '12/25', isDefault: true }
  ]);

  // Form States for Modals
  const [newAddress, setNewAddress] = useState<Partial<Address>>({ type: 'Shipping', country: 'USA' });
  const [newPayment, setNewPayment] = useState({ number: '', expiry: '', cvv: '', name: '' });

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    avatar: user.avatar || '',
    phone: user.phone || '',
    bio: user.bio || '',
    notificationPreferences: user.notificationPreferences || DEFAULT_NOTIFICATIONS
  });

  const [avatarError, setAvatarError] = useState<string | null>(null);

  const handleSave = () => {
    setLoading(true);
    setSuccess(false);
    
    // Simulate API call
    setTimeout(() => {
      // Update the actual user object
      onUpdateUser({ 
          ...user, 
          name: formData.name,
          avatar: formData.avatar,
          phone: formData.phone,
          bio: formData.bio,
          notificationPreferences: formData.notificationPreferences,
          // For demo, we might sync the default address back to user.address
          address: addresses.find(a => a.isDefault)?.line1 || user.address
      });
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
          setAvatarError('Invalid file type. Please upload an image (JPG, PNG, WEBP).');
          return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
          setAvatarError('File is too large. Maximum size is 5MB.');
          return;
      }

      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, avatar: imageUrl }));
    }
  };

  const handleDeleteAddress = (id: string) => {
      setAddresses(addresses.filter(a => a.id !== id));
  };

  const handleAddAddress = () => {
      if (newAddress.line1 && newAddress.city) {
          const address: Address = {
              id: Date.now().toString(),
              type: newAddress.type as any || 'Shipping',
              label: newAddress.label || 'New Address',
              line1: newAddress.line1 || '',
              line2: newAddress.line2,
              city: newAddress.city || '',
              state: newAddress.state || '',
              zip: newAddress.zip || '',
              country: newAddress.country || 'USA',
              isDefault: false
          };
          setAddresses([...addresses, address]);
          setIsAddressModalOpen(false);
          setNewAddress({ type: 'Shipping', country: 'USA' });
      }
  };

  const handleAddPayment = () => {
      if (newPayment.number) {
          const method: PaymentMethod = {
              id: Date.now().toString(),
              type: 'Visa', // Mock detection
              last4: newPayment.number.slice(-4),
              expiry: newPayment.expiry,
              isDefault: false
          };
          setPaymentMethods([...paymentMethods, method]);
          setIsPaymentModalOpen(false);
          setNewPayment({ number: '', expiry: '', cvv: '', name: '' });
      }
  };

  const toggleNotification = (category: keyof NotificationPreferences, channel: 'email' | 'sms' | 'push') => {
      setFormData(prev => ({
          ...prev,
          notificationPreferences: {
              ...prev.notificationPreferences,
              [category]: {
                  ...prev.notificationPreferences[category],
                  [channel]: !prev.notificationPreferences[category][channel]
              }
          }
      }));
  };

  const renderSidebar = () => (
      <nav className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {[
            { id: 'profile', icon: UserCircle, label: 'Profile' },
            { id: 'preferences', icon: Globe, label: 'Preferences' },
            { id: 'addresses', icon: MapPin, label: 'Address Book' },
            { id: 'security', icon: Lock, label: 'Security & Login' },
            { id: 'notifications', icon: Bell, label: 'Notifications' },
            { id: 'billing', icon: CreditCard, label: 'Billing & Payments' },
        ].map((item) => (
            <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full text-left px-4 py-4 font-medium flex items-center border-l-4 transition-all ${
                    activeTab === item.id 
                    ? 'border-blue-600 bg-blue-50 text-blue-700' 
                    : 'border-transparent text-gray-600 hover:bg-gray-50'
                }`}
            >
                <item.icon size={18} className="mr-3" /> {item.label}
            </button>
        ))}
      </nav>
  );

  return (
    <div className="max-w-5xl mx-auto mb-10">
       <div className="flex justify-between items-center mb-6">
           <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
       </div>
       
       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Nav */}
          <div className="lg:col-span-1 space-y-1">
             {renderSidebar()}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 p-8 min-h-[500px] relative">
             
             {/* --- PROFILE TAB --- */}
             {activeTab === 'profile' && (
                <div className="space-y-8 animate-fade-in">
                   <div>
                      <h2 className="text-xl font-bold text-gray-900">Public Profile</h2>
                      <p className="text-gray-500 text-sm mt-1">Manage how you appear to other users on the platform.</p>
                   </div>

                   {/* Profile Photo */}
                   <div className="pb-6 border-b border-gray-100">
                        <div className="flex items-center gap-6">
                            <div className="relative group">
                                <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200 shadow-sm">
                                    {formData.avatar ? (
                                        <img src={formData.avatar} alt="Profile" className="h-full w-full object-cover" />
                                    ) : (
                                        <UserCircle size={64} className="text-gray-400" />
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white cursor-pointer shadow-md hover:bg-blue-700 transition-colors">
                                    <Camera size={14} />
                                    <input type="file" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleImageUpload} />
                                </label>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Profile Photo</h3>
                                <p className="text-sm text-gray-500 mb-2">Recommended 400x400px. JPG, PNG or WEBP. Max 5MB.</p>
                                <button 
                                    onClick={() => { setFormData(prev => ({...prev, avatar: ''})); setAvatarError(null); }}
                                    className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline"
                                >
                                    Remove Photo
                                </button>
                            </div>
                        </div>
                        {avatarError && (
                            <div className="mt-3 flex items-center text-red-600 text-sm bg-red-50 p-2 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-1">
                                <AlertCircle size={16} className="mr-2 shrink-0" />
                                {avatarError}
                            </div>
                        )}
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label className="block text-sm font-bold text-gray-700 mb-1">Display Name</label>
                         <input 
                            type="text" 
                            value={formData.name} 
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                         <input 
                            type="email" 
                            value={formData.email} 
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                         />
                         <p className="text-xs text-gray-400 mt-1">Contact support to change your email.</p>
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                         <input 
                            type="tel" 
                            value={formData.phone} 
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="+1 (555) 000-0000"
                         />
                      </div>
                   </div>
                   
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Bio</label>
                      <textarea 
                         rows={4}
                         value={formData.bio} 
                         onChange={e => setFormData({...formData, bio: e.target.value})}
                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                         placeholder="Tell other users a bit about yourself..."
                      />
                   </div>
                </div>
             )}

             {/* --- PREFERENCES TAB --- */}
             {activeTab === 'preferences' && (
                 <div className="space-y-8 animate-fade-in">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Regional Preferences</h2>
                      <p className="text-gray-500 text-sm mt-1">Customize your platform experience.</p>
                    </div>

                    <div className="max-w-md space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Language</label>
                            <select 
                                value={preferences.language}
                                onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            >
                                <option>English (US)</option>
                                <option>English (UK)</option>
                                <option>Español</option>
                                <option>Français</option>
                                <option>Deutsch</option>
                                <option>中文 (Simplified)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Time Zone</label>
                            <select 
                                value={preferences.timezone}
                                onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            >
                                <option value="UTC">UTC</option>
                                <option value="GMT">GMT (Accra, London)</option>
                                <option value="UTC-05:00">UTC-05:00 Eastern Time</option>
                                <option value="UTC-06:00">UTC-06:00 Central Time</option>
                                <option value="UTC-08:00">UTC-08:00 Pacific Time</option>
                                <option value="UTC+01:00">UTC+01:00 Central European Time</option>
                                <option value="UTC+02:00">UTC+02:00 South Africa Standard Time</option>
                                <option value="UTC+09:00">UTC+09:00 Tokyo</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Currency</label>
                            <select 
                                value={preferences.currency}
                                onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            >
                                <option>USD ($)</option>
                                <option>EUR (€)</option>
                                <option>GBP (£)</option>
                                <option>GHS (₵) - Ghana Cedis</option>
                                <option>NGN (₦) - Nigerian Naira</option>
                                <option>ZAR (R) - South African Rand</option>
                                <option>CAD ($)</option>
                                <option>JPY (¥)</option>
                                <option>BTC (₿)</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Bids are placed in the auction's listing currency, but estimated values will be shown in your preferred currency.</p>
                        </div>
                    </div>
                 </div>
             )}

             {/* --- ADDRESS BOOK TAB --- */}
             {activeTab === 'addresses' && (
                 <div className="space-y-8 animate-fade-in">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Address Book</h2>
                            <p className="text-gray-500 text-sm mt-1">Manage shipping and billing addresses.</p>
                        </div>
                        <button 
                            onClick={() => setIsAddressModalOpen(true)}
                            className="flex items-center text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                        >
                            <Plus size={16} className="mr-1" /> Add New
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {addresses.map((addr) => (
                            <div key={addr.id} className="border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:border-blue-300 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-lg ${addr.type === 'Billing' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {addr.type === 'Billing' ? <Briefcase size={20} /> : <Home size={20} />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-gray-900">{addr.label}</h4>
                                            {addr.isDefault && <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Default</span>}
                                            <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">{addr.type}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br/>
                                            {addr.city}, {addr.state} {addr.zip}, {addr.country}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4 sm:mt-0 w-full sm:w-auto justify-end">
                                    <button className="px-3 py-1.5 text-xs font-bold text-gray-600 border border-gray-300 rounded hover:bg-gray-50">Edit</button>
                                    <button 
                                        onClick={() => handleDeleteAddress(addr.id)}
                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded border border-transparent hover:border-red-200"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
             )}

             {/* --- SECURITY TAB --- */}
             {activeTab === 'security' && (
                <div className="space-y-8 animate-fade-in">
                   <div>
                      <h2 className="text-xl font-bold text-gray-900">Security & Login</h2>
                      <p className="text-gray-500 text-sm mt-1">Manage your password and security settings.</p>
                   </div>

                   <div className="border-b border-gray-100 pb-8">
                      <h3 className="font-bold text-gray-800 mb-4">Change Password</h3>
                      <div className="space-y-4 max-w-md">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                         </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                         </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                         </div>
                         <button className="bg-gray-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors">Update Password</button>
                      </div>
                   </div>
                   
                   <div className="border-b border-gray-100 pb-8">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center"><Shield size={18} className="mr-2 text-green-600"/> Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                         <div>
                            <p className="font-medium text-gray-900">Authenticator App</p>
                            <p className="text-sm text-gray-500">Secure your account with Google Authenticator or similar.</p>
                         </div>
                         <button className="text-blue-600 font-bold hover:underline bg-white border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">Enable 2FA</button>
                      </div>
                   </div>

                   {/* Danger Zone */}
                   <div>
                       <h3 className="font-bold text-red-700 mb-4 flex items-center"><AlertTriangle size={18} className="mr-2"/> Danger Zone</h3>
                       <div className="border border-red-200 rounded-xl overflow-hidden">
                           <div className="p-4 bg-red-50 flex justify-between items-center border-b border-red-100">
                               <div>
                                   <h4 className="font-bold text-gray-900 text-sm">Deactivate Account</h4>
                                   <p className="text-xs text-gray-600">Temporarily disable your account. You can reactivate it anytime.</p>
                               </div>
                               <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-50">Deactivate</button>
                           </div>
                           <div className="p-4 bg-red-50 flex justify-between items-center">
                               <div>
                                   <h4 className="font-bold text-red-900 text-sm">Delete Account</h4>
                                   <p className="text-xs text-red-700">Permanently remove your account and all data. This cannot be undone.</p>
                               </div>
                               <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700">Delete Account</button>
                           </div>
                       </div>
                   </div>
                </div>
             )}

             {/* --- NOTIFICATIONS TAB --- */}
             {activeTab === 'notifications' && (
                <div className="space-y-8 animate-fade-in">
                   <div>
                      <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>
                      <p className="text-gray-500 text-sm mt-1">Choose how and when you want to be notified.</p>
                   </div>

                   <div className="overflow-hidden border border-gray-200 rounded-xl">
                      <table className="min-w-full divide-y divide-gray-200">
                         <thead className="bg-gray-50">
                            <tr>
                               <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                               <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-24">
                                  <div className="flex flex-col items-center"><Mail size={16} className="mb-1"/> Email</div>
                               </th>
                               <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-24">
                                  <div className="flex flex-col items-center"><MessageSquare size={16} className="mb-1"/> SMS</div>
                               </th>
                               <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-24">
                                  <div className="flex flex-col items-center"><Smartphone size={16} className="mb-1"/> Push</div>
                               </th>
                            </tr>
                         </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                            {[
                                { key: 'outbid', label: 'Outbid Alerts', desc: 'When someone places a higher bid.' },
                                { key: 'endingSoon', label: 'Auctions Ending', desc: 'Reminders for watched items.' },
                                { key: 'newMessages', label: 'New Messages', desc: 'Direct messages from sellers/support.' },
                                { key: 'systemUpdates', label: 'System Updates', desc: 'Security alerts and feature updates.' },
                                { key: 'marketing', label: 'Marketing', desc: 'Newsletters and promotions.' },
                            ].map((row) => (
                               <tr key={row.key}>
                                  <td className="px-6 py-4">
                                     <p className="font-bold text-gray-900 text-sm">{row.label}</p>
                                     <p className="text-xs text-gray-500">{row.desc}</p>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                     <input 
                                        type="checkbox" 
                                        checked={(formData.notificationPreferences as any)[row.key].email}
                                        onChange={() => toggleNotification(row.key as any, 'email')}
                                        className="h-5 w-5 text-blue-600 rounded cursor-pointer"
                                     />
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                     <input 
                                        type="checkbox" 
                                        checked={(formData.notificationPreferences as any)[row.key].sms}
                                        onChange={() => toggleNotification(row.key as any, 'sms')}
                                        className="h-5 w-5 text-blue-600 rounded cursor-pointer"
                                     />
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                     <input 
                                        type="checkbox" 
                                        checked={(formData.notificationPreferences as any)[row.key].push}
                                        onChange={() => toggleNotification(row.key as any, 'push')}
                                        className="h-5 w-5 text-blue-600 rounded cursor-pointer"
                                     />
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>
             )}

             {/* --- BILLING TAB --- */}
             {activeTab === 'billing' && (
                <div className="space-y-8 animate-fade-in">
                   <div>
                      <h2 className="text-xl font-bold text-gray-900">Billing & Payments</h2>
                      <p className="text-gray-500 text-sm mt-1">Manage payment methods and billing history.</p>
                   </div>
                   
                   <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 flex items-start">
                      <Shield className="mr-2 mt-0.5" size={16} />
                      <p>Your payment information is stored securely via Stripe. Autobid never stores your full card details.</p>
                   </div>

                   <div className="space-y-4">
                      <h3 className="font-bold text-gray-900">Saved Methods</h3>
                      {paymentMethods.map(method => (
                          <div key={method.id} className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                             <div className="flex items-center">
                                <div className="bg-gray-100 p-2 rounded-md mr-4">
                                   <CreditCard size={24} className="text-gray-600" />
                                </div>
                                <div>
                                   <p className="font-bold text-gray-900">{method.type} ending in {method.last4}</p>
                                   <p className="text-xs text-gray-500">Expires {method.expiry}</p>
                                </div>
                             </div>
                             {method.isDefault && <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">Default</span>}
                          </div>
                      ))}
                      <button 
                        onClick={() => setIsPaymentModalOpen(true)}
                        className="text-blue-600 font-bold hover:underline text-sm"
                      >
                          + Add New Payment Method
                      </button>
                   </div>
                </div>
             )}

             {/* Footer Actions - only show for tabs with forms */}
             {(activeTab === 'profile' || activeTab === 'preferences' || activeTab === 'notifications') && (
                 <div className="pt-8 mt-8 border-t border-gray-100 flex justify-end items-center">
                    {success && <span className="mr-4 text-green-600 flex items-center text-sm font-medium animate-in fade-in slide-in-from-left-2"><CheckCircle size={16} className="mr-1"/> Settings saved successfully!</span>}
                    <button 
                       onClick={handleSave}
                       disabled={loading}
                       className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20 flex items-center disabled:opacity-70"
                    >
                       {loading && <LoadingSpinner size={18} className="mr-2 text-white" />}
                       Save Changes
                    </button>
                 </div>
             )}
          </div>
       </div>

       {/* Address Modal */}
       {isAddressModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
               <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-in zoom-in-95 duration-200">
                   <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                       <h3 className="text-lg font-bold text-gray-900">Add New Address</h3>
                       <button onClick={() => setIsAddressModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
                   </div>
                   <div className="space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                               <input type="text" placeholder="Home, Office..." className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setNewAddress({...newAddress, label: e.target.value})} />
                           </div>
                           <div>
                               <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                               <select className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white" onChange={(e) => setNewAddress({...newAddress, type: e.target.value as any})}>
                                   <option value="Shipping">Shipping</option>
                                   <option value="Billing">Billing</option>
                               </select>
                           </div>
                       </div>
                       <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                           <input type="text" placeholder="Street address" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setNewAddress({...newAddress, line1: e.target.value})} />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                               <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} />
                           </div>
                           <div>
                               <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                               <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setNewAddress({...newAddress, state: e.target.value})} />
                           </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="block text-sm font-medium text-gray-700 mb-1">Zip/Postal Code</label>
                               <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setNewAddress({...newAddress, zip: e.target.value})} />
                           </div>
                           <div>
                               <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                               <select className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white" onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}>
                                   <option value="USA">United States</option>
                                   <option value="Canada">Canada</option>
                                   <option value="UK">United Kingdom</option>
                                   <option value="Ghana">Ghana</option>
                                   <option value="Nigeria">Nigeria</option>
                                   <option value="South Africa">South Africa</option>
                               </select>
                           </div>
                       </div>
                       <div className="pt-4 flex justify-end gap-3">
                           <button onClick={() => setIsAddressModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
                           <button onClick={handleAddAddress} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Save Address</button>
                       </div>
                   </div>
               </div>
           </div>
       )}

       {/* Payment Modal */}
       {isPaymentModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
               <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                   <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                       <h3 className="text-lg font-bold text-gray-900">Add Payment Method</h3>
                       <button onClick={() => setIsPaymentModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
                   </div>
                   <div className="space-y-4">
                       <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                           <div className="relative">
                               <CreditCard className="absolute left-3 top-2.5 text-gray-400" size={18} />
                               <input type="text" placeholder="0000 0000 0000 0000" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setNewPayment({...newPayment, number: e.target.value})} />
                           </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                               <div className="relative">
                                   <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                   <input type="text" placeholder="MM/YY" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setNewPayment({...newPayment, expiry: e.target.value})} />
                               </div>
                           </div>
                           <div>
                               <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                               <div className="relative">
                                   <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                   <input type="text" placeholder="123" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setNewPayment({...newPayment, cvv: e.target.value})} />
                               </div>
                           </div>
                       </div>
                       <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                           <input type="text" placeholder="Name on card" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setNewPayment({...newPayment, name: e.target.value})} />
                       </div>
                       <div className="pt-4 flex justify-end gap-3">
                           <button onClick={() => setIsPaymentModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
                           <button onClick={handleAddPayment} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Add Card</button>
                       </div>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};

export default Settings;