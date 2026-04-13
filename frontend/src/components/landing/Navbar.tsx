import { Link } from 'react-router-dom';
import { Activity, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 nav-blur">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-8 h-8 text-blue-500" />
          <span className="text-xl font-bold heading-font tracking-tight text-white italic">AI Health Intelligence</span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">How It Works</a>
          <a href="#about" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">About</a>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600/20 border border-blue-500/30 rounded-full hover:bg-blue-600/40 transition-all duration-300 flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:inline-block px-5 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors border border-slate-700 rounded-full hover:bg-slate-800/50"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
