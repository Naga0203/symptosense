import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
  Leaf,
  Pill,
  FlaskConical,
  Hospital,
  Salad,
  ClipboardList,
  ChevronDown,
  ArrowLeft,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  TestTubes,
  ThumbsUp,
  TriangleAlert,
  BadgeCheck,
} from 'lucide-react';
import { TREATMENT_CATEGORIES, TREATMENT_DISCLAIMER } from '../constants';
import type { TreatmentCategory } from '../constants/treatment';
import { logger } from '../utils/logger';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Map icon names to Lucide components
const ICON_MAP: Record<TreatmentCategory['iconName'], React.ComponentType<any>> = {
  Leaf,
  Pill,
  FlaskConical,
  Hospital,
  Salad,
  ClipboardList,
};

// Section icons for expanded detail
const SECTION_CONFIG = [
  { key: 'treatments' as const, label: 'Common Treatments', icon: Stethoscope },
  { key: 'medicines' as const, label: 'Medicines & Methods', icon: TestTubes },
  { key: 'benefits' as const, label: 'Benefits', icon: ThumbsUp },
  { key: 'risks' as const, label: 'Risks & Side Effects', icon: TriangleAlert },
  { key: 'whenToPrefer' as const, label: 'When to Prefer', icon: BadgeCheck },
];

export default function TreatmentExploration() {
  const { diseaseName } = useParams<{ diseaseName: string }>();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const decodedDisease = decodeURIComponent(diseaseName || 'Unknown');

  // Reorder categories: expanded card goes first, rest maintain order
  const orderedCategories = useMemo(() => {
    if (!expandedId) return TREATMENT_CATEGORIES;
    const expanded = TREATMENT_CATEGORIES.find((c) => c.id === expandedId);
    const rest = TREATMENT_CATEGORIES.filter((c) => c.id !== expandedId);
    return expanded ? [expanded, ...rest] : TREATMENT_CATEGORIES;
  }, [expandedId]);

  const toggleExpand = (id: string) => {
    const next = expandedId === id ? null : id;
    setExpandedId(next);
    logger.action('Treatment card toggled', { id, expanded: next === id });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Back + Header */}
      <div className="space-y-6">
        <Link
          to="/assessment"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white text-sm font-medium transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Assessment
        </Link>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Treatment Intelligence</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight heading-font">
            Treatment Options for{' '}
            <span className="text-gradient capitalize">{decodedDisease}</span>
          </h1>
          <p className="text-gray-400 text-base max-w-2xl font-medium">
            Explore treatment approaches across multiple medical systems. Click any card to view detailed recommendations.
          </p>
        </div>
      </div>

      {/* Shared Disclaimer Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glow-card p-6 rounded-[24px] border-l-4 border-l-amber-500/50 flex items-start gap-4"
      >
        <div className="p-2.5 bg-amber-500/15 rounded-xl flex-shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-1">Important Disclaimer</h4>
          <p className="text-gray-400 text-sm leading-relaxed">{TREATMENT_DISCLAIMER}</p>
        </div>
      </motion.div>

      {/* Treatment Cards — dynamic reordering */}
      <LayoutGroup>
        <motion.div className="flex flex-col gap-6" layout>
          {/* Expanded card (full width, at top) */}
          <AnimatePresence mode="popLayout">
            {expandedId && (() => {
              const category = TREATMENT_CATEGORIES.find((c) => c.id === expandedId);
              if (!category) return null;
              const Icon = ICON_MAP[category.iconName];

              return (
                <motion.div
                  key={`expanded-${category.id}`}
                  layoutId={`card-${category.id}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                  className={cn(
                    'relative rounded-[28px] overflow-hidden border border-slate-700/40 cursor-pointer',
                    `bg-gradient-to-br ${category.gradientBg}`,
                  )}
                  style={{ boxShadow: '0 0 40px rgba(59, 130, 246, 0.06)' }}
                  onClick={() => toggleExpand(category.id)}
                >
                  <div className="p-8 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <motion.div
                          layoutId={`icon-${category.id}`}
                          className={cn('p-4 rounded-2xl', category.bgColor)}
                        >
                          <Icon className={cn('w-7 h-7', category.accentColor)} />
                        </motion.div>
                        <div>
                          <motion.h3
                            layoutId={`title-${category.id}`}
                            className={cn('text-xl font-bold', category.accentColor)}
                          >
                            {category.label}
                          </motion.h3>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-0.5">
                            Detailed View · Click to collapse
                          </p>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: 180 }}
                        className="p-2.5 bg-gray-800/50 rounded-xl"
                      >
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </motion.div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-sm leading-relaxed max-w-3xl">{category.description}</p>

                    {/* Rich Detail Sections */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2"
                    >
                      {SECTION_CONFIG.map((section, si) => {
                        const items = category.detail[section.key];
                        const SectionIcon = section.icon;
                        return (
                          <motion.div
                            key={section.key}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + si * 0.06 }}
                            className="bg-black/30 border border-gray-800/40 rounded-2xl p-5 space-y-3"
                          >
                            <div className="flex items-center gap-2">
                              <SectionIcon className={cn('w-4 h-4', category.accentColor)} />
                              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                {section.label}
                              </span>
                            </div>
                            <ul className="space-y-2">
                              {items.map((item, idx) => (
                                <motion.li
                                  key={idx}
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.2 + si * 0.04 + idx * 0.04 }}
                                  className="flex gap-2 items-start text-sm"
                                >
                                  <span className={cn(
                                    'mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0',
                                    category.bgColor.replace('/10', '/50')
                                  )} />
                                  <span className="text-gray-300 leading-relaxed">{item}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>

          {/* Collapsed cards grid */}
          <motion.div
            layout
            className={cn(
              'grid gap-5',
              expandedId
                ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            )}
          >
            <AnimatePresence mode="popLayout">
              {orderedCategories
                .filter((c) => c.id !== expandedId)
                .map((category, i) => {
                  const Icon = ICON_MAP[category.iconName];

                  return (
                    <motion.div
                      key={category.id}
                      layoutId={`card-${category.id}`}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{
                        type: 'spring',
                        damping: 26,
                        stiffness: 260,
                        delay: i * 0.04,
                      }}
                      onClick={() => toggleExpand(category.id)}
                      className={cn(
                        'group relative rounded-[24px] overflow-hidden cursor-pointer',
                        'bg-slate-900/40 backdrop-blur-md border border-slate-700/40',
                        'hover:-translate-y-1 transition-all duration-300',
                        category.borderGlow,
                      )}
                    >
                      {/* Hover glow gradient */}
                      <div className={cn(
                        'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                        `bg-gradient-to-br ${category.gradientBg}`,
                      )} />

                      <div className={cn(
                        'relative p-6 space-y-4',
                        expandedId ? 'p-5 space-y-3' : 'p-7 space-y-5',
                      )}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <motion.div
                              layoutId={`icon-${category.id}`}
                              className={cn(
                                'rounded-xl transition-transform duration-300 group-hover:scale-110',
                                category.bgColor,
                                expandedId ? 'p-2.5' : 'p-3.5',
                              )}
                            >
                              <Icon className={cn(
                                category.accentColor,
                                expandedId ? 'w-5 h-5' : 'w-6 h-6',
                              )} />
                            </motion.div>
                            <motion.h3
                              layoutId={`title-${category.id}`}
                              className={cn(
                                'font-bold text-white group-hover:text-white transition-colors',
                                expandedId ? 'text-sm' : 'text-lg',
                              )}
                            >
                              {category.label}
                            </motion.h3>
                          </div>
                          <motion.div className="p-1.5 bg-gray-800/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                          </motion.div>
                        </div>

                        {!expandedId && (
                          <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{category.description}</p>
                        )}

                        <div className={cn(
                          'flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300',
                          category.accentColor,
                        )}>
                          <span className="text-[10px] font-bold uppercase tracking-wider">Explore</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </LayoutGroup>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center space-y-4 pt-4"
      >
        <p className="text-gray-600 text-xs uppercase tracking-widest font-bold">
          Always consult a healthcare professional before starting any treatment
        </p>
        <Link
          to="/assessment"
          className="inline-flex items-center gap-2 px-8 py-3.5 border border-gray-800 text-gray-400 hover:text-white hover:bg-white/5 rounded-2xl text-sm font-medium transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Assessment
        </Link>
      </motion.div>
    </div>
  );
}
