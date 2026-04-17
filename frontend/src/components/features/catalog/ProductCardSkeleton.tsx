import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ProductCardSkeleton() {
	return (
		<div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
			{/* Image area */}
			<Skeleton height={160} borderRadius={0} />

			{/* Body */}
			<div className="p-4">
				<Skeleton height={16} width="80%" className="mb-2" />
				<Skeleton height={22} width="50%" className="mb-2" />
				<Skeleton height={12} width="60%" className="mb-4" />
				<Skeleton height={40} borderRadius={12} />
			</div>
		</div>
	);
}
