export default function AddMovieLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="h-8 w-40 rounded-lg skeleton mb-6" />
      <div className="space-y-4">
        <div className="h-11 rounded-xl skeleton" />
        <div className="h-11 rounded-xl skeleton" />
        <div className="space-y-3 mt-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02]">
              <div className="h-20 w-14 rounded-lg skeleton flex-shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-4 w-1/2 rounded skeleton" />
                <div className="h-3 w-20 rounded skeleton" />
                <div className="h-3 w-full rounded skeleton" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
