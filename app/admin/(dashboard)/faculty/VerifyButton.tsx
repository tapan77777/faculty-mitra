'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyButton({ facultyId }: { facultyId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleVerify() {
    setLoading(true);
    await fetch('/api/admin/faculty/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ faculty_id: facultyId }),
    });
    setDone(true);
    setLoading(false);
    router.refresh();
  }

  if (done) return null;

  return (
    <button
      onClick={handleVerify}
      disabled={loading}
      className="text-xs text-[#635BFF] hover:text-[#5851DB] border border-[#635BFF]/30 hover:border-[#635BFF] hover:bg-[#F0F0FF] px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
    >
      {loading ? '...' : 'Verify'}
    </button>
  );
}
