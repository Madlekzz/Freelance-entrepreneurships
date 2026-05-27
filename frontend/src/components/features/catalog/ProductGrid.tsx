import { Search } from "lucide-react";
import type { CartHook, CatalogProduct, ProductCardData } from "../../../types";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

interface ProductGridProps {
  loading: boolean;
  page: number;
  products: CatalogProduct[];
  cart: CartHook;
}

const SKELETON_ITEMS = Array.from({ length: 8 }, (_, i) => `skeleton-id-${i}`);

export const ProductGrid = ({
  loading,
  page,
  products,
  cart,
}: ProductGridProps) => {
  // 1. Estado de Carga Inicial
  if (loading && page === 1) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 md:gap-6">
        {SKELETON_ITEMS.map((id) => (
          <ProductCardSkeleton key={id} />
        ))}
      </div>
    );
  }

  // 2. Estado Sin Resultados
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">
        <Search size={40} className="opacity-10 mb-4" />
        <p className="text-sm">No encontramos lo que buscas</p>
      </div>
    );
  }

  // 3. Renderizado de Productos
  return (
    <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 md:gap-6">
      {products.map((p: CatalogProduct) => {
        // Construimos el objeto compatible con ProductCardData
        const cardData: ProductCardData = {
          id: p.id,
          name: p.name,
          price: p.price,
          current_stock: p.current_stock,
          image: p.image,
          category_id: p.category_id,
          vendor: p.entrepreneurships.name,
          is_composed: p.is_composed,
        };

        return (
          <ProductCard
            key={p.id}
            product={cardData}
            qty={cart.cart[p.id] ?? 0}
            onAdd={() => cart.addToCart(p.id)}
          />
        );
      })}
    </div>
  );
};
