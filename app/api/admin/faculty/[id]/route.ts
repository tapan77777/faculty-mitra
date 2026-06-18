import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

function isAdmin() {
  return !!cookies().get('admin_session')?.value;
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json() as {
    name?: string;
    college?: string;
    subject?: string;
    designation?: string;
    language?: string;
    is_verified?: boolean;
  };

  const { error } = await supabase
    .from('faculty_profiles')
    .update({
      name: body.name?.trim(),
      college: body.college?.trim(),
      subject: body.subject?.trim(),
      designation: body.designation?.trim(),
      language: body.language?.trim(),
      is_verified: body.is_verified,
    })
    .eq('id', params.id);

  if (error) return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  if (!isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { error: logsError } = await supabase
    .from('message_logs')
    .delete()
    .eq('faculty_id', params.id);

  if (logsError) return NextResponse.json({ error: 'Failed to delete logs' }, { status: 500 });

  const { error } = await supabase
    .from('faculty_profiles')
    .delete()
    .eq('id', params.id);

  if (error) return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  return NextResponse.json({ success: true });
}
