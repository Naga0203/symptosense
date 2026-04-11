import React, { useEffect, useState } from 'react';
import { 
  Stethoscope, 
  Search,
  Activity,
  ArrowRight,
  Info,
  ShieldAlert
} from 'lucide-react';
import { assessmentService } from '../services/api';
import Loader from '../components/common/Loader';
import { motion, AnimatePresence } from 'framer-motion';

export default function Diseases() {
  const [diseases, setDiseases] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const response = await assessmentService.getDiseases();
        setDiseases(response.data.diseases);
      } catch (err) {
        console.error('Failed to fetch diseases', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDiseases();
  }, []);

  const filteredDiseases = diseases.filter(d => 
    d.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
        <Loader />
        <p className="text-gray-500 font-medium animate-pulse">Accessing Medical Database...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/10 rounded-2xl">
              <Stethoscope className="text-cyan-400 w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight heading-font italic">
              Health Intelligence <span className="text-cyan-400">Database</span>
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl font-medium">
            Browse our comprehensive database of conditions analyzed and recognized by our AI diagnostic engine.
          </p>
        </div>

        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search symptoms or conditions..."
            className="w-full h-16 bg-gray-900/40 border-2 border-gray-800 rounded-[24px] pl-16 pr-6 text-white focus:border-cyan-500/50 outline-none transition-all font-medium text-lg placeholder:text-gray-600"
          />
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-[32px] flex items-start gap-4">
        <div className="p-2 bg-blue-500/20 rounded-xl">
          <Info className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h4 className="text-white font-bold text-sm">Supported Conditions</h4>
          <p className="text-gray-400 text-sm leading-relaxed mt-1">
            Our AI engine currently identifies <span className="text-cyan-400 font-bold">{diseases.length}</span> unique medical conditions based on symptom patterns. 
            Click on any condition to learn more about common symptoms and nutritional recommendations.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredDiseases.map((disease, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.02 }}
              key={disease}
              className="group cursor-pointer"
            >
              <div className="glass-card h-full p-6 rounded-[32px] border-gray-800/40 hover:border-cyan-500/40 transition-all duration-500 hover:shadow-[0_0_30px_rgba(34,211,238,0.05)] relative overflow-hidden flex flex-col justify-between min-h-[160px]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-transparent blur-2xl -translate-y-12 translate-x-12 group-hover:bg-cyan-500/20 transition-all duration-700" />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                      <Activity className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white capitalize line-clamp-2 leading-tight group-hover:text-cyan-400 transition-colors">
                      {disease}
                    </h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mt-2">Analyzable</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-cyan-400/0 group-hover:text-cyan-400 transition-all duration-500">
                  <span className="text-xs font-bold">View Diagnostic Info</span>
                  <ArrowRight className="w-4 h-4 translate-x-4 group-hover:translate-x-0 transition-all" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredDiseases.length === 0 && (
        <div className="py-32 text-center space-y-6 glass-card rounded-[40px] border-dashed border-gray-800">
          <div className="w-24 h-24 bg-gray-900/50 rounded-full flex items-center justify-center mx-auto text-gray-700 border border-gray-800">
            <Search className="w-10 h-10 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white italic">
              {loading ? "Synchronizing Database..." : (search ? "No matches found" : "Database Synchronizing")}
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto font-medium">
              {loading 
                ? "Connecting to the AI Health Intelligence nodes..." 
                : (search 
                    ? `We couldn't find any condition matching "${search}" in our diagnostic matrix.` 
                    : "The medical database is currently being populated. If this persists, please ensure the backend server is active.")}
            </p>
          </div>
          {!loading && !search && (
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-blue-600/10 border border-blue-500/30 text-blue-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600/20 transition-all"
            >
              Retry Connection
            </button>
          )}
        </div>
      )}

      {/* Warning */}
      <div className="p-8 bg-red-500/5 border border-red-500/10 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-2xl">
            <ShieldAlert className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-red-500/80 text-sm font-medium leading-relaxed max-w-2xl">
            <span className="font-bold text-red-500">Medical Disclaimer:</span> This database is for educational and informational purposes only. AI diagnostics should never replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician.
          </p>
        </div>
        <button className="whitespace-nowrap px-6 py-3 border border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-xl text-xs font-bold transition-all">
          Read Full Disclaimer
        </button>
      </div>
    </div>
  );
}
