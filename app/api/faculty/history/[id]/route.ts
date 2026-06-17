import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import { getFacultyByPhoneHash } from '@/lib/faculty-data';

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies();
  const phoneHash = cookieStore.get('faculty_session')?.value;
  if (!phoneHash) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const faculty = await getFacultyByPhoneHash(phoneHash);
  if (!faculty) return NextResponse.json({ error: 'Faculty not found' }, { status: 404 });

  const { error } = await supabase
    .from('message_logs')
    .delete()
    .eq('id', params.id)
    .eq('faculty_id', faculty.id);

  if (error) return NextResponse.json({ error: 'Delete failed' }, { status: 500 });

  return NextResponse.json({ success: true });
}
