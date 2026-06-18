import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { getFacultyByPhoneHash } from '@/lib/faculty-data';
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
  const cookieStore = cookies();
  const phoneHash = cookieStore.get('faculty_session')?.value ?? '';
  const faculty = phoneHash ? await getFacultyByPhoneHash(phoneHash) : null;
  if (!faculty) notFound();

  return (
    <ProfileClient
      profile={{
        name: faculty.name,
        college: faculty.college,
        subject: faculty.subject,
        language: faculty.language,
        designation: faculty.designation ?? 'Faculty',
        is_verified: faculty.is_verified ?? false,
        phone_hash: faculty.phone_hash,
      }}
    />
  );
}
