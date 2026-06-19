'use client';

import { useState } from 'react';
import LogDetailModal from './LogDetailModal';

const intentLabels: Record<string, string> = {
  AUDIT_WEB: 'Audit',
  ASSIGN_WEB: 'Assign',
  TOPIC_WEB: 'Topic',
};

const intentColors: Record<string, string> = {
  AUDIT_WEB: 'bg-blue-50 text-blue-700 border-blue-200',
  ASSIGN_WEB: 'bg-green-50 text-green-700 border-green-200',
  TOPIC_WEB: 'bg-purple-50 text-purple-700 border-purple-200',
};

interface Log {
  id: string;
  intent: string;
  input_text: string;
  response_text: string;
  created_at: string;
}

export default function ActivityTimeline({ logs }: { logs: Log[] }) {
  const [viewLog, setViewLog] = useState<Log | null>(null);

  if (logs.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="text-[#425466] text-sm">No interactions recorded yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="divide-y divide-[#E3E8EE]">
        {logs.map((log) => (
          <div key={log.id} className="px-6 py-4 hover:bg-[#F6F9FC] transition-colors">
            <div className="flex items-start gap-4">
              <span
                className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-md border mt-0.5 ${intentColors[log.intent] ?? 'bg-[#F6F9FC] text-[#425466] border-[#E3E8EE]'}`}
              >
                {intentLabels[log.intent] ?? log.intent}
              </span>

              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-xs text-[#8898AA] font-medium">
                  {new Date(log.created_at).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
                <p className="text-sm text-[#0A2540] truncate">
                  {log.input_text?.slice(0, 100)}{log.input_text?.length > 100 ? '…' : ''}
                </p>
                <p className="text-xs text-[#8898AA] truncate">
                  {log.response_text?.slice(0, 200)}{log.response_text?.length > 200 ? '…' : ''}
                </p>
              </div>

              <button
                onClick={() => setViewLog(log)}
                className="flex-shrink-0 text-xs text-[#635BFF] hover:text-[#5851DB] border border-[#635BFF]/30 hover:border-[#635BFF] hover:bg-[#F0F0FF] px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap"
              >
                View Full
              </button>
            </div>
          </div>
        ))}
      </div>

      {viewLog && <LogDetailModal log={viewLog} onClose={() => setViewLog(null)} />}
    </>
  );
}
