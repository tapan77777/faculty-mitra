'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function facultyLogoutAction() {
  cookies().delete('faculty_session');
  redirect('/faculty/login');
}
