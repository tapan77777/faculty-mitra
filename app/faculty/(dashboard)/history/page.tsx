import Link from 'next/link';
import { cookies } from 'next/headers';
import { getFacultyByPhoneHash, getFacultyAudits } from '@/lib/faculty-data';
import { formatDistanceToNow, formatDate } from '@/lib/time-utils';

interface StoredResult {
  overall_score?: number;
  verdict?: string;
  subject?: string;
  semester?: string;
}

function parseStoredResult(responseText: string): StoredResult {
  try {
    return JSON.parse(responseText) as StoredResult;
  } catch {
    return {};
  }
}

function ScoreBadge({ score }: { score: number }) {
  let cls = '';
  if (score >= 80) cls = 'bg-green-900/50 text-green-300 border-green-700';
  else if (score >= 60) cls = 'bg-blue-900/50 text-blue-300 border-blue-700';
  else if (score >= 40) cls = 'bg-amber-900/50 text-amber-300 border-amber-700';
  else cls = 'bg-red-900/50 text-red-300 border-red-700';

  return (
    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border flex-shrink-0 ${cls}`}>
      {score}/100
    </span>
  );
}

export default async function HistoryPage() {
  const cookieStore = cookies();
  const phoneHash = cookieStore.get('faculty_session')?.value ?? '';
  const faculty = phoneHash ? await getFacultyByPhoneHash(phoneHash) : null;

  if (!faculty) return null;

  const audits = await getFacultyAudits(faculty.id);

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Audit History</h2>
          <p className="text-teal-500 text-sm mt-0.5">All your past syllabus audits</p>
        </div>
        <Link
          href="/faculty/audit"
          className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-200 border border-teal-800 hover:border-teal-600 px-3 py-1.5 rounded-lg transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Audit
        </Link>
      </div>

      {/* Empty state */}
      {audits.length === 0 && (
        <div className="bg-[#0d2420] border border-teal-900 rounded-2xl p-12 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-teal-900/40 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-white font-semibold mb-1">No audits yet</p>
          <p className="text-teal-600 text-sm mb-5">
            Audit your syllabus to see AI-powered industry relevance analysis here.
          </p>
          <Link
            href="/faculty/audit"
            className="bg-teal-600 hover:bg-teal-500 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
          >
            Start your first audit →
          </Link>
        </div>
      )}

      {/* Audit list */}
      {audits.length > 0 && (
        <div className="space-y-3">
          {audits.map((audit) => {
            const parsed = parseStoredResult(audit.response_text);
            const score = parsed.overall_score ?? 0;
            const subject = parsed.subject?.trim() || '';
            const semester = parsed.semester?.trim() || '';
            const verdict = parsed.verdict || '—';

            const shortDate = new Date(audit.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });
            const displayTitle =
              subject && semester
                ? `${subject} · ${semester}`
                : subject
                ? subject
                : `Syllabus Audit · ${shortDate}`;

            return (
              <div
                key={audit.id}
                className="bg-[#0d2420] border border-teal-900 rounded-xl p-5 hover:border-teal-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h3 className="text-white font-semibold text-sm mb-1.5">{displayTitle}</h3>

                    {/* Verdict */}
                    <p className="text-teal-300 text-xs leading-relaxed line-clamp-2 mb-2">
                      {verdict}
                    </p>

                    {/* Date */}
                    <p
                      className="text-teal-600 text-xs"
                      title={formatDate(audit.created_at)}
                    >
                      Audited {formatDistanceToNow(audit.created_at)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <ScoreBadge score={score} />
                    <Link
                      href={`/faculty/history/${audit.id}`}
                      className="text-xs text-teal-400 hover:text-white border border-teal-800 hover:border-teal-500 hover:bg-teal-900/30 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
