import { Dropdown } from "antd";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Calendar,
  CalendarIcon,
  CheckCircle2,
  ChevronDown,
  Clock,
  Loader2,
  PackageCheck,
  RotateCcw,
  Store,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  type EntrepreneurSummary,
  useAdminData,
} from "../../../../hooks/useAdminData";
import type { GlobalSale } from "../../../../services/saleService";
import { MONTHS, PAYROLL_CYCLES } from "../../../../utils/payrollUtils";
import ConfirmationModal from "../../shared/ConfirmationModal";
import FilterDropdown from "../../shared/FilterDropdown";
import SearchInput from "../../shared/SearchInput";
import { AdminConsumersSkeleton } from "../admin-consumers/AdminConsumersSkeleton";

export default function AdminEntrepreneurs() {
  const {
    entrepreneursSummary,
    fullEntrepreneursSummary,
    sales,
    loading,
    processingIds,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    payrollCycle,
    setPayrollCycle,
    selectedMonth,
    setSelectedMonth,
    sortOrder,
    setSortOrder,
    openProcessPayroll,
    modalProps,
    selectedSales,
    setSelectedSales,
    toggleSaleSelection,
  } = useAdminData();

  const [view, setView] = useState<"summary" | "detailed">("summary");
  const [selectedEntId, setSelectedEntId] = useState<string | null>(null);

  const selectedEntrepreneur = useMemo(
    () => fullEntrepreneursSummary.find((e) => e.id === selectedEntId),
    [fullEntrepreneursSummary, selectedEntId],
  );

  const detailedSales = useMemo(() => {
    if (!selectedEntId) return [];

    const filtered = sales.filter((s) =>
      s.sale_items.some(
        (item) => item.products.entrepreneurships.id === selectedEntId,
      ),
    );

    // Aplicar ordenamiento por fecha (created_at)
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();

      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [sales, selectedEntId, sortOrder]); // Se añade sortOrder a las dependencias

  const toggleAllVisible = () => {
    const pendingSalesIds = detailedSales
      .filter((s) => !s.payroll_processed)
      .map((s) => s.id);

    if (selectedSales.length === pendingSalesIds.length) {
      setSelectedSales([]);
    } else {
      setSelectedSales(pendingSalesIds);
    }
  };

  if (loading) {
    return <AdminConsumersSkeleton />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Panel de Emprendedores
          </h2>
          <p className="text-sm text-gray-500">
            {view === "summary"
              ? "Resumen de liquidaciones por negocio"
              : `Ventas detalladas de: ${selectedEntrepreneur?.name} - ${selectedEntrepreneur?.ownerName}`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (view === "detailed") {
              setView("summary");
              setSelectedEntId(null);
            } else if (selectedEntId) {
              setView("detailed");
            }
          }}
          disabled={view === "summary" && !selectedEntId}
          className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/20 transition-all disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
        >
          <ArrowLeft size={18} />
          Volver al Resumen
        </button>
      </div>

      {/* NUEVA BARRA DE FILTROS TIPO "MY PRODUCTS" */}
      <div className="flex flex-col lg:flex-row gap-3 items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        {/* Búsqueda Principal */}
        <SearchInput
          value={searchQuery} // Conectado a tu useAdminData
          onChange={setSearchQuery}
          placeholder={
            view === "summary"
              ? "Buscar por negocio o dueño..."
              : "Buscar en ventas de este emprendedor..."
          }
        />

        {view === "detailed" && (
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            {/* Filtro de Estado de Nómina */}
            <FilterDropdown
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: "Todos los estados", value: "all" },
                { label: "Pendientes", value: "pending" },
                { label: "Procesados", value: "processed" },
              ]}
            />

            <Dropdown
              menu={{
                items: [
                  {
                    key: "all_months",
                    label: "Todos los meses",
                    onClick: () => setSelectedMonth(null),
                  },
                  { type: "divider" },
                  ...MONTHS.map((monthName, index) => ({
                    key: index.toString(),
                    label: monthName,
                    onClick: () => setSelectedMonth(index),
                  })),
                ],
              }}
              trigger={["click"]}
            >
              <button
                type="button"
                className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <Calendar size={16} className="text-primary" />
                <span>
                  {selectedMonth !== null
                    ? MONTHS[selectedMonth]
                    : "Todos los meses"}
                </span>
                <ChevronDown size={14} />
              </button>
            </Dropdown>

            {/* Selector de Ciclo de Nómina */}
            <Dropdown
              menu={{
                items: [
                  // Añadimos la opción manual para resetear el filtro
                  {
                    key: "all",
                    label: "Todos los ciclos",
                    onClick: () => setPayrollCycle(null),
                  },
                  // Separador visual opcional
                  { type: "divider" },
                  ...PAYROLL_CYCLES.filter(Boolean).map((cycle) => ({
                    key: cycle!.label,
                    label: cycle!.label,
                    onClick: () => setPayrollCycle(cycle),
                  })),
                ],
              }}
              trigger={["click"]}
            >
              <button
                type="button"
                className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <CalendarIcon size={16} className="text-primary" />
                {/* Usamos un fallback por si es null */}
                <span>{payrollCycle?.label || "Todos los ciclos"}</span>
                <ChevronDown size={14} />
              </button>
            </Dropdown>

            {/* Botón de Reset */}
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setPayrollCycle(null);
                setSelectedMonth(new Date().getMonth());
              }}
              className="p-2.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all cursor-pointer"
              title="Limpiar filtros"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        )}
      </div>

      {/* ACCIÓN MASIVA (Solo se muestra si hay seleccionados) */}
      {selectedSales.length > 0 && (
        <div className="flex items-center justify-between bg-primary/5 border border-primary/20 p-4 rounded-2xl mb-4 animate-in slide-in-from-top duration-300">
          <span className="text-sm font-medium text-primary">
            {selectedSales.length}{" "}
            {selectedSales.length === 1
              ? "venta seleccionada"
              : "ventas seleccionadas"}
          </span>
          <button
            type="button"
            onClick={() => openProcessPayroll(selectedSales)} // <--- USO AQUÍ
            disabled={modalProps.isLoading}
            className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer"
          >
            {processingIds.length > 0 ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <CheckCircle2 size={16} />
            )}
            Liquidar selección
          </button>
        </div>
      )}

      {/* VISTA RESUMIDA */}
      {view === "summary" && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Negocio
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">
                    Ventas
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">
                    Pendiente Nómina
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">
                    Total Acumulado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {entrepreneursSummary.map((ent: EntrepreneurSummary) => (
                  <tr
                    key={ent.id}
                    className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${
                      selectedEntId === ent.id ? "bg-primary/5" : ""
                    }`}
                    onClick={() => {
                      setSelectedEntId(ent.id);
                      setView("detailed");
                    }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                          <Store size={16} />
                        </div>
                        <span className="font-bold text-gray-900">
                          {ent.name} - {ent.ownerName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500">
                      {ent.salesCount} pedidos
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-amber-600">
                      ${ent.pendingPayroll.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                      ${ent.totalRevenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VISTA DETALLADA */}
      {view === "detailed" && selectedEntId && (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 w-10">
                      <input
                        type="checkbox"
                        onChange={toggleAllVisible}
                        checked={
                          detailedSales.filter((s) => !s.payroll_processed)
                            .length > 0 &&
                          selectedSales.length ===
                            detailedSales.filter((s) => !s.payroll_processed)
                              .length
                        }
                        className="rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Productos
                    </th>
                    <th
                      className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-primary transition-colors"
                      onClick={() =>
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      }
                    >
                      <div className="flex items-center gap-1">
                        Fecha
                        {sortOrder === "asc" ? (
                          <ArrowUp size={12} className="text-primary" />
                        ) : (
                          <ArrowDown size={12} className="text-primary" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Estado Nómina
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">
                      Acción
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">
                      Monto
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {detailedSales.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-16 text-center text-gray-400"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <PackageCheck size={48} className="opacity-10" />
                          <p className="text-sm font-medium">
                            No hay ventas registradas
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    detailedSales.map((sale: GlobalSale) => {
                      const isSaleProcessing = processingIds.includes(sale.id);
                      return (
                        <tr
                          key={sale.id}
                          className="hover:bg-gray-50/50 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              disabled={
                                sale.payroll_processed ||
                                processingIds.includes(sale.id)
                              }
                              checked={selectedSales.includes(sale.id)}
                              onChange={() => toggleSaleSelection(sale.id)}
                              className="rounded border-gray-300 text-primary focus:ring-primary cursor-pointer disabled:opacity-30"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                                <User size={16} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-900">
                                  {sale.users.name}
                                </p>
                                <p className="text-[11px] text-gray-400">
                                  {sale.users.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              {sale.sale_items.map((item) => (
                                <p
                                  key={item.products.id}
                                  className="text-xs text-gray-600 flex items-center gap-1"
                                >
                                  <span className="font-bold text-primary bg-primary/5 px-1 rounded">
                                    {item.quantity}x
                                  </span>
                                  <span className="truncate max-w-37.5">
                                    {item.products.name}
                                  </span>
                                </p>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                              <Calendar size={14} className="text-gray-400" />
                              {new Date(sale.created_at).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {sale.payroll_processed ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100">
                                <CheckCircle2 size={12} /> PROCESADO
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold border border-amber-100">
                                <Clock size={12} /> PENDIENTE
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {!sale.payroll_processed ? (
                              <button
                                type="button"
                                onClick={() => openProcessPayroll([sale.id])} // <--- USO AQUÍ
                                disabled={modalProps.isLoading}
                                className="flex items-center gap-1.5 bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-600 transition-all disabled:opacity-50 cursor-pointer"
                                title="Liquidar esta venta"
                              >
                                {isSaleProcessing ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <CheckCircle2 size={14} />
                                )}
                                Liquidar
                              </button>
                            ) : (
                              <div className="flex justify-center text-emerald-500">
                                <CheckCircle2
                                  size={18}
                                  className="opacity-40"
                                />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex flex-col items-end">
                              <span className="text-sm font-bold text-gray-900">
                                ${sale.total.toLocaleString()}
                              </span>
                              <span className="text-[9px] text-gray-400 font-mono">
                                #{sale.id.slice(0, 8).toUpperCase()}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <ConfirmationModal {...modalProps} type="info" />
    </div>
  );
}
