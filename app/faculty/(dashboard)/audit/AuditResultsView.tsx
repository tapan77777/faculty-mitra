'use client';

export interface AuditUnit {
  name: string;
  status: 'KEEP' | 'UPDATE' | 'REMOVE';
  reasoning: string;
  suggestion: string;
}

export interface AuditResult {
  overall_score: number;
  verdict: string;
  units: AuditUnit[];
  trending_skills_missing: string[];
  outdated_topics: string[];
}

const statusStyles: Record<string, string> = {
  KEEP: 'bg-green-900/50 text-green-300 border-green-700',
  UPDATE: 'bg-amber-900/50 text-amber-300 border-amber-700',
  REMOVE: 'bg-red-900/50 text-red-300 border-red-700',
};

const statusIcons: Record<string, string> = {
  KEEP: '✓',
  UPDATE: '↻',
  REMOVE: '✕',
};

export function getScoreBarColor(score: number) {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-blue-500';
  if (score >= 40) return 'bg-amber-500';
  return 'bg-red-500';
}

export function getScoreTextColor(score: number) {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-blue-400';
  if (score >= 40) return 'text-amber-400';
  return 'text-red-400';
}

export default function AuditResultsView({
  result,
}: {
  result: AuditResult;
  subject: string;
  semester: string;
}) {
  const score = result.overall_score;

  return (
    <div className="space-y-5">
      {/* Score card */}
      <div className="bg-[#0d2420] border border-teal-900 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-teal-500 uppercase tracking-wider font-semibold mb-1">
              Relevance Score
            </p>
            <div className="flex items-baseline gap-2">
              <span className={`text-5xl font-bold ${getScoreTextColor(score)}`}>{score}</span>
              <span className="text-teal-600 text-xl">/100</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-teal-500 block mb-1">Verdict</span>
            <p className="text-white font-semibold text-sm max-w-[200px] text-right leading-snug">
              {result.verdict}
            </p>
          </div>
        </div>

        <div className="w-full bg-teal-950 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full ${getScoreBarColor(score)} transition-all duration-1000`}
            style={{ width: `${score}%` }}
          />
        </div>

        <div className="flex justify-between mt-1.5 text-xs text-teal-700">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>

        <div className="mt-4 pt-4 border-t border-teal-900/60 flex gap-4 text-xs text-teal-500">
          <span>
            <span className="text-white font-semibold">
              {result.units.filter((u) => u.status === 'KEEP').length}
            </span>{' '}
            units to keep
          </span>
          <span>
            <span className="text-amber-300 font-semibold">
              {result.units.filter((u) => u.status === 'UPDATE').length}
            </span>{' '}
            need update
          </span>
          <span>
            <span className="text-red-400 font-semibold">
              {result.units.filter((u) => u.status === 'REMOVE').length}
            </span>{' '}
            to remove
          </span>
        </div>
      </div>

      {/* Unit cards */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Unit-by-Unit Analysis
        </h3>
        <div className="space-y-3">
          {result.units.map((unit, i) => (
            <div key={i} className="bg-[#0d2420] border border-teal-900 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-white font-semibold text-sm leading-tight">{unit.name}</h4>
                <span
                  className={`flex-shrink-0 text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${statusStyles[unit.status]}`}
                >
                  <span>{statusIcons[unit.status]}</span>
                  {unit.status}
                </span>
              </div>

              <p className="text-teal-300 text-xs leading-relaxed">{unit.reasoning}</p>

              {(unit.status === 'UPDATE' || unit.status === 'REMOVE') && unit.suggestion && (
                <div className="bg-teal-900/20 border border-teal-800/60 rounded-lg px-3.5 py-2.5">
                  <p className="text-xs text-teal-500 font-semibold mb-0.5 uppercase tracking-wider">
                    Suggestion
                  </p>
                  <p className="text-teal-200 text-xs leading-relaxed">{unit.suggestion}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Industry context */}
      {(result.trending_skills_missing.length > 0 || result.outdated_topics.length > 0) && (
        <div className="bg-[#0d2420] border border-teal-900 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Industry Context
          </h3>

          {result.trending_skills_missing.length > 0 && (
            <div>
              <p className="text-xs text-green-400 font-semibold uppercase tracking-wider mb-2">
                Trending Skills Missing
              </p>
              <div className="flex flex-wrap gap-2">
                {result.trending_skills_missing.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs bg-green-900/30 text-green-300 border border-green-800 px-2.5 py-1 rounded-full"
                  >
                    + {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.outdated_topics.length > 0 && (
            <div>
              <p className="text-xs text-red-400 font-semibold uppercase tracking-wider mb-2">
                Outdated Topics Flagged
              </p>
              <div className="flex flex-wrap gap-2">
                {result.outdated_topics.map((topic, i) => (
                  <span
                    key={i}
                    className="text-xs bg-red-900/30 text-red-300 border border-red-800 px-2.5 py-1 rounded-full"
                  >
                    ✕ {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
