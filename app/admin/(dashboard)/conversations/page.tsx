import Link from 'next/link';
import { getAllConversations } from '@/lib/admin-data';
import { formatDate } from '@/lib/time-utils';

const intentBadge: Record<string, string> = {
  AUDIT:  'bg-blue-50 text-blue-700 border-blue-200',
  ASSIGN: 'bg-green-50 text-green-700 border-green-200',
  TOPIC:  'bg-purple-50 text-purple-700 border-purple-200',
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
          <h2 className="text-xl font-bold tracking-tight text-[#0A2540]">Conversations</h2>
          <p className="text-[#425466] text-sm mt-0.5">All AI interactions with faculty</p>
        </div>
        <span className="text-sm font-semibold text-[#425466] bg-[#F6F9FC] border border-[#E3E8EE] px-3 py-1.5 rounded-md">
          {total} total
        </span>
      </div>

      <div className="bg-white border border-[#E3E8EE] rounded-xl overflow-hidden">
        {rows.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-[#425466] text-sm">No conversations yet.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E3E8EE] bg-[#F6F9FC]">
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#8898AA] uppercase tracking-wider">Faculty</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#8898AA] uppercase tracking-wider">Intent</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#8898AA] uppercase tracking-wider">Input</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#8898AA] uppercase tracking-wider">AI Response</th>
                    <th className="text-right px-6 py-3.5 text-xs font-semibold text-[#8898AA] uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b border-[#E3E8EE] hover:bg-[#F6F9FC] transition-colors align-top">
                      <td className="px-6 py-4 min-w-[140px]">
                        <p className="text-[#0A2540] font-medium">{row.faculty_name ?? '—'}</p>
                        {row.faculty_college && (
                          <p className="text-[#8898AA] text-xs mt-0.5">{row.faculty_college}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${intentBadge[row.intent] ?? 'bg-[#F6F9FC] text-[#425466] border-[#E3E8EE]'}`}
                        >
                          {row.intent}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-[200px]">
                        <p className="text-[#425466] text-xs leading-relaxed line-clamp-3">
                          {row.input_text?.slice(0, 100)}{row.input_text?.length > 100 ? '…' : ''}
                        </p>
                      </td>
                      <td className="px-6 py-4 max-w-[260px]">
                        <p className="text-[#8898AA] text-xs leading-relaxed line-clamp-3">
                          {row.response_text?.slice(0, 150)}{row.response_text?.length > 150 ? '…' : ''}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right text-[#8898AA] text-xs whitespace-nowrap">
                        {row.created_at ? formatDate(row.created_at) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-[#E3E8EE] flex items-center justify-between">
              <p className="text-xs text-[#8898AA]">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={`/admin/conversations?page=${page - 1}`}
                    className="px-3 py-1.5 text-xs bg-white border border-[#E3E8EE] text-[#425466] rounded-lg hover:bg-[#F6F9FC] transition-colors"
                  >
                    ← Prev
                  </Link>
                )}
                <span className="px-3 py-1.5 text-xs bg-[#F0F0FF] border border-[#635BFF]/30 text-[#635BFF] rounded-lg">
                  {page} / {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={`/admin/conversations?page=${page + 1}`}
                    className="px-3 py-1.5 text-xs bg-white border border-[#E3E8EE] text-[#425466] rounded-lg hover:bg-[#F6F9FC] transition-colors"
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
