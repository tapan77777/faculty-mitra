'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    'w-full bg-[#0A2E2A] border border-teal-800 rounded-lg px-4 py-2.5 text-white placeholder-teal-700 focus:outline-none focus:border-teal-500 text-sm';

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Edit Profile</h2>
          <p className="text-teal-500 text-sm mt-0.5">Update your name, college, and subject</p>
        </div>
        {profile.is_verified && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-green-300 bg-green-900/30 border border-green-700 px-3 py-1.5 rounded-full flex-shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Verified Faculty
          </span>
        )}
      </div>

      {!profile.is_verified && (
        <div className="px-4 py-3 bg-teal-900/20 border border-teal-800 rounded-lg text-teal-500 text-xs">
          Verification available for institutional users in Phase 3
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm text-teal-300 mb-1.5">Full Name</label>
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
          <label className="block text-sm text-teal-300 mb-1.5">College / Institution</label>
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
          <label className="block text-sm text-teal-300 mb-1.5">Subject / Department</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Computer Science"
            className={inputCls}
          />
          <p className="text-teal-600 text-xs mt-1.5">
            💡 Tip: Use <span className="text-teal-400">BCA, MCA, CSE, ECE, ME, MBA,</span> or <span className="text-teal-400">B.Com</span> for live Industry Pulse data
          </p>
        </div>

        {/* Designation */}
        <div>
          <label className="block text-sm text-teal-300 mb-1.5">Designation</label>
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
          <label className="block text-sm text-teal-300 mb-1.5">Phone Number</label>
          <input
            type="text"
            value="••••••••••"
            disabled
            className="w-full bg-[#0A2E2A]/50 border border-teal-900 rounded-lg px-4 py-2.5 text-teal-600 text-sm cursor-not-allowed"
          />
          <p className="text-teal-700 text-xs mt-1">Phone number cannot be changed</p>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm text-teal-300 mb-1.5">Language Preference</label>
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
          <div className="px-4 py-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {saved && (
          <div className="px-4 py-3 bg-green-900/30 border border-green-700 rounded-lg text-green-400 text-sm font-medium">
            Profile updated successfully ✅
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
