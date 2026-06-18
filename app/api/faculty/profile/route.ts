import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import { getFacultyByPhoneHash } from '@/lib/faculty-data';

export async function POST(request: Request) {
  const cookieStore = cookies();
  const phoneHash = cookieStore.get('faculty_session')?.value;
  if (!phoneHash) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const faculty = await getFacultyByPhoneHash(phoneHash);
  if (!faculty) return NextResponse.json({ error: 'Faculty not found' }, { status: 404 });

  const body = await request.json() as {
    name?: string;
    college?: string;
    subject?: string;
    language?: string;
    designation?: string;
  };

  const name = body.name?.trim();
  const college = body.college?.trim() ?? '';
  const subject = body.subject?.trim() ?? '';
  const language = body.language?.trim() ?? 'English';
  const designation = body.designation?.trim() || 'Faculty';

  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

  const { error } = await supabase
    .from('faculty_profiles')
    .update({ name, college, subject, language, designation })
    .eq('id', faculty.id);

  if (error) return NextResponse.json({ error: 'Update failed' }, { status: 500 });

  return NextResponse.json({ success: true });
}
