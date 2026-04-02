import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  PackageCheck,
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
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Resumen rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">
              Ventas Encontradas
            </p>
            <p className="text-2xl font-bold text-gray-900">{sales.length}</p>
          </div>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="flex flex-col lg:flex-row gap-3 items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar por cliente, correo o producto..."
        />

        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <FilterDropdown
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <FilterDropdown
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={setSortBy}
            icon={<ChevronDown size={14} className="text-gray-400" />}
          />
        </div>
      </div>

      {/* Tabla de Ventas */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
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
                    colSpan={5}
                    className="px-6 py-16 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <PackageCheck size={48} className="opacity-10" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          No se encontraron resultados
                        </p>
                        <p className="text-xs">
                          Intenta ajustar los filtros o la búsqueda.
                        </p>
                      </div>
                      {(searchQuery || statusFilter !== "all") && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery("");
                            setStatusFilter("all");
                          }}
                          className="mt-2 text-primary text-xs font-bold hover:underline"
                        >
                          Limpiar todos los filtros
                        </button>
                      )}
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
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                        <Calendar size={14} className="text-gray-400" />
                        {new Date(sale.created_at).toLocaleDateString(
                          undefined,
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
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
      </div>
    </div>
  );
}
