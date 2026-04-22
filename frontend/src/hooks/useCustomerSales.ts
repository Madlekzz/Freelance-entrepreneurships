import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify/unstyled";
import { supabase } from "../config/supabaseClient";
import { getConsumerPurchases } from "../services/saleService";
import type { ConsumerSale, PayrollCycle } from "../types";

export const useConsumerSales = () => {
  const [sales, setSales] = useState<ConsumerSale[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [payrollCycle, setPayrollCycle] = useState<PayrollCycle | null>(null);

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
    let result = sales;

    if (selectedMonth !== null) {
      result = result.filter((sale) => {
        const saleDate = new Date(sale.created_at);
        return saleDate.getMonth() === selectedMonth;
      });
    }

    if (payrollCycle !== null) {
      result = result.filter((sale) => {
        const saleDate = new Date(sale.created_at);
        const day = saleDate.getDate();
        if (payrollCycle.startDay < payrollCycle.endDay) {
          return day >= payrollCycle.startDay && day <= payrollCycle.endDay;
        } else {
          return day >= payrollCycle.startDay || day <= payrollCycle.endDay;
        }
      });
    }

    if (!searchQuery.trim()) return result;

    const lowerQuery = searchQuery.toLowerCase();

    return result.filter((sale) => {
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
  }, [sales, searchQuery, selectedMonth, payrollCycle]);

  useEffect(() => {
    fetchMySales();
  }, [fetchMySales]);

  // 3. Retornamos los nuevos estados
  return {
    sales: filteredSales,
    rawSales: sales,
    loading,
    searchQuery,
    setSearchQuery,
    selectedMonth,
    setSelectedMonth,
    payrollCycle,
    setPayrollCycle,
    refresh: fetchMySales,
  };
};
