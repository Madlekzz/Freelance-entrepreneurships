import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type CatalogProduct,
  getActiveProducts,
} from "../services/productService";

export type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc";
const PAGE_SIZE = 12;

export function useCatalog() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [hideOutOfStock, setHideOutOfStock] = useState(false);
  const [page, setPage] = useState(1);

  // Usamos useCallback para poder pasarlo a otros hooks sin causar re-renders
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getActiveProducts();
      setProducts([...data].sort((a, b) => a.name.localeCompare(b.name)));
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Error al cargar los productos",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredAndSorted = useMemo(() => {
    const result = products.filter(
      (p) =>
        (p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.entrepreneurships.name
            .toLowerCase()
            .includes(search.toLowerCase())) &&
        (!hideOutOfStock || p.current_stock > 0),
    );

    return result.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });
  }, [products, search, sortBy, hideOutOfStock]);

  const totalPages = Math.ceil(filteredAndSorted.length / PAGE_SIZE);
  const paginatedProducts = filteredAndSorted.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setSortBy("name-asc");
    setHideOutOfStock(false);
    setPage(1);
  };

  return {
    allProducts: products, // Exportamos todos para el carrito
    paginatedProducts,
    filteredAndSorted, // Exportamos paginados para la vista
    refreshProducts: fetchProducts,
    loading,
    error,
    page,
    totalPages,
    setPage,
    search,
    handleSearch,
    sortBy,
    setSortBy,
    hideOutOfStock,
    setHideOutOfStock,
    clearFilters,
    hasFilters: search !== "" || sortBy !== "name-asc" || hideOutOfStock,
  };
}
