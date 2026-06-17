'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuditResultsView from './AuditResultsView';

export type { AuditUnit, AuditResult } from './AuditResultsView';
import type { AuditResult } from './AuditResultsView';

const SAMPLE_SYLLABUS = `Computer Networking - BCA 3rd Semester

Unit 1: Introduction to Networks - 8 hours
- Types of networks (LAN, WAN, MAN)
- Network topologies (bus, star, ring)
- OSI Reference Model

Unit 2: Microsoft Office Networking - 10 hours
- Sharing files in MS Office
- Outlook configuration
- Network printers setup

Unit 3: TCP/IP Fundamentals - 8 hours
- IP addressing basics
- Subnetting
- DNS basics

Unit 4: Network Security Basics - 6 hours
- Antivirus software
- Firewall configuration
- Password security`;

export default function AuditClient({ initialSubject }: { initialSubject: string }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [syllabus, setSyllabus] = useState('');
  const [subject, setSubject] = useState(initialSubject);
  const [semester, setSemester] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!syllabus.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/faculty/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ syllabus, subject, semester }),
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

  async function handleDownloadPdf() {
    if (!result) return;
    setPdfLoading(true);
    try {
      const res = await fetch('/api/faculty/audit/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result, subject, semester }),
      });
      if (!res.ok) throw new Error('PDF generation failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `syllabus-audit-${subject || 'report'}.pdf`;
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
    setSyllabus('');
    setResult(null);
    setError('');
  }

  // ── Step 1: Input Form ──────────────────────────────────────────────
  if (step === 1) {
    return (
      <div className="max-w-3xl space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white">Audit My Syllabus</h2>
          <p className="text-teal-500 text-sm mt-0.5">
            Paste your syllabus below and get an AI-powered industry relevance analysis
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
                placeholder="e.g. Computer Networking"
                className="w-full bg-[#0A2E2A] border border-teal-800 rounded-lg px-4 py-2.5 text-white placeholder-teal-700 focus:outline-none focus:border-teal-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-teal-300 mb-1.5">Semester</label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                placeholder="e.g. 3rd Semester"
                className="w-full bg-[#0A2E2A] border border-teal-800 rounded-lg px-4 py-2.5 text-white placeholder-teal-700 focus:outline-none focus:border-teal-500 text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm text-teal-300">Syllabus Content</label>
              <button
                type="button"
                onClick={() => {
                  setSyllabus(SAMPLE_SYLLABUS);
                  setSubject('Computer Networking');
                  setSemester('3rd Semester');
                }}
                className="text-xs text-teal-500 hover:text-teal-300 transition-colors underline underline-offset-2"
              >
                Try with sample syllabus →
              </button>
            </div>
            <textarea
              value={syllabus}
              onChange={(e) => setSyllabus(e.target.value)}
              required
              rows={14}
              placeholder="Paste your full syllabus here — units, topics, hours"
              className="w-full bg-[#0A2E2A] border border-teal-800 rounded-xl px-4 py-3 text-white placeholder-teal-700 focus:outline-none focus:border-teal-500 text-sm resize-none leading-relaxed"
            />
            <p className="text-xs text-teal-700 mt-1.5">
              Include unit names, topics, and hours for the best analysis
            </p>
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !syllabus.trim()}
            className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyzing your syllabus...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Analyze Syllabus
              </>
            )}
          </button>
        </form>

        {loading && (
          <div className="bg-[#0d2420] border border-teal-900 rounded-xl p-5">
            <p className="text-teal-300 text-sm font-medium mb-3">AI is analyzing your syllabus...</p>
            <div className="space-y-2.5">
              {[
                'Parsing unit structure',
                'Checking industry relevance',
                'Comparing with current tech trends',
                'Generating recommendations',
              ].map((label, i) => (
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

  // ── Step 2: Results View ─────────────────────────────────────────────
  if (!result) return null;

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
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Audit Results</h2>
          <p className="text-teal-500 text-sm mt-0.5">
            {subject || 'Syllabus'}
            {semester ? ` · ${semester}` : ''}
          </p>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-teal-500 hover:text-teal-300 transition-colors border border-teal-800 hover:border-teal-600 px-3 py-1.5 rounded-lg"
        >
          New Audit
        </button>
      </div>

      <AuditResultsView result={result} subject={subject} semester={semester} />

      {/* Action buttons */}
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

        {updatesNeeded > 0 && (
          <Link
            href={`/faculty/assign?from=audit&topics=${encodeURIComponent(updateTopicNames)}`}
            className="flex-1 flex items-center justify-center gap-2 bg-green-900/20 hover:bg-green-900/40 border border-green-800 hover:border-green-600 text-green-300 font-medium py-3 rounded-xl transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Generate Assignment for Updated Topics
          </Link>
        )}

        <button
          onClick={handleReset}
          className="sm:w-auto flex items-center justify-center gap-2 bg-[#0d2420] hover:bg-teal-900/20 border border-teal-900 hover:border-teal-700 text-teal-500 font-medium py-3 px-5 rounded-xl transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          New Audit
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
