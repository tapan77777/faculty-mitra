import { supabase } from './supabase';

export interface TrendingSkill {
  name: string;
  growth: string;
  context: string;
}

export interface DecliningSkill {
  name: string;
  decline: string;
  context: string;
}

export interface IndustryPulse {
  id: string;
  subject: string;
  quarter: string;
  trending_skills: TrendingSkill[];
  declining_skills: DecliningSkill[];
  hiring_companies: string[];
  source_citation: string | null;
  last_updated: string;
}

const SUBJECT_MAP: Record<string, string> = {
  // Computer Science
  'computer science': 'Computer Science',
  'cs': 'Computer Science',
  'cse': 'Computer Science',
  'computer engineering': 'Computer Science',
  'computer science and engineering': 'Computer Science',
  'b.tech cse': 'Computer Science',
  'bca': 'Computer Science',
  'mca': 'Computer Science',
  'information technology': 'Computer Science',
  'it': 'Computer Science',

  // Electronics and Communication
  'electronics and communication': 'Electronics and Communication',
  'electronics': 'Electronics and Communication',
  'electronics engineering': 'Electronics and Communication',
  'ece': 'Electronics and Communication',
  'ec': 'Electronics and Communication',
  'e&c': 'Electronics and Communication',

  // Mechanical Engineering
  'mechanical engineering': 'Mechanical Engineering',
  'mechanical': 'Mechanical Engineering',
  'me': 'Mechanical Engineering',
  'mech': 'Mechanical Engineering',
  'b.tech mechanical': 'Mechanical Engineering',

  // MBA
  'mba': 'MBA',
  'pgdm': 'MBA',
  'business management': 'MBA',
  'business administration': 'MBA',

  // Commerce
  'commerce': 'Commerce',
  'b.com': 'Commerce',
  'bcom': 'Commerce',
  'm.com': 'Commerce',
  'mcom': 'Commerce',
};

function resolveSubject(raw: string): string | null {
  const normalised = raw.trim().toLowerCase();
  return SUBJECT_MAP[normalised] ?? null;
}

export async function getIndustryPulse(
  subject: string
): Promise<IndustryPulse | null> {
  if (!subject?.trim()) return null;

  const resolved = resolveSubject(subject);
  if (!resolved) return null;

  const { data, error } = await supabase
    .from('industry_pulse')
    .select('*')
    .eq('subject', resolved)
    .single();

  if (error || !data) return null;

  return data as IndustryPulse;
}
