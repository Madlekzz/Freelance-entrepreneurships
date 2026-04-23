import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function SettingsSkeleton() {
  return (
    <div className="pb-20">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-50 rounded-xl">
            <Skeleton width={24} height={24} circle />
          </div>
          <div>
            <Skeleton width={200} height={24} />
            <Skeleton width={280} height={16} />
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <Skeleton width={160} height={16} />
            <div className="mt-2">
              <Skeleton height={48} />
            </div>
            <Skeleton width={200} height={14} className="mt-2" />
          </div>

          <div>
            <Skeleton width={200} height={16} />
            <div className="mt-2">
              <Skeleton height={40} />
            </div>
          </div>

          <div>
            <Skeleton width={160} height={16} />
            <div className="mt-2">
              <Skeleton height={40} />
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
          <Skeleton width={180} height={44} />
        </div>
      </div>

      <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
        <Skeleton width={180} height={18} />
        <div className="mt-3 space-y-2">
          <Skeleton width={"100%"} height={16} />
          <Skeleton width={"100%"} height={16} />
          <Skeleton width={"80%"} height={16} />
          <Skeleton width={"90%"} height={16} />
        </div>
      </div>
    </div>
  );
}