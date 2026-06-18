'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2, X } from 'lucide-react';

interface Props {
  facultyId: string;
  facultyName: string;
}

export default function DeleteFacultyButton({ facultyId, facultyName }: Props) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  async function handleDelete() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/faculty/${facultyId}`, { method: 'DELETE' });
      const data = await res.json() as { error?: string };
      if (!res.ok) {
        setError(data.error ?? 'Delete failed. Please try again.');
        return;
      }
      setOpen(false);
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap"
        title="Delete faculty"
      >
        <Trash2 className="w-3 h-3" strokeWidth={2} />
        Delete
      </button>

      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === overlayRef.current && !loading) setOpen(false); }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 relative">
            <button
              onClick={() => setOpen(false)}
              disabled={loading}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#8898AA] hover:text-[#0A2540] hover:bg-[#F6F9FC] transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>

            <div className="mb-5">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center mb-4">
                <Trash2 className="w-5 h-5 text-red-500" strokeWidth={1.5} />
              </div>
              <h2 className="text-lg font-bold tracking-tight text-[#0A2540] mb-2">Delete Faculty?</h2>
              <p className="text-sm text-[#425466] leading-relaxed">
                This will permanently delete{' '}
                <span className="font-semibold text-[#0A2540]">{facultyName}</span> and all their
                audits, assignments, and topic checks. This cannot be undone.
              </p>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-[#DF1B41] text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="flex-1 border border-[#E3E8EE] text-[#425466] hover:bg-[#F6F9FC] font-medium py-2.5 rounded-lg transition-colors text-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Permanently'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
