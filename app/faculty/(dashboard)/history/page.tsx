import Link from 'next/link';
import { cookies } from 'next/headers';
import { getFacultyByPhoneHash, getFacultyHistory } from '@/lib/faculty-data';
import type { HistoryRecord } from '@/lib/faculty-data';
import { formatDistanceToNow, formatDate } from '@/lib/time-utils';
import DeleteButton from './DeleteButton';
import { Clock } from 'lucide-react';

// ── helpers ────────────────────────────────────────────────────────────

function safeParse(text: string): Record<string, unknown> {
  try { return JSON.parse(text) as Record<string, unknown>; }
  catch { return {}; }
}

function shortDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

const intentMeta: Record<string, { label: string; cls: string }> = {
  AUDIT_WEB:  { label: 'AUDIT',  cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  ASSIGN_WEB: { label: 'ASSIGN', cls: 'bg-green-50 text-green-700 border-green-200' },
  TOPIC_WEB:  { label: 'TOPIC',  cls: 'bg-purple-50 text-purple-700 border-purple-200' },
};

const verdictMeta: Record<string, string> = {
  TEACH:   'bg-[#F0FFF4] text-[#0E9F6E] border-[#A7F3D0]',
  SKIP:    'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
  PARTIAL: 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]',
};

function scoreCls(score: number) {
  if (score >= 80) return 'bg-[#F0FFF4] text-[#0E9F6E] border-[#A7F3D0]';
  if (score >= 60) return 'bg-[#F0F0FF] text-[#635BFF] border-[#635BFF]/30';
  if (score >= 40) return 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]';
  return 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]';
}

interface CardInfo {
  title: string;
  subtitle: string;
  score: number | null;
  topicVerdict: string | null;
  showDetails: boolean;
}

function getCardInfo(record: HistoryRecord): CardInfo {
  const p = safeParse(record.response_text);
  const sd = shortDate(record.created_at);

  if (record.intent === 'AUDIT_WEB') {
    const subj = (p.subject as string)?.trim() || '';
    const sem  = (p.semester as string)?.trim() || '';
    const title =
      subj && sem ? `${subj} · ${sem}`
      : subj      ? subj
      :             `Syllabus Audit · ${sd}`;
    return {
      title,
      subtitle: (p.verdict as string) || '—',
      score: typeof p.overall_score === 'number' ? p.overall_score : null,
      topicVerdict: null,
      showDetails: true,
    };
  }

  if (record.intent === 'ASSIGN_WEB') {
    const topic  = (p.topic as string)?.trim() || '';
    const subj   = (p.subject as string)?.trim() || '';
    const projTitle = (p.title as string)?.trim() || '';
    const title  = projTitle || (topic ? `${topic} Assignment` : `Assignment · ${sd}`);
    const subtitle = subj ? `${subj}${topic ? ` · ${topic}` : ''}` : (topic || '—');
    return { title, subtitle, score: null, topicVerdict: null, showDetails: false };
  }

  if (record.intent === 'TOPIC_WEB') {
    const topic   = (p.topic as string)?.trim() || record.input_text?.trim() || `Topic · ${sd}`;
    const verdict = (p.verdict as string) || null;
    const why     = (p.why as string)?.slice(0, 100) || '—';
    return { title: topic, subtitle: why, score: null, topicVerdict: verdict, showDetails: false };
  }

  return { title: `Record · ${sd}`, subtitle: '—', score: null, topicVerdict: null, showDetails: false };
}

// ── page ───────────────────────────────────────────────────────────────

const FILTERS = [
  { label: 'All',         value: '' },
  { label: 'Audits',      value: 'AUDIT_WEB' },
  { label: 'Assignments', value: 'ASSIGN_WEB' },
  { label: 'Topics',      value: 'TOPIC_WEB' },
];

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: { filter?: string };
}) {
  const filter = FILTERS.some((f) => f.value === searchParams.filter)
    ? (searchParams.filter ?? '')
    : '';

  const cookieStore = cookies();
  const phoneHash = cookieStore.get('faculty_session')?.value ?? '';
  const faculty = phoneHash ? await getFacultyByPhoneHash(phoneHash) : null;
  if (!faculty) return null;

  const records = await getFacultyHistory(faculty.id, filter || undefined);

  return (
    <div className="max-w-3xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#0A2540]">History</h2>
          <p className="text-[#425466] text-sm mt-0.5">All your AI-assisted sessions</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="border-b border-[#E3E8EE] flex gap-0">
        {FILTERS.map(({ label, value }) => (
          <Link
            key={value}
            href={value ? `/faculty/history?filter=${value}` : '/faculty/history'}
            className={`px-4 py-2.5 text-xs font-medium transition-colors whitespace-nowrap border-b-2 -mb-px ${
              filter === value
                ? 'border-[#635BFF] text-[#635BFF]'
                : 'border-transparent text-[#8898AA] hover:text-[#425466]'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {records.length === 0 && (
        <div className="bg-white border border-[#E3E8EE] rounded-2xl p-12 flex flex-col items-center text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#F0F0FF] flex items-center justify-center mb-4">
            <Clock className="w-7 h-7 text-[#635BFF]" strokeWidth={1.5} />
          </div>
          <p className="text-[#0A2540] font-semibold mb-1">Nothing here yet</p>
          <p className="text-[#425466] text-sm mb-5">
            {filter === 'AUDIT_WEB'  && 'No audits found. Audit a syllabus to see it here.'}
            {filter === 'ASSIGN_WEB' && 'No assignments found. Generate one to see it here.'}
            {filter === 'TOPIC_WEB'  && 'No topic checks found. Check a topic to see it here.'}
            {!filter && 'Use Audit, Assign, or Topic to see your history here.'}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/faculty/audit"  className="bg-[#635BFF] hover:bg-[#5851DB] text-white font-medium px-4 py-2 rounded-lg transition-colors text-xs">Audit Syllabus</Link>
            <Link href="/faculty/assign" className="bg-[#F0FFF4] hover:bg-green-50 border border-[#A7F3D0] text-[#0E9F6E] font-medium px-4 py-2 rounded-lg transition-colors text-xs">Generate Assignment</Link>
            <Link href="/faculty/topic"  className="bg-[#F5F3FF] hover:bg-purple-50 border border-purple-200 text-purple-700 font-medium px-4 py-2 rounded-lg transition-colors text-xs">Check Topic</Link>
          </div>
        </div>
      )}

      {/* Record list */}
      {records.length > 0 && (
        <div className="space-y-3">
          {records.map((record) => {
            const info = getCardInfo(record);
            const im   = intentMeta[record.intent];

            return (
              <div
                key={record.id}
                className="bg-white border border-[#E3E8EE] rounded-xl p-5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Intent badge + title */}
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      {im && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md border flex-shrink-0 ${im.cls}`}>
                          {im.label}
                        </span>
                      )}
                      <h3 className="text-[#0A2540] font-semibold text-sm leading-tight">{info.title}</h3>
                    </div>

                    {/* Subtitle */}
                    <p className="text-[#425466] text-xs leading-relaxed line-clamp-2 mb-2">
                      {info.subtitle}
                    </p>

                    {/* Date */}
                    <p className="text-[#8898AA] text-xs" title={formatDate(record.created_at)}>
                      {formatDistanceToNow(record.created_at)}
                    </p>
                  </div>

                  {/* Right badges + actions */}
                  <div className="flex flex-col items-end gap-2.5 flex-shrink-0">
                    {info.score !== null && (
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${scoreCls(info.score)}`}>
                        {info.score}/100
                      </span>
                    )}
                    {info.topicVerdict && (
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${verdictMeta[info.topicVerdict] ?? ''}`}>
                        {info.topicVerdict}
                      </span>
                    )}
                    {info.showDetails && (
                      <Link
                        href={`/faculty/history/${record.id}`}
                        className="text-xs text-[#635BFF] hover:text-[#5851DB] border border-[#635BFF]/30 hover:border-[#635BFF] hover:bg-[#F0F0FF] px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                      >
                        View Details →
                      </Link>
                    )}
                    <DeleteButton id={record.id} variant="icon" />
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
