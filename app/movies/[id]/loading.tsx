export default function MovieLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="h-4 w-20 rounded skeleton mb-6" />
      <div className="flex flex-col sm:flex-row gap-6 mb-8">
        <div className="h-72 w-48 rounded-2xl skeleton flex-shrink-0 mx-auto sm:mx-0" />
        <div className="flex-1 space-y-3 pt-2">
          <div className="h-7 w-3/4 rounded skeleton" />
          <div className="h-4 w-1/2 rounded skeleton" />
          <div className="flex gap-2 mt-2">
            <div className="h-6 w-20 rounded-full skeleton" />
            <div className="h-6 w-16 rounded-full skeleton" />
            <div className="h-6 w-18 rounded-full skeleton" />
          </div>
          <div className="space-y-2 mt-4">
            <div className="h-3 w-full rounded skeleton" />
            <div className="h-3 w-full rounded skeleton" />
            <div className="h-3 w-2/3 rounded skeleton" />
          </div>
          <div className="flex gap-2 mt-4">
            <div className="h-9 w-28 rounded-xl skeleton" />
            <div className="h-9 w-24 rounded-xl skeleton" />
          </div>
        </div>
      </div>
    </div>
  );
}
