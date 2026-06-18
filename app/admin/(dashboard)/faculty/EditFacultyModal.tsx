'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, Loader2 } from 'lucide-react';

const DESIGNATIONS = [
  'Faculty',
  'HoD / Department Head',
  'Trainer / Corporate Educator',
  'Student (exploring)',
  'Evaluator / Judge',
  'Other',
];

interface FacultyData {
  id: string;
  name: string;
  college: string;
  subject: string;
  designation: string;
  language: string;
  is_verified: boolean;
}

interface Props {
  faculty: FacultyData;
  onClose: () => void;
}

export default function EditFacultyModal({ faculty, onClose }: Props) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState(faculty.name ?? '');
  const [college, setCollege] = useState(faculty.college ?? '');
  const [subject, setSubject] = useState(faculty.subject ?? '');
  const [designation, setDesignation] = useState(faculty.designation ?? 'Faculty');
  const [language, setLanguage] = useState(faculty.language ?? 'en');
  const [isVerified, setIsVerified] = useState(faculty.is_verified ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/faculty/${faculty.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, college, subject, designation, language, is_verified: isVerified }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) {
        setError(data.error ?? 'Update failed. Please try again.');
        return;
      }
      router.refresh();
      onClose();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    'w-full border border-[#E3E8EE] focus:ring-2 focus:ring-[#635BFF] focus:border-[#635BFF] rounded-lg py-2.5 px-3.5 text-sm bg-white text-[#0A2540] placeholder-[#8898AA] outline-none transition-all';

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#0A2540]">Edit Faculty</h2>
            <p className="text-xs text-[#8898AA] mt-0.5">{faculty.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8898AA] hover:text-[#0A2540] hover:bg-[#F6F9FC] transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-[#DF1B41] text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm text-[#425466] font-medium mb-1.5">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} />
          </div>

          <div>
            <label className="block text-sm text-[#425466] font-medium mb-1.5">College / Institution</label>
            <input type="text" value={college} onChange={(e) => setCollege(e.target.value)} className={inputCls} />
          </div>

          <div>
            <label className="block text-sm text-[#425466] font-medium mb-1.5">Subject</label>
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-[#425466] font-medium mb-1.5">Designation</label>
              <select value={designation} onChange={(e) => setDesignation(e.target.value)} className={`${inputCls} appearance-none`}>
                {DESIGNATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#425466] font-medium mb-1.5">Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className={`${inputCls} appearance-none`}>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
          </div>

          {/* Verified toggle */}
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm text-[#425466] font-medium">Verified</p>
              <p className="text-xs text-[#8898AA]">Mark faculty as verified</p>
            </div>
            <button
              type="button"
              onClick={() => setIsVerified((v) => !v)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#635BFF] focus:ring-offset-2 ${
                isVerified ? 'bg-[#635BFF]' : 'bg-[#E3E8EE]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                  isVerified ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Footer buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#E3E8EE] text-[#425466] hover:bg-[#F6F9FC] font-medium py-2.5 rounded-lg transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#635BFF] hover:bg-[#5851DB] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
