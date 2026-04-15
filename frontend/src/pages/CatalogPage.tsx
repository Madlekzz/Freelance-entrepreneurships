import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react"; // 1. Importamos useState
import CartDrawer from "../components/ui/catalog/CartDrawer";
import CatalogHeader from "../components/ui/catalog/CatalogHeader";
import CatalogHero from "../components/ui/catalog/CatalogHero";
import CatalogPagination from "../components/ui/catalog/CatalogPagination";
import CatalogSidebar from "../components/ui/catalog/CatalogSidebar";
import CatalogToolbar from "../components/ui/catalog/CatalogToolbar";
import CheckoutModal from "../components/ui/catalog/CheckoutModal";
import ProductCard from "../components/ui/catalog/ProductCard";
import ProductCardSkeleton from "../components/ui/catalog/ProductCardSkeleton";
import { useCart } from "../hooks/useCart";
import { useCatalog } from "../hooks/useCatalog";
import { useCheckout } from "../hooks/useCheckout";

export default function CatalogPage() {
  // 1. Catálogo
  const catalog = useCatalog();

  // 2. Carrito
  const cart = useCart(catalog.allProducts);

  // 3. Checkout
  const checkout = useCheckout({
    cartEntries: cart.cartEntries,
    clearCart: cart.clearCart,
    refreshProducts: catalog.refreshProducts,
    closeCartDrawer: () => cart.setDrawer(false),
  });

  // 4. Estado para el Drawer de Filtros en Mobile
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // 1. Desestructuramos lo que necesitamos de catalog arriba
  const {
    loading,
    page,
    totalPages,
    setPage,
    filteredAndSorted,
    paginatedProducts,
  } = catalog;

  // 2. Ahora el useCallback usa solo las variables extraídas
  const handleScroll = useCallback(() => {
    // Usamos las variables locales desestructuradas
    if (window.innerWidth >= 768 || loading) return;

    const scrollHeight = document.documentElement.scrollHeight;
    const currentScroll = window.innerHeight + window.scrollY;

    if (currentScroll + 200 >= scrollHeight) {
      if (page < totalPages) {
        setPage((prev) => prev + 1);
      }
    }
  }, [loading, page, totalPages, setPage]); // Dependencias limpias

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <CatalogHeader
        cartCount={cart.cartCount}
        onCartClick={() => cart.setDrawer(true)}
        isCartOpen={cart.drawerOpen}
        closeCart={() => cart.setDrawer(false)}
      />

      <CatalogHero />

      {/* Agregamos pb-24 o pb-32 para que el contenido no quede oculto tras el menú móvil */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 pb-32">
        {/* TOOLBAR: Conectamos los disparadores de filtros */}
        <CatalogToolbar
          search={catalog.search}
          onSearch={catalog.handleSearch}
          onOpenFilters={() => setIsFiltersOpen(true)}
        />

        <div className="flex flex-col md:flex-row gap-10">
          {/* SIDEBAR: Conectamos el estado de apertura y la función de cierre */}
          <CatalogSidebar
            sortBy={catalog.sortBy}
            setSortBy={catalog.setSortBy}
            hideOutOfStock={catalog.hideOutOfStock}
            setHideOutOfStock={catalog.setHideOutOfStock}
            clearFilters={catalog.clearFilters}
            hasFilters={catalog.hasFilters}
            isOpen={isFiltersOpen}
            onClose={() => setIsFiltersOpen(false)}
          />

          <section className="flex-1">
            {catalog.loading && catalog.page === 1 ? (
              <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 md:gap-6">
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
                {/* Grilla adaptada a 2 columnas en mobile */}
                <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 md:gap-6">
                  {(window.innerWidth < 768
                    ? filteredAndSorted.slice(0, page * 12)
                    : paginatedProducts
                  ).map((p) => (
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

                {/* Ocultamos paginación en mobile si vas a implementar Infinite Scroll luego */}
                <div className="mt-10 hidden md:block">
                  <CatalogPagination
                    page={catalog.page}
                    totalPages={catalog.totalPages}
                    setPage={catalog.setPage}
                  />
                </div>
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
