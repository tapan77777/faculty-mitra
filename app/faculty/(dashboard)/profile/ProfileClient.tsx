'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';

const DESIGNATIONS = [
  'Faculty',
  'HoD / Department Head',
  'Trainer / Corporate Educator',
  'Student (exploring)',
  'Evaluator / Judge',
  'Other',
];

interface ProfileData {
  name: string;
  college: string;
  subject: string;
  language: string;
  designation: string;
  is_verified: boolean;
  phone_hash: string;
}

export default function ProfileClient({ profile }: { profile: ProfileData }) {
  const router = useRouter();
  const [name, setName] = useState(profile.name);
  const [college, setCollege] = useState(profile.college);
  const [subject, setSubject] = useState(profile.subject);
  const [language, setLanguage] = useState(profile.language || 'English');
  const [designation, setDesignation] = useState(profile.designation || 'Faculty');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');
    setSaved(false);

    try {
      const res = await fetch('/api/faculty/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, college, subject, language, designation }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error ?? 'Save failed. Please try again.');
        return;
      }
      setSaved(true);
      setTimeout(() => router.push('/faculty/dashboard'), 1200);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    'w-full border border-[#E3E8EE] focus:ring-2 focus:ring-[#635BFF] focus:border-[#635BFF] rounded-lg py-2.5 px-4 text-sm bg-white text-[#0A2540] placeholder-[#8898AA] outline-none transition-all';

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#0A2540]">Edit Profile</h2>
          <p className="text-[#425466] text-sm mt-0.5">Update your name, college, and subject</p>
        </div>
        {profile.is_verified && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-[#0E9F6E] bg-[#F0FFF4] border border-[#A7F3D0] px-3 py-1.5 rounded-full flex-shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
            Verified Faculty
          </span>
        )}
      </div>

      {!profile.is_verified && (
        <div className="px-4 py-3 bg-[#F6F9FC] border border-[#E3E8EE] rounded-lg text-[#8898AA] text-xs">
          Verification available for institutional users in Phase 3
        </div>
      )}

      <div className="bg-white border border-[#E3E8EE] rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm text-[#425466] font-medium mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Dr. Priya Sharma"
              className={inputCls}
            />
          </div>

          {/* College */}
          <div>
            <label className="block text-sm text-[#425466] font-medium mb-1.5">College / Institution</label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="e.g. K.J. Somaiya College of Engineering"
              className={inputCls}
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm text-[#425466] font-medium mb-1.5">Subject / Department</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Computer Science"
              className={inputCls}
            />
            <p className="text-[#8898AA] text-xs mt-1.5">
              Tip: Use <span className="text-[#635BFF]">BCA, MCA, CSE, ECE, ME, MBA,</span> or <span className="text-[#635BFF]">B.Com</span> for live Industry Pulse data
            </p>
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm text-[#425466] font-medium mb-1.5">Designation</label>
            <select
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className={`${inputCls} appearance-none`}
            >
              {DESIGNATIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Phone (read-only) */}
          <div>
            <label className="block text-sm text-[#425466] font-medium mb-1.5">Phone Number</label>
            <input
              type="text"
              value="••••••••••"
              disabled
              className="w-full bg-[#F6F9FC] border border-[#E3E8EE] rounded-lg px-4 py-2.5 text-[#8898AA] text-sm cursor-not-allowed"
            />
            <p className="text-[#8898AA] text-xs mt-1">Phone number cannot be changed</p>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm text-[#425466] font-medium mb-1.5">Language Preference</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`${inputCls} appearance-none`}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-[#DF1B41] text-sm">
              {error}
            </div>
          )}

          {saved && (
            <div className="px-4 py-3 bg-[#F0FFF4] border border-[#A7F3D0] rounded-lg text-[#0E9F6E] text-sm font-medium">
              Profile updated successfully
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full bg-[#635BFF] hover:bg-[#5851DB] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3.5 rounded-xl transition-colors text-sm"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
