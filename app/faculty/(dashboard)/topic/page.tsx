import { cookies } from 'next/headers';
import { getFacultyByPhoneHash } from '@/lib/faculty-data';
import TopicClient from './TopicClient';

export default async function TopicPage() {
  const cookieStore = cookies();
  const phoneHash = cookieStore.get('faculty_session')?.value ?? '';
  const faculty = phoneHash ? await getFacultyByPhoneHash(phoneHash) : null;

  return <TopicClient initialSubject={faculty?.subject ?? ''} />;
}
