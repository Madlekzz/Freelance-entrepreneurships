import { useMemo } from "react";
import { useAdminData } from "../../../../hooks/useAdminData";
import { useDashboard } from "../../../../hooks/useDashboard";
import { useITData } from "../../../../hooks/useITData";
import type { SaleItemDetail } from "../../../../types";

export function useGeneralStats() {
  const { user, roles, loading: authLoading } = useDashboard();

  // Permisos
  const canSeeAdmin = roles.includes("ADMIN");
  const canSeeIT = roles.includes("IT");
  const isProvider = roles.includes("PROVEEDOR");
  const isConsumer = roles.includes("CONSUMIDOR");

  // Fetch de datos condicional
  const {
    sales,
    loading: adminLoading,
    entrepreneursSummary,
  } = useAdminData(canSeeAdmin || isProvider || isConsumer);
  const {
    totalUsers,
    pendingRequests,
    activeSessions,
    loading: itLoading,
  } = useITData(canSeeIT);

  const stats = useMemo(() => {
    // 1. Stats para ADMIN
    const adminStats = {
      totalRevenue: sales.reduce((acc, s) => acc + s.total, 0),
      pendingPayroll: sales
        .filter((s) => !s.payroll_processed)
        .reduce((acc, s) => acc + s.total, 0),
      activeEntrepreneurs: entrepreneursSummary.length,
    };

    // 2. Stats para PROVEEDOR (Filtrar por dueño de producto)
    const providerSales = sales.filter((s) =>
      s.sale_items.some(
        (item: SaleItemDetail) =>
          item.products.entrepreneurships.owner_id === user?.id,
      ),
    );
    const providerStats = {
      revenue: providerSales.reduce((acc, s) => acc + s.total, 0),
      salesCount: providerSales.length,
    };

    // 3. Stats para CONSUMIDOR (Filtrar por comprador)
    const consumerPurchases = sales.filter((s) => s.users.id === user?.id);
    const consumerStats = {
      totalSpent: consumerPurchases.reduce((acc, s) => acc + s.total, 0),
      purchaseCount: consumerPurchases.length,
    };

    return { adminStats, providerStats, consumerStats };
  }, [sales, entrepreneursSummary, user]);

  // Formateador de roles para el tip de abajo
  const rolesList = new Intl.ListFormat("es", {
    style: "long",
    type: "conjunction",
  }).format(roles.map((role) => role.charAt(0) + role.slice(1).toLowerCase()));

  return {
    user,
    roles,
    canSeeAdmin,
    canSeeIT,
    isProvider,
    isConsumer,
    stats,
    itData: { totalUsers, pendingRequests, activeSessions },
    rolesList,
    loading: authLoading || adminLoading || itLoading,
  };
}
