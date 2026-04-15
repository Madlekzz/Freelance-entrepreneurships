import { Dropdown } from "antd";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Calendar,
  CalendarIcon,
  CheckCircle2,
  ChevronDown,
  Filter,
  Loader2,
  Package,
  RotateCcw,
  Store,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useAdminData } from "../../../../hooks/useAdminData";
import { MONTHS, PAYROLL_CYCLES } from "../../../../utils/payrollUtils";
import ConfirmationModal from "../../shared/ConfirmationModal";
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

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();

      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [sales, selectedEntId, sortOrder]);

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
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 md:pb-0 [scrollbar-gutter:stable]">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 md:p-6 rounded-4xl md:rounded-3xl border border-gray-100 shadow-sm gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900 leading-tight">
            Panel de Emprendedores
          </h2>
          <p className="text-xs md:text-sm text-gray-500 max-w-62.5 md:max-w-none">
            {view === "summary"
              ? "Resumen de liquidaciones por negocio"
              : `Ventas detalladas de: ${selectedEntrepreneur?.name}`}
          </p>
        </div>

        {view === "detailed" && (
          <button
            type="button"
            onClick={() => {
              setView("summary");
              setSelectedEntId(null);
            }}
            className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-primary/20 transition-all w-full sm:w-auto justify-center cursor-pointer"
          >
            <ArrowLeft size={16} />
            Volver al Resumen
          </button>
        )}
      </div>

      {/* BARRA DE FILTROS */}
      <div className="flex flex-col lg:flex-row gap-3 items-center bg-white p-4 rounded-4xl md:rounded-2xl border border-gray-100 shadow-sm">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={
            view === "summary"
              ? "Buscar por negocio o dueño..."
              : "Buscar en ventas de este emprendedor..."
          }
        />

        {view === "detailed" && (
          <div className="grid grid-cols-2 lg:flex lg:flex-nowrap items-center gap-2 w-full lg:w-auto">
            {/* Filtro de Estado - Diseño Unificado */}
            <div className="col-span-1 lg:w-48 relative">
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "all",
                      label: "Todos los estados",
                      onClick: () => setStatusFilter("all"),
                    },
                    { type: "divider" },
                    {
                      key: "pending",
                      label: "Pendientes",
                      onClick: () => setStatusFilter("pending"),
                    },
                    {
                      key: "processed",
                      label: "Procesados",
                      onClick: () => setStatusFilter("processed"),
                    },
                  ],
                }}
                trigger={["click"]}
                getPopupContainer={(triggerNode) =>
                  triggerNode.parentNode as HTMLElement
                }
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between gap-2 bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    {/* Usamos un icono representativo para estado, ej. Filter o Activity */}
                    <Filter size={16} className="text-primary shrink-0" />
                    <span className="truncate">
                      {statusFilter === "all"
                        ? "Todos los estados"
                        : statusFilter === "pending"
                          ? "Pendientes"
                          : "Procesados"}
                    </span>
                  </div>
                  <ChevronDown size={14} className="text-gray-400 shrink-0" />
                </button>
              </Dropdown>
            </div>

            {/* Selector de Meses - Diseño Unificado */}
            <div className="col-span-1 lg:w-44 relative">
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
                getPopupContainer={(triggerNode) =>
                  triggerNode.parentNode as HTMLElement
                }
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between gap-2 bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Calendar size={16} className="text-primary shrink-0" />
                    <span className="truncate">
                      {selectedMonth !== null
                        ? MONTHS[selectedMonth]
                        : "Todos los meses"}
                    </span>
                  </div>
                  <ChevronDown size={14} className="text-gray-400 shrink-0" />
                </button>
              </Dropdown>
            </div>

            {/* Selector de Ciclo de Nómina - Diseño Unificado */}
            <div className="col-span-1 lg:w-48 relative">
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "all",
                      label: "Todos los ciclos",
                      onClick: () => setPayrollCycle(null),
                    },
                    { type: "divider" },
                    ...PAYROLL_CYCLES.filter(Boolean).map((cycle) => ({
                      key: cycle!.label,
                      label: cycle!.label,
                      onClick: () => setPayrollCycle(cycle),
                    })),
                  ],
                }}
                trigger={["click"]}
                getPopupContainer={(triggerNode) =>
                  triggerNode.parentNode as HTMLElement
                }
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between gap-2 bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <CalendarIcon size={16} className="text-primary shrink-0" />
                    <span className="truncate">
                      {payrollCycle?.label || "Todos los ciclos"}
                    </span>
                  </div>
                  <ChevronDown size={14} className="text-gray-400 shrink-0" />
                </button>
              </Dropdown>
            </div>

            {/* Botón Reset */}
            <div className="col-span-1 lg:w-auto flex justify-center lg:block">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setPayrollCycle(null);
                  setSelectedMonth(new Date().getMonth());
                }}
                className="flex items-center justify-center p-2.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all cursor-pointer"
                title="Limpiar filtros"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ACCIÓN MASIVA FLOTANTE */}
      {selectedSales.length > 0 && (
        <div className="fixed bottom-24 left-4 right-4 md:relative md:bottom-0 md:left-0 md:right-0 z-40">
          <div className="flex items-center justify-between bg-primary text-white p-4 rounded-2xl shadow-xl md:shadow-none animate-in slide-in-from-bottom duration-300 border border-white/20">
            <span className="text-sm font-bold">
              {selectedSales.length}{" "}
              {selectedSales.length === 1 ? "venta" : "ventas"}
            </span>
            <button
              type="button"
              onClick={() => openProcessPayroll(selectedSales)}
              disabled={modalProps.isLoading}
              className="bg-white text-primary px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-gray-100 transition-all cursor-pointer"
            >
              {processingIds.length > 0 ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CheckCircle2 size={16} />
              )}
              Liquidar selección
            </button>
          </div>
        </div>
      )}

      {/* CONTENIDO DE DATOS */}
      <div className="min-h-100">
        {/* VISTA RESUMIDA (SUMMARY) */}
        {view === "summary" && (
          <div className="grid grid-cols-1 gap-4 md:bg-white md:rounded-3xl md:border md:border-gray-100 md:shadow-sm overflow-hidden">
            {/* Tabla Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Negocio
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">
                      Pedidos
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">
                      Pendiente
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">
                      Total Acumulado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {entrepreneursSummary.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-gray-400 italic"
                      >
                        No se encontraron emprendimientos.
                      </td>
                    </tr>
                  ) : (
                    entrepreneursSummary.map((ent) => (
                      <tr
                        key={ent.id}
                        className="hover:bg-gray-50/50 transition-colors cursor-pointer"
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
                        <td className="px-6 py-4 text-right text-gray-500 text-sm">
                          {ent.salesCount}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-amber-600">
                          ${ent.pendingPayroll.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-gray-900">
                          ${ent.totalRevenue.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Cards Mobile */}
            <div className="md:hidden space-y-4">
              {entrepreneursSummary.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-100 mt-4">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    <Package size={32} className="text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Sin emprendimientos
                  </h3>
                  <p className="text-sm text-gray-500 max-w-55 leading-relaxed">
                    {searchQuery
                      ? `No encontramos resultados para "${searchQuery}"`
                      : "Aún no has agregado productos a tu catálogo."}
                  </p>
                </div>
              ) : (
                entrepreneursSummary.map((ent) => (
                  <button
                    type="button"
                    key={ent.id}
                    onClick={() => {
                      setSelectedEntId(ent.id);
                      setView("detailed");
                    }}
                    className="bg-white p-5 rounded-4xl w-full border border-gray-100 shadow-sm space-y-4 active:scale-[0.98] transition-all"
                  >
                    {/* Contenedor de cabecera centrado */}
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="p-3 bg-primary/5 rounded-2xl text-primary">
                        <Store size={20} />
                      </div>
                      <div className="min-w-0 w-full">
                        <p className="text-sm font-black text-gray-900 uppercase tracking-tight truncate">
                          {ent.name}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {ent.ownerName}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-50">
                      <div className="space-y-0.5 text-left">
                        {" "}
                        {/* Alineado a la izquierda para contraste */}
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          Pendiente
                        </p>
                        <p className="text-sm font-black text-amber-600">
                          ${ent.pendingPayroll.toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-0.5 text-right">
                        {" "}
                        {/* Alineado a la derecha para contraste */}
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          Total Acum.
                        </p>
                        <p className="text-sm font-black text-gray-900">
                          ${ent.totalRevenue.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* VISTA DETALLADA (DETAILED) */}
        {view === "detailed" && selectedEntId && (
          <div className="space-y-4 md:bg-white md:rounded-3xl md:border md:border-gray-100 md:shadow-sm overflow-hidden animate-in slide-in-from-right duration-300">
            {/* Tabla Desktop */}
            <div className="hidden md:block overflow-x-auto">
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
                        className="rounded border-gray-300 text-primary cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Productos
                    </th>
                    <th
                      className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() =>
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      }
                    >
                      <div className="flex items-center gap-1">
                        Fecha{" "}
                        {sortOrder === "asc" ? (
                          <ArrowUp size={12} />
                        ) : (
                          <ArrowDown size={12} />
                        )}
                      </div>
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
                        colSpan={6} // Cambiado a 5 para cubrir todas las columnas
                        className="px-6 py-20 text-center"
                      >
                        <div className="flex flex-col items-center justify-center gap-2 text-gray-400 italic">
                          <Package size={40} className="opacity-20" />
                          <p>No se encontraron ventas.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    detailedSales.map((sale) => (
                      <tr
                        key={sale.id}
                        className="hover:bg-gray-50/50 transition-colors"
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
                            className="rounded border-gray-300 text-primary cursor-pointer disabled:opacity-30"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                              <User size={14} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">
                                {sale.users.name}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                {sale.users.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {sale.sale_items.map((item) => (
                            <p
                              key={item.products.id}
                              className="text-[11px] text-gray-600"
                            >
                              <span className="font-bold text-primary">
                                {item.quantity}x
                              </span>{" "}
                              {item.products.name}
                            </p>
                          ))}
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                          {new Date(sale.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {!sale.payroll_processed ? (
                            <button
                              type="button"
                              onClick={() => openProcessPayroll([sale.id])}
                              className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-600 transition-all cursor-pointer"
                            >
                              Liquidar
                            </button>
                          ) : (
                            <CheckCircle2
                              size={18}
                              className="text-emerald-500 opacity-40 mx-auto"
                            />
                          )}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-gray-900">
                          ${sale.total.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Cards Mobile */}
            <div className="md:hidden space-y-4">
              {detailedSales.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-100 mt-4">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    <Package size={32} className="text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Sin ventas
                  </h3>
                  <p className="text-sm text-gray-500 max-w-55 leading-relaxed">
                    {searchQuery
                      ? `No encontramos resultados para "${searchQuery}"`
                      : "Aún no has agregado productos a tu catálogo."}
                  </p>
                </div>
              ) : (
                detailedSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="bg-white p-5 rounded-4xl border border-gray-100 shadow-sm space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          disabled={sale.payroll_processed}
                          checked={selectedSales.includes(sale.id)}
                          onChange={() => toggleSaleSelection(sale.id)}
                          className="w-5 h-5 rounded-lg border-gray-200 text-primary cursor-pointer"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-black text-gray-900 leading-tight truncate">
                            {sale.users.name}
                          </p>
                          <p className="text-[10px] text-gray-400 font-mono">
                            #{sale.id.slice(0, 8).toUpperCase()}
                          </p>
                        </div>
                      </div>
                      {sale.payroll_processed ? (
                        <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-[9px] font-black italic">
                          LIQUIDADO
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openProcessPayroll([sale.id])}
                          className="bg-green-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-black shadow-sm active:scale-95 transition-all cursor-pointer"
                        >
                          LIQUIDAR
                        </button>
                      )}
                    </div>

                    <div className="space-y-1.5 bg-gray-50/50 p-3 rounded-2xl border border-gray-100/50">
                      {sale.sale_items.map((item) => (
                        <div
                          key={item.products.id}
                          className="text-[11px] text-gray-600 flex justify-between gap-2"
                        >
                          <span className="truncate">
                            <b className="text-primary">{item.quantity}x</b>{" "}
                            {item.products.name}
                          </span>
                          <span className="font-mono text-gray-400 shrink-0">
                            ${item.unit_price}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          Fecha de Venta
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-700 font-bold">
                          <Calendar size={13} className="text-primary" />
                          {new Date(sale.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          Monto
                        </p>
                        <p className="text-xl font-black text-gray-900 leading-none">
                          ${sale.total.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <ConfirmationModal {...modalProps} type="info" />
    </div>
  );
}
