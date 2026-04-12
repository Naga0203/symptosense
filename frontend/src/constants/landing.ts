/**
 * Landing page data — keep Home.tsx clean of inline data.
 */

export interface StatItem {
  label: string;
  value: string;
}

export const LANDING_STATS: StatItem[] = [
  { label: 'Assessments', value: '50,000+' },
  { label: 'Accuracy Rate', value: '94%' },
  { label: 'Treatment Systems', value: '6' },
  { label: 'Results', value: '< 30 sec' },
];

export interface Testimonial {
  name: string;
  role: string;
  content: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Dr. Sarah Mitchell',
    role: 'GP Consultant',
    content:
      'SymptoSense is a game-changer for early triage. The precision in linking symptoms to multiple treatment systems is unprecedented.',
  },
  {
    name: 'James Rodriguez',
    role: 'Health Advocate',
    content:
      'Finally, an AI that speaks my language. I feel more empowered and informed before heading to my doctor appointments.',
  },
  {
    name: 'Priya Nair',
    role: 'Ayurvedic Specialist',
    content:
      'Merging ancient wisdom with modern AI is exactly what the future of integrated healthcare looks like.',
  },
];
