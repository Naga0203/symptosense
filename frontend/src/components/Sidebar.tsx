import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FilePlus, 
  History, 
  Stethoscope, 
  UserCircle,
  Activity,
  LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const { profile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FilePlus, label: 'New Assessment', path: '/assessment' },
    { icon: Stethoscope, label: 'Diseases Library', path: '/diseases' },
    { icon: Activity, label: 'Reports Analysis', path: '/report-analysis' },
    { icon: History, label: 'History', path: '/history' },
    { icon: UserCircle, label: 'Profile', path: '/profile' },
  ];

  const getInitials = (name: string) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <aside className={cn(
      "bg-[#0a0c10] border-r border-gray-800/50 flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out z-20 overflow-hidden",
      isOpen ? "w-64" : "w-0 -translate-x-full"
    )}>
      <div className="p-6 flex items-center gap-3">
        <div className="p-1 rounded-lg">
          <img src="/logo.svg" alt="SymptoSense Logo" className="w-9 h-9 shadow-[0_0_15px_rgba(34,211,238,0.2)]" />
        </div>
        <h1 className="font-bold text-base text-white tracking-tight leading-tight whitespace-nowrap heading-font">
          SymptoSense <br /> 
          <span className="text-cyan-400/80 text-[10px] font-medium uppercase tracking-[0.1em]">AI Health Intelligence</span>
        </h1>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
              isActive 
                ? "text-white" 
                : "text-gray-400 hover:text-white"
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="nav-glow"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent border-l-4 border-blue-500 shadow-[inset_10px_0_30px_rgba(37,99,235,0.1)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <item.icon className={cn(
                  "w-5 h-5 transition-all duration-300 relative z-10",
                  isActive ? "text-blue-400 scale-110" : "group-hover:text-white"
                )} />
                <span className="font-medium relative z-10 whitespace-nowrap">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 text-gray-400 hover:text-red-400 hover:bg-red-400/5 group"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
      </nav>

      <NavLink 
        to="/profile"
        className={cn(
          "p-4 border-t border-gray-800/50 mt-auto bg-black/20 hover:bg-white/5 transition-colors group block",
          location.pathname === '/profile' && "bg-white/10"
        )}
      >
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center text-cyan-400 font-bold overflow-hidden shadow-inner group-hover:border-cyan-500/50 transition-colors">
            {profile?.profilePic ? (
                <img src={profile.profilePic} alt="" className="w-full h-full object-cover" />
            ) : (
                <span className="text-xs">{getInitials(profile?.fullName || 'Guest User')}</span>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-white truncate group-hover:text-cyan-400 transition-colors">
                {profile?.fullName || 'Health Explorer'}
            </p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Premium Node</p>
          </div>
        </div>
      </NavLink>
    </aside>
  );
}
