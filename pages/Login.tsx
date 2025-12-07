import React, { useState } from 'react';
import { Gavel, User as UserIcon, Shield, Lock, AlertCircle } from 'lucide-react';
import { User } from '../types';
import { MOCK_REGULAR_USER, MOCK_ADMIN, MOCK_SUPER_ADMIN } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Hardcoded credentials logic
    if (email === 'user' && password === 'user') {
      onLogin(MOCK_REGULAR_USER);
    } else if (email === 'admin' && password === 'admin') {
      onLogin(MOCK_ADMIN);
    } else if (email === 'super_admin' && password === 'super_admin') {
      onLogin(MOCK_SUPER_ADMIN);
    } else {
      // Allow regular email entry for demo purposes if it matches the mock email, otherwise default to a generic regular user session for testing
      if (email.includes('@')) {
         onLogin({ ...MOCK_REGULAR_USER, email });
      } else {
         setError("Invalid credentials. Try 'user/user', 'admin/admin', or 'super_admin/super_admin'");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Brand & Info */}
        <div className="bg-gray-900 md:w-5/12 p-12 text-white flex flex-col justify-between relative overflow-hidden">
           <div className="absolute inset-0 z-0 opacity-20">
              <img src="https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" />
           </div>
           
           <div className="relative z-10">
              <div className="inline-flex items-center space-x-2 mb-8">
                <div className="bg-blue-600 p-2 rounded-lg">
                    <Gavel className="text-white" size={24} />
                </div>
                <span className="text-2xl font-bold">Autobid</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
              <p className="text-gray-400 leading-relaxed">
                 Access the world's most exclusive marketplace for luxury assets. Secure, transparent, and built for professionals.
              </p>
           </div>
           
           <div className="relative z-10 mt-12">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Trusted By</p>
              <div className="flex space-x-4 opacity-50">
                 <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                 <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                 <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                 <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
              </div>
           </div>
        </div>

        {/* Right Side: Login Forms */}
        <div className="md:w-7/12 p-8 md:p-12">
           <div className="text-center md:text-left mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Sign in to your account</h3>
              <p className="text-gray-500 mt-1">Enter your credentials to access the dashboard.</p>
           </div>

           {error && (
             <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center">
               <AlertCircle size={16} className="mr-2" />
               {error}
             </div>
           )}
        
           <form onSubmit={handleCustomLogin} className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Username or Email</label>
               <input 
                 type="text"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                 placeholder="Username"
               />
             </div>
             
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
               <input 
                 type="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                 placeholder="Password"
               />
             </div>

             <button 
               type="submit"
               className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition-colors"
             >
               Sign In
             </button>
           </form>

           <div className="mt-8 text-center bg-blue-50 p-4 rounded-xl border border-blue-100">
             <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-2">Demo Credentials</p>
             <div className="flex justify-center gap-4 text-xs text-gray-600">
                <div>
                   <span className="font-bold">User:</span> user / user
                </div>
                <div>
                   <span className="font-bold">Admin:</span> admin / admin
                </div>
                <div>
                   <span className="font-bold">Super:</span> super_admin / super_admin
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;