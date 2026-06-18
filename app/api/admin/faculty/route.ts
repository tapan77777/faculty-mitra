import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const adminSession = cookies().get('admin_session')?.value;
  if (!adminSession) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data } = await supabase
    .from('faculty_profiles')
    .select('*')
    .order('message_count', { ascending: false });

  return NextResponse.json(data ?? []);
}
