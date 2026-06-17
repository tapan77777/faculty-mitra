import Link from 'next/link';
import { cookies } from 'next/headers';
import { getFacultyByPhoneHash, getFacultyHistory } from '@/lib/faculty-data';
import type { HistoryRecord } from '@/lib/faculty-data';
import { formatDistanceToNow, formatDate } from '@/lib/time-utils';

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
  AUDIT_WEB:  { label: 'AUDIT',  cls: 'bg-blue-900/50 text-blue-300 border-blue-700' },
  ASSIGN_WEB: { label: 'ASSIGN', cls: 'bg-green-900/50 text-green-300 border-green-700' },
  TOPIC_WEB:  { label: 'TOPIC',  cls: 'bg-purple-900/50 text-purple-300 border-purple-700' },
};

const verdictMeta: Record<string, string> = {
  TEACH:   'bg-green-900/50 text-green-300 border-green-700',
  SKIP:    'bg-red-900/50 text-red-300 border-red-700',
  PARTIAL: 'bg-amber-900/50 text-amber-300 border-amber-700',
};

function scoreCls(score: number) {
  if (score >= 80) return 'bg-green-900/50 text-green-300 border-green-700';
  if (score >= 60) return 'bg-blue-900/50 text-blue-300 border-blue-700';
  if (score >= 40) return 'bg-amber-900/50 text-amber-300 border-amber-700';
  return 'bg-red-900/50 text-red-300 border-red-700';
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
          <h2 className="text-xl font-bold text-white">History</h2>
          <p className="text-teal-500 text-sm mt-0.5">All your AI-assisted sessions</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-[#0A2E2A]/60 border border-teal-900 rounded-xl p-1 w-fit">
        {FILTERS.map(({ label, value }) => (
          <Link
            key={value}
            href={value ? `/faculty/history?filter=${value}` : '/faculty/history'}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              filter === value
                ? 'bg-teal-600 text-white'
                : 'text-teal-400 hover:text-white hover:bg-teal-900/40'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {records.length === 0 && (
        <div className="bg-[#0d2420] border border-teal-900 rounded-2xl p-12 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-teal-900/40 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-white font-semibold mb-1">Nothing here yet</p>
          <p className="text-teal-600 text-sm mb-5">
            {filter === 'AUDIT_WEB'  && 'No audits found. Audit a syllabus to see it here.'}
            {filter === 'ASSIGN_WEB' && 'No assignments found. Generate one to see it here.'}
            {filter === 'TOPIC_WEB'  && 'No topic checks found. Check a topic to see it here.'}
            {!filter && 'Use Audit, Assign, or Topic to see your history here.'}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/faculty/audit"  className="bg-teal-600 hover:bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-xs">Audit Syllabus</Link>
            <Link href="/faculty/assign" className="bg-green-700 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-xs">Generate Assignment</Link>
            <Link href="/faculty/topic"  className="bg-purple-700 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-xs">Check Topic</Link>
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
                className="bg-[#0d2420] border border-teal-900 rounded-xl p-5 hover:border-teal-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Intent badge + title */}
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      {im && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded border flex-shrink-0 ${im.cls}`}>
                          {im.label}
                        </span>
                      )}
                      <h3 className="text-white font-semibold text-sm leading-tight">{info.title}</h3>
                    </div>

                    {/* Subtitle */}
                    <p className="text-teal-400 text-xs leading-relaxed line-clamp-2 mb-2">
                      {info.subtitle}
                    </p>

                    {/* Date */}
                    <p className="text-teal-600 text-xs" title={formatDate(record.created_at)}>
                      {formatDistanceToNow(record.created_at)}
                    </p>
                  </div>

                  {/* Right badges + actions */}
                  <div className="flex flex-col items-end gap-2.5 flex-shrink-0">
                    {info.score !== null && (
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${scoreCls(info.score)}`}>
                        {info.score}/100
                      </span>
                    )}
                    {info.topicVerdict && (
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${verdictMeta[info.topicVerdict] ?? ''}`}>
                        {info.topicVerdict}
                      </span>
                    )}
                    {info.showDetails && (
                      <Link
                        href={`/faculty/history/${record.id}`}
                        className="text-xs text-teal-400 hover:text-white border border-teal-800 hover:border-teal-500 hover:bg-teal-900/30 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                      >
                        View Details →
                      </Link>
                    )}
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
