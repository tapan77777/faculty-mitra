import {
  getTotalFaculty,
  getTotalMessages,
  getMostUsedFeature,
  getActiveToday,
  getFeatureBreakdown,
  getRecentActivity,
} from '@/lib/admin-data';
import { formatDistanceToNow } from '@/lib/time-utils';

const intentColors: Record<string, string> = {
  AUDIT: 'bg-blue-900/50 text-blue-300 border-blue-700',
  ASSIGN: 'bg-green-900/50 text-green-300 border-green-700',
  TOPIC: 'bg-purple-900/50 text-purple-300 border-purple-700',
};

const intentBarColors: Record<string, string> = {
  AUDIT: 'bg-blue-500',
  ASSIGN: 'bg-green-500',
  TOPIC: 'bg-purple-500',
};

export default async function OverviewPage() {
  const [total, messages, topFeature, activeToday, breakdown, activity] = await Promise.all([
    getTotalFaculty(),
    getTotalMessages(),
    getMostUsedFeature(),
    getActiveToday(),
    getFeatureBreakdown(),
    getRecentActivity(10),
  ]);

  const maxCount = Math.max(breakdown.AUDIT, breakdown.ASSIGN, breakdown.TOPIC, 1);

  const stats = [
    {
      label: 'Total Faculty',
      value: total,
      icon: '👩‍🏫',
      sub: 'Onboarded',
    },
    {
      label: 'Total Messages',
      value: messages,
      icon: '💬',
      sub: 'All time',
    },
    {
      label: 'Top Feature',
      value: topFeature,
      icon: '🏆',
      sub: 'Most used',
    },
    {
      label: 'Active Today',
      value: activeToday,
      icon: '⚡',
      sub: 'Faculty',
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h2 className="text-xl font-bold text-white">Overview</h2>
        <p className="text-teal-500 text-sm mt-0.5">Real-time usage statistics</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#0d2420] border border-teal-900 rounded-xl p-5">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-sm font-medium text-teal-300 mt-0.5">{s.label}</div>
            <div className="text-xs text-teal-600 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature usage chart */}
        <div className="bg-[#0d2420] border border-teal-900 rounded-xl p-6">
          <h3 className="text-base font-semibold text-white mb-1">Usage by Feature</h3>
          <p className="text-xs text-teal-500 mb-5">Total interactions per intent</p>
          <div className="space-y-4">
            {(['AUDIT', 'ASSIGN', 'TOPIC'] as const).map((key) => {
              const count = breakdown[key];
              const pct = Math.round((count / maxCount) * 100);
              return (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${intentColors[key]}`}>
                      {key}
                    </span>
                    <span className="text-sm font-bold text-white">{count}</span>
                  </div>
                  <div className="w-full bg-teal-950 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${intentBarColors[key]} transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-teal-900 flex justify-between text-xs text-teal-500">
            <span>Total: {breakdown.AUDIT + breakdown.ASSIGN + breakdown.TOPIC} interactions</span>
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-[#0d2420] border border-teal-900 rounded-xl p-6">
          <h3 className="text-base font-semibold text-white mb-1">Recent Activity</h3>
          <p className="text-xs text-teal-500 mb-4">Last 10 interactions</p>
          {activity.length === 0 ? (
            <p className="text-teal-600 text-sm">No activity yet.</p>
          ) : (
            <div className="space-y-3">
              {activity.map((item) => (
                <div key={item.id} className="flex items-start gap-3 py-2 border-b border-teal-900/50 last:border-0">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded border flex-shrink-0 mt-0.5 ${intentColors[item.intent] ?? 'bg-gray-800 text-gray-300 border-gray-600'}`}
                  >
                    {item.intent}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">
                      {item.faculty_name ?? 'Unknown'}
                      {item.faculty_college && (
                        <span className="text-teal-500 font-normal"> · {item.faculty_college}</span>
                      )}
                    </p>
                    <p className="text-xs text-teal-600 truncate">{item.input_text?.slice(0, 60)}…</p>
                  </div>
                  <span className="text-xs text-teal-600 flex-shrink-0">
                    {formatDistanceToNow(item.created_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Faculty table */}
      <div className="bg-[#0d2420] border border-teal-900 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-teal-900 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Faculty</h3>
            <p className="text-xs text-teal-500 mt-0.5">All onboarded faculty</p>
          </div>
          <span className="text-xs text-teal-400 bg-teal-900/40 px-2.5 py-1 rounded-full">{total} total</span>
        </div>
        <FacultyTableInline />
      </div>
    </div>
  );
}

async function FacultyTableInline() {
  const { getAllFaculty } = await import('@/lib/admin-data');
  const faculty = await getAllFaculty();

  if (faculty.length === 0) {
    return <p className="px-6 py-8 text-teal-600 text-sm">No faculty onboarded yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-teal-900">
            <th className="text-left px-6 py-3 text-xs font-semibold text-teal-500 uppercase tracking-wider">Name</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-teal-500 uppercase tracking-wider">College</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-teal-500 uppercase tracking-wider">Subject</th>
            <th className="text-right px-6 py-3 text-xs font-semibold text-teal-500 uppercase tracking-wider">Messages</th>
            <th className="text-right px-6 py-3 text-xs font-semibold text-teal-500 uppercase tracking-wider">Last Active</th>
          </tr>
        </thead>
        <tbody>
          {faculty.slice(0, 8).map((f) => (
            <tr key={f.id} className="border-b border-teal-900/40 hover:bg-teal-900/10 transition-colors">
              <td className="px-6 py-3 text-white font-medium">{f.name}</td>
              <td className="px-6 py-3 text-teal-300">{f.college}</td>
              <td className="px-6 py-3 text-teal-400">{f.subject}</td>
              <td className="px-6 py-3 text-right text-white font-semibold">{f.message_count ?? 0}</td>
              <td className="px-6 py-3 text-right text-teal-500 text-xs">
                {f.last_active ? formatDistanceToNow(f.last_active) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
