import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const AdminConsumersSkeleton = () => {
  const skeletonRows = Array.from({ length: 6 }, (_, index) => ({
    id: `skeleton-row-${index}`,
  }));
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="space-y-2">
          <Skeleton width={180} height={24} />
          <Skeleton width={250} height={14} />
        </div>
        <Skeleton width={130} height={40} borderRadius={12} />
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {[1, 2, 3, 4, 5].map((i) => (
                  <th key={i} className="px-6 py-4">
                    <Skeleton width={80} height={10} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {skeletonRows.map((row) => (
                <tr key={row.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Skeleton circle width={36} height={36} />
                      <div>
                        <Skeleton width={120} height={14} />
                        <Skeleton width={160} height={10} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Skeleton width={70} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Skeleton width={60} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Skeleton width={80} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <Skeleton width={90} height={32} borderRadius={8} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
