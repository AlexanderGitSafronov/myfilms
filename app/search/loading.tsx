export default function SearchLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="h-8 w-24 rounded-lg skeleton mb-4" />
      <div className="h-11 rounded-xl skeleton mb-6" />
      <div className="h-11 rounded-xl skeleton mb-6" />
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="h-24 w-16 rounded-lg skeleton flex-shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-4 w-1/2 rounded skeleton" />
              <div className="h-3 w-24 rounded skeleton" />
              <div className="flex gap-1">
                <div className="h-5 w-16 rounded-full skeleton" />
                <div className="h-5 w-14 rounded-full skeleton" />
              </div>
              <div className="h-3 w-full rounded skeleton" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
