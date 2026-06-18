import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { getFacultyByPhoneHash, getAuditById } from '@/lib/faculty-data';
import { formatDate } from '@/lib/time-utils';
import AuditResultsView from '@/app/faculty/(dashboard)/audit/AuditResultsView';
import type { AuditResult } from '@/app/faculty/(dashboard)/audit/AuditResultsView';
import PdfDownloadButton from './PdfDownloadButton';
import DeleteButton from '../DeleteButton';
import { ChevronLeft, Pencil, RefreshCw, FileText } from 'lucide-react';

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
        className="inline-flex items-center gap-1.5 text-xs text-[#425466] hover:text-[#0A2540] transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2} />
        Audit History
      </Link>

      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#0A2540]">{displayTitle}</h2>
          <p className="text-[#8898AA] text-sm mt-0.5">{formatDate(audit.created_at)}</p>
        </div>
      </div>

      {/* Results */}
      <AuditResultsView result={result} subject={subject} semester={semester} />

      {/* Original syllabus — collapsible */}
      {audit.input_text && (
        <details className="bg-white border border-[#E3E8EE] rounded-xl overflow-hidden group shadow-sm">
          <summary className="flex items-center justify-between px-5 py-3.5 cursor-pointer select-none list-none text-sm text-[#425466] hover:text-[#0A2540] hover:bg-[#F6F9FC] transition-colors">
            <span className="flex items-center gap-2 font-medium">
              <FileText className="w-4 h-4 text-[#635BFF]" strokeWidth={1.5} />
              View Original Syllabus
            </span>
            <svg
              className="w-4 h-4 text-[#8898AA] transition-transform group-open:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="px-5 pb-5 pt-2 border-t border-[#E3E8EE]">
            <pre className="text-xs text-[#425466] whitespace-pre-wrap leading-relaxed font-mono overflow-x-auto">
              {audit.input_text}
            </pre>
          </div>
        </details>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pb-2">
        <PdfDownloadButton result={result} subject={subject} semester={semester} />
        <DeleteButton id={params.id} variant="full" />

        {updatesNeeded > 0 && (
          <Link
            href={`/faculty/assign?from=audit&topics=${encodeURIComponent(updateTopicNames)}`}
            className="flex items-center justify-center gap-2 bg-[#F0FFF4] hover:bg-green-50 border border-[#A7F3D0] hover:border-green-300 text-[#0E9F6E] font-medium py-3 px-5 rounded-xl transition-colors text-sm"
          >
            <Pencil className="w-4 h-4" strokeWidth={1.5} />
            Generate Assignment for Updated Topics
          </Link>
        )}

        <Link
          href="/faculty/audit"
          className="flex items-center justify-center gap-2 bg-white hover:bg-[#F6F9FC] border border-[#E3E8EE] text-[#425466] hover:text-[#0A2540] font-medium py-3 px-5 rounded-xl transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
          Re-audit this Syllabus
        </Link>
      </div>
    </div>
  );
}
