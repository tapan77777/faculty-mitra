import Link from 'next/link';
import { cookies } from 'next/headers';
import { getFacultyByPhoneHash, getFacultyStats, getFacultyRecentActivity } from '@/lib/faculty-data';
import { formatDistanceToNow } from '@/lib/time-utils';
import { getIndustryPulse } from '@/lib/industry-pulse';
import type { IndustryPulse } from '@/lib/industry-pulse';
import {
  BarChart3, TrendingUp, AlertTriangle, Briefcase,
  ClipboardList, Pencil, BookOpen, Zap, CheckCircle2,
  ArrowRight,
} from 'lucide-react';

function IndustryPulsePanel({
  pulse,
  subject,
  isDefault = false,
  isJudge = false,
}: {
  pulse: IndustryPulse | null;
  subject: string;
  isDefault?: boolean;
  isJudge?: boolean;
}) {
  if (!pulse) {
    return (
      <div className="bg-white border border-[#E3E8EE] rounded-2xl p-6 space-y-2">
        <p className="text-[#0A2540] font-semibold text-sm flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#635BFF]" strokeWidth={1.5} />
          Industry Pulse for <span className="text-[#635BFF]">{subject || 'your subject'}</span> — Coming Soon
        </p>
        <p className="text-[#425466] text-xs leading-relaxed">
          Currently live for: Computer Science (BCA / MCA / CSE), Electronics &amp; Communication (ECE),
          Mechanical Engineering (ME), MBA / PGDM, Commerce (B.Com / M.Com)
        </p>
        <p className="text-[#8898AA] text-xs">
          Want your subject added?{' '}
          <a href="mailto:hello@facultymitra.com" className="text-[#635BFF] hover:text-[#5851DB] underline transition-colors">
            hello@facultymitra.com
          </a>
        </p>
      </div>
    );
  }

  const updatedDate = new Date(pulse.last_updated).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div className="bg-white border border-[#E3E8EE] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E3E8EE] bg-gradient-to-r from-[#F0F0FF] to-white">
        <div>
          <h3 className="text-[#0A2540] font-bold text-base flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#635BFF]" strokeWidth={1.5} />
            Industry Pulse — <span className="text-[#635BFF]">{pulse.subject}</span>
            <span className="text-[#8898AA] font-medium"> · {pulse.quarter}</span>
          </h3>
          <p className="text-[#8898AA] text-xs mt-0.5">Skills employers are hiring vs. phasing out right now</p>
        </div>
        <span className="flex-shrink-0 text-xs text-[#8898AA] bg-[#F6F9FC] border border-[#E3E8EE] px-2.5 py-1 rounded-full whitespace-nowrap">
          Updated {updatedDate}
        </span>
      </div>

      {/* Contextual banner — default or judge */}
      {isJudge && (
        <div className="px-6 py-2 bg-purple-50 border-b border-purple-100 flex items-center gap-2">
          <span className="text-xs text-purple-700 font-medium">
            👨‍⚖️ Judge View — Sample data for demonstration
          </span>
        </div>
      )}
      {isDefault && !isJudge && (
        <div className="px-6 py-2 bg-indigo-50/60 border-b border-indigo-100 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Showing trends for{' '}
            <span className="font-medium text-indigo-600">Computer Science</span>{' '}
            <span className="text-slate-400">(default)</span>
          </p>
          <Link
            href="/faculty/profile"
            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors whitespace-nowrap flex-shrink-0"
          >
            Personalize →
          </Link>
        </div>
      )}

      {/* Skills columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#E3E8EE] p-5 gap-5 sm:gap-0">
        {/* Trending */}
        <div className="sm:pr-5">
          <p className="text-xs font-semibold text-[#0E9F6E] uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" strokeWidth={2} />
            Trending Skills
          </p>
          <div className="space-y-2.5">
            {pulse.trending_skills.map((skill, i) => (
              <div key={i} className="bg-[#F0FFF4] border border-[#A7F3D0] rounded-lg px-3.5 py-2.5">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="text-[#0A2540] text-sm font-semibold leading-snug">{skill.name}</span>
                  <span className="flex-shrink-0 text-xs font-bold text-[#0E9F6E] bg-white border border-[#A7F3D0] px-2 py-0.5 rounded-full">
                    {skill.growth}
                  </span>
                </div>
                <p className="text-[#425466] text-xs leading-relaxed">{skill.context}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Declining */}
        <div className="sm:pl-5">
          <p className="text-xs font-semibold text-[#DF1B41] uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" strokeWidth={2} />
            Declining Skills
          </p>
          <div className="space-y-2.5">
            {pulse.declining_skills.map((skill, i) => (
              <div key={i} className="bg-[#FEF2F2] border border-[#FECACA] rounded-lg px-3.5 py-2.5">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="text-[#0A2540] text-sm font-semibold leading-snug">{skill.name}</span>
                  <span className="flex-shrink-0 text-xs font-bold text-[#DC2626] bg-white border border-[#FECACA] px-2 py-0.5 rounded-full">
                    {skill.decline}
                  </span>
                </div>
                <p className="text-[#425466] text-xs leading-relaxed">{skill.context}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hiring companies */}
      <div className="px-5 pb-4 border-t border-[#E3E8EE] pt-4">
        <p className="text-xs font-semibold text-[#425466] mb-2.5 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-[#635BFF]" strokeWidth={1.5} />
          Companies actively hiring:
        </p>
        <div className="flex flex-wrap gap-2">
          {pulse.hiring_companies.map((company) => (
            <span
              key={company}
              className="text-xs text-[#425466] bg-[#F6F9FC] border border-[#E3E8EE] px-2.5 py-1 rounded-md"
            >
              {company}
            </span>
          ))}
        </div>
      </div>

      {/* Source */}
      {pulse.source_citation && (
        <div className="px-5 pb-4">
          <p className="text-xs text-[#8898AA]">Source: {pulse.source_citation}</p>
        </div>
      )}

      {/* Update Profile CTA — only for default (non-judge) users */}
      {isDefault && !isJudge && (
        <div className="px-5 pb-5 border-t border-[#E3E8EE] pt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-[#8898AA]">Set your subject to see personalized trends.</p>
          <Link
            href="/faculty/profile"
            className="text-xs font-medium text-[#635BFF] border border-[#635BFF]/30 hover:border-[#635BFF] hover:bg-[#F0F0FF] px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap"
          >
            Update Profile
          </Link>
        </div>
      )}
    </div>
  );
}

const intentColors: Record<string, string> = {
  AUDIT: 'bg-blue-50 text-blue-700 border-blue-200',
  ASSIGN: 'bg-green-50 text-green-700 border-green-200',
  TOPIC: 'bg-purple-50 text-purple-700 border-purple-200',
  GENERAL: 'bg-[#F6F9FC] text-[#425466] border-[#E3E8EE]',
};

const actionButtons = [
  {
    href: '/faculty/audit',
    label: 'Audit My Syllabus',
    description: 'Check your syllabus against learning outcomes',
    iconBg: 'bg-[#F0F0FF]',
    icon: <ClipboardList className="w-5 h-5 text-[#635BFF]" strokeWidth={1.5} />,
  },
  {
    href: '/faculty/assign',
    label: 'Generate Assignment',
    description: 'Create custom assignments for your students',
    iconBg: 'bg-[#F0FFF4]',
    icon: <Pencil className="w-5 h-5 text-[#0E9F6E]" strokeWidth={1.5} />,
  },
  {
    href: '/faculty/topic',
    label: 'Check a Topic',
    description: 'Get AI insights on any teaching topic',
    iconBg: 'bg-[#F5F3FF]',
    icon: <BookOpen className="w-5 h-5 text-purple-600" strokeWidth={1.5} />,
  },
];

export default async function FacultyDashboardPage() {
  const cookieStore = cookies();
  const phoneHash = cookieStore.get('faculty_session')?.value ?? '';

  const faculty = phoneHash ? await getFacultyByPhoneHash(phoneHash) : null;
  if (!faculty) return null;

  const isJudge = faculty.designation === 'Evaluator / Judge';
  const subjectForPulse = faculty.subject?.trim() || 'Computer Science';
  const isDefault = !faculty.subject?.trim();

  const [stats, activity, rawPulse] = await Promise.all([
    getFacultyStats(faculty.id),
    getFacultyRecentActivity(faculty.id, 8),
    getIndustryPulse(subjectForPulse),
  ]);

  // Fall back to CS if subject is set but has no pulse data yet
  const pulse = rawPulse ?? (subjectForPulse !== 'Computer Science' ? await getIndustryPulse('Computer Science') : null);
  const showAsDefault = isDefault || (!isDefault && !rawPulse && !!pulse);

  const statCards = [
    {
      label: 'Total Audits Done',
      value: stats.totalAudits,
      icon: <ClipboardList className="w-8 h-8 text-[#635BFF] opacity-60" strokeWidth={1.5} />,
      sub: 'Syllabus checks',
    },
    {
      label: 'Assignments Generated',
      value: stats.totalAssignments,
      icon: <Pencil className="w-8 h-8 text-[#635BFF] opacity-60" strokeWidth={1.5} />,
      sub: 'Via WhatsApp & web',
    },
    {
      label: 'Topics Checked',
      value: stats.totalTopics,
      icon: <BookOpen className="w-8 h-8 text-[#635BFF] opacity-60" strokeWidth={1.5} />,
      sub: 'AI topic insights',
    },
    {
      label: 'Last Active',
      value: faculty.last_active ? formatDistanceToNow(faculty.last_active) : 'Never',
      icon: <Zap className="w-8 h-8 text-[#635BFF] opacity-60" strokeWidth={1.5} />,
      sub: 'Most recent use',
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Welcome card */}
      <div className="bg-gradient-to-br from-[#635BFF] to-[#5851DB] rounded-2xl p-8 text-white">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h2 className="text-2xl font-bold tracking-tight">
            Hi {faculty.name.split(' ')[0]}, here&apos;s your dashboard
          </h2>
          {faculty.is_verified && (
            <span className="flex items-center gap-1 text-xs font-semibold text-white bg-white/20 border border-white/30 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" strokeWidth={2} />
              Verified
            </span>
          )}
        </div>
        <p className="opacity-80 text-sm mt-1">
          {faculty.college ? `${faculty.college} · ` : ''}
          {faculty.designation ? `${faculty.designation} · ` : ''}
          {faculty.subject || 'Faculty Portal'}
        </p>
      </div>

      {/* Industry Pulse */}
      <IndustryPulsePanel
        pulse={pulse}
        subject={faculty.subject || 'Computer Science'}
        isDefault={showAsDefault}
        isJudge={isJudge}
      />

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white border border-[#E3E8EE] rounded-2xl p-6 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              {s.icon}
            </div>
            <div className="text-3xl font-bold text-[#0A2540]">{s.value}</div>
            <div className="text-sm text-[#425466] mt-1 leading-tight">{s.label}</div>
            <div className="text-xs text-[#8898AA] mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-base font-bold tracking-tight text-[#0A2540] mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {actionButtons.map((btn) => (
            <Link
              key={btn.href}
              href={btn.href}
              className="bg-white border border-[#E3E8EE] rounded-2xl p-6 flex items-start justify-between gap-3 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg ${btn.iconBg} flex items-center justify-center flex-shrink-0`}>
                  {btn.icon}
                </div>
                <div>
                  <p className="font-semibold text-[#0A2540] text-sm">{btn.label}</p>
                  <p className="text-xs text-[#425466] mt-1">{btn.description}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#8898AA] group-hover:text-[#635BFF] transition-colors flex-shrink-0 mt-0.5" strokeWidth={1.5} />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white border border-[#E3E8EE] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E3E8EE]">
          <h3 className="text-base font-bold tracking-tight text-[#0A2540]">Recent Activity</h3>
          <p className="text-xs text-[#8898AA] mt-0.5">Your last {Math.min(activity.length, 8)} interactions</p>
        </div>

        {activity.length === 0 ? (
          <div className="text-center py-8 px-6">
            <p className="text-[#425466] text-sm">No activity yet.</p>
            <p className="text-[#8898AA] text-xs mt-1">Start by auditing your syllabus or generating an assignment.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E3E8EE]">
            {activity.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 px-6 py-3.5"
              >
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-md border flex-shrink-0 mt-0.5 ${
                    intentColors[item.intent] ?? 'bg-[#F6F9FC] text-[#425466] border-[#E3E8EE]'
                  }`}
                >
                  {item.intent}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#0A2540] truncate">{item.input_text?.slice(0, 80)}</p>
                  <p className="text-xs text-[#8898AA] truncate mt-0.5">
                    {item.response_text?.slice(0, 60)}…
                  </p>
                </div>
                <span className="text-xs text-[#8898AA] flex-shrink-0 whitespace-nowrap">
                  {formatDistanceToNow(item.created_at)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-2 text-xs text-[#8898AA]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0E9F6E] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0E9F6E]"></span>
        </span>
        All systems operational
      </div>
    </div>
  );
}
