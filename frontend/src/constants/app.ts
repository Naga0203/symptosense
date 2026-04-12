/**
 * App-wide constants — single source of truth.
 * Never hardcode these values inline.
 */

// ─── Brand ────────────────────────────────────────────
export const APP_NAME = 'SymptoSense';
export const APP_TAGLINE = 'AI Health Intelligence';
export const APP_COPYRIGHT = `© ${new Date().getFullYear()} SymptoSense Intelligence. All rights reserved.`;

// ─── Medical Disclaimer ───────────────────────────────
export const PREDICTION_DISCLAIMER =
  'This output is generated using a Neural Network model and should not be considered a medical diagnosis. Please consult a healthcare professional.';

export const GLOBAL_MEDICAL_DISCLAIMER =
  'This platform is for educational and informational purposes only. AI diagnostics should never replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician.';

export const TREATMENT_DISCLAIMER =
  'The treatment information presented below is AI-generated and intended for educational purposes only. It does not constitute medical advice. Always consult a qualified healthcare professional before starting any treatment.';

// ─── Colors (CSS custom-property mirrors) ─────────────
export const COLORS = {
  bgPrimary: '#05080d',
  bgSecondary: '#06080b',
  bgCard: '#0a0c10',
  accent: '#3b82f6',       // blue-500
  accentCyan: '#22d3ee',   // cyan-400
  accentPurple: '#a855f7', // purple-500
  accentEmerald: '#34d399',// emerald-400
  scrollbarTrack: 'transparent',
  scrollbarThumb: '#1f2937',
  scrollbarThumbHover: '#374151',
} as const;

// ─── Profile Avatars (realistic defaults) ───────────
export const DEFAULT_AVATARS: Record<string, string> = {
  male: 'https://i.pravatar.cc/200?img=11',
  female: 'https://i.pravatar.cc/200?img=5',
  other: 'https://i.pravatar.cc/200?img=33',
};

// ─── Agent data keys to skip when rendering ──────────
export const AGENT_RENDER_SKIP_KEYS = [
  'agent_name',
  'model_used',
  'medical_disclaimer',
  'disease',
] as const;
