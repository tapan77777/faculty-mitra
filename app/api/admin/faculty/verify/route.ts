import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const cookieStore = cookies();
  const adminSession = cookieStore.get('admin_session')?.value;
  if (!adminSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json() as { faculty_id?: string };
  const facultyId = body.faculty_id?.trim();
  if (!facultyId) {
    return NextResponse.json({ error: 'faculty_id required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('faculty_profiles')
    .update({ is_verified: true })
    .eq('id', facultyId);

  if (error) return NextResponse.json({ error: 'Update failed' }, { status: 500 });

  return NextResponse.json({ success: true });
}
