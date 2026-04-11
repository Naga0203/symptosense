import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  X, 
  CheckCircle2, 
  AlertCircle,
  FileSearch,
  Zap,
  Leaf,
  Apple,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { assessmentService } from '../services/api';
import Loader from '../components/common/Loader';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InsightResult {
  report_summary: any;
  lifestyle_recommendations: any;
  nutrition_advice: any;
  key_metrics_explained: any;
  next_steps: any;
}

export default function ReportAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InsightResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const renderContent = (content: any) => {
    if (!content) return null;
    if (typeof content === 'string') return content;
    if (typeof content === 'object') {
      return (
        <div className="space-y-3">
          {Object.entries(content).map(([key, value]) => (
            <div key={key} className="flex flex-col gap-1 p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{key}</span>
              <span className="text-sm text-gray-300 font-medium">{String(value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return String(content);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await assessmentService.insight(formData);
      setResult(response.data.insights);
    } catch (err) {
      setError('Analysis failed. Please ensure the file is a clear medical report.');
    } finally {
      setLoading(false);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-10 pb-20 max-w-5xl mx-auto">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
            <Zap className="w-3 h-3" />
            AI Intelligence
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight heading-font">Report Analysis</h1>
        <p className="text-gray-500 text-lg font-medium">Deep medical insights and health recommendations powered by clinical AI.</p>
      </div>

      {!result && !loading ? (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-[40px] p-12 text-center space-y-8 border-gray-800/40 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] -mr-32 -mt-32" />
            
            <div 
                onClick={() => fileInputRef.current?.click()}
                className="group relative cursor-pointer"
            >
                <div className="aspect-[16/6] border-2 border-dashed border-gray-800 rounded-[32px] flex flex-col items-center justify-center gap-6 group-hover:bg-white/5 group-hover:border-blue-500/30 transition-all duration-500">
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg" />
                    <div className="w-20 h-20 bg-gray-900 rounded-3xl flex items-center justify-center border border-gray-800 group-hover:scale-110 group-hover:border-blue-500/50 transition-all duration-500">
                        <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-xl font-bold text-white">Click to upload report</p>
                        <p className="text-gray-500 font-medium tracking-wide">PDF, JPEG or PNG formats supported</p>
                    </div>
                </div>
            </div>

            {file && (
                <div className="flex items-center gap-4 p-5 bg-blue-500/5 border border-blue-500/20 rounded-[24px] animate-in slide-in-from-bottom-2 duration-300">
                    <div className="p-3 bg-blue-500/10 rounded-xl">
                        <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1 text-left">
                        <p className="text-sm font-bold text-white truncate">{file.name}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <button onClick={() => setFile(null)} className="p-2 hover:bg-red-500/10 hover:text-red-500 text-gray-500 transition-all rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-medium">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            <button 
                onClick={handleAnalyze}
                disabled={!file}
                className="w-full h-16 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-[24px] font-bold text-lg flex items-center justify-center gap-3 transition-all enabled:shadow-[0_0_20px_rgba(37,99,235,0.3)] group"
            >
                Start AI Analysis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {['OCR Extraction', 'Data Synthesis', 'Wellness Insights', 'Nutrition Advice'].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 justify-center text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        {feature}
                    </div>
                ))}
            </div>
        </motion.div>
      ) : loading ? (
        <div className="glass-card rounded-[40px] p-24 flex flex-col items-center justify-center gap-10 border-gray-800/40">
            <Loader />
            <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-white heading-font">Decrypting Medical Data</h3>
                <div className="flex flex-col gap-2">
                    <p className="text-gray-500 text-sm animate-pulse">Running OCR on document nodes...</p>
                    <p className="text-gray-700 text-[10px] uppercase tracking-[0.3em]">Processing Secure Pipeline</p>
                </div>
            </div>
        </div>
      ) : result && (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
            {/* Summary Banner */}
            <div className="glass-card p-10 rounded-[40px] border-blue-500/30 bg-gradient-to-br from-blue-900/10 to-transparent">
                <div className="flex flex-col md:flex-row gap-10 items-start">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 border border-blue-500/30">
                        <FileSearch className="w-8 h-8 text-blue-400" />
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white heading-font uppercase tracking-tight">Executive Summary</h3>
                        <div className="text-gray-300 leading-relaxed text-lg">{renderContent(result.report_summary)}</div>
                    </div>
                </div>
            </div>

            {/* Insight Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <motion.div variants={itemVariants} className="glass-card p-8 rounded-[32px] space-y-6">
                    <div className="flex items-center gap-3 text-emerald-400">
                        <Leaf className="w-6 h-6" />
                        <h4 className="text-lg font-bold tracking-wide">Lifestyle Support</h4>
                    </div>
                    <div className="text-gray-400 leading-relaxed text-sm">{renderContent(result.lifestyle_recommendations)}</div>
                 </motion.div>

                 <motion.div variants={itemVariants} className="glass-card p-8 rounded-[32px] space-y-6">
                    <div className="flex items-center gap-3 text-orange-400">
                        <Apple className="w-6 h-6" />
                        <h4 className="text-lg font-bold tracking-wide">Nutrition & Diet</h4>
                    </div>
                    <div className="text-gray-400 leading-relaxed text-sm">{renderContent(result.nutrition_advice)}</div>
                 </motion.div>

                 <motion.div variants={itemVariants} className="glass-card p-8 rounded-[32px] space-y-6">
                    <div className="flex items-center gap-3 text-purple-400">
                        <MessageSquare className="w-6 h-6" />
                        <h4 className="text-lg font-bold tracking-wide">Metrics Explained</h4>
                    </div>
                    <div className="text-gray-400 leading-relaxed text-sm">{renderContent(result.key_metrics_explained)}</div>
                 </motion.div>

                 <motion.div variants={itemVariants} className="glass-card p-8 rounded-[32px] space-y-6 border-blue-500/20">
                    <div className="flex items-center gap-3 text-blue-400">
                        <ArrowRight className="w-6 h-6" />
                        <h4 className="text-lg font-bold tracking-wide">Strategic Next Steps</h4>
                    </div>
                    <div className="text-gray-400 leading-relaxed text-sm">{renderContent(result.next_steps)}</div>
                 </motion.div>
            </div>

            <button 
                onClick={() => setResult(null)}
                className="w-full py-4 border border-gray-800 rounded-2xl text-gray-500 font-bold hover:bg-white/5 transition-all text-sm uppercase tracking-widest"
            >
                Upload Another Report
            </button>
        </div>
      )}
    </div>
  );
}
