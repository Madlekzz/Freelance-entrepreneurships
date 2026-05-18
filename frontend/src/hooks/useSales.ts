import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  getSalesByEntrepreneurship,
} from "../services/saleService";
import type { EntrepreneurshipSale } from "../types";

export function useSales(entrepreneurshipId?: string) {
  const [sales, setSales] = useState<EntrepreneurshipSale[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Estados de Filtros y Ordenamiento ---
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-desc"); // date-desc, date-asc, total-desc, total-asc
  const [statusFilter, setStatusFilter] = useState("all"); // all, processed, pending

  // 1. Carga de datos desde la API
  const fetchSales = useCallback(async () => {
    if (!entrepreneurshipId) return;

    try {
      setLoading(true);
      const data = await getSalesByEntrepreneurship(entrepreneurshipId);
      setSales(data);
    } catch (error) {
      console.error("Error fetching sales:", error);
      const errorMessage = error instanceof Error ? error.message : "Error al cargar las ventas. Intenta de nuevo más tarde.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [entrepreneurshipId]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  // 2. Lógica de Filtrado y Ordenamiento (Computed State)
  // Usamos useMemo para que solo se recalcule cuando cambien los datos o los filtros
  const filteredSales = useMemo(() => {
    let result = [...sales];

    // --- A. Búsqueda Multicriterio ---
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((sale) => {
        // Buscar en nombre del cliente
        const matchCustomer = sale.users?.name.toLowerCase().includes(query);

        // Buscar en email del cliente
        const matchEmail = sale.users?.email.toLowerCase().includes(query);

        // Buscar en la lista de productos de esa venta
        const matchProduct = sale.sale_items?.some((item) =>
          item.products.name.toLowerCase().includes(query),
        );

        return matchCustomer || matchEmail || matchProduct;
      });
    }

    // --- B. Filtro por Estado (payroll_processed / refunded) ---
    if (statusFilter !== "all") {
      if (statusFilter === "refunded") {
        result = result.filter(
          (sale) =>
            sale.refunded === true ||
            sale.sale_items.every((item) => item.refunded),
        );
      } else {
        const isProcessed = statusFilter === "processed";
        result = result.filter((sale) => {
          const allItemsRefunded = sale.sale_items.every(
            (item) => item.refunded,
          );
          return (
            !sale.refunded &&
            !allItemsRefunded &&
            sale.payroll_processed === isProcessed
          );
        });
      }
    }

    // --- C. Ordenamiento ---
    result.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "date-asc":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "total-desc":
          return b.total - a.total;
        case "total-asc":
          return a.total - b.total;
        default:
          return 0;
      }
    });

    return result;
  }, [sales, searchQuery, sortBy, statusFilter]);

  return {
    // Datos
    sales: filteredSales, // Lista ya procesada para la tabla
    originalSalesCount: sales.length, // Para saber si el emprendimiento tiene ventas en total
    loading,

    // Setters de filtros para los componentes de UI
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    statusFilter,
    setStatusFilter,

    // Acciones
    refetch: fetchSales,
  };
}
