'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const intentLabels: Record<string, string> = {
  AUDIT_WEB: 'Syllabus Audit',
  ASSIGN_WEB: 'Assignment',
  TOPIC_WEB: 'Topic Check',
};

interface Log {
  id: string;
  intent: string;
  input_text: string;
  response_text: string;
  created_at: string;
}

export default function LogDetailModal({ log, onClose }: { log: Log; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  let parsedOutput: unknown = null;
  try { parsedOutput = JSON.parse(log.response_text); } catch { /* raw text */ }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E3E8EE] flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-[#0A2540]">{intentLabels[log.intent] ?? log.intent}</h2>
            <p className="text-xs text-[#8898AA] mt-0.5">
              {new Date(log.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8898AA] hover:text-[#0A2540] hover:bg-[#F6F9FC] transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-auto p-6 space-y-5">
          {/* Input */}
          <div>
            <p className="text-xs font-semibold text-[#8898AA] uppercase tracking-wider mb-2">Input</p>
            <div className="bg-[#F6F9FC] border border-[#E3E8EE] rounded-xl p-4 max-h-48 overflow-auto">
              <pre className="text-xs text-[#0A2540] whitespace-pre-wrap font-mono leading-relaxed">
                {log.input_text}
              </pre>
            </div>
          </div>

          {/* Output */}
          <div>
            <p className="text-xs font-semibold text-[#8898AA] uppercase tracking-wider mb-2">Output</p>
            <div className="bg-[#F6F9FC] border border-[#E3E8EE] rounded-xl p-4 max-h-64 overflow-auto">
              <pre className="text-xs text-[#0A2540] whitespace-pre-wrap font-mono leading-relaxed">
                {parsedOutput
                  ? JSON.stringify(parsedOutput, null, 2)
                  : log.response_text}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
