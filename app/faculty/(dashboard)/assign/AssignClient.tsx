'use client';

import { useState } from 'react';
import Link from 'next/link';

export interface AssignTask {
  number: number;
  title: string;
  description: string;
}
export interface AssignRubricRow {
  criteria: string;
  marks: number;
  description: string;
}
export interface AssignResult {
  title: string;
  overview: string;
  objectives: string[];
  tasks: AssignTask[];
  rubric: AssignRubricRow[];
  hints: string[];
  industry_context: string;
}

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'] as const;

export default function AssignClient({
  initialSubject,
  initialTopics,
}: {
  initialSubject: string;
  initialTopics: string;
}) {
  // Pre-fill the first topic from URL params (passed from audit page)
  const firstTopic = initialTopics ? initialTopics.split(',')[0].trim() : '';

  const [step, setStep] = useState<1 | 2>(1);
  const [subject, setSubject] = useState(initialSubject);
  const [semester, setSemester] = useState('');
  const [topic, setTopic] = useState(firstTopic);
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [hours, setHours] = useState('3');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AssignResult | null>(null);
  const [error, setError] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);
  const [hintsOpen, setHintsOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/faculty/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, semester, topic, difficulty, hours }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Generation failed. Please try again.');
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

  async function handleDownloadPdf() {
    if (!result) return;
    setPdfLoading(true);
    try {
      const res = await fetch('/api/faculty/assign/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result, subject, semester, topic, difficulty, hours }),
      });
      if (!res.ok) throw new Error('failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `assignment-${topic || 'report'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setError('PDF download failed. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  }

  function handleReset() {
    setStep(1);
    setResult(null);
    setError('');
    setHintsOpen(false);
  }

  // ── Step 1: Input Form ──────────────────────────────────────────────
  if (step === 1) {
    return (
      <div className="max-w-2xl space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white">Generate Assignment</h2>
          <p className="text-teal-500 text-sm mt-0.5">
            Create a practical, project-based assignment for your students
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-teal-300 mb-1.5">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Database Systems"
                className="w-full bg-[#0A2E2A] border border-teal-800 rounded-lg px-4 py-2.5 text-white placeholder-teal-700 focus:outline-none focus:border-teal-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-teal-300 mb-1.5">Semester</label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                placeholder="e.g. 4th Semester"
                className="w-full bg-[#0A2E2A] border border-teal-800 rounded-lg px-4 py-2.5 text-white placeholder-teal-700 focus:outline-none focus:border-teal-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-teal-300 mb-1.5">Topic / Unit Name</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              placeholder="e.g. SQL Joins, Cloud Basics, REST APIs"
              className="w-full bg-[#0A2E2A] border border-teal-800 rounded-lg px-4 py-2.5 text-white placeholder-teal-700 focus:outline-none focus:border-teal-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-teal-300 mb-1.5">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
                className="w-full bg-[#0A2E2A] border border-teal-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-teal-500 text-sm appearance-none"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-teal-300 mb-1.5">Hours for Assignment</label>
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                min="1"
                max="40"
                placeholder="3"
                className="w-full bg-[#0A2E2A] border border-teal-800 rounded-lg px-4 py-2.5 text-white placeholder-teal-700 focus:outline-none focus:border-teal-500 text-sm"
              />
            </div>
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
                Generating assignment...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Generate Assignment
              </>
            )}
          </button>
        </form>

        {loading && (
          <div className="bg-[#0d2420] border border-teal-900 rounded-xl p-5">
            <p className="text-teal-300 text-sm font-medium mb-3">Creating your assignment...</p>
            <div className="space-y-2.5">
              {['Designing learning objectives', 'Creating practical tasks', 'Building evaluation rubric', 'Adding industry context'].map((label, i) => (
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

  const totalMarks = result.rubric.reduce((sum, r) => sum + (r.marks || 0), 0);

  return (
    <div className="max-w-3xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Assignment Generated</h2>
          <p className="text-teal-500 text-sm mt-0.5">
            {topic}{difficulty ? ` · ${difficulty}` : ''}{hours ? ` · ${hours}h` : ''}
          </p>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-teal-500 hover:text-teal-300 border border-teal-800 hover:border-teal-600 px-3 py-1.5 rounded-lg transition-colors"
        >
          New Assignment
        </button>
      </div>

      {/* Project title + overview */}
      <div className="bg-gradient-to-br from-green-900/30 to-green-900/10 border border-green-800 rounded-2xl p-6">
        <p className="text-xs text-green-400 font-semibold uppercase tracking-wider mb-2">Project</p>
        <h3 className="text-2xl font-bold text-white mb-3">{result.title}</h3>
        <p className="text-green-200 text-sm leading-relaxed">{result.overview}</p>
      </div>

      {/* Learning objectives */}
      <div className="bg-[#0d2420] border border-teal-900 rounded-xl p-5">
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Learning Objectives
        </h4>
        <ul className="space-y-2">
          {result.objectives.map((obj, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-teal-200">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-900/60 border border-teal-700 flex items-center justify-center text-xs text-teal-400 font-semibold mt-0.5">{i + 1}</span>
              {obj}
            </li>
          ))}
        </ul>
      </div>

      {/* Tasks */}
      <div>
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Tasks
        </h4>
        <div className="space-y-3">
          {result.tasks.map((task) => (
            <div key={task.number} className="bg-[#0d2420] border border-teal-900 rounded-xl p-4 flex gap-4">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center text-xs font-bold text-white">
                {task.number}
              </span>
              <div>
                <p className="text-white text-sm font-semibold mb-1">{task.title}</p>
                <p className="text-teal-300 text-xs leading-relaxed">{task.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rubric */}
      <div className="bg-[#0d2420] border border-teal-900 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-teal-900 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-white">Evaluation Rubric</h4>
          <span className="text-xs text-teal-400 bg-teal-900/40 px-2.5 py-1 rounded-full">{totalMarks} marks total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-teal-900/60">
                <th className="text-left px-5 py-2.5 text-teal-500 font-semibold uppercase tracking-wider">Criteria</th>
                <th className="text-right px-5 py-2.5 text-teal-500 font-semibold uppercase tracking-wider w-20">Marks</th>
                <th className="text-left px-5 py-2.5 text-teal-500 font-semibold uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody>
              {result.rubric.map((row, i) => (
                <tr key={i} className="border-b border-teal-900/30 last:border-0 hover:bg-teal-900/10">
                  <td className="px-5 py-2.5 text-white font-medium">{row.criteria}</td>
                  <td className="px-5 py-2.5 text-right text-teal-300 font-semibold">{row.marks}</td>
                  <td className="px-5 py-2.5 text-teal-400 leading-relaxed">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hints (collapsible) */}
      {result.hints.length > 0 && (
        <div className="bg-[#0d2420] border border-amber-900/60 rounded-xl overflow-hidden">
          <button
            onClick={() => setHintsOpen(!hintsOpen)}
            className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-amber-900/10 transition-colors"
          >
            <span className="text-sm font-semibold text-amber-300 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Hints for Students ({result.hints.length})
            </span>
            <svg
              className={`w-4 h-4 text-amber-500 transition-transform ${hintsOpen ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {hintsOpen && (
            <div className="px-5 pb-4 pt-1 border-t border-amber-900/40 space-y-2">
              {result.hints.map((hint, i) => (
                <p key={i} className="text-amber-200 text-xs leading-relaxed flex items-start gap-2">
                  <span className="text-amber-500 flex-shrink-0">•</span>
                  {hint}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Industry context */}
      {result.industry_context && (
        <div className="bg-[#0d2420] border border-teal-900 rounded-xl p-5">
          <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Indian Industry Context
          </h4>
          <p className="text-teal-300 text-xs leading-relaxed">{result.industry_context}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pb-2">
        <button
          onClick={handleDownloadPdf}
          disabled={pdfLoading}
          className="flex-1 flex items-center justify-center gap-2 bg-[#0d2420] hover:bg-teal-900/30 border border-teal-800 hover:border-teal-600 text-teal-300 font-medium py-3 rounded-xl transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pdfLoading ? (
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
          {pdfLoading ? 'Generating PDF…' : 'Download as PDF'}
        </button>

        <button
          onClick={handleReset}
          className="flex-1 flex items-center justify-center gap-2 bg-[#0d2420] hover:bg-teal-900/20 border border-teal-900 hover:border-teal-700 text-teal-500 font-medium py-3 rounded-xl transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Assignment
        </button>

        <Link
          href="/faculty/history"
          className="flex-1 flex items-center justify-center gap-2 bg-teal-900/20 hover:bg-teal-900/40 border border-teal-800 hover:border-teal-600 text-teal-400 font-medium py-3 rounded-xl transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Save to History
        </Link>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
