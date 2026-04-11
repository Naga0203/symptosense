import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  TrendingUp, 
  Flame, 
  FileCheck, 
  Plus, 
  ChevronRight, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Clock,
  LayoutDashboard
} from 'lucide-react';
import { assessmentService, authService } from '../services/api';
import Loader from '../components/common/Loader';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyRes, profileRes] = await Promise.allSettled([
          assessmentService.getHistory(),
          authService.getProfile()
        ]);

        if (historyRes.status === 'fulfilled') {
          setHistory(historyRes.value.data);
        } else {
          console.error('Dashboard failed to fetch history', historyRes.reason);
        }

        if (profileRes.status === 'fulfilled') {
          setProfile(profileRes.value.data.profile);
        } else {
          console.error('Dashboard failed to fetch profile', profileRes.reason);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { 
      label: 'Assessments', 
      value: history.length.toString(), 
      subValue: 'Lifetime Total', 
      icon: FileCheck, 
      color: 'text-blue-400', 
      bg: 'bg-blue-400/10' 
    },
    { 
      label: 'AI Confidence', 
      value: history.length > 0 
        ? (history.reduce((acc, h) => acc + h.confidence, 0) / history.length * 100).toFixed(0) + '%' 
        : '0%', 
      subValue: 'Average Accuracy', 
      icon: ShieldCheck, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-400/10' 
    },
    { 
      label: 'Reports Sync', 
      value: history.filter(h => h.analysis).length.toString(), 
      subValue: 'Deep Analysis', 
      icon: Zap, 
      color: 'text-orange-400', 
      bg: 'bg-orange-400/10' 
    },
    { 
      label: 'Health Passport', 
      value: profile?.bloodGroup || 'Pending', 
      subValue: profile?.fullName?.split(' ')[0] || 'Guest', 
      icon: Activity, 
      color: 'text-purple-400', 
      bg: 'bg-purple-400/10' 
    },
  ];

  if (loading) return <div className="h-[60vh] flex flex-col items-center justify-center gap-6"><Loader /><p className="text-gray-500 font-medium animate-pulse uppercase tracking-[0.2em]">Syncing Medical Node...</p></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl"><LayoutDashboard className="text-blue-400 w-8 h-8" /></div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight heading-font italic">Command <span className="text-blue-500">Center</span></h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl font-medium">
            Welcome back, <span className="text-white font-black italic">{profile?.fullName || 'Health Explorer'}</span>. 
            Your AI health intelligence is operational.
          </p>
        </div>
        
        <Link 
          to="/assessment"
          className="h-16 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all shadow-[0_0_30px_rgba(37,99,235,0.2)] active:scale-95 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Initialize Analysis
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="group glass-card p-8 rounded-[40px] hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-500/10 transition-colors" />
            <div className="flex items-center justify-between mb-8">
              <div className={cn("p-4 rounded-3xl transition-transform group-hover:scale-110 duration-500", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-500 opacity-50" />
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl font-black text-white tracking-tighter">{stat.value}</h3>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{stat.label}</p>
              <p className="text-[10px] text-gray-600 font-bold italic">{stat.subValue}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table Section */}
        <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-[40px] overflow-hidden border-gray-800/40">
                <div className="p-10 flex items-center justify-between border-b border-gray-800/40">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center"><Clock className="text-blue-400 w-6 h-6" /></div>
                        <div>
                            <h3 className="text-xl font-black text-white heading-font italic">Recent Activity</h3>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Latest Diagnostic Logs</p>
                        </div>
                    </div>
                    <Link to="/history" className="p-4 bg-gray-900 border border-gray-800 rounded-2xl group hover:border-blue-500/30 transition-all">
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </Link>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-black/20">
                                <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Identity</th>
                                <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Timeline</th>
                                <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Confidence</th>
                                <th className="px-10 py-6 text-center text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Detail</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/30 font-medium">
                            {history.slice(0, 5).map((h, i) => (
                                <tr key={i} className="group hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => navigate('/history')}>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-blue-400 group-hover:border-blue-500/50 transition-all"><ShieldCheck className="w-5 h-5" /></div>
                                            <span className="text-white font-black capitalize">{h.prediction}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-xs text-gray-500 font-bold whitespace-nowrap">{new Date(h.timestamp).toLocaleDateString()}</td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-1.5 bg-gray-950 rounded-full border border-gray-800/50 overflow-hidden min-w-[100px]">
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${h.confidence * 100}%` }} className="h-full bg-gradient-to-r from-blue-600 to-cyan-400" />
                                            </div>
                                            <span className="text-xs font-black text-white">{(h.confidence * 100).toFixed(0)}%</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex justify-center">
                                            <div className="p-3 bg-gray-950 border border-gray-800 rounded-xl group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all"><ExternalLink className="w-4 h-4" /></div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {history.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-10 py-32 text-center">
                                        <div className="space-y-4 opacity-30">
                                            <FileCheck className="w-16 h-16 mx-auto text-gray-500" />
                                            <p className="text-xl font-black text-white italic capitalize">No assessments yet</p>
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Perform your first analysis to see data here</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Sidebar Section */}
        <div className="space-y-8">
            <div className="glass-card rounded-[40px] p-10 space-y-10 relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 blur-[100px] pointer-events-none" />
                <div className="flex items-center justify-between relative">
                    <h3 className="text-xl font-black text-white heading-font italic">Medical <span className="text-cyan-400">Node</span></h3>
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                    </div>
                </div>

                <div className="space-y-6 relative">
                    <QuickAction label="Analyze Reports" icon={Zap} desc="Deep OCR extraction & AI summary" to="/report-analysis" color="text-orange-400" bg="bg-orange-500/10" />
                    <QuickAction label="Health Identity" icon={Activity} desc="Review clinical bio-markers" to="/profile" color="text-purple-400" bg="bg-purple-500/10" />
                    <QuickAction label="Diseases Grid" icon={ShieldCheck} desc="Search medical condition library" to="/diseases" color="text-blue-400" bg="bg-blue-500/10" />
                </div>

                <div className="p-8 bg-gradient-to-br from-blue-600/20 to-indigo-700/20 border border-blue-500/30 rounded-[32px] space-y-4 relative group hover:scale-[1.02] transition-transform">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-2xl flex items-center justify-center shadow-inner"><Activity className="w-5 h-5 text-blue-400" /></div>
                        <p className="text-xs font-black text-white uppercase tracking-tighter">AI Pulse Monitor</p>
                    </div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black leading-relaxed">System ready for biometric data ingestion. High precision mode enabled.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ label, icon: Icon, desc, to, color, bg }: any) {
    return (
        <Link to={to} className="flex items-center gap-4 p-5 rounded-3xl border border-gray-800/50 hover:border-blue-500/30 hover:bg-white/[0.02] transition-all group">
            <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110", bg)}><Icon className={cn("w-5 h-5", color)} /></div>
            <div className="space-y-0.5">
                <h4 className="text-sm font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{label}</h4>
                <p className="text-[10px] text-gray-600 font-bold italic line-clamp-1">{desc}</p>
            </div>
        </Link>
    );
}
