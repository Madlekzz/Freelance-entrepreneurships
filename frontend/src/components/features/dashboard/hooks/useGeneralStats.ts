import { useEffect, useMemo, useState } from "react";
import { useAdminData } from "../../../../hooks/useAdminData";
import { useDashboard } from "../../../../hooks/useDashboard";
import { useITData } from "../../../../hooks/useITData";
import { getMyEntrepreneurships } from "../../../../services/entrepreneurshipService";
import {
  getConsumerPurchases,
  getSalesByEntrepreneurship,
} from "../../../../services/saleService";
import type { ConsumerSale, EntrepreneurshipSale } from "../../../../types";

export function useGeneralStats() {
  const { user, roles, loading: authLoading } = useDashboard();

  // Permisos
  const canSeeAdmin = roles.includes("ADMIN");
  const canSeeIT = roles.includes("IT");
  const isProvider = roles.includes("PROVEEDOR");
  const isConsumer = roles.includes("CONSUMIDOR");

  // Fetch de datos condicional (solo ADMIN)
  const {
    sales,
    loading: adminLoading,
    entrepreneursSummary,
  } = useAdminData(canSeeAdmin);
  const {
    totalUsers,
    pendingRequests,
    activeSessions,
    loading: itLoading,
  } = useITData(canSeeIT);

  // Fetch específico para CONSUMIDOR (null = loading)
  const [consumerSales, setConsumerSales] = useState<ConsumerSale[] | null>(null);

  useEffect(() => {
    if (!isConsumer || !user) return;

    getConsumerPurchases(user.id)
      .then((data) => setConsumerSales(data ?? []))
      .catch(() => setConsumerSales([]));
  }, [isConsumer, user]);

  // Fetch específico para PROVEEDOR (usa su propio endpoint, no el de admin)
  const [providerSales, setProviderSales] = useState<EntrepreneurshipSale[]>([]);
  const [providerLoading, setProviderLoading] = useState(isProvider);

  useEffect(() => {
    if (!isProvider || !user) return;

    let cancelled = false;

    const fetchProviderSales = async () => {
      try {
        setProviderLoading(true);
        const myEnts = await getMyEntrepreneurships();
        const salesPromises = myEnts.map((ent) =>
          getSalesByEntrepreneurship(ent.id),
        );
        const results = await Promise.all(salesPromises);

        if (!cancelled) {
          const merged = new Map<string, EntrepreneurshipSale>();
          results.forEach((sales) => {
            sales.forEach((sale) => {
              if (!merged.has(sale.id)) {
                merged.set(sale.id, sale);
              }
            });
          });
          setProviderSales(Array.from(merged.values()));
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Error fetching provider sales:", error);
          setProviderSales([]);
        }
      } finally {
        if (!cancelled) setProviderLoading(false);
      }
    };

    fetchProviderSales();

    return () => {
      cancelled = true;
    };
  }, [isProvider, user]);

  const stats = useMemo(() => {
    // 1. Stats para ADMIN
    const adminStats = {
      totalRevenue: sales.reduce((acc, s) => acc + s.total, 0),
      pendingPayroll: sales
        .filter((s) => !s.payroll_processed && !s.refunded)
        .reduce((acc, s) => acc + s.total, 0),
      activeEntrepreneurs: entrepreneursSummary.length,
    };

    // 2. Stats para PROVEEDOR (desde su propio fetch independiente)
    const providerStats = {
      revenue: providerSales.reduce((acc, s) => acc + s.total, 0),
      salesCount: providerSales.length,
    };

    // 3. Stats para CONSUMIDOR (desde su propio endpoint)
    const safeConsumerSales = consumerSales ?? [];
    const consumerStats = {
      totalSpent: safeConsumerSales.reduce((acc, s) => acc + s.total, 0),
      purchaseCount: safeConsumerSales.length,
    };

    return { adminStats, providerStats, consumerStats };
  }, [sales, entrepreneursSummary, providerSales, consumerSales]);

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
    loading: authLoading || adminLoading || itLoading || providerLoading || (isConsumer && consumerSales === null),
  };
}
