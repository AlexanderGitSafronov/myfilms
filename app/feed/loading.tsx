export default function FeedLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-6 w-6 rounded-full skeleton" />
        <div className="h-7 w-20 rounded-lg skeleton" />
      </div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
            {/* User row */}
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-8 w-8 rounded-full skeleton flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-48 rounded skeleton" />
              </div>
              <div className="h-3 w-14 rounded skeleton" />
            </div>
            {/* Movie row */}
            <div className="flex gap-3">
              <div className="h-24 w-16 rounded-lg skeleton flex-shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-4 w-3/4 rounded skeleton" />
                <div className="h-3 w-20 rounded skeleton" />
                <div className="flex gap-1 mt-1">
                  <div className="h-5 w-16 rounded-full skeleton" />
                  <div className="h-5 w-14 rounded-full skeleton" />
                </div>
                <div className="h-3 w-full rounded skeleton" />
                <div className="h-3 w-2/3 rounded skeleton" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
