/**
 * Treatment exploration categories.
 * Each category has rich structured data for expandable cards:
 * treatments, medicines, benefits, risks, and when-to-prefer guidance.
 */

export interface TreatmentDetail {
  treatments: string[];
  medicines: string[];
  benefits: string[];
  risks: string[];
  whenToPrefer: string[];
}

export interface TreatmentCategory {
  id: string;
  label: string;
  /** Lucide icon identifier — mapped at render time */
  iconName: 'Leaf' | 'Pill' | 'FlaskConical' | 'Hospital' | 'Salad' | 'ClipboardList';
  accentColor: string;
  bgColor: string;
  borderGlow: string;
  gradientBg: string;
  description: string;
  detail: TreatmentDetail;
}

export const TREATMENT_CATEGORIES: TreatmentCategory[] = [
  {
    id: 'ayurvedic',
    label: 'Ayurvedic',
    iconName: 'Leaf',
    accentColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderGlow: 'hover:shadow-[0_0_30px_rgba(52,211,153,0.15)] hover:border-emerald-500/40',
    gradientBg: 'from-emerald-500/5 to-transparent',
    description: 'Traditional Indian medicine system using natural herbs, lifestyle balance, and dosha harmonization.',
    detail: {
      treatments: [
        'Panchakarma (5-fold detoxification therapy)',
        'Shirodhara (warm oil forehead therapy)',
        'Abhyanga (therapeutic oil massage)',
        'Nasya (nasal administration of herbal oils)',
        'Basti (herbal enema therapy)',
      ],
      medicines: [
        'Ashwagandha (stress & immunity)',
        'Triphala (digestive health)',
        'Turmeric / Curcumin (anti-inflammatory)',
        'Brahmi (cognitive function)',
        'Guduchi / Giloy (immune modulator)',
      ],
      benefits: [
        'Natural, plant-based remedies with minimal synthetic chemicals',
        'Targets root cause through body constitution (Prakriti) analysis',
        'Promotes holistic wellness — mind, body, and spirit',
        'Effective for chronic and lifestyle diseases',
      ],
      risks: [
        'Slower onset of action compared to allopathy',
        'Potential heavy metal contamination in unregulated products',
        'May interact with conventional medications',
        'Requires experienced practitioner for accurate diagnosis',
      ],
      whenToPrefer: [
        'Chronic conditions not responding well to conventional treatment',
        'Preventive healthcare and immunity building',
        'Stress-related and psychosomatic disorders',
        'When seeking minimal side-effect treatment options',
      ],
    },
  },
  {
    id: 'allopathy',
    label: 'Allopathy',
    iconName: 'Pill',
    accentColor: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderGlow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:border-blue-500/40',
    gradientBg: 'from-blue-500/5 to-transparent',
    description: 'Evidence-based conventional medicine using pharmaceuticals and clinical protocols.',
    detail: {
      treatments: [
        'Pharmacological therapy (oral, IV, topical)',
        'Surgical intervention when indicated',
        'Physiotherapy and rehabilitation',
        'Radiation and chemotherapy (oncology)',
        'Immunotherapy and biologics',
      ],
      medicines: [
        'Analgesics (Paracetamol, Ibuprofen)',
        'Antibiotics (Amoxicillin, Azithromycin)',
        'Antihypertensives (Amlodipine, Losartan)',
        'Statins (Atorvastatin) for cholesterol',
        'Antidiabetics (Metformin, Insulin)',
      ],
      benefits: [
        'Rapid symptom relief with predictable dosing',
        'Extensive clinical trials and evidence base',
        'Emergency and critical care capability',
        'Standardized protocols across healthcare systems',
      ],
      risks: [
        'Potential side effects from synthetic compounds',
        'Risk of antibiotic resistance with overuse',
        'May treat symptoms without addressing root cause',
        'Drug dependency risk with certain medications',
      ],
      whenToPrefer: [
        'Acute infections and emergency situations',
        'Conditions requiring surgical intervention',
        'When rapid, measurable outcomes are essential',
        'Well-understood diseases with established protocols',
      ],
    },
  },
  {
    id: 'homeopathy',
    label: 'Homeopathy',
    iconName: 'FlaskConical',
    accentColor: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
    borderGlow: 'hover:shadow-[0_0_30px_rgba(167,139,250,0.15)] hover:border-violet-500/40',
    gradientBg: 'from-violet-500/5 to-transparent',
    description: 'Holistic healing system using highly diluted natural substances to stimulate the body\'s self-recovery.',
    detail: {
      treatments: [
        'Constitutional treatment (whole-person analysis)',
        'Acute prescribing for immediate symptoms',
        'Miasmatic treatment for inherited tendencies',
        'Organ-specific drainage remedies',
        'Biochemic tissue salts therapy',
      ],
      medicines: [
        'Arnica Montana (trauma, bruising)',
        'Nux Vomica (digestive disorders)',
        'Belladonna (fever, inflammation)',
        'Rhus Toxicodendron (joint stiffness)',
        'Pulsatilla (hormonal and emotional issues)',
      ],
      benefits: [
        'Extremely low risk of side effects',
        'Safe for children, elderly, and pregnant women',
        'Treats the individual, not just the disease',
        'Can be used alongside conventional medicine',
      ],
      risks: [
        'Limited scientific evidence for mechanism of action',
        'Initial aggravation of symptoms possible',
        'Not suitable for emergency or surgical cases',
        'Requires patience — results may take longer',
      ],
      whenToPrefer: [
        'Chronic allergies, skin conditions, and autoimmune issues',
        'Pediatric care with minimal intervention',
        'Emotional and psychosomatic complaints',
        'When conventional treatment has significant side effects',
      ],
    },
  },
  {
    id: 'modern-medicine',
    label: 'Modern Medicine',
    iconName: 'Hospital',
    accentColor: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderGlow: 'hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] hover:border-cyan-500/40',
    gradientBg: 'from-cyan-500/5 to-transparent',
    description: 'Cutting-edge medical treatments including advanced diagnostics, precision medicine, and AI-assisted therapies.',
    detail: {
      treatments: [
        'Genomic medicine and personalized therapy',
        'Robotic-assisted minimally invasive surgery',
        'CAR-T cell therapy (cancer immunotherapy)',
        'AI-powered diagnostic imaging analysis',
        'Telemedicine and remote patient monitoring',
      ],
      medicines: [
        'Monoclonal antibodies (targeted therapy)',
        'mRNA-based therapeutics',
        'CRISPR gene editing applications',
        'Biologic disease-modifying agents',
        'Nanomedicine drug delivery systems',
      ],
      benefits: [
        'Cutting-edge precision with personalized treatment',
        'Access to latest research and clinical trials',
        'Minimally invasive procedures with faster recovery',
        'AI and data-driven diagnostic accuracy',
      ],
      risks: [
        'High cost and limited accessibility',
        'Experimental treatments may have unknown long-term effects',
        'Over-reliance on technology vs. clinical judgment',
        'May not be available in all regions',
      ],
      whenToPrefer: [
        'Rare diseases requiring specialized diagnostics',
        'Cancer treatment with targeted therapy needs',
        'When conventional treatments have failed',
        'Access to research hospitals and clinical trials',
      ],
    },
  },
  {
    id: 'lifestyle-diet',
    label: 'Lifestyle & Diet',
    iconName: 'Salad',
    accentColor: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderGlow: 'hover:shadow-[0_0_30px_rgba(251,146,60,0.15)] hover:border-orange-500/40',
    gradientBg: 'from-orange-500/5 to-transparent',
    description: 'Nutrition plans, exercise routines, and daily habit adjustments to support recovery and prevention.',
    detail: {
      treatments: [
        'Medical nutrition therapy (MNT)',
        'Elimination diet protocols',
        'Circadian rhythm optimization',
        'Mindfulness-based stress reduction (MBSR)',
        'Physical rehabilitation exercises',
      ],
      medicines: [
        'Vitamin D3 + K2 supplementation',
        'Omega-3 fatty acids (EPA/DHA)',
        'Probiotics for gut microbiome health',
        'Magnesium (sleep and muscle function)',
        'Adaptogens (Ashwagandha, Rhodiola)',
      ],
      benefits: [
        'Addresses root causes of lifestyle diseases',
        'No pharmaceutical side effects',
        'Sustainable long-term health improvement',
        'Improves mental health alongside physical wellness',
      ],
      risks: [
        'Requires sustained discipline and commitment',
        'Results are gradual and may take weeks',
        'Self-guided approaches may miss critical issues',
        'Supplements can interact with medications',
      ],
      whenToPrefer: [
        'Diabetes, hypertension, and obesity management',
        'Preventive care and health maintenance',
        'Mental health support (anxiety, depression)',
        'Post-treatment recovery and rehabilitation',
      ],
    },
  },
  {
    id: 'recommendations',
    label: 'Recommendations',
    iconName: 'ClipboardList',
    accentColor: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderGlow: 'hover:shadow-[0_0_30px_rgba(251,113,133,0.15)] hover:border-rose-500/40',
    gradientBg: 'from-rose-500/5 to-transparent',
    description: 'Personalized action plan combining insights from all treatment systems into prioritized next steps.',
    detail: {
      treatments: [
        'Integrated treatment plan across systems',
        'Priority-ranked action items',
        'Scheduled follow-up checkpoints',
        'Risk factor monitoring protocol',
        'Emergency escalation guidelines',
      ],
      medicines: [
        'Prescribed medications review and optimization',
        'Supplement stack recommendations',
        'Herbal adjunct therapies where appropriate',
        'Topical and external applications',
        'Preventive vaccination schedule review',
      ],
      benefits: [
        'Holistic view combining all medical perspectives',
        'Structured timeline with measurable milestones',
        'Balanced approach reducing over-reliance on single system',
        'Empowers patient with clear, actionable guidance',
      ],
      risks: [
        'Complexity of managing multiple treatment approaches',
        'Potential conflicts between different treatment philosophies',
        'Information overload without proper guidance',
        'Requires regular professional oversight',
      ],
      whenToPrefer: [
        'Complex conditions requiring multi-disciplinary care',
        'When seeking a second opinion across systems',
        'Long-term condition management',
        'Holistic health optimization and prevention',
      ],
    },
  },
];
