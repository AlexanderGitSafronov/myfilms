export default function ProfileLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Avatar + name */}
      <div className="flex items-start gap-4 mb-8">
        <div className="h-20 w-20 rounded-full skeleton flex-shrink-0" />
        <div className="flex-1 space-y-2 pt-2">
          <div className="h-6 w-40 rounded skeleton" />
          <div className="h-4 w-28 rounded skeleton" />
          <div className="h-4 w-56 rounded skeleton" />
          <div className="flex gap-4 mt-1">
            <div className="h-3 w-20 rounded skeleton" />
            <div className="h-3 w-20 rounded skeleton" />
          </div>
        </div>
      </div>
      {/* Lists grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
            <div className="aspect-[16/7] skeleton" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-3/4 rounded skeleton" />
              <div className="h-3 w-1/2 rounded skeleton" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
