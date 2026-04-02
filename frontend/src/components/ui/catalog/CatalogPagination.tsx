import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
	page: number;
	totalPages: number;
	setPage: (page: number | ((p: number) => number)) => void;
}

export default function CatalogPagination({
	page,
	totalPages,
	setPage,
}: Props) {
	if (totalPages <= 1) return null;

	return (
		<div className="flex items-center justify-center gap-10 mt-10">
			<button
				onClick={() => setPage((p) => Math.max(1, p - 1))}
				disabled={page === 1}
				className="flex items-center gap-1 text-sm cursor-pointer text-primary hover:text-primary-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
			>
				<ChevronLeft size={16} /> Anterior
			</button>

			<div className="flex items-center gap-1">
				{Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
					<button
						key={n}
						onClick={() => setPage(n)}
						className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
							page === n
								? "bg-primary text-white"
								: "text-gray-500 hover:bg-gray-100"
						}`}
					>
						{n}
					</button>
				))}
			</div>

			<button
				onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
				disabled={page === totalPages}
				className="flex items-center gap-1 text-sm cursor-pointer text-primary hover:text-primary-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
			>
				Siguiente <ChevronRight size={16} />
			</button>
		</div>
	);
}
