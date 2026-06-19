import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const adminSession = cookies().get('admin_session')?.value;
  if (!adminSession) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [{ data: faculty }, { data: logs }] = await Promise.all([
    supabase.from('faculty_profiles').select('*').order('message_count', { ascending: false }),
    supabase
      .from('message_logs')
      .select('faculty_id, intent')
      .in('intent', ['AUDIT_WEB', 'ASSIGN_WEB', 'TOPIC_WEB']),
  ]);

  const activityMap: Record<string, { audits: number; assignments: number; topics: number }> = {};
  for (const log of logs ?? []) {
    if (!activityMap[log.faculty_id]) {
      activityMap[log.faculty_id] = { audits: 0, assignments: 0, topics: 0 };
    }
    if (log.intent === 'AUDIT_WEB') activityMap[log.faculty_id].audits++;
    else if (log.intent === 'ASSIGN_WEB') activityMap[log.faculty_id].assignments++;
    else if (log.intent === 'TOPIC_WEB') activityMap[log.faculty_id].topics++;
  }

  const result = (faculty ?? []).map((f) => ({
    ...f,
    activity: activityMap[f.id] ?? { audits: 0, assignments: 0, topics: 0 },
  }));

  return NextResponse.json(result);
}
