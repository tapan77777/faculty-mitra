export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Welcome card */}
      <div className="bg-white border border-[#E3E8EE] rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-4 bg-[#E3E8EE] rounded w-32" />
            <div className="h-7 bg-[#E3E8EE] rounded w-48" />
            <div className="h-3.5 bg-[#E3E8EE] rounded w-40 mt-1" />
          </div>
          <div className="w-10 h-10 rounded-full bg-[#E3E8EE]" />
        </div>
      </div>

      {/* Industry Pulse skeleton */}
      <div className="bg-white border border-[#E3E8EE] rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-[#E3E8EE] rounded w-36" />
          <div className="h-5 bg-[#E3E8EE] rounded w-20" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#F6F9FC] rounded-xl p-3 space-y-1.5">
              <div className="h-3 bg-[#E3E8EE] rounded w-full" />
              <div className="h-5 bg-[#E3E8EE] rounded w-12" />
            </div>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-[#E3E8EE] rounded-xl p-5 shadow-sm space-y-2">
            <div className="h-3.5 bg-[#E3E8EE] rounded w-24" />
            <div className="h-8 bg-[#E3E8EE] rounded w-16" />
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-[#E3E8EE] rounded-2xl p-5 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-lg bg-[#E3E8EE]" />
            <div className="h-4 bg-[#E3E8EE] rounded w-28" />
            <div className="h-3 bg-[#E3E8EE] rounded w-full" />
            <div className="h-3 bg-[#E3E8EE] rounded w-4/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
