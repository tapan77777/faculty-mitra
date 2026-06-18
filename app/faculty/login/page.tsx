'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, ChevronLeft, Award } from 'lucide-react';
import AppLoader from '@/components/AppLoader';

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
  const [judgeLoading, setJudgeLoading] = useState(false);
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
        await submitLogin();
      } else {
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

  async function handleJudgeLogin() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/faculty/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: '0000000001',
          name: 'Wadhwani Evaluator',
          college: 'Wadhwani AI',
          designation: 'Evaluator / Judge',
        }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error ?? 'Quick access failed. Please try again.');
        return;
      }
      setJudgeLoading(true);
      await new Promise((r) => setTimeout(r, 2000));
      router.push('/faculty/dashboard');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    'w-full border border-[#E3E8EE] focus:ring-2 focus:ring-[#635BFF] focus:border-[#635BFF] rounded-lg py-2.5 px-4 text-sm bg-white text-[#0A2540] placeholder-[#8898AA] outline-none transition-all';

  if (judgeLoading) {
    return <AppLoader message="Setting up your evaluation experience..." />;
  }

  return (
    <div className="min-h-screen bg-[#F6F9FC] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#635BFF] mb-4">
            <BookOpen className="w-7 h-7 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0A2540]">FacultyMitra</h1>
          <p className="text-[#425466] text-sm mt-1">Faculty Portal</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E3E8EE] shadow-sm p-8">
          {!isNewUser ? (
            <>
              <h2 className="text-lg font-bold tracking-tight text-[#0A2540] mb-1">Sign in</h2>
              <p className="text-[#8898AA] text-xs mb-6">New here? We&apos;ll create your account automatically.</p>

              {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-[#DF1B41] text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleContinue} className="space-y-4">
                <div>
                  <label className="block text-sm text-[#425466] font-medium mb-1.5">Phone Number</label>
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
                  <label className="block text-sm text-[#425466] font-medium mb-1.5">Your Name</label>
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
                  className="w-full bg-[#635BFF] hover:bg-[#5851DB] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors text-sm mt-2"
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
                  className="text-[#425466] hover:text-[#0A2540] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" strokeWidth={2} />
                </button>
                <h2 className="text-lg font-bold tracking-tight text-[#0A2540]">Create Account</h2>
              </div>
              <p className="text-[#8898AA] text-xs mb-6 ml-6">A few more details to get started</p>

              {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-[#DF1B41] text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm text-[#425466] font-medium mb-1.5">College / Institution</label>
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
                  <label className="block text-sm text-[#425466] font-medium mb-1.5">Your Role</label>
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
                  className="w-full bg-[#635BFF] hover:bg-[#5851DB] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors text-sm mt-2"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Quick Judge Access */}
        <div className="mt-4">
          {/* OR divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#E3E8EE]" />
            <span className="text-xs text-[#8898AA] font-medium">OR</span>
            <div className="flex-1 h-px bg-[#E3E8EE]" />
          </div>

          <div className="bg-white rounded-2xl border border-[#635BFF]/20 p-5 text-center">
            <p className="text-sm font-semibold text-[#0A2540] mb-0.5">Hackathon Evaluator?</p>
            <p className="text-xs text-[#8898AA] mb-4">Quick access for Wadhwani AI judges</p>
            <button
              onClick={handleJudgeLogin}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 border border-[#635BFF] text-[#635BFF] hover:bg-[#F0F0FF] disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm py-2.5 rounded-lg transition-colors"
            >
              <Award className="w-4 h-4" strokeWidth={1.5} />
              {loading ? 'Signing in...' : 'Quick Judge Access →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
