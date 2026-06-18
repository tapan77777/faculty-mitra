import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const body = await request.json() as { phone?: string };
  const phone = body.phone?.trim();

  if (!phone || !/^\d{10}$/.test(phone)) {
    return NextResponse.json({ error: 'Invalid phone' }, { status: 400 });
  }

  const phoneHash = crypto.createHash('sha256').update(phone).digest('hex');
  const { data } = await supabase
    .from('faculty_profiles')
    .select('id')
    .eq('phone_hash', phoneHash)
    .single();

  return NextResponse.json({ exists: !!data });
}
