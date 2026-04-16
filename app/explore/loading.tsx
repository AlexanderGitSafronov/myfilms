export default function ExploreLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      <div className="h-8 w-32 rounded-lg skeleton" />
      <div>
        <div className="h-5 w-40 rounded skeleton mb-4" />
        <div className="flex gap-3 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-28">
              <div className="aspect-[2/3] rounded-xl skeleton mb-2" />
              <div className="h-3 w-20 rounded skeleton" />
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="h-5 w-44 rounded skeleton mb-4" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
              <div className="aspect-[16/7] skeleton" />
              <div className="p-3 space-y-2">
                <div className="h-4 w-3/4 rounded skeleton" />
                <div className="h-3 w-1/2 rounded skeleton" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
