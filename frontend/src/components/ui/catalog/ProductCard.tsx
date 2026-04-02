import { ShoppingBag, Check } from "lucide-react";

interface Product {
	id: number;
	name: string;
	price: number;
	stock: number;
	image: string | null;
	vendor: string;
}

interface Props {
	product: Product;
	qty: number;
	onAdd: () => void;
}

const fmt = (n: number) =>
	new Intl.NumberFormat("es-CO", {
		style: "currency",
		currency: "COP",
		maximumFractionDigits: 0,
	}).format(n);

export default function ProductCard({ product, qty, onAdd }: Props) {
	const inCart = qty > 0;

	return (
		<div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
			{/* Image area */}
			<div className="h-40 bg-blue-50 flex items-center justify-center relative overflow-hidden">
				{product.image ? (
					<img
						src={product.image}
						alt={product.name}
						className="w-full h-full object-cover"
					/>
				) : (
					<ShoppingBag size={40} className="text-primary/30" />
				)}
				<span className="absolute top-3 left-3 bg-primary text-white text-xs font-medium px-2.5 py-1 rounded-full">
					{product.vendor}
				</span>
				{inCart && (
					<span className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
						<Check size={13} className="text-primary" />
					</span>
				)}
			</div>

			{/* Body */}
			<div className="p-4">
				<p className="font-medium text-gray-900 mb-1 line-clamp-2 leading-snug">
					{product.name}
				</p>
				<p className="font-display text-xl font-bold text-primary mb-1">
					{fmt(product.price)}
				</p>
				<p className="text-xs text-gray-400 mb-4">
					{product.stock - qty} unidades disponibles
				</p>

				<button
					onClick={onAdd}
					disabled={qty >= product.stock}
					className={`w-full cursor-pointer py-2.5 rounded-xl text-sm font-medium transition-colors ${
						inCart
							? "bg-blue-50 text-primary border border-primary/20 hover:bg-blue-100"
							: "bg-primary hover:bg-primary-dark text-white"
					} disabled:opacity-40 disabled:cursor-not-allowed`}
				>
					{inCart ? `En carrito (${qty})` : "Agregar al carrito"}
				</button>
			</div>
		</div>
	);
}
