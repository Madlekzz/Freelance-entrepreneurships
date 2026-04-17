import { useMemo } from "react";
import type { EntrepreneurshipProduct, Sale } from "../../../../../types";

export function useOverviewStats(
  sales: Sale[],
  products: EntrepreneurshipProduct[],
) {
  return useMemo(() => {
    const totalRevenue = sales.reduce((acc, sale) => acc + sale.total, 0);
    const totalProducts = products.length;

    const lowStockProducts = products.filter(
      (p) => p.current_stock <= 5 && p.current_stock > 0,
    ).length;

    const outOfStock = products.filter((p) => p.current_stock === 0).length;

    const averageTicket = sales.length > 0 ? totalRevenue / sales.length : 0;

    const pendingPayrollCount = sales.filter(
      (s) => !s.payroll_processed,
    ).length;

    return {
      totalRevenue,
      totalProducts,
      lowStockProducts,
      outOfStock,
      averageTicket,
      totalSalesCount: sales.length,
      pendingPayrollCount,
    };
  }, [sales, products]);
}
