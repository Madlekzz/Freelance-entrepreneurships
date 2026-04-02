import { Search } from "lucide-react";

interface Props {
	search: string;
	onSearch: (val: string) => void;
}

export default function CatalogToolbar({ search, onSearch }: Props) {
	return (
		<header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
			<div>
				<h2 className="font-display text-2xl font-bold text-gray-900 leading-tight">
					Catálogo de Productos
				</h2>
				<p className="text-sm text-gray-400 mt-1">
					Apoya el talento local de nuestra comunidad
				</p>
			</div>

			<div className="relative w-full md:w-96">
				<Search
					size={18}
					className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
				/>
				<input
					type="text"
					placeholder="Buscar por nombre o emprendimiento..."
					value={search}
					onChange={(e) => onSearch(e.target.value)}
					className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl text-sm text-gray-900 bg-white outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
				/>
			</div>
		</header>
	);
}
