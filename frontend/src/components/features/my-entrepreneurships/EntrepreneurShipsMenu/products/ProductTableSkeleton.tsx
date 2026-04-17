export default function ProductTableSkeleton() {
  // Generamos 5 filas de esqueleto
  const rows = Array.from({ length: 5 }, (_, idx) => ({
    id: `skeleton-row-${idx}`,
  }));

  return (
    <div className="animate-pulse space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-7 w-40 bg-gray-200 rounded-lg"></div>
        <div className="h-10 w-36 bg-gray-200 rounded-xl"></div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 h-12 border-b border-gray-100"></div>
        <div className="divide-y divide-gray-50">
          {rows.map((row) => (
            <div
              key={row.id}
              className="px-6 py-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 w-1/3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
                <div className="h-4 w-32 bg-gray-100 rounded"></div>
              </div>
              <div className="h-4 w-20 bg-gray-100 rounded"></div>
              <div className="h-4 w-16 bg-gray-100 rounded"></div>
              <div className="h-6 w-16 bg-gray-50 rounded-full"></div>
              <div className="h-4 w-4 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
