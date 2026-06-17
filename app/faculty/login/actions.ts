'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

function hashPhone(phone: string): string {
  return crypto.createHash('sha256').update(phone).digest('hex');
}

export async function facultyLoginAction(formData: FormData) {
  const phone = (formData.get('phone') as string)?.trim();
  const name = (formData.get('name') as string)?.trim();

  if (!phone || !name || !/^\d{10}$/.test(phone)) {
    redirect('/faculty/login?error=1');
  }

  const phoneHash = hashPhone(phone);

  const { data: existing } = await supabase
    .from('faculty_profiles')
    .select('id')
    .eq('phone_hash', phoneHash)
    .single();

  if (!existing) {
    await supabase.from('faculty_profiles').insert({
      phone_hash: phoneHash,
      name,
      college: '',
      subject: '',
      language: 'English',
      last_active: new Date().toISOString(),
      message_count: 0,
    });
  }

  cookies().set('faculty_session', phoneHash, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect('/faculty/dashboard');
}

export async function facultyLogoutAction() {
  cookies().delete('faculty_session');
  redirect('/faculty/login');
}
