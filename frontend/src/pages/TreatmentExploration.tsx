import React, { useState, useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
  Leaf,
  Pill,
  FlaskConical,
  Hospital,
  Salad,
  ClipboardList,
  ArrowLeft,
  ShieldAlert,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { TREATMENT_CATEGORIES, TREATMENT_DISCLAIMER } from '../constants';
import type { TreatmentCategory } from '../constants/treatment';
import { logger } from '../utils/logger';
import TreatmentCard from '../components/common/TreatmentCard';

// Map icon names to Lucide components
const ICON_MAP: Record<TreatmentCategory['iconName'], LucideIcon> = {
  Leaf,
  Pill,
  FlaskConical,
  Hospital,
  Salad,
  ClipboardList,
};

// Medical-themed gradients mapping
const GRADIENT_MAP: Record<string, { primary: string; secondary: string; glow?: string }> = {
  ayurvedic: { primary: '#10b981', secondary: '#06b6d4', glow: '#10b981' },
  allopathy: { primary: '#3b82f6', secondary: '#22d3ee', glow: '#3b82f6' },
  homeopathy: { primary: '#8b5cf6', secondary: '#10b981', glow: '#8b5cf6' },
  'modern-medicine': { primary: '#06b6d4', secondary: '#3b82f6', glow: '#06b6d4' },
  'lifestyle-diet': { primary: '#f97316', secondary: '#ec4899', glow: '#f97316' },
  recommendations: { primary: '#f43f5e', secondary: '#475569', glow: '#f43f5e' },
};

export default function TreatmentExploration() {
  const { diseaseName } = useParams<{ diseaseName: string }>();
  const location = useLocation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const decodedDisease = decodeURIComponent(diseaseName || 'Unknown');
  const aiAnalysis = location.state?.analysis;

  // Map AI data to categories if available
  const dynamicCategories = useMemo(() => {
    if (!aiAnalysis) return TREATMENT_CATEGORIES;

    const treatment = aiAnalysis.treatment_exploration;
    const lifestyle = aiAnalysis.lifestyle_and_diet;

    return TREATMENT_CATEGORIES.map(category => {
      let detail = { ...category.detail };
      let description = category.description;

      if (category.id === 'allopathy' && treatment?.allopathy) {
        detail = {
          treatments: treatment.allopathy.map((t: any) => t.treatment_name),
          medicines: treatment.allopathy.filter((t: any) => t.type?.toLowerCase().includes('medication')).map((t: any) => t.treatment_name),
          benefits: treatment.allopathy.map((t: any) => t.description),
          risks: treatment.allopathy.flatMap((t: any) => t.common_side_effects || []),
          whenToPrefer: ["Standard evidence-based care", "Acute symptoms"]
        };
        description = treatment.treatment_overview || description;
      } else if (category.id === 'ayurvedic' && treatment?.ayurvedic_treatments) {
        detail = {
          treatments: treatment.ayurvedic_treatments.map((t: any) => t.treatment_type),
          medicines: treatment.ayurvedic_treatments.map((t: any) => t.formulation_name),
          benefits: treatment.ayurvedic_treatments.map((t: any) => t.description),
          risks: ["Consult Ayurvedic practitioner", "Check for herb-drug interactions"],
          whenToPrefer: ["Long-term wellness", "Holistic balance"]
        };
      } else if (category.id === 'homeopathy' && treatment?.homeopathy) {
        detail = {
          treatments: treatment.homeopathy.map((t: any) => t.indication),
          medicines: treatment.homeopathy.map((t: any) => t.remedy_name),
          benefits: treatment.homeopathy.map((t: any) => t.description),
          risks: ["Limited clinical evidence", "Individual sensitivity"],
          whenToPrefer: ["Sensitive patients", "Chronic conditions"]
        };
      } else if (category.id === 'modern-medicine' && treatment?.emerging_therapies) {
        detail = {
          treatments: treatment.emerging_therapies.map((t: any) => t.therapy_name),
          medicines: treatment.emerging_therapies.map((t: any) => t.research_stage),
          benefits: treatment.emerging_therapies.map((t: any) => t.description),
          risks: ["Experimental stage", "High cost"],
          whenToPrefer: ["Refractory cases", "Clinical trials"]
        };
      } else if (category.id === 'lifestyle-diet' && lifestyle) {
        detail = {
          treatments: lifestyle.exercise_recommendations?.recommended_activities || [],
          medicines: lifestyle.supplements?.map((s: any) => s.name) || [],
          benefits: [lifestyle.mental_health, lifestyle.stress_management?.importance].filter(Boolean),
          risks: [lifestyle.exercise_recommendations?.activities_to_avoid].filter(Boolean),
          whenToPrefer: ["Lifestyle optimization", "Supportive care"]
        };
      }

      return { ...category, detail, description };
    });
  }, [aiAnalysis]);

  // Reorder categories: expanded card goes first, rest maintain order
  const orderedCategories = useMemo(() => {
    const source = dynamicCategories;
    if (!expandedId) return source;
    const expanded = source.find((c) => c.id === expandedId);
    const rest = source.filter((c) => c.id !== expandedId);
    return expanded ? [expanded, ...rest] : source;
  }, [expandedId, dynamicCategories]);

  const toggleExpand = (id: string) => {
    const next = expandedId === id ? null : id;
    setExpandedId(next);
    logger.action('Treatment card toggled', { id, expanded: next === id });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700 font-sans">
      {/* Back + Header */}
      <div className="space-y-6">
        <Link
          to="/assessment"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-sm font-medium transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Assessment
        </Link>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Treatment Intelligence</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Treatment Options for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 capitalize">
              {decodedDisease}
            </span>
          </h1>
          <p className="text-slate-400 text-base max-w-2xl font-medium leading-relaxed">
            Explore diverse therapeutic approaches across multiple medical systems. Click any card to explore detailed
            recommendations and safety guidelines.
          </p>
        </div>
      </div>

      {/* Disclaimer Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-900/40 backdrop-blur-md p-6 rounded-[24px] border border-slate-800 border-l-4 border-l-amber-500/50 flex items-start gap-4"
      >
        <div className="p-2.5 bg-amber-500/15 rounded-xl flex-shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-1">Medical Disclaimer</h4>
          <p className="text-slate-400 text-sm leading-relaxed">{TREATMENT_DISCLAIMER}</p>
        </div>
      </motion.div>

      {/* Cards Grid */}
      <LayoutGroup>
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {orderedCategories.map((category) => (
              <TreatmentCard
                key={category.id}
                layoutId={category.id}
                title={category.label}
                description={category.description}
                details={category.detail}
                gradient={GRADIENT_MAP[category.id] || GRADIENT_MAP.allopathy}
                Icon={ICON_MAP[category.iconName]}
                isActive={expandedId === category.id}
                onClick={() => toggleExpand(category.id)}
                tags={category.id === 'ayurvedic' ? ['Natural', 'Holistic'] : category.id === 'allopathy' ? ['Clinical', 'Fast Acting'] : []}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center space-y-6 pt-12"
      >
        <div className="flex flex-col items-center gap-2">
          <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold">
            Safety First
          </p>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            These insights are generated by AI for educational purposes. Always prioritize professional medical advice.
          </p>
        </div>
        <Link
          to="/assessment"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Assessment
        </Link>
      </motion.div>
    </div>
  );
}
