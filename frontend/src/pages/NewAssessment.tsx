import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Stethoscope, 
  Upload, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Mic,
  ChevronRight,
  Pill,
  Apple,
  Activity,
  ShieldAlert
} from 'lucide-react';
import { assessmentService } from '../services/api';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type AssessmentMode = 'report' | 'symptoms';

interface AgentResponse {
  agent_name: string;
  model_used: string;
  medical_disclaimer: string;
  [key: string]: any;
}

interface DiagnosisResult {
  prediction: string;
  confidence: number;
  analysis: {
    status: string;
    global_medical_disclaimer: string;
    agents: {
      recommendation: AgentResponse;
      treatment_exploration: AgentResponse;
      clinical_guidelines: AgentResponse;
      lifestyle_and_diet: AgentResponse;
    };
  };
}

const renderAgentData = (data: any): React.ReactNode => {
  if (typeof data === 'string') return data;
  if (Array.isArray(data)) {
    return (
      <ul className="space-y-3 list-none pl-0">
        {data.map((item, i) => (
          <li key={i} className="flex gap-3">
            <span className="text-cyan-400 mt-1">•</span>
            <span>{renderAgentData(item)}</span>
          </li>
        ))}
      </ul>
    );
  }
  if (typeof data === 'object' && data !== null) {
    return (
      <div className="space-y-4">
        {Object.entries(data).map(([key, value]) => {
          if (['agent_name', 'model_used', 'medical_disclaimer', 'disease'].includes(key)) return null;
          return (
            <div key={key} className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 block mb-1">
                {key.replace(/_/g, ' ')}
              </span>
              <div className="text-gray-300">
                {renderAgentData(value)}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  return String(data);
};

export default function NewAssessment() {
  const [mode, setMode] = useState<AssessmentMode>('report');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [symptoms, setSymptoms] = useState('');
  const [reportSymptoms, setReportSymptoms] = useState('');
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setIsUploading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await assessmentService.extractSymptoms(formData);
        if (response.data.warning) {
          setError(response.data.warning);
        }
        setReportSymptoms(response.data.extracted_symptoms);
        setIsUploading(false);
      } catch (err) {
        setError('Failed to process report. Please try manually.');
        setIsUploading(false);
      }
    }
  };

  const handleDiagnose = async () => {
    const combinedSymptoms = [symptoms, reportSymptoms].filter(Boolean).join(', ');
    if (!combinedSymptoms.trim()) {
      setError('Please provide symptoms or upload a report.');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    try {
      const response = await assessmentService.diagnose(combinedSymptoms);
      setResult(response.data);
      setIsUploading(false);
    } catch (err) {
      setError('Diagnosis failed. Please try again.');
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-white tracking-tight">Health Assessment</h1>
        <p className="text-gray-400 text-lg">AI-powered medical analysis and personalized recommendations.</p>
      </div>

      {!result ? (
        <>
          {/* Mode Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => setMode('report')}
              className={cn(
                "relative p-8 rounded-3xl border-2 transition-all duration-300 text-left group",
                mode === 'report' 
                  ? "bg-cyan-500/5 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.1)]" 
                  : "bg-gray-900/40 border-gray-800 hover:border-gray-700"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-4 rounded-2xl",
                  mode === 'report' ? "bg-cyan-500 text-white" : "bg-gray-800 text-gray-400"
                )}>
                  <FileText className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Medical Reports + Symptoms</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">Upload a medical report (PDF/Image) for automated symptom extraction.</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => setMode('symptoms')}
              className={cn(
                "relative p-8 rounded-3xl border-2 transition-all duration-300 text-left group",
                mode === 'symptoms' 
                  ? "bg-cyan-500/5 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.1)]" 
                  : "bg-gray-900/40 border-gray-800 hover:border-gray-700"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-4 rounded-2xl",
                  mode === 'symptoms' ? "bg-cyan-500 text-white" : "bg-gray-800 text-gray-400"
                )}>
                  <Stethoscope className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Symptoms Only</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">Describe your symptoms manually for a quick check-up.</p>
                </div>
              </div>
            </button>
          </div>

          {/* Main Action Area */}
          <div className="bg-gray-900/40 border border-gray-800 rounded-[32px] p-8 space-y-8">
            {mode === 'report' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Upload Medical Report</h3>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 border-2 border-dashed border-gray-800 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 hover:bg-white/5 cursor-pointer transition-all"
                >
                  <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
                  <div className="p-4 bg-gray-800 rounded-full">
                    {isUploading ? <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" /> : <Upload className="w-8 h-8 text-gray-400" />}
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium">Drag and drop files here</p>
                    <p className="text-sm text-gray-500">or click to select files</p>
                  </div>
                </div>
                {file && (
                  <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-2xl border border-gray-700">
                    <FileText className="w-5 h-5 text-cyan-400" />
                    <div className="flex-1 text-sm text-white truncate">{file.name}</div>
                    <button onClick={() => setFile(null)} className="p-1 hover:text-white text-gray-500 transition-colors"><X className="w-4 h-4" /></button>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Describe Your Symptoms</h3>
                <button className="text-cyan-400 p-2 rounded-full bg-cyan-400/10 hover:bg-cyan-400/20 transition-all"><Mic className="w-5 h-5" /></button>
              </div>
              <textarea 
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe your symptoms here (e.g., persistent headache, fatigue for 3 days...)"
                className="w-full bg-black/40 border border-gray-800 rounded-3xl p-6 min-h-[160px] text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none resize-none"
              />
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <button 
              onClick={handleDiagnose}
              disabled={isUploading || (!symptoms.trim() && !reportSymptoms)}
              className="w-full h-16 bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-800 disabled:text-gray-600 text-[#06080b] font-bold rounded-2xl flex items-center justify-center gap-2 transition-all group"
            >
              {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Analyze Condition <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
          {/* Header Summary Card */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-cyan-500/30 rounded-[32px] p-8">
            <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
              <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
                <div className="p-4 bg-cyan-500/20 rounded-full w-fit">
                  <CheckCircle2 className="w-12 h-12 text-cyan-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-cyan-400 font-semibold tracking-wider uppercase text-xs">Primary Analysis</p>
                  <h2 className="text-4xl font-bold text-white capitalize">{result.prediction}</h2>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-4 min-w-[200px]">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-800" />
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364.4} strokeDashoffset={364.4 * (1 - result.confidence)} className="text-cyan-500 transition-all duration-1000" />
                  </svg>
                  <span className="absolute text-2xl font-bold text-white">{(result.confidence * 100).toFixed(0)}%</span>
                </div>
                <p className="text-gray-400 text-sm">Confidence Match</p>
              </div>
            </div>
          </div>

          {/* Global Disclaimer */}
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-500 text-sm flex gap-4">
            <ShieldAlert className="w-6 h-6 flex-shrink-0" />
            <p className="leading-relaxed font-medium">
              {result.analysis.global_medical_disclaimer}
            </p>
          </div>

          {/* Analysis Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* 1. Clinical Insights */}
             <div className="bg-gray-900/40 border border-gray-800 rounded-[32px] p-8 space-y-6 flex flex-col">
                <div className="flex items-center gap-3">
                  <Activity className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">Clinical Insights</h3>
                </div>
                <div className="flex-1 overflow-auto max-h-[400px] pr-2 custom-scrollbar">
                  {renderAgentData(result.analysis.agents.recommendation)}
                </div>
                <div className="pt-4 mt-auto border-t border-gray-800/50">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">{result.analysis.agents.recommendation.agent_name} | {result.analysis.agents.recommendation.model_used}</p>
                </div>
             </div>

             {/* 2. Professional Guidelines */}
             <div className="bg-gray-900/40 border border-gray-800 rounded-[32px] p-8 space-y-6 flex flex-col">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">Professional Guidelines</h3>
                </div>
                <div className="flex-1 overflow-auto max-h-[400px] pr-2 custom-scrollbar">
                  {renderAgentData(result.analysis.agents.clinical_guidelines)}
                </div>
                <div className="pt-4 mt-auto border-t border-gray-800/50">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">{result.analysis.agents.clinical_guidelines.agent_name} | {result.analysis.agents.clinical_guidelines.model_used}</p>
                </div>
             </div>

             {/* 3. Treatment Exploration */}
             <div className="bg-gray-900/40 border border-gray-800 rounded-[32px] p-8 space-y-6 flex flex-col">
                <div className="flex items-center gap-3">
                  <Pill className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">Treatment Exploration</h3>
                </div>
                <div className="flex-1 overflow-auto max-h-[400px] pr-2 custom-scrollbar">
                  {renderAgentData(result.analysis.agents.treatment_exploration)}
                </div>
                <div className="pt-4 mt-auto border-t border-gray-800/50">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">{result.analysis.agents.treatment_exploration.agent_name} | {result.analysis.agents.treatment_exploration.model_used}</p>
                </div>
             </div>

             {/* 4. Lifestyle & Nutrition */}
             <div className="bg-gray-900/40 border border-gray-800 rounded-[32px] p-8 space-y-6 flex flex-col">
                <div className="flex items-center gap-3">
                  <Apple className="w-6 h-6 text-orange-400" />
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">Lifestyle & Nutrition</h3>
                </div>
                <div className="flex-1 overflow-auto max-h-[400px] pr-2 custom-scrollbar">
                  {renderAgentData(result.analysis.agents.lifestyle_and_diet)}
                </div>
                <div className="pt-4 mt-auto border-t border-gray-800/50">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">{result.analysis.agents.lifestyle_and_diet.agent_name} | {result.analysis.agents.lifestyle_and_diet.model_used}</p>
                </div>
             </div>
          </div>

          <button 
            onClick={() => setResult(null)}
            className="w-full h-14 border border-gray-800 hover:bg-white/5 text-gray-400 font-medium rounded-2xl transition-all"
          >
            Start New Assessment
          </button>
        </div>
      )}
    </div>
  );
}
