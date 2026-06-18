import { getAllFaculty } from '@/lib/admin-data';
import { formatDistanceToNow, formatDate } from '@/lib/time-utils';
import VerifyButton from './VerifyButton';
import { CheckCircle2 } from 'lucide-react';

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
          <h2 className="text-xl font-bold tracking-tight text-[#0A2540]">Faculty</h2>
          <p className="text-[#425466] text-sm mt-0.5">All onboarded faculty, sorted by activity</p>
        </div>
        <span className="text-sm font-semibold text-[#425466] bg-[#F6F9FC] border border-[#E3E8EE] px-3 py-1.5 rounded-md">
          {faculty.length} total
        </span>
      </div>

      <div className="bg-white border border-[#E3E8EE] rounded-xl overflow-hidden">
        {faculty.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-[#425466] text-sm">No faculty onboarded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E3E8EE] bg-[#F6F9FC]">
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#8898AA] uppercase tracking-wider">#</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#8898AA] uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#8898AA] uppercase tracking-wider">College</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#8898AA] uppercase tracking-wider">Designation</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#8898AA] uppercase tracking-wider">Subject</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#8898AA] uppercase tracking-wider">Language</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#8898AA] uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-3.5 text-xs font-semibold text-[#8898AA] uppercase tracking-wider">Messages</th>
                  <th className="text-right px-6 py-3.5 text-xs font-semibold text-[#8898AA] uppercase tracking-wider">Joined</th>
                  <th className="text-right px-6 py-3.5 text-xs font-semibold text-[#8898AA] uppercase tracking-wider">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {faculty.map((f, i) => (
                  <tr
                    key={f.id}
                    className="border-b border-[#E3E8EE] hover:bg-[#F6F9FC] transition-colors"
                  >
                    <td className="px-6 py-4 text-[#8898AA] text-xs">{i + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#F0F0FF] flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#635BFF]">
                          {f.name?.charAt(0)?.toUpperCase() ?? '?'}
                        </div>
                        <span className="text-[#0A2540] font-medium">{f.name}</span>
                        {f.designation === 'Evaluator / Judge' && (
                          <span className="text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded-md">
                            JUDGE
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#425466]">{f.college || '—'}</td>
                    <td className="px-6 py-4 text-[#8898AA] text-xs">{f.designation || 'Faculty'}</td>
                    <td className="px-6 py-4 text-[#425466]">{f.subject || '—'}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-[#F6F9FC] text-[#425466] border border-[#E3E8EE] px-2 py-0.5 rounded-md">
                        {languageLabels[f.language] ?? f.language}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {f.is_verified ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-[#0E9F6E] bg-[#F0FFF4] border border-[#A7F3D0] px-2.5 py-1 rounded-full w-fit">
                          <CheckCircle2 className="w-3 h-3" strokeWidth={2.5} />
                          Verified
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#8898AA]">Unverified</span>
                          <VerifyButton facultyId={f.id} />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-[#0A2540] font-bold">{f.message_count ?? 0}</span>
                    </td>
                    <td className="px-6 py-4 text-right text-[#8898AA] text-xs">
                      {f.created_at ? formatDate(f.created_at) : '—'}
                    </td>
                    <td className="px-6 py-4 text-right text-[#8898AA] text-xs">
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
