import React from 'react';
import { User } from '../types';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, CreditCard, Clock } from 'lucide-react';

interface WalletProps {
  user: User;
}

const MOCK_TRANSACTIONS = [
  { id: 1, type: 'DEPOSIT', amount: 5000, date: '2023-10-15', status: 'Completed', method: 'Bank Transfer' },
  { id: 2, type: 'WITHDRAW', amount: 1200, date: '2023-10-10', status: 'Completed', method: 'Wire' },
  { id: 3, type: 'HOLD', amount: 500, date: '2023-10-08', status: 'Active', method: 'Auction Hold #a1' },
  { id: 4, type: 'DEPOSIT', amount: 10000, date: '2023-09-22', status: 'Completed', method: 'Credit Card' },
];

const Wallet: React.FC<WalletProps> = ({ user }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Wallet</h1>
        <p className="text-gray-500">Manage your funds, deposits, and payment methods.</p>
      </div>

      {/* Balance Card */}
      <div className="bg-gray-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
               <p className="text-gray-400 font-medium mb-1 flex items-center gap-2">Total Balance</p>
               <h2 className="text-5xl font-bold mb-2">${user.walletBalance.toLocaleString()}</h2>
               <p className="text-sm text-gray-400">Available for bidding: ${(user.walletBalance - 500).toLocaleString()}</p>
            </div>
            <div className="flex gap-4">
               <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center">
                  <ArrowDownLeft size={20} className="mr-2" /> Deposit
               </button>
               <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center border border-white/10">
                  <ArrowUpRight size={20} className="mr-2" /> Withdraw
               </button>
            </div>
         </div>
         {/* Decor */}
         <div className="absolute -right-10 -bottom-20 text-white opacity-5">
            <WalletIcon size={300} />
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
               <h3 className="font-bold text-gray-900">Recent Transactions</h3>
               <button className="text-sm text-blue-600 hover:underline">Download Statement</button>
            </div>
            <div className="divide-y divide-gray-100">
               {MOCK_TRANSACTIONS.map(tx => (
                  <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                     <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${
                           tx.type === 'DEPOSIT' ? 'bg-green-100 text-green-600' : 
                           tx.type === 'WITHDRAW' ? 'bg-gray-100 text-gray-600' : 'bg-orange-100 text-orange-600'
                        }`}>
                           {tx.type === 'DEPOSIT' ? <ArrowDownLeft size={20} /> : 
                            tx.type === 'WITHDRAW' ? <ArrowUpRight size={20} /> : <Clock size={20} />}
                        </div>
                        <div>
                           <p className="font-bold text-gray-900">{tx.method}</p>
                           <p className="text-xs text-gray-500">{tx.date} • {tx.status}</p>
                        </div>
                     </div>
                     <span className={`font-bold ${tx.type === 'DEPOSIT' ? 'text-green-600' : 'text-gray-900'}`}>
                        {tx.type === 'DEPOSIT' ? '+' : '-'}${tx.amount.toLocaleString()}
                     </span>
                  </div>
               ))}
            </div>
         </div>

         <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
               <h3 className="font-bold text-gray-900 mb-4">Payment Methods</h3>
               <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                     <div className="flex items-center gap-3">
                        <CreditCard size={20} className="text-gray-400" />
                        <span className="text-sm font-medium">•••• 4242</span>
                     </div>
                     <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Default</span>
                  </div>
                  <button className="w-full py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg border border-dashed border-blue-200 transition-colors">
                     + Add Method
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Wallet;