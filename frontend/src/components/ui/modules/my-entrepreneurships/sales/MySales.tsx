import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Package,
  ShoppingBag,
  User,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useSales } from "../../../../../hooks/useSales";
import FilterDropdown from "../../../shared/FilterDropdown";
import SearchInput from "../../../shared/SearchInput";
import ProductTableSkeleton from "../products/ProductTableSkeleton";

// Configuración de opciones para los filtros
const SORT_OPTIONS = [
  { value: "date-desc", label: "Fecha: Más recientes" },
  { value: "date-asc", label: "Fecha: Más antiguos" },
  { value: "total-desc", label: "Monto: Mayor a Menor" },
  { value: "total-asc", label: "Monto: Menor a Mayor" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "Todos los estados" },
  { value: "processed", label: "Procesado" },
  { value: "pending", label: "Pendiente" },
];

export default function MySales() {
  const { id } = useParams<{ id: string }>();
  const {
    sales,
    loading,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    statusFilter,
    setStatusFilter,
  } = useSales(id);

  if (loading) return <ProductTableSkeleton />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 md:pb-0">
      {/* Resumen rápido - Adaptado para que no se vea gigante en mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 md:p-6 rounded-4xl md:rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-500 font-medium">
              Ventas Encontradas
            </p>
            <p className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
              {sales.length}
            </p>
          </div>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros (Ya ajustada previamente) */}
      <div className="flex flex-col lg:flex-row gap-3 items-center bg-white p-4 rounded-4xl md:rounded-2xl border border-gray-100 shadow-sm">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar por cliente, correo o producto..."
        />

        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <div className="w-full lg:w-44 min-w-0">
            <FilterDropdown
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={setStatusFilter}
            />
          </div>
          <div className="w-full lg:w-44 min-w-0">
            <FilterDropdown
              options={SORT_OPTIONS}
              value={sortBy}
              onChange={setSortBy}
              icon={<ChevronDown size={14} className="text-gray-400" />}
            />
          </div>
        </div>
      </div>

      {/* CONTENEDOR DE VENTAS */}
      <div>
        {/* VISTA DESKTOP: Tabla original */}
        <div className="hidden md:block bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Productos
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Estado Nómina
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">
                  Monto
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sales.length === 0 ? (
                <tr>
                  <td
                    colSpan={5} // Cambiado a 5 para cubrir todas las columnas
                    className="px-6 py-20 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-400 italic">
                      <Package size={40} className="opacity-20" />
                      <p>No se encontraron ventas.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr
                    key={sale.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 group-hover:bg-white transition-colors">
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
                    <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                      {new Date(sale.created_at).toLocaleDateString(undefined, {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* VISTA MOBILE: Cards Detalladas */}
        <div className="md:hidden grid grid-cols-1 gap-4 p-4">
          {sales.length === 0 ? (
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
                  : "Aún no has vendido ningun producto."}
              </p>
            </div>
          ) : (
            sales.map((sale) => (
              <div
                key={sale.id}
                className="bg-white p-5 rounded-4xl border border-gray-100 shadow-sm space-y-4"
              >
                {/* Header de la Card: Cliente e ID */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                      <User size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate uppercase tracking-tight">
                        {sale.users.name}
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono">
                        #{sale.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                  </div>
                  {sale.payroll_processed ? (
                    <span className="bg-emerald-50 text-emerald-600 p-1.5 rounded-lg shrink-0">
                      <CheckCircle2 size={16} />
                    </span>
                  ) : (
                    <span className="bg-amber-50 text-amber-600 p-1.5 rounded-lg shrink-0">
                      <Clock size={16} />
                    </span>
                  )}
                </div>

                {/* Lista de Productos */}
                <div className="bg-gray-50/50 rounded-2xl p-3 space-y-2">
                  {sale.sale_items.map((item) => (
                    <div
                      key={item.products.id}
                      className="flex justify-between items-center text-[11px]"
                    >
                      <span className="text-gray-600 truncate max-w-[70%]">
                        <span className="font-bold text-primary mr-1">
                          {item.quantity}x
                        </span>
                        {item.products.name}
                      </span>
                      <span className="font-bold text-gray-400 italic">
                        ${item.unit_price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer de la Card: Fecha y Total */}
                <div className="flex justify-between items-end pt-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                      Fecha de Venta
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-gray-700 font-bold">
                      <Calendar size={13} className="text-primary" />
                      {new Date(sale.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                      Monto Total
                    </p>
                    <p className="text-lg font-black text-primary leading-tight">
                      ${sale.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
