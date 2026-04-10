import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { updatePayrollStatus } from "../services/adminService";
import { type GlobalSale, getAllSales } from "../services/saleService";
import { AppError } from "../types";
import type { PayrollCycle } from "../utils/payrollUtils";

// --- Interfaces de Resumen (ViewModels) ---

export interface EntrepreneurSummary {
  id: string;
  name: string;
  ownerName: string;
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
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [payrollCycle, setPayrollCycle] = useState<PayrollCycle | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(
    new Date().getMonth(),
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idsToProcess, setIdsToProcess] = useState<string[]>([]);
  const [modalConfig, setModalConfig] = useState({ title: "", message: "" });
  const [selectedSales, setSelectedSales] = useState<string[]>([]);

  // Dentro de useAdminData.ts
  const fetchData = useCallback(
    async (isSilent = false) => {
      if (!enabled) {
        setLoading(false);
        return;
      }

      try {
        if (!isSilent) setLoading(true);
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
    },
    [enabled],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openProcessPayroll = useCallback((ids: string[]) => {
    if (ids.length === 0) return;

    setIdsToProcess(ids);
    const isMultiple = ids.length > 1;

    setModalConfig({
      title: isMultiple
        ? "Liquidar selección masiva"
        : "Liquidar venta individual",
      message: isMultiple
        ? `¿Estás seguro de que deseas liquidar las ${ids.length} ventas seleccionadas? Esta acción no se puede deshacer.`
        : "¿Estás seguro de que deseas liquidar esta venta? Se marcará como procesada en el sistema.",
    });

    setIsModalOpen(true);
  }, []);

  const processPayroll = async (saleIds: string[]) => {
    if (saleIds.length === 0) return;

    try {
      setProcessingIds((prev) => [...prev, ...saleIds]);
      await Promise.all(saleIds.map((id) => updatePayrollStatus(id)));
      toast.success("Registros actualizados correctamente");
      await fetchData(true);
      setSelectedSales((prev) => prev.filter((id) => !saleIds.includes(id)));
      setIsModalOpen(false);
    } catch (error: unknown) {
      console.error("Error al procesar nómina:", error);
      toast.error("Error al actualizar algunos registros");
    } finally {
      setProcessingIds((prev) => prev.filter((id) => !saleIds.includes(id)));
      setIdsToProcess([]);
    }
  };

  const toggleSaleSelection = useCallback((saleId: string) => {
    setSelectedSales((prev) =>
      prev.includes(saleId)
        ? prev.filter((id) => id !== saleId)
        : [...prev, saleId],
    );
  }, []);

  const isDateInCycle = useCallback(
    (date: Date, cycle: PayrollCycle | null, refMonth: number | null) => {
      const currentYear = new Date().getFullYear();

      // 1. Si no hay mes seleccionado, mostramos todo (o filtramos solo por ciclo si existe)
      if (refMonth === null) {
        if (!cycle) return true; // Ni mes ni ciclo: mostrar todo

        // Si hay ciclo pero no mes, validamos el ciclo en cualquier mes del año actual
        return (
          date.getDate() >=
            (cycle.startDay <= cycle.endDay ? cycle.startDay : 0) &&
          date.getFullYear() === currentYear
        );
      }

      // 2. Si NO hay ciclo, filtramos por el mes de referencia
      if (!cycle) {
        return (
          date.getMonth() === refMonth && date.getFullYear() === currentYear
        );
      }

      // 3. Lógica de ciclos (se mantiene igual)
      const { startDay, endDay } = cycle;
      let startDate: Date;
      let endDate: Date;

      if (startDay <= endDay) {
        startDate = new Date(currentYear, refMonth, startDay, 0, 0, 0);
        endDate = new Date(currentYear, refMonth, endDay, 23, 59, 59);
      } else {
        startDate = new Date(currentYear, refMonth - 1, startDay, 0, 0, 0);
        endDate = new Date(currentYear, refMonth, endDay, 23, 59, 59);
      }

      return date >= startDate && date <= endDate;
    },
    [],
  );

  // --- Resumen para la sección EMPRENDEDORES ---
  // --- Resumen para la sección EMPRENDEDORES ---
  const { fullEntrepreneursSummary, filteredEntrepreneursSummary } =
    useMemo(() => {
      const map: Record<string, EntrepreneurSummary> = {};

      // 1. Filtrado base por CICLO y ESTADO
      const baseSales = sales.filter((sale) => {
        const saleDate = new Date(sale.created_at);

        const matchesStatus =
          statusFilter === "all"
            ? true
            : statusFilter === "pending"
              ? !sale.payroll_processed
              : sale.payroll_processed;

        const matchesCycle = isDateInCycle(
          saleDate,
          payrollCycle,
          selectedMonth,
        );

        return matchesStatus && matchesCycle;
      });

      // 2. Agrupación por Emprendimiento
      baseSales.forEach((s) => {
        const entrepreneurship = s.sale_items[0]?.products?.entrepreneurships;
        if (!entrepreneurship) return;

        const entId = entrepreneurship.id;
        if (!map[entId]) {
          map[entId] = {
            id: entId,
            name: entrepreneurship.name,
            ownerName: entrepreneurship.users.name,
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

      const fullList = Object.values(map);
      const searchLower = searchQuery.toLowerCase();

      const filteredList = fullList.filter(
        (ent) =>
          !searchQuery ||
          ent.name.toLowerCase().includes(searchLower) ||
          ent.ownerName.toLowerCase().includes(searchLower),
      );

      return {
        fullEntrepreneursSummary: fullList,
        filteredEntrepreneursSummary: filteredList,
      };
    }, [
      sales,
      searchQuery,
      statusFilter,
      payrollCycle,
      isDateInCycle,
      selectedMonth,
    ]);

  // --- Resumen para la sección CONSUMIDORES (Empleados) ---
  // --- Resumen para la sección CONSUMIDORES (Empleados) ---
  const consumersSummary = useMemo<ConsumerSummary[]>(() => {
    const map: Record<string, ConsumerSummary> = {};
    const searchLower = searchQuery.toLowerCase();

    // Filtramos ventas por ciclo antes de agrupar consumidores
    const cycleSales = sales.filter((s) =>
      isDateInCycle(new Date(s.created_at), payrollCycle, selectedMonth),
    );

    cycleSales.forEach((s) => {
      const user = s.users;
      if (!user) return;

      const userName = user.name.toLowerCase();
      const userEmail = user.email.toLowerCase();

      if (
        searchQuery &&
        !userName.includes(searchLower) &&
        !userEmail.includes(searchLower)
      ) {
        return;
      }

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
  }, [sales, searchQuery, payrollCycle, isDateInCycle, selectedMonth]);

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const searchLower = searchQuery.toLowerCase();
      const saleDate = new Date(sale.created_at);

      // 1. Filtro por Texto
      const entrepreneurName =
        sale.sale_items[0]?.products?.entrepreneurships?.name?.toLowerCase() ||
        "";
      const userName = sale.users?.name?.toLowerCase() || "";

      // --- NUEVO: Buscar en los nombres de los productos ---
      const matchesProduct = sale.sale_items.some((item) =>
        item.products?.name?.toLowerCase().includes(searchLower),
      );

      const matchesSearch =
        entrepreneurName.includes(searchLower) ||
        userName.includes(searchLower) ||
        matchesProduct; // <--- Agregamos la condición aquí

      // 2. Filtro por Estado de Nómina
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "pending"
            ? !sale.payroll_processed
            : sale.payroll_processed;

      const matchesCycle = isDateInCycle(saleDate, payrollCycle, selectedMonth);

      return matchesSearch && matchesStatus && matchesCycle;
    });
  }, [
    sales,
    searchQuery,
    statusFilter,
    payrollCycle,
    isDateInCycle,
    selectedMonth,
  ]);

  return {
    sales: filteredSales,
    selectedSales,
    setSelectedSales,
    toggleSaleSelection,
    fullEntrepreneursSummary,
    entrepreneursSummary: filteredEntrepreneursSummary,
    consumersSummary,
    loading,
    processingIds,
    processPayroll,
    openProcessPayroll,
    refetch: fetchData,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    payrollCycle,
    setPayrollCycle,
    setSelectedMonth,
    selectedMonth,
    sortOrder,
    setSortOrder,
    modalProps: {
      isOpen: isModalOpen,
      onClose: () => !processingIds.length && setIsModalOpen(false),
      onConfirm: () => processPayroll(idsToProcess),
      title: modalConfig.title,
      message: modalConfig.message,
      isLoading: processingIds.length > 0,
      confirmText: "Si, liquidar",
    },
  };
}
