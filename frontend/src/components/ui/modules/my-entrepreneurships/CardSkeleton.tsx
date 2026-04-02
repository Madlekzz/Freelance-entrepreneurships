import Skeleton from "react-loading-skeleton";

const CardSkeleton = () => (
  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
    {/* Icono Skeleton */}
    <div className="mb-5">
      <Skeleton width={56} height={56} borderRadius={16} />
    </div>

    {/* Título Skeleton */}
    <Skeleton height={24} width="75%" className="mb-4" />

    {/* Info Grid Skeleton */}
    <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50 my-4">
      <div className="flex flex-col gap-2">
        <Skeleton width={40} height={10} />
        <Skeleton width={60} height={14} />
      </div>
      <div className="flex flex-col items-end gap-2">
        <Skeleton width={40} height={10} />
        <Skeleton width={60} height={14} />
      </div>
    </div>

    {/* Botón Skeleton */}
    <Skeleton height={48} borderRadius={16} className="mt-2" />
  </div>
);

export default CardSkeleton;
