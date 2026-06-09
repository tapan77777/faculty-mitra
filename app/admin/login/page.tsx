import { loginAction } from './actions';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const hasError = searchParams.error === '1';

  return (
    <div className="min-h-screen bg-[#051c19] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-600 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">FacultyMitra</h1>
          <p className="text-teal-400 text-sm mt-1">Admin Dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-[#0d2420] border border-teal-900 rounded-2xl p-8">
          <h2 className="text-lg font-semibold text-white mb-6">Sign in</h2>

          {hasError && (
            <div className="mb-4 px-4 py-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">
              Invalid email or password.
            </div>
          )}

          <form action={loginAction} className="space-y-4">
            <div>
              <label className="block text-sm text-teal-300 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                required
                placeholder="admin@facultymitra.com"
                className="w-full bg-[#0A2E2A] border border-teal-800 rounded-lg px-4 py-2.5 text-white placeholder-teal-700 focus:outline-none focus:border-teal-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-teal-300 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full bg-[#0A2E2A] border border-teal-800 rounded-lg px-4 py-2.5 text-white placeholder-teal-700 focus:outline-none focus:border-teal-500 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm mt-2"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
