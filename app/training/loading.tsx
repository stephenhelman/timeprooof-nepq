export default function TrainingLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <div className="h-8 w-48 bg-gray-800 rounded-lg animate-pulse" />
      <div className="h-4 w-64 bg-gray-800 rounded animate-pulse" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-2xl p-6 space-y-3 animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-gray-700" />
            <div className="h-5 w-32 bg-gray-700 rounded" />
            <div className="h-3 w-full bg-gray-700 rounded" />
            <div className="h-3 w-3/4 bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
