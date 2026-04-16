export default function ListsLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-32 rounded-lg skeleton" />
        <div className="h-9 w-36 rounded-xl skeleton" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
            <div className="aspect-[16/7] skeleton" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-3/4 rounded skeleton" />
              <div className="h-3 w-1/2 rounded skeleton" />
              <div className="flex gap-3 mt-1">
                <div className="h-3 w-16 rounded skeleton" />
                <div className="h-3 w-14 rounded skeleton" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
