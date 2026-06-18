import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const body = await request.json() as {
    phone?: string;
    name?: string;
    college?: string;
    designation?: string;
  };

  const phone = body.phone?.trim();
  const name = body.name?.trim();

  if (!phone || !/^\d{10}$/.test(phone) || !name) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const phoneHash = crypto.createHash('sha256').update(phone).digest('hex');

  const { data: existing } = await supabase
    .from('faculty_profiles')
    .select('id')
    .eq('phone_hash', phoneHash)
    .single();

  if (!existing) {
    const college = body.college?.trim() ?? '';
    const designation = body.designation?.trim() || 'Faculty';

    const { error } = await supabase.from('faculty_profiles').insert({
      phone_hash: phoneHash,
      name,
      college,
      designation,
      subject: '',
      language: 'English',
      is_verified: false,
      last_active: new Date().toISOString(),
      message_count: 0,
    });

    if (error) {
      return NextResponse.json({ error: 'Account creation failed' }, { status: 500 });
    }
  }

  cookies().set('faculty_session', phoneHash, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.json({ success: true });
}
