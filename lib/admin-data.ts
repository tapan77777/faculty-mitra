import { supabase } from './supabase';

export interface ActivityItem {
  id: string;
  faculty_id: string;
  intent: string;
  input_text: string;
  response_text: string;
  created_at: string;
  faculty_name: string | null;
  faculty_college: string | null;
  faculty_is_verified: boolean;
}

export interface FacultyRow {
  id: string;
  name: string;
  college: string;
  subject: string;
  language: string;
  designation: string;
  is_verified: boolean;
  message_count: number;
  last_active: string;
  created_at: string;
}

export interface ConversationRow {
  id: string;
  faculty_id: string;
  intent: string;
  input_text: string;
  response_text: string;
  created_at: string;
  faculty_name: string | null;
  faculty_college: string | null;
}

export interface FeatureBreakdown {
  AUDIT: number;
  ASSIGN: number;
  TOPIC: number;
}

export async function getTotalFaculty(): Promise<number> {
  const { count } = await supabase
    .from('faculty_profiles')
    .select('*', { count: 'exact', head: true });
  return count ?? 0;
}

export async function getTotalMessages(): Promise<number> {
  const { count } = await supabase
    .from('message_logs')
    .select('*', { count: 'exact', head: true })
    .in('intent', ['AUDIT_WEB', 'ASSIGN_WEB', 'TOPIC_WEB']);
  return count ?? 0;
}

export async function getMostUsedFeature(): Promise<string> {
  const breakdown = await getFeatureBreakdown();
  const max = Math.max(breakdown.AUDIT, breakdown.ASSIGN, breakdown.TOPIC);
  if (max === 0) return 'N/A';
  if (breakdown.AUDIT === max) return 'AUDIT';
  if (breakdown.ASSIGN === max) return 'ASSIGN';
  return 'TOPIC';
}

export async function getActiveToday(): Promise<number> {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const { data } = await supabase
    .from('message_logs')
    .select('faculty_id')
    .in('intent', ['AUDIT_WEB', 'ASSIGN_WEB', 'TOPIC_WEB'])
    .gte('created_at', todayStart.toISOString());
  const unique = new Set((data ?? []).map((r) => r.faculty_id));
  return unique.size;
}

export async function getFeatureBreakdown(): Promise<FeatureBreakdown> {
  const { data } = await supabase
    .from('message_logs')
    .select('intent')
    .in('intent', ['AUDIT_WEB', 'ASSIGN_WEB', 'TOPIC_WEB']);

  const breakdown: FeatureBreakdown = { AUDIT: 0, ASSIGN: 0, TOPIC: 0 };
  for (const row of data ?? []) {
    if (row.intent === 'AUDIT_WEB') breakdown.AUDIT++;
    else if (row.intent === 'ASSIGN_WEB') breakdown.ASSIGN++;
    else if (row.intent === 'TOPIC_WEB') breakdown.TOPIC++;
  }
  return breakdown;
}

export async function getRecentActivity(limit = 10): Promise<ActivityItem[]> {
  const { data: logs } = await supabase
    .from('message_logs')
    .select('*')
    .in('intent', ['AUDIT_WEB', 'ASSIGN_WEB', 'TOPIC_WEB'])
    .order('created_at', { ascending: false })
    .limit(limit);

  if (!logs?.length) return [];

  const facultyIds = Array.from(new Set(logs.map((l) => l.faculty_id)));
  const { data: faculty } = await supabase
    .from('faculty_profiles')
    .select('id, name, college, is_verified')
    .in('id', facultyIds);

  const facultyMap = new Map(Array.from((faculty ?? []).map((f) => [f.id, f] as [string, typeof f])));

  return logs.map((log) => ({
    ...log,
    faculty_name: facultyMap.get(log.faculty_id)?.name ?? null,
    faculty_college: facultyMap.get(log.faculty_id)?.college ?? null,
    faculty_is_verified: facultyMap.get(log.faculty_id)?.is_verified ?? false,
  }));
}

export async function getAllFaculty(): Promise<FacultyRow[]> {
  const { data } = await supabase
    .from('faculty_profiles')
    .select('*')
    .order('message_count', { ascending: false });
  return (data as FacultyRow[]) ?? [];
}

const PAGE_SIZE = 20;

export async function getAllConversations(
  page: number
): Promise<{ rows: ConversationRow[]; total: number }> {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: logs, count } = await supabase
    .from('message_logs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (!logs?.length) return { rows: [], total: count ?? 0 };

  const facultyIds = Array.from(new Set(logs.map((l) => l.faculty_id)));
  const { data: faculty } = await supabase
    .from('faculty_profiles')
    .select('id, name, college')
    .in('id', facultyIds);

  const facultyMap = new Map(Array.from((faculty ?? []).map((f) => [f.id, f] as [string, typeof f])));

  const rows: ConversationRow[] = logs.map((log) => ({
    ...log,
    faculty_name: facultyMap.get(log.faculty_id)?.name ?? null,
    faculty_college: facultyMap.get(log.faculty_id)?.college ?? null,
  }));

  return { rows, total: count ?? 0 };
}
