import { facultyLoginAction } from './actions';

export default function FacultyLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const hasError = searchParams.error === '1';

  return (
    <div className="min-h-screen bg-[#051c19] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
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
          <h2 className="text-lg font-semibold text-white mb-1">Sign in</h2>
          <p className="text-teal-500 text-xs mb-6">New here? We&apos;ll create your account automatically.</p>

          {hasError && (
            <div className="mb-4 px-4 py-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">
              Please enter a valid 10-digit phone number and your name.
            </div>
          )}

          <form action={facultyLoginAction} className="space-y-4">
            <div>
              <label className="block text-sm text-teal-300 mb-1.5">Phone Number</label>
              <input
                type="tel"
                name="phone"
                required
                pattern="\d{10}"
                maxLength={10}
                placeholder="10-digit number"
                className="w-full bg-[#0A2E2A] border border-teal-800 rounded-lg px-4 py-2.5 text-white placeholder-teal-700 focus:outline-none focus:border-teal-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-teal-300 mb-1.5">Your Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Full name"
                className="w-full bg-[#0A2E2A] border border-teal-800 rounded-lg px-4 py-2.5 text-white placeholder-teal-700 focus:outline-none focus:border-teal-500 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm mt-2"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
