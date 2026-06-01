import { Calendar, Filter, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import type { DateRange } from "../../../types";
import { MONTHS } from "../../../utils/payrollUtils";
import { DateRangeFilter } from "../../shared/DateRangeFilter";
import SearchInput from "../../shared/SearchInput";
import FilterSelector from "./FilterSelector";

interface Props {
  view: "summary" | "detailed";
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  selectedMonth: number | null;
  setSelectedMonth: (val: number | null) => void;
  dateRange: DateRange | null;
  setDateRange: (val: DateRange | null) => void;
  exportButton?: ReactNode;
}

export const EntrepreneursFilters = (props: Props) => {
  const {
    view,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    selectedMonth,
    setSelectedMonth,
    dateRange,
    setDateRange,
    exportButton,
  } = props;

  return (
    <div className="flex flex-col lg:flex-row gap-3 items-center bg-white p-4 rounded-4xl md:rounded-2xl border border-gray-100 shadow-sm">
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder={
          view === "summary"
            ? "Buscar por negocio o dueño..."
            : "Buscar en ventas..."
        }
      />

      {view === "detailed" && (
        <div className="grid grid-cols-2 lg:flex lg:flex-nowrap items-center gap-2 w-full lg:w-auto">
          <FilterSelector
            label={
              statusFilter === "all"
                ? "Todos"
                : statusFilter === "pending"
                  ? "Pendientes"
                  : "Procesados"
            }
            icon={Filter}
            items={[
              {
                key: "all",
                label: "Todos los estados",
                onClick: () => setStatusFilter("all"),
              },
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
            ]}
          />

          <FilterSelector
            label={selectedMonth !== null ? MONTHS[selectedMonth] : "Meses"}
            icon={Calendar}
            items={[
              {
                key: "all",
                label: "Todos los meses",
                onClick: () => setSelectedMonth(null),
              },
              ...MONTHS.map((m, i) => ({
                key: i,
                label: m,
                onClick: () => setSelectedMonth(i),
              })),
            ]}
          />

          <DateRangeFilter value={dateRange} onChange={setDateRange} />

          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setDateRange(null);
              setSelectedMonth(null);
            }}
            className="p-2.5 text-gray-400 hover:text-primary rounded-xl cursor-pointer transition-colors"
            title="Limpiar filtros"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      )}

      {exportButton}
    </div>
  );
};
