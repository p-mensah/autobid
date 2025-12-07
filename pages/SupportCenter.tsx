import React, { useState } from 'react';
import { User } from '../types';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Send, 
  LifeBuoy, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  X, 
  MoreHorizontal,
  Paperclip,
  Smile,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

interface SupportProps {
  user: User;
}

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  lastUpdate: string;
  createdAt: string;
  messages: { 
    id: string;
    sender: 'user' | 'agent' | 'system'; 
    name: string;
    text: string; 
    time: string;
    attachments?: string[];
  }[];
}

const MOCK_TICKETS: SupportTicket[] = [
  {
    id: 'T-1023',
    subject: 'Question about deposit refund',
    category: 'Billing',
    status: 'RESOLVED',
    priority: 'MEDIUM',
    lastUpdate: '2023-10-15',
    createdAt: '2023-10-12',
    messages: [
        { id: 'm1', sender: 'user', name: 'Jane Buyer', text: 'Hi, I requested a refund for my deposit 3 days ago but haven\'t seen it yet.', time: '10:00 AM, Oct 12' },
        { id: 'm2', sender: 'agent', name: 'Support Team', text: 'Hello Jane, your refund was processed yesterday. It typically takes 2-3 business days to appear on your statement depending on your bank.', time: '10:30 AM, Oct 13' },
        { id: 'm3', sender: 'system', name: 'System', text: 'Ticket marked as Resolved by Agent.', time: '10:35 AM, Oct 15' }
    ]
  },
  {
    id: 'T-1045',
    subject: 'Cannot upload images to listing',
    category: 'Technical',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    lastUpdate: '2023-10-26',
    createdAt: '2023-10-26',
    messages: [
        { id: 'm1', sender: 'user', name: 'Jane Buyer', text: 'I keep getting an error "File too large" even though my images are under 5MB.', time: '2:00 PM, Today' },
        { id: 'm2', sender: 'agent', name: 'Tech Support', text: 'Thanks for reporting this. Can you specify which browser you are using?', time: '2:15 PM, Today' }
    ]
  },
  {
    id: 'T-1050',
    subject: 'Dispute with Seller #s5',
    category: 'Complaint',
    status: 'OPEN',
    priority: 'HIGH',
    lastUpdate: 'Just now',
    createdAt: '2023-10-27',
    messages: [
        { id: 'm1', sender: 'user', name: 'Jane Buyer', text: 'The vehicle mileage was misrepresented. It has 50k miles, not 40k as listed.', time: '9:00 AM, Today' }
    ]
  }
];

const SupportCenter: React.FC<SupportProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'chat'>('tickets');
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_TICKETS);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  
  // New Ticket Form State
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketCategory, setNewTicketCategory] = useState('General');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  const [newTicketPriority, setNewTicketPriority] = useState('LOW');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  // Chat Input State
  const [chatInput, setChatInput] = useState('');

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  const handleCreateTicket = (e: React.FormEvent) => {
      e.preventDefault();
      const newTicket: SupportTicket = {
          id: `T-${Math.floor(Math.random() * 10000)}`,
          subject: newTicketSubject,
          category: newTicketCategory,
          status: 'OPEN',
          priority: newTicketPriority as any,
          lastUpdate: 'Just now',
          createdAt: new Date().toLocaleDateString(),
          messages: [
              { 
                  id: `m${Date.now()}`, 
                  sender: 'user', 
                  name: user.name, 
                  text: newTicketMessage + (attachedFile ? `\n[Attachment: ${attachedFile.name}]` : ''), 
                  time: 'Just now',
                  attachments: attachedFile ? [attachedFile.name] : undefined
              }
          ]
      };
      
      setTickets([newTicket, ...tickets]);
      setIsNewTicketModalOpen(false);
      setNewTicketSubject('');
      setNewTicketMessage('');
      setNewTicketCategory('General');
      setAttachedFile(null);
      
      // Auto select the new ticket
      setSelectedTicketId(newTicket.id);
  };

  const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (!chatInput.trim() || !selectedTicketId) return;

      const newMessage = {
          id: `m${Date.now()}`,
          sender: 'user' as const,
          name: user.name,
          text: chatInput,
          time: 'Just now'
      };

      setTickets(tickets.map(t => {
          if (t.id === selectedTicketId) {
              return {
                  ...t,
                  messages: [...t.messages, newMessage],
                  lastUpdate: 'Just now',
                  status: t.status === 'RESOLVED' ? 'OPEN' : t.status // Re-open if user replies
              };
          }
          return t;
      }));

      setChatInput('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setAttachedFile(e.target.files[0]);
      }
  };

  const getStatusColor = (status: string) => {
      switch (status) {
          case 'OPEN': return 'bg-blue-100 text-blue-700 border-blue-200';
          case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
          case 'RESOLVED': return 'bg-green-100 text-green-700 border-green-200';
          case 'CLOSED': return 'bg-gray-100 text-gray-700 border-gray-200';
          default: return 'bg-gray-100 text-gray-700';
      }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
           <p className="text-gray-500 text-sm">Manage your tickets and get help.</p>
        </div>
        <button 
            onClick={() => setIsNewTicketModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-blue-700 flex items-center transition-colors"
        >
            <Plus size={18} className="mr-2" /> New Ticket
        </button>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex">
          {/* Sidebar List */}
          <div className={`${selectedTicketId ? 'hidden md:flex' : 'flex'} w-full md:w-80 border-r border-gray-200 flex-col`}>
              <div className="p-4 border-b border-gray-200">
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                          type="text" 
                          placeholder="Search tickets..." 
                          className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                  </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                  {tickets.map(ticket => (
                      <div 
                          key={ticket.id}
                          onClick={() => setSelectedTicketId(ticket.id)}
                          className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedTicketId === ticket.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'border-l-4 border-l-transparent'}`}
                      >
                          <div className="flex justify-between items-start mb-1">
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getStatusColor(ticket.status)}`}>
                                  {ticket.status.replace('_', ' ')}
                              </span>
                              <span className="text-xs text-gray-400">{ticket.lastUpdate}</span>
                          </div>
                          <h4 className={`font-bold text-sm mb-1 line-clamp-1 ${selectedTicketId === ticket.id ? 'text-blue-900' : 'text-gray-900'}`}>
                              {ticket.subject}
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-2">
                              {ticket.messages[ticket.messages.length - 1].text}
                          </p>
                      </div>
                  ))}
              </div>
          </div>

          {/* Ticket Detail / Chat Area */}
          <div className={`${!selectedTicketId ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-gray-50/50`}>
              {selectedTicket ? (
                  <>
                      {/* Chat Header */}
                      <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center shadow-sm">
                          <div className="flex items-center overflow-hidden">
                              <button 
                                  onClick={() => setSelectedTicketId(null)}
                                  className="md:hidden mr-3 text-gray-500 hover:text-gray-900"
                              >
                                  <ChevronRight size={24} className="rotate-180"/>
                              </button>
                              <div>
                                  <h3 className="font-bold text-gray-900 truncate flex items-center gap-2">
                                      {selectedTicket.subject}
                                      <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">#{selectedTicket.id}</span>
                                  </h3>
                                  <div className="flex items-center text-xs text-gray-500 mt-0.5 space-x-3">
                                      <span className="flex items-center"><LifeBuoy size={12} className="mr-1"/> {selectedTicket.category}</span>
                                      <span className="flex items-center"><Clock size={12} className="mr-1"/> Created {selectedTicket.createdAt}</span>
                                  </div>
                              </div>
                          </div>
                          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                              <MoreHorizontal size={20} />
                          </button>
                      </div>

                      {/* Chat Messages */}
                      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
                          {selectedTicket.messages.map(msg => (
                              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                  {msg.sender !== 'user' && (
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mr-3 ${msg.sender === 'system' ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-600'}`}>
                                          {msg.sender === 'system' ? <AlertCircle size={16} /> : <LifeBuoy size={16} />}
                                      </div>
                                  )}
                                  <div className={`max-w-[80%] md:max-w-[70%] space-y-1`}>
                                      <div className={`p-4 rounded-2xl shadow-sm text-sm ${
                                          msg.sender === 'user' 
                                              ? 'bg-blue-600 text-white rounded-br-none' 
                                              : msg.sender === 'system' 
                                                  ? 'bg-gray-200 text-gray-600 text-center italic rounded-lg' 
                                                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                      }`}>
                                          {msg.text}
                                          {msg.attachments && msg.attachments.length > 0 && (
                                              <div className="mt-2 pt-2 border-t border-white/20 flex items-center">
                                                  <FileText size={14} className="mr-1"/>
                                                  <span className="italic opacity-80">{msg.attachments[0]}</span>
                                              </div>
                                          )}
                                      </div>
                                      {msg.sender !== 'system' && (
                                          <p className={`text-[10px] text-gray-400 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                              {msg.name} • {msg.time}
                                          </p>
                                      )}
                                  </div>
                              </div>
                          ))}
                      </div>

                      {/* Chat Input */}
                      {selectedTicket.status !== 'CLOSED' && (
                          <div className="p-4 bg-white border-t border-gray-200">
                              <form onSubmit={handleSendMessage} className="flex gap-2">
                                  <button type="button" className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                                      <Paperclip size={20} />
                                  </button>
                                  <input 
                                      type="text" 
                                      value={chatInput}
                                      onChange={(e) => setChatInput(e.target.value)}
                                      placeholder="Type your reply..."
                                      className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                  />
                                  <button 
                                      type="submit" 
                                      disabled={!chatInput.trim()}
                                      className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                      <Send size={20} />
                                  </button>
                              </form>
                          </div>
                      )}
                  </>
              ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <MessageSquare size={40} className="opacity-50" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Select a Ticket</h3>
                      <p className="max-w-xs">Choose a ticket from the sidebar to view the conversation or create a new one.</p>
                  </div>
              )}
          </div>
      </div>

      {/* Create Ticket Modal */}
      {isNewTicketModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
                  <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-blue-50">
                      <h3 className="font-bold text-blue-900 text-lg flex items-center">
                          <Plus size={20} className="mr-2" /> Create New Ticket
                      </h3>
                      <button onClick={() => setIsNewTicketModalOpen(false)} className="text-blue-700 hover:text-blue-900">
                          <X size={24} />
                      </button>
                  </div>
                  <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
                          <input 
                              type="text" 
                              required
                              value={newTicketSubject}
                              onChange={(e) => setNewTicketSubject(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                              placeholder="Brief summary of the issue"
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                              <select 
                                  value={newTicketCategory}
                                  onChange={(e) => setNewTicketCategory(e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                              >
                                  <option value="General">General Inquiry</option>
                                  <option value="Billing">Billing & Refunds</option>
                                  <option value="Technical">Technical Issue</option>
                                  <option value="Complaint">Complaint / Report</option>
                                  <option value="Verification">Account Verification</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-sm font-bold text-gray-700 mb-1">Priority</label>
                              <select 
                                  value={newTicketPriority}
                                  onChange={(e) => setNewTicketPriority(e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                              >
                                  <option value="LOW">Low</option>
                                  <option value="MEDIUM">Medium</option>
                                  <option value="HIGH">High</option>
                              </select>
                          </div>
                      </div>
                      
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                          <textarea 
                              required
                              rows={5}
                              value={newTicketMessage}
                              onChange={(e) => setNewTicketMessage(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                              placeholder="Please describe your issue in detail..."
                          />
                      </div>

                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Attachments</label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors relative cursor-pointer">
                              <input 
                                  type="file" 
                                  accept=".jpg,.png,.pdf,.docx" 
                                  onChange={handleFileChange}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <div className="flex flex-col items-center justify-center text-gray-500">
                                  {attachedFile ? (
                                      <div className="flex items-center text-blue-600 font-medium">
                                          <CheckCircle size={18} className="mr-2"/>
                                          {attachedFile.name}
                                      </div>
                                  ) : (
                                      <>
                                          <div className="bg-gray-100 p-2 rounded-full mb-2">
                                              <ImageIcon size={20} />
                                          </div>
                                          <span className="text-sm">Click to upload (Images, PDF, DOCX)</span>
                                      </>
                                  )}
                              </div>
                          </div>
                      </div>

                      <div className="flex justify-end pt-4 gap-3">
                          <button 
                              type="button"
                              onClick={() => setIsNewTicketModalOpen(false)}
                              className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
                          >
                              Cancel
                          </button>
                          <button 
                              type="submit"
                              className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md"
                          >
                              Submit Ticket
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default SupportCenter;