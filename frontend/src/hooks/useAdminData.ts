import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { updatePayrollStatus } from "../services/adminService";
import { type GlobalSale, getAllSales } from "../services/saleService";
import { AppError } from "../types";

// --- Interfaces de Resumen (ViewModels) ---

export interface EntrepreneurSummary {
  id: string;
  name: string;
  totalRevenue: number;
  pendingPayroll: number;
  salesCount: number;
  pendingIds: string[];
}

export interface ConsumerSummary {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
  pendingDeduction: number;
  ordersCount: number;
  pendingIds: string[];
}

/**
 * @param enabled - Controla si el hook debe realizar la petición a la API.
 * Útil para evitar errores 403 en usuarios sin rol ADMIN/IT.
 */
export function useAdminData(enabled: boolean = true) {
  const [sales, setSales] = useState<GlobalSale[]>([]);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [processing, setProcessing] = useState<boolean>(false);

  // Dentro de useAdminData.ts
  const fetchData = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getAllSales();
      setSales(data);
    } catch (err: unknown) {
      // Verificamos si es nuestro error personalizado
      if (err instanceof AppError) {
        // Evitamos el toast si es 403
        if (err.status !== 403) {
          toast.error(err.message);
        }
        console.error(`[${err.status}] ${err.message}`);
      } else {
        // Error genérico no controlado
        toast.error("Ocurrió un error desconocido");
      }
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const processPayroll = async (saleIds: string[]) => {
    if (saleIds.length === 0) return;

    try {
      setProcessing(true);
      await Promise.all(saleIds.map((id) => updatePayrollStatus(id)));
      toast.success("Registros actualizados correctamente");
      await fetchData();
    } catch (error: unknown) {
      console.error("Error al procesar nómina:", error);
      toast.error("Error al actualizar algunos registros");
    } finally {
      setProcessing(false);
    }
  };

  // --- Resumen para la sección EMPRENDEDORES ---
  const entrepreneursSummary = useMemo<EntrepreneurSummary[]>(() => {
    const map: Record<string, EntrepreneurSummary> = {};

    sales.forEach((s) => {
      const entrepreneurship = s.sale_items[0]?.products?.entrepreneurships;
      if (!entrepreneurship) return;

      const entId = entrepreneurship.id;

      if (!map[entId]) {
        map[entId] = {
          id: entId,
          name: entrepreneurship.name,
          totalRevenue: 0,
          pendingPayroll: 0,
          salesCount: 0,
          pendingIds: [],
        };
      }

      map[entId].totalRevenue += s.total;
      map[entId].salesCount += 1;

      if (!s.payroll_processed) {
        map[entId].pendingPayroll += s.total;
        map[entId].pendingIds.push(s.id);
      }
    });

    return Object.values(map);
  }, [sales]);

  // --- Resumen para la sección CONSUMIDORES (Empleados) ---
  const consumersSummary = useMemo<ConsumerSummary[]>(() => {
    const map: Record<string, ConsumerSummary> = {};

    sales.forEach((s) => {
      const user = s.users;
      if (!user) return;

      if (!map[user.email]) {
        map[user.email] = {
          id: user.id,
          name: user.name,
          email: user.email,
          totalSpent: 0,
          pendingDeduction: 0,
          ordersCount: 0,
          pendingIds: [],
        };
      }

      map[user.email].totalSpent += s.total;
      map[user.email].ordersCount += 1;

      if (!s.payroll_processed) {
        map[user.email].pendingDeduction += s.total;
        map[user.email].pendingIds.push(s.id);
      }
    });

    return Object.values(map);
  }, [sales]);

  return {
    sales,
    entrepreneursSummary,
    consumersSummary,
    loading,
    processing,
    processPayroll,
    refetch: fetchData,
  };
}
