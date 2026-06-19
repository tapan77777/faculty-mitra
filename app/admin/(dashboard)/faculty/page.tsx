'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { formatDistanceToNow, formatDate } from '@/lib/time-utils';
import VerifyButton from './VerifyButton';
import EditFacultyModal from './EditFacultyModal';
import DeleteFacultyButton from './DeleteFacultyButton';
import { CheckCircle2, Pencil, Eye, Search, X } from 'lucide-react';

const languageLabels: Record<string, string> = { en: 'English', hi: 'Hindi' };

const FILTERS = ['All', 'Verified', 'Unverified', 'Judges', 'Faculty', 'Trainers'] as const;
type Filter = typeof FILTERS[number];

interface ActivityBreakdown {
  audits: number;
  assignments: number;
  topics: number;
}

interface FacultyRow {
  id: string;
  name: string;
  college: string;
  designation: string;
  subject: string;
  language: string;
  is_verified: boolean;
  message_count: number;
  created_at: string;
  last_active: string;
  activity: ActivityBreakdown;
}

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<FacultyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FacultyRow | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('All');

  async function loadFaculty() {
    setLoading(true);
    const res = await fetch('/api/admin/faculty');
    if (res.ok) {
      const data = await res.json() as FacultyRow[];
      setFaculty(data);
    }
    setLoading(false);
  }

  useEffect(() => { void loadFaculty(); }, []);

  const filtered = useMemo(() => {
    let list = faculty;

    if (filter === 'Verified') list = list.filter((f) => f.is_verified);
    else if (filter === 'Unverified') list = list.filter((f) => !f.is_verified);
    else if (filter === 'Judges') list = list.filter((f) => f.designation === 'Evaluator / Judge');
    else if (filter === 'Faculty') list = list.filter((f) => f.designation === 'Faculty' || !f.designation);
    else if (filter === 'Trainers') list = list.filter((f) => f.designation === 'Trainer / Corporate Educator');

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.name?.toLowerCase().includes(q) ||
          f.college?.toLowerCase().includes(q) ||
          f.subject?.toLowerCase().includes(q) ||
          f.designation?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [faculty, filter, search]);

  function activityLabel(a: ActivityBreakdown) {
    const total = a.audits + a.assignments + a.topics;
    if (total === 0) return '—';
    return `${a.audits}a · ${a.assignments}as · ${a.topics}t`;
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-7 bg-[#E3E8EE] rounded w-32" />
        <div className="bg-white border border-[#E3E8EE] rounded-xl h-64" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5 max-w-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#0A2540]">Faculty</h2>
            <p className="text-[#425466] text-sm mt-0.5">All onboarded faculty, sorted by activity</p>
          </div>
          <span className="text-sm font-semibold text-[#425466] bg-[#F6F9FC] border border-[#E3E8EE] px-3 py-1.5 rounded-md">
            {filtered.length} / {faculty.length}
          </span>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8898AA]" strokeWidth={1.5} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, college, subject..."
              className="w-full pl-9 pr-8 py-2 border border-[#E3E8EE] focus:ring-2 focus:ring-[#635BFF] focus:border-[#635BFF] rounded-lg text-sm bg-white text-[#0A2540] placeholder-[#8898AA] outline-none transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8898AA] hover:text-[#0A2540]">
                <X className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                  filter === f
                    ? 'bg-[#635BFF] text-white border-[#635BFF]'
                    : 'bg-white text-[#425466] border-[#E3E8EE] hover:bg-[#F6F9FC] hover:text-[#0A2540]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#E3E8EE] rounded-xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-[#425466] text-sm">
                {search || filter !== 'All' ? 'No faculty match your filters.' : 'No faculty onboarded yet.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E3E8EE] bg-[#F6F9FC]">
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#8898AA] uppercase tracking-wider">#</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#8898AA] uppercase tracking-wider">Name</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#8898AA] uppercase tracking-wider">College</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#8898AA] uppercase tracking-wider">Subject</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#8898AA] uppercase tracking-wider">Status</th>
                    <th className="text-center px-4 py-3.5 text-xs font-semibold text-[#8898AA] uppercase tracking-wider">Activity</th>
                    <th className="text-right px-4 py-3.5 text-xs font-semibold text-[#8898AA] uppercase tracking-wider">Msgs</th>
                    <th className="text-right px-4 py-3.5 text-xs font-semibold text-[#8898AA] uppercase tracking-wider">Joined</th>
                    <th className="text-right px-4 py-3.5 text-xs font-semibold text-[#8898AA] uppercase tracking-wider">Last Active</th>
                    <th className="text-right px-4 py-3.5 text-xs font-semibold text-[#8898AA] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((f, i) => (
                    <tr key={f.id} className="border-b border-[#E3E8EE] hover:bg-[#F6F9FC] transition-colors">
                      <td className="px-4 py-3.5 text-[#8898AA] text-xs">{i + 1}</td>

                      {/* Name */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#F0F0FF] flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#635BFF]">
                            {f.name?.charAt(0)?.toUpperCase() ?? '?'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[#0A2540] font-medium text-xs truncate max-w-[120px]">{f.name}</p>
                            <p className="text-[#8898AA] text-[10px] truncate max-w-[120px]">{f.designation || 'Faculty'}</p>
                          </div>
                          {f.designation === 'Evaluator / Judge' && (
                            <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded-md flex-shrink-0">
                              JUDGE
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-[#425466] text-xs max-w-[140px] truncate">{f.college || '—'}</td>
                      <td className="px-4 py-3.5 text-[#425466] text-xs max-w-[120px] truncate">{f.subject || '—'}</td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        {f.is_verified ? (
                          <span className="flex items-center gap-1 text-xs font-semibold text-[#0E9F6E] bg-[#F0FFF4] border border-[#A7F3D0] px-2 py-0.5 rounded-full w-fit">
                            <CheckCircle2 className="w-3 h-3" strokeWidth={2.5} />
                            Verified
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-[#8898AA]">—</span>
                            <VerifyButton facultyId={f.id} />
                          </div>
                        )}
                      </td>

                      {/* Activity */}
                      <td className="px-4 py-3.5 text-center">
                        {f.activity && (f.activity.audits + f.activity.assignments + f.activity.topics > 0) ? (
                          <div className="flex items-center justify-center gap-1.5 text-[10px] font-medium">
                            <span className="bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded">
                              {f.activity.audits}a
                            </span>
                            <span className="bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded">
                              {f.activity.assignments}as
                            </span>
                            <span className="bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded">
                              {f.activity.topics}t
                            </span>
                          </div>
                        ) : (
                          <span className="text-[#8898AA] text-xs">—</span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <span className="text-[#0A2540] font-bold text-xs">{f.message_count ?? 0}</span>
                      </td>
                      <td className="px-4 py-3.5 text-right text-[#8898AA] text-xs whitespace-nowrap">
                        {f.created_at ? formatDate(f.created_at) : '—'}
                      </td>
                      <td className="px-4 py-3.5 text-right text-[#8898AA] text-xs whitespace-nowrap">
                        {f.last_active ? formatDistanceToNow(f.last_active) : '—'}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/faculty/${f.id}`}
                            className="inline-flex items-center gap-1 text-xs text-[#425466] hover:text-[#0A2540] border border-[#E3E8EE] hover:border-[#CFD7DF] hover:bg-[#F6F9FC] px-2 py-1 rounded-lg transition-colors whitespace-nowrap"
                          >
                            <Eye className="w-3 h-3" strokeWidth={2} />
                            View
                          </Link>
                          <button
                            onClick={() => setEditing(f)}
                            className="inline-flex items-center gap-1 text-xs text-[#635BFF] hover:text-[#5851DB] border border-[#635BFF]/30 hover:border-[#635BFF] hover:bg-[#F0F0FF] px-2 py-1 rounded-lg transition-colors whitespace-nowrap"
                          >
                            <Pencil className="w-3 h-3" strokeWidth={2} />
                            Edit
                          </button>
                          <DeleteFacultyButton facultyId={f.id} facultyName={f.name} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {editing && (
        <EditFacultyModal
          faculty={editing}
          onClose={() => {
            setEditing(null);
            void loadFaculty();
          }}
        />
      )}
    </>
  );
}
