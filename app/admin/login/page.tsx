import { loginAction } from './actions';
import { Monitor } from 'lucide-react';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const hasError = searchParams.error === '1';

  return (
    <div className="min-h-screen bg-[#F6F9FC] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#635BFF] mb-4">
            <Monitor className="w-7 h-7 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0A2540]">FacultyMitra</h1>
          <p className="text-[#425466] text-sm mt-1">Admin Dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E3E8EE] rounded-2xl shadow-sm p-8">
          <h2 className="text-lg font-bold tracking-tight text-[#0A2540] mb-6">Sign in</h2>

          {hasError && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-[#DF1B41] text-sm">
              Invalid email or password.
            </div>
          )}

          <form action={loginAction} className="space-y-4">
            <div>
              <label className="block text-sm text-[#425466] font-medium mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                required
                placeholder="admin@facultymitra.com"
                className="w-full border border-[#E3E8EE] focus:ring-2 focus:ring-[#635BFF] focus:border-[#635BFF] rounded-lg py-2.5 px-4 text-sm bg-white text-[#0A2540] placeholder-[#8898AA] outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-[#425466] font-medium mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full border border-[#E3E8EE] focus:ring-2 focus:ring-[#635BFF] focus:border-[#635BFF] rounded-lg py-2.5 px-4 text-sm bg-white text-[#0A2540] placeholder-[#8898AA] outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#635BFF] hover:bg-[#5851DB] text-white font-medium py-2.5 rounded-lg transition-colors text-sm mt-2"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
