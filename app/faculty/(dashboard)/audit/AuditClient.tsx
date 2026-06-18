'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuditResultsView from './AuditResultsView';
import { ClipboardList, Download, RefreshCw, Pencil, Loader2 } from 'lucide-react';
import AILoader from '@/components/AILoader';

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

  const inputCls = 'w-full border border-[#E3E8EE] focus:ring-2 focus:ring-[#635BFF] focus:border-[#635BFF] rounded-lg py-2.5 px-4 text-sm bg-white text-[#0A2540] placeholder-[#8898AA] outline-none transition-all';

  // ── Step 1: Input Form ──────────────────────────────────────────────
  if (step === 1) {
    return (
      <div className="max-w-3xl space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#0A2540]">Audit My Syllabus</h2>
          <p className="text-[#425466] text-sm mt-0.5">
            Paste your syllabus below and get an AI-powered industry relevance analysis
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
                  placeholder="e.g. Computer Networking"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm text-[#425466] font-medium mb-1.5">Semester</label>
                <input
                  type="text"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  placeholder="e.g. 3rd Semester"
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm text-[#425466] font-medium">Syllabus Content</label>
                <button
                  type="button"
                  onClick={() => {
                    setSyllabus(SAMPLE_SYLLABUS);
                    setSubject('Computer Networking');
                    setSemester('3rd Semester');
                  }}
                  className="text-xs text-[#635BFF] hover:text-[#5851DB] transition-colors underline underline-offset-2"
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
                className="w-full border border-[#E3E8EE] focus:ring-2 focus:ring-[#635BFF] focus:border-[#635BFF] rounded-xl px-4 py-3 text-sm bg-white text-[#0A2540] placeholder-[#8898AA] outline-none transition-all resize-none leading-relaxed"
              />
              <p className="text-xs text-[#8898AA] mt-1.5">
                Include unit names, topics, and hours for the best analysis
              </p>
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-[#DF1B41] text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !syllabus.trim()}
              className="w-full bg-[#635BFF] hover:bg-[#5851DB] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <ClipboardList className="w-4 h-4" strokeWidth={1.5} />
                  Analyze Syllabus
                </>
              )}
            </button>
          </form>
        </div>

        {loading && <AILoader type="audit" />}
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
          <h2 className="text-xl font-bold tracking-tight text-[#0A2540]">Audit Results</h2>
          <p className="text-[#425466] text-sm mt-0.5">
            {subject || 'Syllabus'}
            {semester ? ` · ${semester}` : ''}
          </p>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-[#425466] hover:text-[#0A2540] transition-colors border border-[#E3E8EE] hover:border-[#CFD7DF] bg-white px-3 py-1.5 rounded-lg"
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
          className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-[#F6F9FC] border border-[#E3E8EE] hover:border-[#CFD7DF] text-[#0A2540] font-medium py-3 rounded-xl transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pdfLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#635BFF]" />
          ) : (
            <Download className="w-4 h-4 text-[#635BFF]" strokeWidth={1.5} />
          )}
          {pdfLoading ? 'Generating PDF…' : 'Download as PDF'}
        </button>

        {updatesNeeded > 0 && (
          <Link
            href={`/faculty/assign?from=audit&topics=${encodeURIComponent(updateTopicNames)}`}
            className="flex-1 flex items-center justify-center gap-2 bg-[#F0FFF4] hover:bg-green-50 border border-[#A7F3D0] hover:border-green-300 text-[#0E9F6E] font-medium py-3 rounded-xl transition-colors text-sm"
          >
            <Pencil className="w-4 h-4" strokeWidth={1.5} />
            Generate Assignment for Updated Topics
          </Link>
        )}

        <button
          onClick={handleReset}
          className="sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-[#F6F9FC] border border-[#E3E8EE] text-[#425466] font-medium py-3 px-5 rounded-xl transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
          New Audit
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
