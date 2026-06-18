'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pencil, Download, RefreshCw, Clock, CheckCircle2, ClipboardList, Briefcase, Lightbulb, ChevronDown, Loader2 } from 'lucide-react';
import AILoader from '@/components/AILoader';

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

  const inputCls = 'w-full border border-[#E3E8EE] focus:ring-2 focus:ring-[#635BFF] focus:border-[#635BFF] rounded-lg py-2.5 px-4 text-sm bg-white text-[#0A2540] placeholder-[#8898AA] outline-none transition-all';

  // ── Step 1: Input Form ──────────────────────────────────────────────
  if (step === 1) {
    return (
      <div className="max-w-2xl space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#0A2540]">Generate Assignment</h2>
          <p className="text-[#425466] text-sm mt-0.5">
            Create a practical, project-based assignment for your students
          </p>
        </div>

        <div className="bg-white border border-[#E3E8EE] rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#425466] font-medium mb-1.5">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Database Systems"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm text-[#425466] font-medium mb-1.5">Semester</label>
                <input
                  type="text"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  placeholder="e.g. 4th Semester"
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#425466] font-medium mb-1.5">Topic / Unit Name</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                placeholder="e.g. SQL Joins, Cloud Basics, REST APIs"
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#425466] font-medium mb-1.5">Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
                  className={`${inputCls} appearance-none`}
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#425466] font-medium mb-1.5">Hours for Assignment</label>
                <input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  min="1"
                  max="40"
                  placeholder="3"
                  className={inputCls}
                />
              </div>
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
                  Generating...
                </>
              ) : (
                <>
                  <Pencil className="w-4 h-4" strokeWidth={1.5} />
                  Generate Assignment
                </>
              )}
            </button>
          </form>
        </div>

        {loading && <AILoader type="assign" />}
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
          <h2 className="text-xl font-bold tracking-tight text-[#0A2540]">Assignment Generated</h2>
          <p className="text-[#425466] text-sm mt-0.5">
            {topic}{difficulty ? ` · ${difficulty}` : ''}{hours ? ` · ${hours}h` : ''}
          </p>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-[#425466] hover:text-[#0A2540] border border-[#E3E8EE] hover:border-[#CFD7DF] bg-white px-3 py-1.5 rounded-lg transition-colors"
        >
          New Assignment
        </button>
      </div>

      {/* Project title + overview */}
      <div className="bg-gradient-to-br from-[#F0FFF4] to-white border border-[#A7F3D0] rounded-2xl p-6">
        <p className="text-xs text-[#0E9F6E] font-semibold uppercase tracking-wider mb-2">Project</p>
        <h3 className="text-2xl font-bold tracking-tight text-[#0A2540] mb-3">{result.title}</h3>
        <p className="text-[#425466] text-sm leading-relaxed">{result.overview}</p>
      </div>

      {/* Learning objectives */}
      <div className="bg-white border border-[#E3E8EE] rounded-xl p-5 shadow-sm">
        <h4 className="text-sm font-semibold text-[#0A2540] mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#635BFF]" strokeWidth={1.5} />
          Learning Objectives
        </h4>
        <ul className="space-y-2">
          {result.objectives.map((obj, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-[#425466]">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#F0F0FF] border border-[#635BFF]/20 flex items-center justify-center text-xs text-[#635BFF] font-semibold mt-0.5">{i + 1}</span>
              {obj}
            </li>
          ))}
        </ul>
      </div>

      {/* Tasks */}
      <div>
        <h4 className="text-sm font-semibold text-[#0A2540] mb-3 flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-[#635BFF]" strokeWidth={1.5} />
          Tasks
        </h4>
        <div className="space-y-3">
          {result.tasks.map((task) => (
            <div key={task.number} className="bg-white border border-[#E3E8EE] rounded-xl p-4 flex gap-4 shadow-sm">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#635BFF] flex items-center justify-center text-xs font-bold text-white">
                {task.number}
              </span>
              <div>
                <p className="text-[#0A2540] text-sm font-semibold mb-1">{task.title}</p>
                <p className="text-[#425466] text-xs leading-relaxed">{task.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rubric */}
      <div className="bg-white border border-[#E3E8EE] rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 border-b border-[#E3E8EE] flex items-center justify-between">
          <h4 className="text-sm font-semibold text-[#0A2540]">Evaluation Rubric</h4>
          <span className="text-xs text-[#425466] bg-[#F6F9FC] border border-[#E3E8EE] px-2.5 py-1 rounded-md">{totalMarks} marks total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#E3E8EE] bg-[#F6F9FC]">
                <th className="text-left px-5 py-2.5 text-[#8898AA] font-semibold uppercase tracking-wider">Criteria</th>
                <th className="text-right px-5 py-2.5 text-[#8898AA] font-semibold uppercase tracking-wider w-20">Marks</th>
                <th className="text-left px-5 py-2.5 text-[#8898AA] font-semibold uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody>
              {result.rubric.map((row, i) => (
                <tr key={i} className={`border-b border-[#E3E8EE] last:border-0 ${i % 2 === 1 ? 'bg-[#F6F9FC]' : 'bg-white'}`}>
                  <td className="px-5 py-2.5 text-[#0A2540] font-medium">{row.criteria}</td>
                  <td className="px-5 py-2.5 text-right text-[#635BFF] font-semibold">{row.marks}</td>
                  <td className="px-5 py-2.5 text-[#425466] leading-relaxed">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hints (collapsible) */}
      {result.hints.length > 0 && (
        <div className="bg-white border border-[#E3E8EE] rounded-xl overflow-hidden shadow-sm">
          <button
            onClick={() => setHintsOpen(!hintsOpen)}
            className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-[#F6F9FC] transition-colors"
          >
            <span className="text-sm font-semibold text-[#0A2540] flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#F59E0B]" strokeWidth={1.5} />
              Hints for Students ({result.hints.length})
            </span>
            <ChevronDown
              className={`w-4 h-4 text-[#8898AA] transition-transform ${hintsOpen ? 'rotate-180' : ''}`}
              strokeWidth={1.5}
            />
          </button>
          {hintsOpen && (
            <div className="px-5 pb-4 pt-1 border-t border-[#E3E8EE] space-y-2">
              {result.hints.map((hint, i) => (
                <p key={i} className="text-[#425466] text-xs leading-relaxed flex items-start gap-2">
                  <span className="text-[#F59E0B] flex-shrink-0">•</span>
                  {hint}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Industry context */}
      {result.industry_context && (
        <div className="bg-white border border-[#E3E8EE] rounded-xl p-5 shadow-sm">
          <h4 className="text-sm font-semibold text-[#0A2540] mb-2 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#635BFF]" strokeWidth={1.5} />
            Indian Industry Context
          </h4>
          <p className="text-[#425466] text-xs leading-relaxed">{result.industry_context}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pb-2">
        <button
          onClick={handleDownloadPdf}
          disabled={pdfLoading}
          className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-[#F6F9FC] border border-[#E3E8EE] hover:border-[#CFD7DF] text-[#0A2540] font-medium py-3 rounded-xl transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pdfLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#635BFF]" />
          ) : (
            <Download className="w-4 h-4 text-[#635BFF]" strokeWidth={1.5} />
          )}
          {pdfLoading ? 'Generating PDF…' : 'Download as PDF'}
        </button>

        <button
          onClick={handleReset}
          className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-[#F6F9FC] border border-[#E3E8EE] text-[#425466] font-medium py-3 rounded-xl transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
          New Assignment
        </button>

        <Link
          href="/faculty/history"
          className="flex-1 flex items-center justify-center gap-2 bg-[#F0F0FF] hover:bg-indigo-50 border border-[#635BFF]/20 hover:border-[#635BFF]/40 text-[#635BFF] font-medium py-3 rounded-xl transition-colors text-sm"
        >
          <Clock className="w-4 h-4" strokeWidth={1.5} />
          Save to History
        </Link>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-[#DF1B41] text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
