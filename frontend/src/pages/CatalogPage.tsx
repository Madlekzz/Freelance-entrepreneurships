import { Search } from "lucide-react";
import CatalogHeader from "../components/ui/catalog/CatalogHeader";
import CatalogHero from "../components/ui/catalog/CatalogHero";
import ProductCard from "../components/ui/catalog/ProductCard";
import ProductCardSkeleton from "../components/ui/catalog/ProductCardSkeleton";
import CartDrawer from "../components/ui/catalog/CartDrawer";
import CheckoutModal from "../components/ui/catalog/CheckoutModal";
import CatalogToolbar from "../components/ui/catalog/CatalogToolbar";
import CatalogSidebar from "../components/ui/catalog/CatalogSidebar";
import CatalogPagination from "../components/ui/catalog/CatalogPagination";

import { useCatalog } from "../hooks/useCatalog";
import { useCart } from "../hooks/useCart";
import { useCheckout } from "../hooks/useCheckout";

export default function CatalogPage() {
	// 1. Catálogo
	const catalog = useCatalog();

	// 2. Carrito (depende de todos los productos para calcular totales y stock)
	const cart = useCart(catalog.allProducts);

	// 3. Checkout (depende del carrito y del catálogo para actualizarlos)
	const checkout = useCheckout({
		cartEntries: cart.cartEntries,
		clearCart: cart.clearCart,
		refreshProducts: catalog.refreshProducts,
		closeCartDrawer: () => cart.setDrawer(false),
	});

	return (
		<div className="min-h-screen bg-gray-50 font-sans">
			<CatalogHeader
				cartCount={cart.cartCount}
				onCartClick={() => cart.setDrawer(true)}
			/>
			<CatalogHero />

			<main className="max-w-7xl mx-auto px-8 py-8">
				<CatalogToolbar
					search={catalog.search}
					onSearch={catalog.handleSearch}
				/>

				<div className="flex flex-col md:flex-row gap-10">
					<CatalogSidebar
						sortBy={catalog.sortBy}
						setSortBy={catalog.setSortBy}
						hideOutOfStock={catalog.hideOutOfStock}
						setHideOutOfStock={catalog.setHideOutOfStock}
						clearFilters={catalog.clearFilters}
						hasFilters={catalog.hasFilters}
					/>

					<section className="flex-1">
						{catalog.loading ? (
							<div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
								{Array.from({ length: 8 }).map((_, i) => (
									<ProductCardSkeleton key={i} />
								))}
							</div>
						) : catalog.paginatedProducts.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">
								<Search size={40} className="opacity-10 mb-4" />
								<p className="text-sm">No encontramos lo que buscas</p>
							</div>
						) : (
							<>
								<div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
									{catalog.paginatedProducts.map((p) => (
										<ProductCard
											key={p.id}
											product={{
												id: p.id,
												name: p.name,
												price: p.price,
												stock: p.current_stock,
												image: p.image,
												vendor: p.entrepreneurships.name,
											}}
											qty={cart.cart[p.id] ?? 0}
											onAdd={() => cart.addToCart(p.id)}
										/>
									))}
								</div>

								<CatalogPagination
									page={catalog.page}
									totalPages={catalog.totalPages}
									setPage={catalog.setPage}
								/>
							</>
						)}
					</section>
				</div>
			</main>

			<CartDrawer
				isOpen={cart.drawerOpen}
				entries={cart.cartEntries}
				total={cart.cartTotal}
				onClose={() => cart.setDrawer(false)}
				onChangeQty={cart.changeQty}
				onRemove={cart.removeFromCart}
				onCheckout={checkout.handleOpenCheckout}
			/>

			<CheckoutModal
				isOpen={checkout.modalOpen}
				status={checkout.status}
				error={checkout.error}
				loadingCons={checkout.loadingCons}
				consumers={checkout.consumers}
				selectedConsumerId={checkout.selectedConsumerId}
				selectedConsumer={checkout.selectedConsumer}
				entries={cart.cartEntries}
				total={cart.cartTotal}
				onClose={checkout.handleCloseModal}
				onConsumerChange={checkout.onConsumerChange}
				onConfirm={checkout.handleConfirmPurchase}
			/>
		</div>
	);
}
