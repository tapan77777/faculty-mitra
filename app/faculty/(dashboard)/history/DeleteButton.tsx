'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export default function DeleteButton({
  id,
  variant = 'icon',
}: {
  id: string;
  variant?: 'icon' | 'full';
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await fetch(`/api/faculty/history/${id}`, { method: 'DELETE' });
    setLoading(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      {variant === 'icon' ? (
        <button
          onClick={() => setOpen(true)}
          title="Delete"
          className="text-[#8898AA] hover:text-red-500 transition-colors p-1 rounded"
        >
          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
          Delete
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
          <div className="bg-white border border-[#E3E8EE] rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-[#0A2540] font-semibold text-base mb-2">Delete this record?</h3>
            <p className="text-[#425466] text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl border border-[#E3E8EE] text-[#425466] hover:text-[#0A2540] hover:border-[#CFD7DF] text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
