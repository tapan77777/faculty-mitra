'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (email === 'admin@facultymitra.com' && password === 'wadhwani2026') {
    cookies().set('admin_session', 'true', {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
    });
    redirect('/admin');
  }

  redirect('/admin/login?error=1');
}

export async function logoutAction() {
  cookies().delete('admin_session');
  redirect('/admin/login');
}
