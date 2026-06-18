'use client';

import { TrendingUp } from 'lucide-react';

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
  KEEP:   'bg-[#F0FFF4] text-[#0E9F6E] border-[#A7F3D0]',
  UPDATE: 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]',
  REMOVE: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
};

const statusIcons: Record<string, string> = {
  KEEP:   '✓',
  UPDATE: '↻',
  REMOVE: '✕',
};

export function getScoreBarColor(score: number) {
  if (score >= 80) return 'bg-[#0E9F6E]';
  if (score >= 60) return 'bg-[#635BFF]';
  if (score >= 40) return 'bg-[#F59E0B]';
  return 'bg-[#DF1B41]';
}

export function getScoreTextColor(score: number) {
  if (score >= 80) return 'text-[#0E9F6E]';
  if (score >= 60) return 'text-[#635BFF]';
  if (score >= 40) return 'text-[#F59E0B]';
  return 'text-[#DF1B41]';
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
      <div className="bg-white border border-[#E3E8EE] rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-[#8898AA] uppercase tracking-wider font-semibold mb-1">
              Relevance Score
            </p>
            <div className="flex items-baseline gap-2">
              <span className={`text-6xl font-bold tracking-tight ${getScoreTextColor(score)}`}>{score}</span>
              <span className="text-[#8898AA] text-xl">/100</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#8898AA] block mb-1">Verdict</span>
            <p className="text-[#0A2540] font-semibold text-sm max-w-[200px] text-right leading-snug">
              {result.verdict}
            </p>
          </div>
        </div>

        <div className="w-full bg-[#E3E8EE] rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full ${getScoreBarColor(score)} transition-all duration-1000`}
            style={{ width: `${score}%` }}
          />
        </div>

        <div className="flex justify-between mt-1.5 text-xs text-[#8898AA]">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>

        <div className="mt-4 pt-4 border-t border-[#E3E8EE] flex gap-4 text-xs text-[#8898AA]">
          <span>
            <span className="text-[#0A2540] font-semibold">
              {result.units.filter((u) => u.status === 'KEEP').length}
            </span>{' '}
            units to keep
          </span>
          <span>
            <span className="text-[#D97706] font-semibold">
              {result.units.filter((u) => u.status === 'UPDATE').length}
            </span>{' '}
            need update
          </span>
          <span>
            <span className="text-[#DC2626] font-semibold">
              {result.units.filter((u) => u.status === 'REMOVE').length}
            </span>{' '}
            to remove
          </span>
        </div>
      </div>

      {/* Unit cards */}
      <div>
        <h3 className="text-sm font-semibold text-[#0A2540] mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#635BFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Unit-by-Unit Analysis
        </h3>
        <div className="space-y-3">
          {result.units.map((unit, i) => (
            <div key={i} className="bg-white border border-[#E3E8EE] rounded-xl p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-[#0A2540] font-semibold text-sm leading-tight">{unit.name}</h4>
                <span
                  className={`flex-shrink-0 text-xs font-bold px-2.5 py-0.5 rounded-md border flex items-center gap-1 ${statusStyles[unit.status]}`}
                >
                  <span>{statusIcons[unit.status]}</span>
                  {unit.status}
                </span>
              </div>

              <p className="text-[#425466] text-xs leading-relaxed">{unit.reasoning}</p>

              {(unit.status === 'UPDATE' || unit.status === 'REMOVE') && unit.suggestion && (
                <div className="bg-[#F6F9FC] border border-[#E3E8EE] rounded-lg px-3.5 py-2.5">
                  <p className="text-xs text-[#8898AA] font-semibold mb-0.5 uppercase tracking-wider">
                    Suggestion
                  </p>
                  <p className="text-[#425466] text-xs leading-relaxed">{unit.suggestion}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Industry context */}
      {(result.trending_skills_missing.length > 0 || result.outdated_topics.length > 0) && (
        <div className="bg-[#F6F9FC] border border-[#E3E8EE] rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-[#0A2540] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#635BFF]" strokeWidth={1.5} />
            Industry Context
          </h3>

          {result.trending_skills_missing.length > 0 && (
            <div>
              <p className="text-xs text-[#0E9F6E] font-semibold uppercase tracking-wider mb-2">
                Trending Skills Missing
              </p>
              <div className="flex flex-wrap gap-2">
                {result.trending_skills_missing.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs bg-[#F0FFF4] text-[#0E9F6E] border border-[#A7F3D0] px-2.5 py-1 rounded-md"
                  >
                    + {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.outdated_topics.length > 0 && (
            <div>
              <p className="text-xs text-[#DC2626] font-semibold uppercase tracking-wider mb-2">
                Outdated Topics Flagged
              </p>
              <div className="flex flex-wrap gap-2">
                {result.outdated_topics.map((topic, i) => (
                  <span
                    key={i}
                    className="text-xs bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] px-2.5 py-1 rounded-md"
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
