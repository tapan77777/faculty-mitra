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

export default function FacultyLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [designation, setDesignation] = useState('Faculty');
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{10}$/.test(phone) || !name.trim()) {
      setError('Please enter a valid 10-digit phone number and your name.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const checkRes = await fetch('/api/faculty/check-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const checkData = await checkRes.json() as { exists?: boolean; error?: string };

      if (!checkRes.ok) {
        setError(checkData.error ?? 'Something went wrong. Please try again.');
        return;
      }

      if (checkData.exists) {
        // Returning user — log in immediately
        await submitLogin();
      } else {
        // New user — reveal extra fields
        setIsNewUser(true);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!college.trim()) {
      setError('Please enter your college or institution name.');
      return;
    }
    setLoading(true);
    setError('');
    await submitLogin();
  }

  async function submitLogin() {
    try {
      const res = await fetch('/api/faculty/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, name, college, designation }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error ?? 'Login failed. Please try again.');
        return;
      }
      router.push('/faculty/dashboard');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    'w-full bg-[#0A2E2A] border border-teal-800 rounded-lg px-4 py-2.5 text-white placeholder-teal-700 focus:outline-none focus:border-teal-500 text-sm';

  return (
    <div className="min-h-screen bg-[#051c19] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-600 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">FacultyMitra</h1>
          <p className="text-teal-400 text-sm mt-1">Faculty Portal</p>
        </div>

        <div className="bg-[#0d2420] border border-teal-900 rounded-2xl p-8">
          {!isNewUser ? (
            <>
              <h2 className="text-lg font-semibold text-white mb-1">Sign in</h2>
              <p className="text-teal-500 text-xs mb-6">New here? We&apos;ll create your account automatically.</p>

              {error && (
                <div className="mb-4 px-4 py-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleContinue} className="space-y-4">
                <div>
                  <label className="block text-sm text-teal-300 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    required
                    placeholder="10-digit number"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm text-teal-300 mb-1.5">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Full name"
                    className={inputCls}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || phone.length !== 10 || !name.trim()}
                  className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors text-sm mt-2"
                >
                  {loading ? 'Checking...' : 'Continue'}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1">
                <button
                  onClick={() => { setIsNewUser(false); setError(''); }}
                  className="text-teal-500 hover:text-teal-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-lg font-semibold text-white">Create Account</h2>
              </div>
              <p className="text-teal-500 text-xs mb-6 ml-6">A few more details to get started</p>

              {error && (
                <div className="mb-4 px-4 py-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm text-teal-300 mb-1.5">College / Institution</label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    required
                    autoFocus
                    placeholder="e.g. K.J. Somaiya College"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm text-teal-300 mb-1.5">Your Role</label>
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
                <button
                  type="submit"
                  disabled={loading || !college.trim()}
                  className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors text-sm mt-2"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
