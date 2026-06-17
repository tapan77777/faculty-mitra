import Link from 'next/link';
import { cookies } from 'next/headers';
import { getFacultyByPhoneHash, getFacultyStats, getFacultyRecentActivity } from '@/lib/faculty-data';
import { formatDistanceToNow } from '@/lib/time-utils';

const intentColors: Record<string, string> = {
  AUDIT: 'bg-blue-900/50 text-blue-300 border-blue-700',
  ASSIGN: 'bg-green-900/50 text-green-300 border-green-700',
  TOPIC: 'bg-purple-900/50 text-purple-300 border-purple-700',
  GENERAL: 'bg-teal-900/50 text-teal-300 border-teal-700',
};

const actionButtons = [
  {
    href: '/faculty/audit',
    label: 'Audit My Syllabus',
    description: 'Check your syllabus against learning outcomes',
    color: 'from-blue-900/40 to-blue-900/10 border-blue-800 hover:border-blue-600',
    icon: (
      <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    href: '/faculty/assign',
    label: 'Generate Assignment',
    description: 'Create custom assignments for your students',
    color: 'from-green-900/40 to-green-900/10 border-green-800 hover:border-green-600',
    icon: (
      <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    href: '/faculty/topic',
    label: 'Check a Topic',
    description: 'Get AI insights on any teaching topic',
    color: 'from-purple-900/40 to-purple-900/10 border-purple-800 hover:border-purple-600',
    icon: (
      <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
];

export default async function FacultyDashboardPage() {
  const cookieStore = cookies();
  const phoneHash = cookieStore.get('faculty_session')?.value ?? '';

  const faculty = phoneHash ? await getFacultyByPhoneHash(phoneHash) : null;
  if (!faculty) return null;

  const [stats, activity] = await Promise.all([
    getFacultyStats(faculty.id),
    getFacultyRecentActivity(faculty.id, 8),
  ]);

  const statCards = [
    {
      label: 'Total Audits Done',
      value: stats.totalAudits,
      icon: '📋',
      sub: 'Syllabus checks',
    },
    {
      label: 'Assignments Generated',
      value: stats.totalAssignments,
      icon: '✏️',
      sub: 'Via WhatsApp & web',
    },
    {
      label: 'Topics Checked',
      value: stats.totalTopics,
      icon: '📚',
      sub: 'AI topic insights',
    },
    {
      label: 'Last Active',
      value: faculty.last_active ? formatDistanceToNow(faculty.last_active) : 'Never',
      icon: '⚡',
      sub: 'Most recent use',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Welcome card */}
      <div className="bg-gradient-to-r from-teal-900/40 to-teal-900/10 border border-teal-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white">
          Hi {faculty.name.split(' ')[0]}, here&apos;s your dashboard
        </h2>
        <p className="text-teal-400 text-sm mt-1">
          {faculty.college ? `${faculty.college} · ` : ''}
          {faculty.subject || 'Faculty Portal'}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-[#0d2420] border border-teal-900 rounded-xl p-5">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-sm font-medium text-teal-300 mt-0.5 leading-tight">{s.label}</div>
            <div className="text-xs text-teal-600 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div>
        <h3 className="text-base font-semibold text-white mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {actionButtons.map((btn) => (
            <Link
              key={btn.href}
              href={btn.href}
              className={`bg-gradient-to-br ${btn.color} border rounded-xl p-5 flex flex-col gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]`}
            >
              <div className="w-10 h-10 rounded-lg bg-[#051c19]/60 flex items-center justify-center">
                {btn.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{btn.label}</p>
                <p className="text-xs text-teal-400 mt-0.5">{btn.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-[#0d2420] border border-teal-900 rounded-xl p-6">
        <h3 className="text-base font-semibold text-white mb-1">Recent Activity</h3>
        <p className="text-xs text-teal-500 mb-4">Your last {Math.min(activity.length, 8)} interactions</p>

        {activity.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-teal-600 text-sm">No activity yet.</p>
            <p className="text-teal-700 text-xs mt-1">Start by auditing your syllabus or generating an assignment.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activity.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 py-2.5 border-b border-teal-900/50 last:border-0"
              >
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded border flex-shrink-0 mt-0.5 ${
                    intentColors[item.intent] ?? 'bg-gray-800 text-gray-300 border-gray-600'
                  }`}
                >
                  {item.intent}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-teal-200 truncate">{item.input_text?.slice(0, 80)}</p>
                  <p className="text-xs text-teal-600 truncate mt-0.5">
                    {item.response_text?.slice(0, 60)}…
                  </p>
                </div>
                <span className="text-xs text-teal-600 flex-shrink-0 whitespace-nowrap">
                  {formatDistanceToNow(item.created_at)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
