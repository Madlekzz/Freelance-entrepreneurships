import { useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import type { SortOption } from "../../../hooks/useCatalog";

interface Props {
	sortBy: SortOption;
	setSortBy: (val: SortOption) => void;
	hideOutOfStock: boolean;
	setHideOutOfStock: (val: boolean | ((prev: boolean) => boolean)) => void;
	clearFilters: () => void;
	hasFilters: boolean;
}

export default function CatalogSidebar({
	sortBy,
	setSortBy,
	hideOutOfStock,
	setHideOutOfStock,
	clearFilters,
	hasFilters,
}: Props) {
	// Estos estados son puramente visuales, por lo que se quedan en el componente
	const [isSortOpen, setIsSortOpen] = useState(true);
	const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

	const orderFilters = [
		{ id: "name-asc", label: "Alfabético: A - Z" },
		{ id: "name-desc", label: "Alfabético: Z - A" },
		{ id: "price-asc", label: "Precio: Menor a Mayor" },
		{ id: "price-desc", label: "Precio: Mayor a Menor" },
	];

	return (
		<aside className="w-full md:w-64 shrink-0">
			<div className="sticky top-24">
				<h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
					<Search size={20} className="text-primary" />
					Filtros
				</h2>

				<div className="space-y-2">
					{/* Ordenar */}
					<div className="border-b border-gray-100 pb-2">
						<button
							onClick={() => setIsSortOpen(!isSortOpen)}
							className="cursor-pointer flex items-center justify-between w-full py-3 text-sm font-semibold text-gray-700 hover:text-primary transition-colors group"
						>
							<span>Ordenar por</span>
							<ChevronRight
								size={16}
								className={`transition-transform duration-200 ${isSortOpen ? "rotate-90" : ""} text-gray-400 group-hover:text-primary`}
							/>
						</button>
						<div
							className={`overflow-hidden transition-all duration-300 ${isSortOpen ? "max-h-60 opacity-100 mb-4" : "max-h-0 opacity-0"}`}
						>
							<div className="flex flex-col gap-1 ml-2">
								{orderFilters.map((option) => (
									<button
										key={option.id}
										onClick={() => setSortBy(option.id as SortOption)}
										className={`cursor-pointer text-left px-4 py-2 rounded-lg text-sm transition-all ${sortBy === option.id ? "bg-primary/10 text-primary font-medium" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
									>
										{option.label}
									</button>
								))}
							</div>
						</div>
					</div>

					{/* Categorías */}
					<div className="border-b border-gray-100 pb-2">
						<button
							onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
							className="cursor-pointer flex items-center justify-between w-full py-3 text-sm font-semibold text-gray-700 hover:text-primary transition-colors group"
						>
							<span>Categorías</span>
							<ChevronRight
								size={16}
								className={`transition-transform duration-200 ${isCategoriesOpen ? "rotate-90" : ""} text-gray-400 group-hover:text-primary`}
							/>
						</button>
						<div
							className={`overflow-hidden transition-all duration-300 ${isCategoriesOpen ? "max-h-60 opacity-100 mb-4" : "max-h-0 opacity-0"}`}
						>
							<div className="flex flex-col gap-1 ml-2 py-2">
								<p className="text-xs text-gray-400 px-4 italic">
									No hay categorías disponibles aún.
								</p>
							</div>
						</div>
					</div>

					{/* Stock */}
					<div className="border-b border-gray-100 pb-4 pt-2">
						<label className="flex items-center justify-between cursor-pointer group">
							<span className="text-sm font-semibold text-gray-700 group-hover:text-primary transition-colors">
								Ocultar sin stock
							</span>
							<div
								onClick={() => setHideOutOfStock((v) => !v)}
								className={`w-10 h-5 rounded-full relative transition-colors ${hideOutOfStock ? "bg-primary" : "bg-gray-200"}`}
							>
								<div
									className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${hideOutOfStock ? "translate-x-5" : "translate-x-0.5"}`}
								/>
							</div>
						</label>
					</div>
				</div>

				{/* Limpiar Filtros */}
				{hasFilters && (
					<button
						onClick={clearFilters}
						className="cursor-pointer mt-8 w-full py-2.5 text-xs font-bold text-primary uppercase tracking-widest border border-primary/20 rounded-xl hover:bg-primary hover:text-white transition-all"
					>
						Limpiar filtros
					</button>
				)}
			</div>
		</aside>
	);
}
