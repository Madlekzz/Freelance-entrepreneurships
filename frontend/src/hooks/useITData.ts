import { useCallback, useEffect, useState } from "react";
import { getPendingRequests } from "../services/authService";
import { getActiveSessions, getAllUsers } from "../services/usersService";

interface ITMetrics {
  totalUsers: number;
  pendingRequests: number;
  activeSessions: number;
}

export function useITData(enabled: boolean) {
  const [metrics, setMetrics] = useState<ITMetrics>({
    totalUsers: 0,
    pendingRequests: 0,
    activeSessions: 0,
  });
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  const fetchITDashboardData = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Ejecución paralela de servicios reales
      const [users, requests, activeCount] = await Promise.all([
        getAllUsers(),
        getPendingRequests(),
        getActiveSessions(),
      ]);

      setMetrics({
        totalUsers: users.length,
        pendingRequests: requests.length,
        activeSessions: activeCount,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error al cargar métricas de IT";
      setError(msg);
      console.error("[useITData] Error:", msg);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchITDashboardData();
  }, [fetchITDashboardData]);

  return {
    ...metrics,
    loading,
    error,
    refresh: fetchITDashboardData,
  };
}
