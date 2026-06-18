'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProfileData {
  name: string;
  college: string;
  subject: string;
  language: string;
  phone_hash: string;
}

export default function ProfileClient({ profile }: { profile: ProfileData }) {
  const router = useRouter();
  const [name, setName] = useState(profile.name);
  const [college, setCollege] = useState(profile.college);
  const [subject, setSubject] = useState(profile.subject);
  const [language, setLanguage] = useState(profile.language || 'English');
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
        body: JSON.stringify({ name, college, subject, language }),
      });
      const data = await res.json();
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

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Edit Profile</h2>
        <p className="text-teal-500 text-sm mt-0.5">Update your name, college, and subject</p>
      </div>

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
            className="w-full bg-[#0A2E2A] border border-teal-800 rounded-lg px-4 py-2.5 text-white placeholder-teal-700 focus:outline-none focus:border-teal-500 text-sm"
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
            className="w-full bg-[#0A2E2A] border border-teal-800 rounded-lg px-4 py-2.5 text-white placeholder-teal-700 focus:outline-none focus:border-teal-500 text-sm"
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
            className="w-full bg-[#0A2E2A] border border-teal-800 rounded-lg px-4 py-2.5 text-white placeholder-teal-700 focus:outline-none focus:border-teal-500 text-sm"
          />
          <p className="text-teal-600 text-xs mt-1.5">
            💡 Tip: Use <span className="text-teal-400">BCA, MCA, CSE, ECE, ME, MBA,</span> or <span className="text-teal-400">B.Com</span> for live Industry Pulse data
          </p>
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
            className="w-full bg-[#0A2E2A] border border-teal-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-teal-500 text-sm appearance-none"
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
