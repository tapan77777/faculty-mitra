'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import { Pencil, Clock, RefreshCw, Briefcase, CheckCircle2, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import AIThinkingLoader from '@/components/ui/AIThinkingLoader';

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
    cls: 'bg-[#F0FFF4] border-[#A7F3D0] text-[#0E9F6E]',
    icon: <CheckCircle2 className="w-8 h-8" strokeWidth={1.5} />,
    summary: 'This topic is highly relevant and worth teaching',
  },
  SKIP: {
    label: 'SKIP IT',
    cls: 'bg-[#FEF2F2] border-[#FECACA] text-[#DC2626]',
    icon: <XCircle className="w-8 h-8" strokeWidth={1.5} />,
    summary: 'This topic has limited value for current students',
  },
  PARTIAL: {
    label: 'PARTIAL',
    cls: 'bg-[#FFFBEB] border-[#FDE68A] text-[#D97706]',
    icon: <AlertTriangle className="w-8 h-8" strokeWidth={1.5} />,
    summary: 'Teach selectively — some parts are useful',
  },
};

export default function TopicClient({ initialSubject }: { initialSubject: string }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState(initialSubject);
  const [loading, setLoading] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);
  const [pendingResult, setPendingResult] = useState<TopicResult | null>(null);
  const [result, setResult] = useState<TopicResult | null>(null);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setLoaderDone(false);
    setPendingResult(null);
    setError('');
    let success = false;
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
      setPendingResult(data);
      setLoaderDone(true);
      success = true;
    } catch {
      setError('Network error. Please try again.');
    } finally {
      if (!success) setLoading(false);
    }
  }

  function handleLoaderComplete() {
    if (pendingResult) { setResult(pendingResult); setStep(2); }
    setLoading(false);
    setLoaderDone(false);
    setPendingResult(null);
  }

  function handleReset() {
    setStep(1);
    setTopic('');
    setResult(null);
    setError('');
  }

  const inputCls = 'w-full border border-[#E3E8EE] focus:ring-2 focus:ring-[#635BFF] focus:border-[#635BFF] rounded-lg py-2.5 px-4 text-sm bg-white text-[#0A2540] placeholder-[#8898AA] outline-none transition-all';

  // ── Step 1: Input ───────────────────────────────────────────────────
  if (step === 1) {
    return (
      <div className="max-w-xl space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#0A2540]">Check a Topic</h2>
          <p className="text-[#425466] text-sm mt-0.5">
            Find out if a topic is worth teaching to Indian students in 2026
          </p>
        </div>

        <div className="bg-white border border-[#E3E8EE] rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-[#425466] font-medium mb-1.5">Topic to Check</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                autoFocus
                placeholder="e.g. Blockchain, Web3, Pascal, COBOL, Docker"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-sm text-[#425466] font-medium mb-1.5">
                Subject Context <span className="text-[#8898AA]">(optional)</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Computer Science, BCA, MCA"
                className={inputCls}
              />
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-[#DF1B41] text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="w-full bg-[#635BFF] hover:bg-[#5851DB] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Pencil className="w-4 h-4" strokeWidth={1.5} />
                  Check Topic
                </>
              )}
            </button>
          </form>
        </div>

        <AnimatePresence>
          {loading && (
            <AIThinkingLoader
              feature="topic"
              estimatedSeconds={6}
              done={loaderDone}
              onComplete={handleLoaderComplete}
            />
          )}
        </AnimatePresence>
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
          <h2 className="text-xl font-bold tracking-tight text-[#0A2540]">Topic Analysis</h2>
          <p className="text-[#425466] text-sm mt-0.5">{topic}</p>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-[#425466] hover:text-[#0A2540] border border-[#E3E8EE] hover:border-[#CFD7DF] bg-white px-3 py-1.5 rounded-lg transition-colors"
        >
          New Topic
        </button>
      </div>

      {/* Verdict card */}
      <div className={`border rounded-2xl p-6 ${vc.cls}`}>
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-shrink-0">
            {vc.icon}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-0.5">Verdict</p>
            <p className="text-2xl font-bold tracking-tight">{vc.label}</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed opacity-90">{result.why}</p>
      </div>

      {/* Industry use cases */}
      {result.use_cases.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-[#0A2540] mb-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#635BFF]" strokeWidth={1.5} />
            Indian Industry Use Cases
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.use_cases.map((uc, i) => (
              <div key={i} className="bg-white border border-[#E3E8EE] rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-[#635BFF] bg-[#F0F0FF] px-2 py-0.5 rounded-md">
                    {uc.sector}
                  </span>
                  <span className="text-xs text-[#0A2540] font-semibold">{uc.company}</span>
                </div>
                <p className="text-[#425466] text-xs leading-relaxed">{uc.use}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teach in 1 class guide */}
      {result.teach_guide.length > 0 && (
        <div className="bg-white border border-[#E3E8EE] rounded-xl overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 border-b border-[#E3E8EE]">
            <h4 className="text-sm font-semibold text-[#0A2540]">Teach It in 1 Class</h4>
            <p className="text-xs text-[#8898AA] mt-0.5">Hour-by-hour breakdown</p>
          </div>
          <div className="divide-y divide-[#E3E8EE]">
            {result.teach_guide.map((h) => (
              <div key={h.hour} className="px-5 py-4 flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#F0F0FF] border border-[#635BFF]/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-[#635BFF]">{h.hour}</span>
                </div>
                <div>
                  <p className="text-[#0A2540] text-sm font-semibold mb-1">{h.title}</p>
                  <p className="text-[#425466] text-xs leading-relaxed">{h.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Career opportunities */}
      {result.careers.length > 0 && (
        <div className="bg-white border border-[#E3E8EE] rounded-xl overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 border-b border-[#E3E8EE]">
            <h4 className="text-sm font-semibold text-[#0A2540]">Career Opportunities in India</h4>
          </div>
          <div className="divide-y divide-[#E3E8EE]">
            {result.careers.map((c, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[#0A2540] text-sm font-medium">{c.role}</p>
                  <p className="text-[#8898AA] text-xs mt-0.5">{c.companies}</p>
                </div>
                <span className="flex-shrink-0 text-xs font-semibold text-[#0E9F6E] bg-[#F0FFF4] border border-[#A7F3D0] px-2.5 py-1 rounded-md">
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
          className="flex-1 flex items-center justify-center gap-2 bg-[#F0FFF4] hover:bg-green-50 border border-[#A7F3D0] hover:border-green-300 text-[#0E9F6E] font-medium py-3 rounded-xl transition-colors text-sm"
        >
          <Pencil className="w-4 h-4" strokeWidth={1.5} />
          Generate Assignment
        </Link>

        <Link
          href="/faculty/history"
          className="flex-1 flex items-center justify-center gap-2 bg-[#F0F0FF] hover:bg-indigo-50 border border-[#635BFF]/20 hover:border-[#635BFF]/40 text-[#635BFF] font-medium py-3 rounded-xl transition-colors text-sm"
        >
          <Clock className="w-4 h-4" strokeWidth={1.5} />
          Save to History
        </Link>

        <button
          onClick={handleReset}
          className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-[#F6F9FC] border border-[#E3E8EE] text-[#425466] font-medium py-3 rounded-xl transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
          New Topic
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-[#DF1B41] text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
