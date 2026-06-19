import {
  getTotalFaculty,
  getTotalMessages,
  getMostUsedFeature,
  getActiveToday,
  getFeatureBreakdown,
  getRecentActivity,
  getJudges,
} from '@/lib/admin-data';
import { formatDistanceToNow } from '@/lib/time-utils';
import { Users, MessageSquare, Trophy, Zap, CheckCircle2, Award } from 'lucide-react';

const intentColors: Record<string, string> = {
  AUDIT:  'bg-blue-50 text-blue-700 border-blue-200',
  ASSIGN: 'bg-green-50 text-green-700 border-green-200',
  TOPIC:  'bg-purple-50 text-purple-700 border-purple-200',
};

const intentBarColors: Record<string, string> = {
  AUDIT:  'bg-blue-500',
  ASSIGN: 'bg-[#0E9F6E]',
  TOPIC:  'bg-purple-500',
};

export default async function OverviewPage() {
  const [total, messages, topFeature, activeToday, breakdown, activity, judges] = await Promise.all([
    getTotalFaculty(),
    getTotalMessages(),
    getMostUsedFeature(),
    getActiveToday(),
    getFeatureBreakdown(),
    getRecentActivity(10),
    getJudges(),
  ]);

  const maxCount = Math.max(breakdown.AUDIT, breakdown.ASSIGN, breakdown.TOPIC, 1);

  const stats = [
    { label: 'Total Faculty',   value: total,       icon: <Users className="w-8 h-8 text-[#635BFF] opacity-60" strokeWidth={1.5} />,          sub: 'Onboarded' },
    { label: 'Total Messages',  value: messages,    icon: <MessageSquare className="w-8 h-8 text-[#635BFF] opacity-60" strokeWidth={1.5} />,   sub: 'All time' },
    { label: 'Top Feature',     value: topFeature,  icon: <Trophy className="w-8 h-8 text-[#635BFF] opacity-60" strokeWidth={1.5} />,          sub: 'Most used' },
    { label: 'Active Today',    value: activeToday, icon: <Zap className="w-8 h-8 text-[#635BFF] opacity-60" strokeWidth={1.5} />,             sub: 'Faculty' },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#0A2540]">Overview</h2>
        <p className="text-[#425466] text-sm mt-0.5">Real-time usage statistics</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-[#E3E8EE] rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-4 right-4">{s.icon}</div>
            <div className="text-3xl font-bold text-[#0A2540]">{s.value}</div>
            <div className="text-sm text-[#425466] mt-1 leading-tight">{s.label}</div>
            <div className="text-xs text-[#8898AA] mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature usage chart */}
        <div className="bg-white border border-[#E3E8EE] rounded-xl p-6">
          <h3 className="text-base font-semibold text-[#0A2540] mb-1">Usage by Feature</h3>
          <p className="text-xs text-[#8898AA] mb-5">Total interactions per intent</p>
          <div className="space-y-4">
            {(['AUDIT', 'ASSIGN', 'TOPIC'] as const).map((key) => {
              const count = breakdown[key];
              const pct = Math.round((count / maxCount) * 100);
              return (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${intentColors[key]}`}>
                      {key}
                    </span>
                    <span className="text-sm font-bold text-[#0A2540]">{count}</span>
                  </div>
                  <div className="w-full bg-[#E3E8EE] rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${intentBarColors[key]} transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-[#E3E8EE] flex justify-between text-xs text-[#8898AA]">
            <span>Total: {breakdown.AUDIT + breakdown.ASSIGN + breakdown.TOPIC} interactions</span>
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white border border-[#E3E8EE] rounded-xl p-6">
          <h3 className="text-base font-semibold text-[#0A2540] mb-1">Recent Activity</h3>
          <p className="text-xs text-[#8898AA] mb-4">Last 10 interactions</p>
          {activity.length === 0 ? (
            <p className="text-[#425466] text-sm">No activity yet.</p>
          ) : (
            <div className="space-y-3">
              {activity.map((item) => (
                <div key={item.id} className="flex items-start gap-3 py-2 border-b border-[#E3E8EE] last:border-0">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-md border flex-shrink-0 mt-0.5 ${intentColors[item.intent] ?? 'bg-[#F6F9FC] text-[#425466] border-[#E3E8EE]'}`}
                  >
                    {item.intent}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm text-[#0A2540] font-medium truncate">
                        {item.faculty_name ?? 'Unknown'}
                        {item.faculty_college && (
                          <span className="text-[#8898AA] font-normal"> · {item.faculty_college}</span>
                        )}
                      </p>
                      {item.faculty_is_verified && (
                        <span title="Verified Faculty" className="flex-shrink-0 flex items-center gap-0.5 text-xs font-semibold text-[#0E9F6E] bg-[#F0FFF4] border border-[#A7F3D0] px-1.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-2.5 h-2.5" strokeWidth={2.5} />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#8898AA] truncate">{item.input_text?.slice(0, 60)}…</p>
                  </div>
                  <span className="text-xs text-[#8898AA] flex-shrink-0">
                    {formatDistanceToNow(item.created_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Judge Sessions */}
      <div className="bg-white border border-purple-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-purple-100 bg-purple-50/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-600" strokeWidth={1.5} />
            <h3 className="text-base font-semibold text-[#0A2540]">Judge Sessions</h3>
          </div>
          <span className="text-xs font-semibold text-purple-700 bg-purple-100 border border-purple-200 px-2.5 py-1 rounded-full">
            {judges.length} {judges.length === 1 ? 'judge' : 'judges'}
          </span>
        </div>
        {judges.length === 0 ? (
          <p className="px-6 py-8 text-[#425466] text-sm">No judges logged in yet.</p>
        ) : (
          <div className="divide-y divide-[#E3E8EE]">
            {judges.map((j) => (
              <div key={j.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-purple-50/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-700 flex-shrink-0">
                    {j.name?.charAt(0)?.toUpperCase() ?? '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0A2540]">{j.name}</p>
                    <p className="text-xs text-[#8898AA]">{j.college || '—'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#8898AA]">{j.last_active ? formatDistanceToNow(j.last_active) : '—'}</p>
                  <p className="text-xs font-semibold text-purple-700">{j.message_count ?? 0} msgs</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Faculty table */}
      <div className="bg-white border border-[#E3E8EE] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E3E8EE] flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#0A2540]">Faculty</h3>
            <p className="text-xs text-[#8898AA] mt-0.5">All onboarded faculty</p>
          </div>
          <span className="text-xs text-[#425466] bg-[#F6F9FC] border border-[#E3E8EE] px-2.5 py-1 rounded-md">{total} total</span>
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
    return <p className="px-6 py-8 text-[#425466] text-sm">No faculty onboarded yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#E3E8EE] bg-[#F6F9FC]">
            <th className="text-left px-6 py-3 text-xs font-semibold text-[#8898AA] uppercase tracking-wider">Name</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-[#8898AA] uppercase tracking-wider">College</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-[#8898AA] uppercase tracking-wider">Subject</th>
            <th className="text-right px-6 py-3 text-xs font-semibold text-[#8898AA] uppercase tracking-wider">Messages</th>
            <th className="text-right px-6 py-3 text-xs font-semibold text-[#8898AA] uppercase tracking-wider">Last Active</th>
          </tr>
        </thead>
        <tbody>
          {faculty.slice(0, 8).map((f) => (
            <tr key={f.id} className="border-b border-[#E3E8EE] hover:bg-[#F6F9FC] transition-colors">
              <td className="px-6 py-3 text-[#0A2540] font-medium">{f.name}</td>
              <td className="px-6 py-3 text-[#425466]">{f.college}</td>
              <td className="px-6 py-3 text-[#8898AA]">{f.subject}</td>
              <td className="px-6 py-3 text-right text-[#0A2540] font-semibold">{f.message_count ?? 0}</td>
              <td className="px-6 py-3 text-right text-[#8898AA] text-xs">
                {f.last_active ? formatDistanceToNow(f.last_active) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
