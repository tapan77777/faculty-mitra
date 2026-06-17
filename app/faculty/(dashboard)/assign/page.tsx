import { cookies } from 'next/headers';
import { getFacultyByPhoneHash } from '@/lib/faculty-data';
import AssignClient from './AssignClient';

export default async function AssignPage({
  searchParams,
}: {
  searchParams: { topics?: string; from?: string };
}) {
  const cookieStore = cookies();
  const phoneHash = cookieStore.get('faculty_session')?.value ?? '';
  const faculty = phoneHash ? await getFacultyByPhoneHash(phoneHash) : null;

  return (
    <AssignClient
      initialSubject={faculty?.subject ?? ''}
      initialTopics={searchParams.topics ?? ''}
    />
  );
}
