/**
 * Avatar configuration for the profile avatar picker.
 * Uses pravatar.cc for realistic human avatars and DiceBear for illustrated styles.
 */

export type AvatarStyle = 'realistic' | 'illustrated';

export interface AvatarStyleOption {
  id: AvatarStyle;
  label: string;
  description: string;
}

export const AVATAR_STYLES: AvatarStyleOption[] = [
  { id: 'realistic', label: 'Realistic', description: 'Photorealistic human avatars' },
  { id: 'illustrated', label: 'Illustrated', description: 'AI-generated art styles' },
];

// ─── Realistic Avatars (pravatar.cc) ─────────────────
// pravatar.cc provides 70 high-quality realistic portrait images (img=1..70)
const PRAVATAR_BASE = 'https://i.pravatar.cc';

/** Generate a realistic avatar URL with deterministic image ID */
export function getRealisticAvatarUrl(id: number, size: number = 200): string {
  return `${PRAVATAR_BASE}/${size}?img=${id}`;
}

/** Curated set of the best-looking realistic avatars from pravatar.cc */
const REALISTIC_IDS = [
  1, 3, 5, 7, 8, 9, 10, 11, 12, 13,
  14, 15, 16, 18, 20, 21, 22, 23, 24, 25,
  26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
];

export function generateRealisticBatch(count: number = 30): string[] {
  return REALISTIC_IDS.slice(0, count).map((id) => getRealisticAvatarUrl(id, 200));
}

// ─── Illustrated Avatars (DiceBear) ─────────────────
const DICEBEAR_API_VERSION = '7.x';

const DICEBEAR_STYLES = [
  'lorelei',
  'notionists',
  'open-peeps',
  'personas',
  'avataaars',
  'bottts',
] as const;

const DICEBEAR_SEEDS = [
  'Felix', 'Luna', 'Shadow', 'Nova', 'Pixel', 'Zen',
  'Atom', 'Coral', 'Vega', 'Echo', 'Drift', 'Blaze',
  'Storm', 'Ember', 'Frost', 'Onyx', 'Pearl', 'Rain',
  'Sky', 'Wave', 'Flora', 'Star', 'Mist', 'Dawn',
];

export function getDiceBearUrl(style: string, seed: string): string {
  return `https://api.dicebear.com/${DICEBEAR_API_VERSION}/${style}/svg?seed=${encodeURIComponent(seed)}`;
}

export function generateIllustratedBatch(count: number = 24): string[] {
  const avatars: string[] = [];
  for (let i = 0; i < count; i++) {
    const style = DICEBEAR_STYLES[i % DICEBEAR_STYLES.length];
    const seed = DICEBEAR_SEEDS[i % DICEBEAR_SEEDS.length];
    avatars.push(getDiceBearUrl(style, seed));
  }
  return avatars;
}

// ─── Combined generator ─────────────────────────────
export function generateAvatarBatch(style: AvatarStyle, count?: number): string[] {
  return style === 'realistic'
    ? generateRealisticBatch(count ?? 30)
    : generateIllustratedBatch(count ?? 24);
}

// ─── Default avatars (realistic) ────────────────────
export const DEFAULT_REALISTIC_AVATARS: Record<string, string> = {
  male: getRealisticAvatarUrl(11, 200),
  female: getRealisticAvatarUrl(5, 200),
  other: getRealisticAvatarUrl(33, 200),
};

// ─── File upload validation ─────────────────────────
export const AVATAR_UPLOAD = {
  maxSizeBytes: 2 * 1024 * 1024,
  maxSizeMB: 2,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'] as const,
  allowedExtensions: '.jpg, .jpeg, .png, .webp',
} as const;

export function validateAvatarFile(file: File): { valid: boolean; error?: string } {
  if (!AVATAR_UPLOAD.allowedTypes.includes(file.type as any)) {
    return { valid: false, error: `Invalid file type. Allowed: ${AVATAR_UPLOAD.allowedExtensions}` };
  }
  if (file.size > AVATAR_UPLOAD.maxSizeBytes) {
    return { valid: false, error: `File too large. Maximum size: ${AVATAR_UPLOAD.maxSizeMB}MB` };
  }
  return { valid: true };
}
