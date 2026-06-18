'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import type { AuditResult } from '@/app/faculty/(dashboard)/audit/AuditResultsView';

export default function PdfDownloadButton({
  result,
  subject,
  semester,
}: {
  result: AuditResult;
  subject: string;
  semester: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleDownload() {
    setLoading(true);
    setError('');
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
      a.download = `audit-${subject || 'report'}-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setError('PDF download failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-white hover:bg-[#F6F9FC] border border-[#E3E8EE] hover:border-[#CFD7DF] text-[#0A2540] font-medium py-3 px-5 rounded-xl transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <svg className="w-4 h-4 animate-spin text-[#635BFF]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <Download className="w-4 h-4 text-[#635BFF]" strokeWidth={1.5} />
        )}
        {loading ? 'Generating PDF…' : 'Download as PDF'}
      </button>
      {error && <p className="text-[#DF1B41] text-xs mt-2">{error}</p>}
    </div>
  );
}
