import Skeleton from "react-loading-skeleton";

const RequestRowSkeleton = () => (
  <tr className="border-b border-gray-50">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        {/* Avatar/Icon Circle */}
        <Skeleton circle width={36} height={36} />
        <div className="flex flex-col gap-1.5">
          {/* Title/Name line */}
          <Skeleton width={96} height={12} />
          {/* Subtitle/Description line */}
          <Skeleton width={128} height={10} />
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      {/* Detail/Date line */}
      <Skeleton width={112} height={12} />
    </td>
    <td className="px-6 py-4">
      {/* Badges/Tags */}
      <div className="flex gap-1.5">
        <Skeleton width={48} height={20} borderRadius={6} />
        <Skeleton width={48} height={20} borderRadius={6} />
      </div>
    </td>
    <td className="px-6 py-4 text-right">
      {/* Action buttons */}
      <div className="flex justify-end gap-2">
        <Skeleton width={32} height={32} borderRadius={8} />
        <Skeleton width={32} height={32} borderRadius={8} />
      </div>
    </td>
  </tr>
);

export default RequestRowSkeleton;
