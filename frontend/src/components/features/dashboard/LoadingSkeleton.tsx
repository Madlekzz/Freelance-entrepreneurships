export default function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* 1. Header Skeleton (Bienvenida) */}
      <div className="h-27 bg-gray-100 rounded-3xl w-full border border-gray-50" />

      {/* 2. Sección Admin/IT Skeleton */}
      <div className="space-y-6">
        {/* Simulación del SectionHeader */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gray-100 rounded-lg" />
          <div className="h-6 bg-gray-100 rounded-md w-48" />
        </div>

        {/* Simulación de las StatCards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-44 bg-gray-50 rounded-3xl border border-gray-100 p-6 space-y-4"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-2xl" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-24" />
                <div className="h-8 bg-gray-200 rounded w-32" />
                <div className="h-3 bg-gray-200 rounded w-40" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Grid de Proveedor/Consumidor Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[1, 2].map((section) => (
          <div key={section} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 rounded-lg" />
              <div className="h-6 bg-gray-100 rounded-md w-40" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2].map((card) => (
                <div
                  key={card}
                  className="h-44 bg-gray-50 rounded-3xl border border-gray-100 p-6 space-y-4"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 4. Footer Skeleton */}
      <div className="h-48 bg-gray-50/50 rounded-3xl border border-gray-100 w-full" />
    </div>
  );
}
