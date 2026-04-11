import React, { useEffect, useState } from 'react';
import { assessmentService } from '../services/api';
import { 
  History as HistoryIcon, 
  Calendar, 
  ChevronRight, 
  CheckCircle2,
  Clock,
  ExternalLink,
  Search,
  Activity,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../components/common/Loader';

interface AssessmentRecord {
  id: string;
  prediction: string;
  confidence: number;
  symptoms: string;
  timestamp: string;
}

export default function History() {
  const [records, setRecords] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await assessmentService.getHistory();
        setRecords(response.data);
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filtered = records.filter(r => 
    r.prediction.toLowerCase().includes(search.toLowerCase()) ||
    r.symptoms.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="h-[60vh] flex flex-col items-center justify-center gap-6"><Loader /><p className="text-gray-500 font-medium animate-pulse">Retrieving Health History...</p></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 rounded-2xl"><HistoryIcon className="text-purple-400 w-8 h-8" /></div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight heading-font italic">Medical <span className="text-purple-400">Timeline</span></h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl font-medium">Your persistent health discovery log. Every analysis is saved to your secure medical identity.</p>
        </div>

        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search diagnosis or symptoms..."
            className="w-full h-16 bg-gray-900/40 border-2 border-gray-800 rounded-[24px] pl-16 pr-6 text-white focus:border-purple-500/50 outline-none transition-all font-medium text-lg placeholder:text-gray-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((record, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              key={record.id}
              className="group glass-card p-1 rounded-[32px] hover:border-purple-500/30 transition-all duration-500"
            >
              <div className="bg-gray-900/40 rounded-[30px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 h-full">
                <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="w-16 h-16 rounded-2xl bg-black border border-gray-800 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:border-purple-500/50 transition-all">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-gray-500 font-extrabold uppercase tracking-[0.2em]">{new Date(record.timestamp).toLocaleDateString()} @ {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <h3 className="text-2xl font-black text-white group-hover:text-purple-400 transition-colors capitalize">{record.prediction}</h3>
                        <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-emerald-500" />
                            <span className="text-xs font-bold text-gray-400 italic font-mono truncate max-w-[200px] md:max-w-md">"{record.symptoms}"</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-gray-800 pt-6 md:pt-0">
                    <div className="space-y-2 text-right">
                        <div className="flex items-center gap-2 justify-end">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Match Strength</span>
                            <span className="text-white font-black italic text-lg">{(record.confidence * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-40 bg-gray-950 h-1.5 rounded-full overflow-hidden border border-gray-800/50">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${record.confidence * 100}%` }} className="bg-gradient-to-r from-purple-600 to-cyan-400 h-full" />
                        </div>
                    </div>
                    
                    <button className="p-4 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl hover:bg-purple-500 hover:text-white transition-all group-hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                        <ArrowRight className="w-6 h-6" />
                    </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="py-24 text-center space-y-4">
          <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto text-gray-700/50">
            <HistoryIcon className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-white italic">Timeline Clear</h3>
          <p className="text-gray-500 font-medium">No records found matching your search. Perform a new analysis to populate your timeline.</p>
        </div>
      )}
    </div>
  );
}
