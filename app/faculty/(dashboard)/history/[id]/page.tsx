import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { getFacultyByPhoneHash, getAuditById } from '@/lib/faculty-data';
import { formatDate } from '@/lib/time-utils';
import AuditResultsView from '@/app/faculty/(dashboard)/audit/AuditResultsView';
import type { AuditResult } from '@/app/faculty/(dashboard)/audit/AuditResultsView';
import PdfDownloadButton from './PdfDownloadButton';

interface StoredResult extends AuditResult {
  subject?: string;
  semester?: string;
}

function parseStoredResult(responseText: string): StoredResult | null {
  try {
    const parsed = JSON.parse(responseText) as StoredResult;
    if (
      typeof parsed.overall_score !== 'number' ||
      !Array.isArray(parsed.units)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export default async function AuditDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const cookieStore = cookies();
  const phoneHash = cookieStore.get('faculty_session')?.value ?? '';
  const faculty = phoneHash ? await getFacultyByPhoneHash(phoneHash) : null;

  if (!faculty) notFound();

  const audit = await getAuditById(params.id, faculty.id);
  if (!audit) notFound();

  const stored = parseStoredResult(audit.response_text);
  if (!stored) notFound();

  const subject = stored.subject?.trim() || '';
  const semester = stored.semester?.trim() || '';

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

  // Strip subject/semester keys to pass a clean AuditResult to the view
  const result: AuditResult = {
    overall_score: stored.overall_score,
    verdict: stored.verdict,
    units: stored.units,
    trending_skills_missing: stored.trending_skills_missing,
    outdated_topics: stored.outdated_topics,
  };

  const updatesNeeded = result.units.filter(
    (u) => u.status === 'UPDATE' || u.status === 'REMOVE'
  ).length;
  const updateTopicNames = result.units
    .filter((u) => u.status === 'UPDATE' || u.status === 'REMOVE')
    .map((u) => u.name)
    .slice(0, 3)
    .join(',');

  return (
    <div className="max-w-3xl space-y-5">
      {/* Back nav */}
      <Link
        href="/faculty/history"
        className="inline-flex items-center gap-1.5 text-xs text-teal-500 hover:text-teal-300 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Audit History
      </Link>

      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">{displayTitle}</h2>
          <p className="text-teal-500 text-sm mt-0.5">{formatDate(audit.created_at)}</p>
        </div>
      </div>

      {/* Results */}
      <AuditResultsView result={result} subject={subject} semester={semester} />

      {/* Original syllabus — collapsible */}
      {audit.input_text && (
        <details className="bg-[#0d2420] border border-teal-900 rounded-xl overflow-hidden group">
          <summary className="flex items-center justify-between px-5 py-3.5 cursor-pointer select-none list-none text-sm text-teal-300 hover:text-white hover:bg-teal-900/20 transition-colors">
            <span className="flex items-center gap-2 font-medium">
              <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Original Syllabus
            </span>
            <svg
              className="w-4 h-4 text-teal-600 transition-transform group-open:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="px-5 pb-5 pt-2 border-t border-teal-900/60">
            <pre className="text-xs text-teal-300 whitespace-pre-wrap leading-relaxed font-mono overflow-x-auto">
              {audit.input_text}
            </pre>
          </div>
        </details>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pb-2">
        <PdfDownloadButton result={result} subject={subject} semester={semester} />

        {updatesNeeded > 0 && (
          <Link
            href={`/faculty/assign?from=audit&topics=${encodeURIComponent(updateTopicNames)}`}
            className="flex items-center justify-center gap-2 bg-green-900/20 hover:bg-green-900/40 border border-green-800 hover:border-green-600 text-green-300 font-medium py-3 px-5 rounded-xl transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Generate Assignment for Updated Topics
          </Link>
        )}

        <Link
          href="/faculty/audit"
          className="flex items-center justify-center gap-2 bg-[#0d2420] hover:bg-teal-900/20 border border-teal-900 hover:border-teal-700 text-teal-500 hover:text-teal-300 font-medium py-3 px-5 rounded-xl transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Re-audit this Syllabus
        </Link>
      </div>
    </div>
  );
}
