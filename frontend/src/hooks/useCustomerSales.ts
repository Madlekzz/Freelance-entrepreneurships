import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify/unstyled";
import { supabase } from "../config/supabaseClient";
import { getConsumerPurchases } from "../services/saleService";
import type { ConsumerSale } from "../types";

export const useConsumerSales = () => {
  const [sales, setSales] = useState<ConsumerSale[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Estado para el término de búsqueda
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMySales = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return;

      const data = await getConsumerPurchases(session.user.id);
      setSales(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al cargar las compras",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Lógica de filtrado con useMemo para optimizar rendimiento
  const filteredSales = useMemo(() => {
    if (!searchQuery.trim()) return sales;

    const lowerQuery = searchQuery.toLowerCase();

    return sales.filter((sale) => {
      const matchesItem = sale.sale_items.some(
        (item) =>
          item.products.name.toLowerCase().includes(lowerQuery) ||
          item.products.entrepreneurships.name
            .toLowerCase()
            .includes(lowerQuery),
      );

      const matchesId = sale.id.toLowerCase().includes(lowerQuery);

      return matchesItem || matchesId;
    });
  }, [sales, searchQuery]);

  useEffect(() => {
    fetchMySales();
  }, [fetchMySales]);

  // 3. Retornamos los nuevos estados
  return {
    sales: filteredSales, // Retornamos las ventas ya filtradas
    rawSales: sales, // Por si necesitas la cuenta total original
    loading,
    searchQuery,
    setSearchQuery,
    refresh: fetchMySales,
  };
};
