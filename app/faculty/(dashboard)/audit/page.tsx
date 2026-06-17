import { cookies } from 'next/headers';
import { getFacultyByPhoneHash } from '@/lib/faculty-data';
import AuditClient from './AuditClient';

export default async function AuditPage() {
  const cookieStore = cookies();
  const phoneHash = cookieStore.get('faculty_session')?.value ?? '';
  const faculty = phoneHash ? await getFacultyByPhoneHash(phoneHash) : null;

  return <AuditClient initialSubject={faculty?.subject ?? ''} />;
}
