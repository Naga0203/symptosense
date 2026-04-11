import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  Stethoscope, 
  Search, 
  Tablets, 
  LineChart, 
  ChevronRight,
  Plus,
  Activity
} from 'lucide-react';
import Navbar from '../components/landing/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen mesh-gradient overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">AI-Powered Health Intelligence</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold heading-font leading-[1.1] text-white">
              Understand Your <br />
              <span className="text-gradient">Health</span> Before <br />
              It Becomes a <br />
              Problem
            </h1>
            
            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
              Describe your symptoms, get AI-powered analysis across multiple medical systems, 
              and take control of your health data — all in under 30 seconds.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link 
                to="/dashboard" 
                className="group px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all flex items-center gap-2"
              >
                Analyze Symptoms 
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="#how-it-works" 
                className="px-8 py-4 glass-card rounded-xl font-bold text-white hover:bg-slate-800/80"
              >
                Explore How It Works
              </a>
            </div>

            <div className="pt-6 flex flex-wrap gap-8 items-center text-slate-500 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500/60" />
                <span>HIPAA-aware design</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500/60" />
                <span>Results in seconds</span>
              </div>
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-purple-500/60" />
                <span>Doctor-reviewed logic</span>
              </div>
            </div>
          </div>

          <div className="relative animate-in zoom-in fade-in duration-1000 delay-200">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 blur-3xl rounded-full" />
            <div className="relative glass-card p-2 rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="/hero_doctor_smartphone_v2_1775881042609.png" 
                alt="Doctor using SymptoSense" 
                className="w-full h-auto rounded-2xl object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="features" className="py-20 border-y border-slate-800/50 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: 'Assessments', value: '50,000+' },
            { label: 'Accuracy Rate', value: '94%' },
            { label: 'Treatment Systems', value: '6' },
            { label: 'Results', value: '< 30 sec' },
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <div className="text-3xl md:text-5xl font-extrabold heading-font text-white">{stat.value}</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 px-6 bg-slate-900/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-24">
            <span className="text-blue-500 font-bold uppercase tracking-widest text-sm">How It Works</span>
            <h2 className="text-4xl md:text-6xl font-extrabold heading-font text-white">
              Three Simple Steps to <br />
              <span className="text-gradient">Better Health</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg pt-4">
              From symptom input to actionable results — our AI works alongside 
              medical expertise to guide you.
            </p>
          </div>

          <div className="space-y-40">
            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-20 items-center">
              <div className="space-y-6">
                <div className="text-8xl font-black text-slate-800/30 heading-font mb-[-40px]">01</div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Search className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold text-white heading-font">Describe Your Symptoms</h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Use natural language to explain how you're feeling. Our AI understands 
                  context, severity, and duration — no medical jargon required.
                </p>
                <a href="/dashboard" className="inline-flex items-center text-blue-400 font-bold hover:text-blue-300 gap-2">
                  Start Your Analysis <ChevronRight className="w-4 h-4" />
                </a>
              </div>
              <div className="relative glass-card p-2 rounded-3xl group">
                <img 
                  src="/step1_laptop_stethoscope_1775880791113.png" 
                  alt="Step 1" 
                  className="rounded-2xl w-full aspect-video object-cover" 
                />
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-20 items-center">
              <div className="order-2 md:order-1 relative glass-card p-2 rounded-3xl group">
                <img 
                  src="/step2_medical_tech_room_1775880828429.png" 
                  alt="Step 2" 
                  className="rounded-2xl w-full aspect-video object-cover" 
                />
              </div>
              <div className="order-1 md:order-2 space-y-6">
                <div className="text-8xl font-black text-slate-800/30 heading-font mb-[-40px]">02</div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-3xl font-bold text-white heading-font">AI Analyzes Your Data</h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Our multi-model AI engine cross-references your symptoms against medical 
                  databases, clinical guidelines, and holistic treatment frameworks.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-20 items-center">
              <div className="space-y-6">
                <div className="text-8xl font-black text-slate-800/30 heading-font mb-[-40px]">03</div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <LineChart className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-3xl font-bold text-white heading-font">Get Actionable Results</h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Receive clear risk assessments, confidence scores, and treatment 
                  recommendations across Modern Medicine, Ayurveda, Homeopathy, and 
                  Lifestyle changes.
                </p>
                <a href="/login" className="inline-flex items-center text-blue-400 font-bold hover:text-blue-300 gap-2">
                  Create Free Account <ChevronRight className="w-4 h-4" />
                </a>
              </div>
              <div className="relative glass-card p-2 rounded-3xl group">
                <img 
                  src="/step3_surgeons_view_1775880879936.png" 
                  alt="Step 3" 
                  className="rounded-2xl w-full aspect-video object-cover" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="about" className="py-32 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-20">
          <div className="space-y-4">
            <span className="text-blue-500 font-bold uppercase tracking-widest text-sm">Testimonials</span>
            <h2 className="text-4xl md:text-6xl font-extrabold heading-font text-white">
              Trusted by Health <span className="text-gradient">Professionals</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg pt-4">
              See what medical professionals and health-conscious users say about SymptoSense.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                name: 'Dr. Sarah Mitchell', 
                role: 'GP Consultant', 
                content: 'SymptoSense is a game-changer for early triage. The precision in linking symptoms to multiple treatment systems is unprecedented.' 
              },
              { 
                name: 'James Rodriguez', 
                role: 'Health Advocate', 
                content: 'Finally, an AI that speaks my language. I feel more empowered and informed before heading to my doctor appointments.' 
              },
              { 
                name: 'Priya Nair', 
                role: 'Ayurvedic Specialist', 
                content: 'Merging ancient wisdom with modern AI is exactly what the future of integrated healthcare looks like.' 
              },
            ].map((t, i) => (
              <div key={i} className="glass-card p-8 rounded-3xl text-left border-l-4 border-l-blue-500">
                <p className="text-slate-300 italic mb-8">"{t.content}"</p>
                <div>
                  <div className="font-bold text-white">{t.name}</div>
                  <div className="text-sm text-slate-500">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-800/50 bg-[#05080d]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2">
            <Activity className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold heading-font text-white italic">AI Health Intelligence</span>
          </div>
          <p className="text-slate-600 text-sm">© 2026 SymptoSense Intelligence. All rights reserved.</p>
          <div className="flex gap-8 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
