import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/landing/Navbar';
import {
  LANDING_STATS,
  TESTIMONIALS,
  APP_COPYRIGHT,
} from '../constants';

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen mesh-gradient overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">AI-Powered Health Intelligence</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold heading-font leading-[1.1] text-white">
              Understand Your <br />
              <span className="text-gradient">Health</span> Before <br />
              It Becomes a <br />
              Problem
            </h1>
            
            <p className="text-base text-slate-400 max-w-xl leading-relaxed">
              Describe your symptoms, get AI-powered analysis across multiple medical systems, 
              and take control of your health data — all in under 30 seconds.
            </p>

            <div className="flex flex-wrap gap-4">
              {user ? (
                <Link 
                  to="/dashboard" 
                  className="group px-7 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all flex items-center gap-2"
                >
                  Analyze Symptoms 
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link 
                    to="/register" 
                    className="group px-7 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all flex items-center gap-2"
                  >
                    Create Account
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    to="/login" 
                    className="px-7 py-3.5 glass-card rounded-xl font-bold text-sm text-white hover:bg-slate-800/80"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            <div className="pt-4 flex flex-wrap gap-8 items-center text-slate-500 text-xs">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500/60" />
                <span>HIPAA-aware design</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500/60" />
                <span>Results in seconds</span>
              </div>
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-purple-500/60" />
                <span>Doctor-reviewed logic</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 blur-3xl rounded-full" />
            <div className="relative glow-card p-2 rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="/hero_doctor_smartphone_v2_1775881042609.png" 
                alt="Doctor using SymptoSense" 
                className="w-full h-auto rounded-2xl object-cover aspect-[4/3]"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="features" className="py-16 border-y border-slate-800/50 bg-slate-900/20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center"
        >
          {LANDING_STATS.map((stat, i) => (
            <motion.div key={i} variants={fadeInUp} className="space-y-2">
              <div className="text-2xl md:text-4xl font-extrabold heading-font text-white">{stat.value}</div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-28 px-6 bg-slate-900/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-20"
          >
            <span className="text-blue-500 font-bold uppercase tracking-widest text-xs">How It Works</span>
            <h2 className="text-3xl md:text-5xl font-extrabold heading-font text-white">
              Three Simple Steps to <br />
              <span className="text-gradient">Better Health</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-base pt-3">
              From symptom input to actionable results — our AI works alongside 
              medical expertise to guide you.
            </p>
          </motion.div>

          <div className="space-y-32">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-16 items-center"
            >
              <div className="space-y-5">
                <div className="text-7xl font-black text-slate-800/30 heading-font mb-[-36px]">01</div>
                <div className="w-11 h-11 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Search className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white heading-font">Describe Your Symptoms</h3>
                <p className="text-slate-400 text-base leading-relaxed">
                  Use natural language to explain how you're feeling. Our AI understands 
                  context, severity, and duration — no medical jargon required.
                </p>
                {user ? (
                  <Link to="/dashboard" className="inline-flex items-center text-blue-400 font-bold text-sm hover:text-blue-300 gap-2">
                    Start Your Analysis <ChevronRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link to="/login" className="inline-flex items-center text-blue-400 font-bold text-sm hover:text-blue-300 gap-2">
                    Sign In to Start <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
              <div className="relative glow-card p-2 rounded-3xl group">
                <img 
                  src="/step1_laptop_stethoscope_1775880791113.png" 
                  alt="Step 1" 
                  className="rounded-2xl w-full aspect-video object-cover" 
                />
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-16 items-center"
            >
              <div className="order-2 md:order-1 relative glow-card p-2 rounded-3xl group">
                <img 
                  src="/step2_medical_tech_room_1775880828429.png" 
                  alt="Step 2" 
                  className="rounded-2xl w-full aspect-video object-cover" 
                />
              </div>
              <div className="order-1 md:order-2 space-y-5">
                <div className="text-7xl font-black text-slate-800/30 heading-font mb-[-36px]">02</div>
                <div className="w-11 h-11 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white heading-font">AI Analyzes Your Data</h3>
                <p className="text-slate-400 text-base leading-relaxed">
                  Our multi-model AI engine cross-references your symptoms against medical 
                  databases, clinical guidelines, and holistic treatment frameworks.
                </p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-16 items-center"
            >
              <div className="space-y-5">
                <div className="text-7xl font-black text-slate-800/30 heading-font mb-[-36px]">03</div>
                <div className="w-11 h-11 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <LineChart className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-white heading-font">Get Actionable Results</h3>
                <p className="text-slate-400 text-base leading-relaxed">
                  Receive clear risk assessments, confidence scores, and treatment 
                  recommendations across Modern Medicine, Ayurveda, Homeopathy, and 
                  Lifestyle changes.
                </p>
                <a href="/login" className="inline-flex items-center text-blue-400 font-bold text-sm hover:text-blue-300 gap-2">
                  Create Free Account <ChevronRight className="w-4 h-4" />
                </a>
              </div>
              <div className="relative glow-card p-2 rounded-3xl group">
                <img 
                  src="/step3_surgeons_view_1775880879936.png" 
                  alt="Step 3" 
                  className="rounded-2xl w-full aspect-video object-cover" 
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="about" className="py-28 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <span className="text-blue-500 font-bold uppercase tracking-widest text-xs">Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-extrabold heading-font text-white">
              Trusted by Health <span className="text-gradient">Professionals</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-base pt-3">
              See what medical professionals and health-conscious users say about SymptoSense.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid md:grid-cols-3 gap-7"
          >
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                variants={fadeInUp}
                key={i}
                className="glow-card p-7 rounded-3xl text-left border-l-4 border-l-blue-500"
              >
                <p className="text-slate-300 italic mb-6 text-sm leading-relaxed">"{t.content}"</p>
                <div>
                  <div className="font-bold text-white text-sm">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-slate-800/50 bg-[var(--color-bg-primary)]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Activity className="w-7 h-7 text-blue-500" />
            <span className="text-lg font-bold heading-font text-white italic">AI Health Intelligence</span>
          </div>
          <p className="text-slate-600 text-xs">{APP_COPYRIGHT}</p>
          <div className="flex gap-8 text-xs font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
