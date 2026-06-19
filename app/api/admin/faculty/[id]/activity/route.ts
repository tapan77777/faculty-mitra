import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const adminSession = cookies().get('admin_session')?.value;
  if (!adminSession) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data } = await supabase
    .from('message_logs')
    .select('*')
    .eq('faculty_id', params.id)
    .in('intent', ['AUDIT_WEB', 'ASSIGN_WEB', 'TOPIC_WEB'])
    .order('created_at', { ascending: false });

  return NextResponse.json(data ?? []);
}
