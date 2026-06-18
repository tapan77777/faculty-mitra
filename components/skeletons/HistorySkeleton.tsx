export default function HistorySkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 bg-[#E3E8EE] rounded w-24" />
          <div className="h-3.5 bg-[#E3E8EE] rounded w-48" />
        </div>
        <div className="h-7 bg-[#E3E8EE] rounded w-16" />
      </div>

      {/* List items */}
      <div className="bg-white border border-[#E3E8EE] rounded-2xl overflow-hidden shadow-sm">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="px-6 py-4 border-b border-[#E3E8EE] last:border-0 flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-[#E3E8EE] flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-[#E3E8EE] rounded w-3/4" />
              <div className="h-3 bg-[#E3E8EE] rounded w-1/2" />
            </div>
            <div className="h-3 bg-[#E3E8EE] rounded w-20 flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
