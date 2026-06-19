import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getFacultyLogs } from '@/lib/admin-data';
import { formatDistanceToNow, formatDate } from '@/lib/time-utils';
import { CheckCircle2, ArrowLeft, MessageSquare, Calendar, Clock } from 'lucide-react';
import FacultyDetailActions from './FacultyDetailActions';
import ActivityTimeline from './ActivityTimeline';

const languageLabels: Record<string, string> = { en: 'English', hi: 'Hindi' };

export default async function FacultyDetailPage({ params }: { params: { id: string } }) {
  const [{ data: profile }, logs] = await Promise.all([
    supabase.from('faculty_profiles').select('*').eq('id', params.id).single(),
    getFacultyLogs(params.id),
  ]);

  if (!profile) notFound();

  const audits = logs.filter((l) => l.intent === 'AUDIT_WEB').length;
  const assignments = logs.filter((l) => l.intent === 'ASSIGN_WEB').length;
  const topics = logs.filter((l) => l.intent === 'TOPIC_WEB').length;

  const stats = [
    { label: 'Audits',      value: audits,                    color: 'text-blue-600',  bg: 'bg-blue-50 border-blue-200' },
    { label: 'Assignments', value: assignments,                color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
    { label: 'Topics',      value: topics,                    color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
    { label: 'Total',       value: profile.message_count ?? 0, color: 'text-[#635BFF]', bg: 'bg-[#F0F0FF] border-[#635BFF]/20' },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back + actions row */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/faculty"
          className="flex items-center gap-1.5 text-sm text-[#425466] hover:text-[#0A2540] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Back to Faculty
        </Link>
        <FacultyDetailActions faculty={profile} />
      </div>

      {/* Profile card */}
      <div className="bg-white border border-[#E3E8EE] rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#F0F0FF] flex items-center justify-center flex-shrink-0 text-2xl font-bold text-[#635BFF]">
            {profile.name?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-bold tracking-tight text-[#0A2540]">{profile.name}</h2>
              {profile.is_verified && (
                <span className="flex items-center gap-1 text-xs font-semibold text-[#0E9F6E] bg-[#F0FFF4] border border-[#A7F3D0] px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" strokeWidth={2.5} />
                  Verified
                </span>
              )}
              {profile.designation === 'Evaluator / Judge' && (
                <span className="text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded-md">
                  JUDGE
                </span>
              )}
            </div>
            <p className="text-[#425466] text-sm mt-0.5">{profile.college || '—'}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-[#8898AA] flex-wrap">
              <span>{profile.designation || 'Faculty'}</span>
              {profile.subject && <><span>·</span><span>{profile.subject}</span></>}
              <span>·</span>
              <span>{languageLabels[profile.language] ?? profile.language}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-[#E3E8EE]">
          <div className="flex items-center gap-2 text-sm">
            <MessageSquare className="w-4 h-4 text-[#635BFF]" strokeWidth={1.5} />
            <div>
              <p className="text-xs text-[#8898AA]">Messages</p>
              <p className="font-semibold text-[#0A2540]">{profile.message_count ?? 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-[#635BFF]" strokeWidth={1.5} />
            <div>
              <p className="text-xs text-[#8898AA]">Joined</p>
              <p className="font-semibold text-[#0A2540]">{profile.created_at ? formatDate(profile.created_at) : '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-[#635BFF]" strokeWidth={1.5} />
            <div>
              <p className="text-xs text-[#8898AA]">Last Active</p>
              <p className="font-semibold text-[#0A2540]">{profile.last_active ? formatDistanceToNow(profile.last_active) : '—'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className={`border rounded-xl p-4 ${s.bg}`}>
            <p className="text-xs text-[#8898AA] font-medium">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Activity timeline */}
      <div className="bg-white border border-[#E3E8EE] rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#E3E8EE]">
          <h3 className="text-base font-semibold text-[#0A2540]">Activity Timeline</h3>
          <p className="text-xs text-[#8898AA] mt-0.5">{logs.length} interactions · newest first</p>
        </div>
        <ActivityTimeline logs={logs} />
      </div>
    </div>
  );
}
