import Link from 'next/link';
import { getAllConversations } from '@/lib/admin-data';
import { formatDate } from '@/lib/time-utils';

const intentBadge: Record<string, string> = {
  AUDIT: 'bg-blue-900/50 text-blue-300 border-blue-700',
  ASSIGN: 'bg-green-900/50 text-green-300 border-green-700',
  TOPIC: 'bg-purple-900/50 text-purple-300 border-purple-700',
};

const PAGE_SIZE = 20;

export default async function ConversationsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10));
  const { rows, total } = await getAllConversations(page);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Conversations</h2>
          <p className="text-teal-500 text-sm mt-0.5">All AI interactions with faculty</p>
        </div>
        <span className="text-sm font-semibold text-teal-300 bg-teal-900/40 border border-teal-800 px-3 py-1.5 rounded-full">
          {total} total
        </span>
      </div>

      <div className="bg-[#0d2420] border border-teal-900 rounded-xl overflow-hidden">
        {rows.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-teal-600 text-sm">No conversations yet.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-teal-900 bg-[#0A2E2A]/50">
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-teal-500 uppercase tracking-wider">Faculty</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-teal-500 uppercase tracking-wider">Intent</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-teal-500 uppercase tracking-wider">Input</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-teal-500 uppercase tracking-wider">AI Response</th>
                    <th className="text-right px-6 py-3.5 text-xs font-semibold text-teal-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b border-teal-900/40 hover:bg-teal-900/10 transition-colors align-top">
                      <td className="px-6 py-4 min-w-[140px]">
                        <p className="text-white font-medium">{row.faculty_name ?? '—'}</p>
                        {row.faculty_college && (
                          <p className="text-teal-500 text-xs mt-0.5">{row.faculty_college}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded border ${intentBadge[row.intent] ?? 'bg-gray-800 text-gray-300 border-gray-600'}`}
                        >
                          {row.intent}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-[200px]">
                        <p className="text-teal-300 text-xs leading-relaxed line-clamp-3">
                          {row.input_text?.slice(0, 100)}{row.input_text?.length > 100 ? '…' : ''}
                        </p>
                      </td>
                      <td className="px-6 py-4 max-w-[260px]">
                        <p className="text-teal-500 text-xs leading-relaxed line-clamp-3">
                          {row.response_text?.slice(0, 150)}{row.response_text?.length > 150 ? '…' : ''}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right text-teal-600 text-xs whitespace-nowrap">
                        {row.created_at ? formatDate(row.created_at) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-teal-900 flex items-center justify-between">
              <p className="text-xs text-teal-500">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={`/admin/conversations?page=${page - 1}`}
                    className="px-3 py-1.5 text-xs bg-teal-900/50 border border-teal-800 text-teal-300 rounded-lg hover:bg-teal-800 transition-colors"
                  >
                    ← Prev
                  </Link>
                )}
                <span className="px-3 py-1.5 text-xs bg-teal-600/20 border border-teal-600 text-teal-300 rounded-lg">
                  {page} / {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={`/admin/conversations?page=${page + 1}`}
                    className="px-3 py-1.5 text-xs bg-teal-900/50 border border-teal-800 text-teal-300 rounded-lg hover:bg-teal-800 transition-colors"
                  >
                    Next →
                  </Link>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
