import { getAllFaculty } from '@/lib/admin-data';
import { formatDistanceToNow, formatDate } from '@/lib/time-utils';
import VerifyButton from './VerifyButton';

const languageLabels: Record<string, string> = {
  en: 'English',
  hi: 'Hindi',
};

export default async function FacultyPage() {
  const faculty = await getAllFaculty();

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Faculty</h2>
          <p className="text-teal-500 text-sm mt-0.5">All onboarded faculty, sorted by activity</p>
        </div>
        <span className="text-sm font-semibold text-teal-300 bg-teal-900/40 border border-teal-800 px-3 py-1.5 rounded-full">
          {faculty.length} total
        </span>
      </div>

      <div className="bg-[#0d2420] border border-teal-900 rounded-xl overflow-hidden">
        {faculty.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-teal-600 text-sm">No faculty onboarded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-teal-900 bg-[#0A2E2A]/50">
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-teal-500 uppercase tracking-wider">#</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-teal-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-teal-500 uppercase tracking-wider">College</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-teal-500 uppercase tracking-wider">Designation</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-teal-500 uppercase tracking-wider">Subject</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-teal-500 uppercase tracking-wider">Language</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-teal-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-3.5 text-xs font-semibold text-teal-500 uppercase tracking-wider">Messages</th>
                  <th className="text-right px-6 py-3.5 text-xs font-semibold text-teal-500 uppercase tracking-wider">Joined</th>
                  <th className="text-right px-6 py-3.5 text-xs font-semibold text-teal-500 uppercase tracking-wider">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {faculty.map((f, i) => (
                  <tr
                    key={f.id}
                    className="border-b border-teal-900/40 hover:bg-teal-900/10 transition-colors"
                  >
                    <td className="px-6 py-4 text-teal-600 text-xs">{i + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-800 flex items-center justify-center flex-shrink-0 text-xs font-bold text-teal-300">
                          {f.name?.charAt(0)?.toUpperCase() ?? '?'}
                        </div>
                        <span className="text-white font-medium">{f.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-teal-300">{f.college || '—'}</td>
                    <td className="px-6 py-4 text-teal-400 text-xs">{f.designation || 'Faculty'}</td>
                    <td className="px-6 py-4 text-teal-400">{f.subject || '—'}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-teal-900/50 text-teal-300 border border-teal-800 px-2 py-0.5 rounded">
                        {languageLabels[f.language] ?? f.language}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {f.is_verified ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-green-300 bg-green-900/30 border border-green-700 px-2.5 py-1 rounded-full w-fit">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          Verified
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-teal-600">Unverified</span>
                          <VerifyButton facultyId={f.id} />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-white font-bold">{f.message_count ?? 0}</span>
                    </td>
                    <td className="px-6 py-4 text-right text-teal-500 text-xs">
                      {f.created_at ? formatDate(f.created_at) : '—'}
                    </td>
                    <td className="px-6 py-4 text-right text-teal-500 text-xs">
                      {f.last_active ? formatDistanceToNow(f.last_active) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
