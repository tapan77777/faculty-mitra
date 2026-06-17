import { supabase, FacultyProfile } from './supabase';

export interface AuditRecord {
  id: string;
  faculty_id: string;
  input_text: string;
  response_text: string;
  created_at: string;
}

export interface HistoryRecord {
  id: string;
  faculty_id: string;
  intent: string;
  input_text: string;
  response_text: string;
  created_at: string;
}

export interface FacultyStats {
  totalAudits: number;
  totalAssignments: number;
  totalTopics: number;
}

export interface FacultyActivity {
  id: string;
  intent: string;
  input_text: string;
  response_text: string;
  created_at: string;
}

export async function getFacultyByPhoneHash(hash: string): Promise<FacultyProfile | null> {
  const { data } = await supabase
    .from('faculty_profiles')
    .select('*')
    .eq('phone_hash', hash)
    .single();
  return (data as FacultyProfile) ?? null;
}

export async function getFacultyStats(facultyId: string): Promise<FacultyStats> {
  const { data } = await supabase
    .from('message_logs')
    .select('intent')
    .eq('faculty_id', facultyId);

  const rows = data ?? [];
  return {
    totalAudits: rows.filter((r) => r.intent === 'AUDIT' || r.intent === 'AUDIT_WEB').length,
    totalAssignments: rows.filter((r) => r.intent === 'ASSIGN' || r.intent === 'ASSIGN_WEB').length,
    totalTopics: rows.filter((r) => r.intent === 'TOPIC' || r.intent === 'TOPIC_WEB').length,
  };
}

export async function getFacultyHistory(
  facultyId: string,
  intent?: string
): Promise<HistoryRecord[]> {
  let query = supabase
    .from('message_logs')
    .select('id, faculty_id, intent, input_text, response_text, created_at')
    .eq('faculty_id', facultyId)
    .in('intent', ['AUDIT_WEB', 'ASSIGN_WEB', 'TOPIC_WEB'])
    .order('created_at', { ascending: false });

  if (intent) {
    query = query.eq('intent', intent);
  }

  const { data } = await query;
  return (data as HistoryRecord[]) ?? [];
}

export async function getFacultyAudits(facultyId: string): Promise<AuditRecord[]> {
  const { data } = await supabase
    .from('message_logs')
    .select('id, faculty_id, input_text, response_text, created_at')
    .eq('faculty_id', facultyId)
    .eq('intent', 'AUDIT_WEB')
    .order('created_at', { ascending: false });
  return (data as AuditRecord[]) ?? [];
}

export async function getAuditById(
  auditId: string,
  facultyId: string
): Promise<AuditRecord | null> {
  const { data } = await supabase
    .from('message_logs')
    .select('id, faculty_id, input_text, response_text, created_at')
    .eq('id', auditId)
    .eq('faculty_id', facultyId)
    .eq('intent', 'AUDIT_WEB')
    .single();
  return (data as AuditRecord) ?? null;
}

export async function getFacultyRecentActivity(
  facultyId: string,
  limit = 10
): Promise<FacultyActivity[]> {
  const { data } = await supabase
    .from('message_logs')
    .select('id, intent, input_text, response_text, created_at')
    .eq('faculty_id', facultyId)
    .order('created_at', { ascending: false })
    .limit(limit);
  return (data as FacultyActivity[]) ?? [];
}
