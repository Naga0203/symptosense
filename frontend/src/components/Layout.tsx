import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  const fetchProfile = async () => {
    try {
      const res = await authService.getProfile();
      setProfile(res.data.profile);
    } catch (err) {
      console.error('Layout failed to fetch profile', err);
    }
  };

  useEffect(() => {
    fetchProfile();

    const handleProfileUpdate = () => {
      fetchProfile();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#06080b] font-['Inter']">
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-h-0 overflow-auto relative">
        <header className="h-20 flex items-center justify-between px-8 bg-[#06080b]/80 backdrop-blur-xl sticky top-0 z-10 border-b border-gray-800/30">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800/50 rounded-xl text-white transition-all duration-300 group shadow-lg"
              title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
            >
              <motion.div
                animate={{ rotate: isSidebarOpen ? 0 : 180 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.div>
            </button>
            <div className="h-8 w-[1px] bg-gray-800/50" />
            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
              <span className="opacity-60 text-xs uppercase tracking-widest font-bold">Health Intelligence</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white font-bold whitespace-nowrap overflow-hidden">Workspace Matrix</span>
            </div>
          </div>
          
          <Link to="/profile" className="flex items-center gap-6 group">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors truncate max-w-[120px]">
                {profile?.fullName || 'Identity Pending...'}
              </span>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest opacity-70">Premium Node</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px] shadow-[0_0_15px_rgba(34,211,238,0.3)] group-hover:scale-110 transition-transform flex-shrink-0">
              <div className="w-full h-full rounded-full bg-[#0a0c10] flex items-center justify-center text-white overflow-hidden">
                {profile?.profilePic ? (
                  <img src={profile.profilePic} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
            </div>
          </Link>
        </header>

        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
