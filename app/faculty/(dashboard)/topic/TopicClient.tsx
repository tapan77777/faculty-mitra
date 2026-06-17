'use client';

import { useState } from 'react';
import Link from 'next/link';

export interface TopicUseCase {
  sector: string;
  company: string;
  use: string;
}
export interface TopicTeachHour {
  hour: number;
  title: string;
  content: string;
}
export interface TopicCareer {
  role: string;
  salary: string;
  companies: string;
}
export interface TopicResult {
  verdict: 'TEACH' | 'SKIP' | 'PARTIAL';
  why: string;
  use_cases: TopicUseCase[];
  teach_guide: TopicTeachHour[];
  careers: TopicCareer[];
}

const verdictConfig = {
  TEACH: {
    label: 'TEACH IT',
    cls: 'bg-green-900/50 text-green-300 border-green-600',
    dot: 'bg-green-400',
    icon: '✓',
    summary: 'This topic is highly relevant and worth teaching',
  },
  SKIP: {
    label: 'SKIP IT',
    cls: 'bg-red-900/50 text-red-300 border-red-600',
    dot: 'bg-red-400',
    icon: '✕',
    summary: 'This topic has limited value for current students',
  },
  PARTIAL: {
    label: 'PARTIAL',
    cls: 'bg-amber-900/50 text-amber-300 border-amber-600',
    dot: 'bg-amber-400',
    icon: '~',
    summary: 'Teach selectively — some parts are useful',
  },
};

export default function TopicClient({ initialSubject }: { initialSubject: string }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState(initialSubject);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TopicResult | null>(null);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/faculty/topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, subject }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Analysis failed. Please try again.');
        return;
      }
      setResult(data);
      setStep(2);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setStep(1);
    setTopic('');
    setResult(null);
    setError('');
  }

  // ── Step 1: Input ───────────────────────────────────────────────────
  if (step === 1) {
    return (
      <div className="max-w-xl space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white">Check a Topic</h2>
          <p className="text-teal-500 text-sm mt-0.5">
            Find out if a topic is worth teaching to Indian students in 2026
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-teal-300 mb-1.5">Topic to Check</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              autoFocus
              placeholder="e.g. Blockchain, Web3, Pascal, COBOL, Docker"
              className="w-full bg-[#0A2E2A] border border-teal-800 rounded-lg px-4 py-2.5 text-white placeholder-teal-700 focus:outline-none focus:border-teal-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-teal-300 mb-1.5">
              Subject Context <span className="text-teal-600">(optional)</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Computer Science, BCA, MCA"
              className="w-full bg-[#0A2E2A] border border-teal-800 rounded-lg px-4 py-2.5 text-white placeholder-teal-700 focus:outline-none focus:border-teal-500 text-sm"
            />
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyzing topic...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Check Topic
              </>
            )}
          </button>
        </form>

        {loading && (
          <div className="bg-[#0d2420] border border-teal-900 rounded-xl p-5">
            <p className="text-teal-300 text-sm font-medium mb-3">Evaluating topic relevance...</p>
            <div className="space-y-2.5">
              {['Checking industry demand in India', 'Reviewing 2026 job market data', 'Finding real company use cases', 'Preparing teaching guide'].map((label, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-teal-600">
                  <svg className="w-3.5 h-3.5 animate-spin flex-shrink-0" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Step 2: Results ─────────────────────────────────────────────────
  if (!result) return null;

  const vc = verdictConfig[result.verdict] ?? verdictConfig.PARTIAL;

  return (
    <div className="max-w-3xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Topic Analysis</h2>
          <p className="text-teal-500 text-sm mt-0.5">{topic}</p>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-teal-500 hover:text-teal-300 border border-teal-800 hover:border-teal-600 px-3 py-1.5 rounded-lg transition-colors"
        >
          New Topic
        </button>
      </div>

      {/* Verdict card */}
      <div className={`border rounded-2xl p-6 ${vc.cls}`}>
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-xl border-2 border-current flex items-center justify-center text-2xl font-bold flex-shrink-0">
            {vc.icon}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-0.5">Verdict</p>
            <p className="text-2xl font-bold">{vc.label}</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed opacity-90">{result.why}</p>
      </div>

      {/* Industry use cases */}
      {result.use_cases.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Indian Industry Use Cases
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.use_cases.map((uc, i) => (
              <div key={i} className="bg-[#0d2420] border border-teal-900 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-teal-400 bg-teal-900/40 px-2 py-0.5 rounded-full">
                    {uc.sector}
                  </span>
                  <span className="text-xs text-white font-semibold">{uc.company}</span>
                </div>
                <p className="text-teal-300 text-xs leading-relaxed">{uc.use}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teach in 1 class guide */}
      {result.teach_guide.length > 0 && (
        <div className="bg-[#0d2420] border border-teal-900 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-teal-900">
            <h4 className="text-sm font-semibold text-white">Teach It in 1 Class</h4>
            <p className="text-xs text-teal-500 mt-0.5">Hour-by-hour breakdown</p>
          </div>
          <div className="divide-y divide-teal-900/50">
            {result.teach_guide.map((h) => (
              <div key={h.hour} className="px-5 py-4 flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-teal-900/60 border border-teal-700 flex items-center justify-center">
                  <span className="text-xs font-bold text-teal-300">{h.hour}</span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold mb-1">{h.title}</p>
                  <p className="text-teal-400 text-xs leading-relaxed">{h.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Career opportunities */}
      {result.careers.length > 0 && (
        <div className="bg-[#0d2420] border border-teal-900 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-teal-900">
            <h4 className="text-sm font-semibold text-white">Career Opportunities in India</h4>
          </div>
          <div className="divide-y divide-teal-900/50">
            {result.careers.map((c, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-white text-sm font-medium">{c.role}</p>
                  <p className="text-teal-500 text-xs mt-0.5">{c.companies}</p>
                </div>
                <span className="flex-shrink-0 text-xs font-semibold text-green-400 bg-green-900/30 border border-green-800 px-2.5 py-1 rounded-full">
                  {c.salary} LPA
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pb-2">
        <Link
          href={`/faculty/assign?from=topic&topics=${encodeURIComponent(topic)}`}
          className="flex-1 flex items-center justify-center gap-2 bg-green-900/20 hover:bg-green-900/40 border border-green-800 hover:border-green-600 text-green-300 font-medium py-3 rounded-xl transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Generate Assignment
        </Link>

        <Link
          href="/faculty/history"
          className="flex-1 flex items-center justify-center gap-2 bg-teal-900/20 hover:bg-teal-900/40 border border-teal-800 hover:border-teal-600 text-teal-400 font-medium py-3 rounded-xl transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Save to History
        </Link>

        <button
          onClick={handleReset}
          className="flex-1 flex items-center justify-center gap-2 bg-[#0d2420] hover:bg-teal-900/20 border border-teal-900 hover:border-teal-700 text-teal-500 font-medium py-3 rounded-xl transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          New Topic
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
