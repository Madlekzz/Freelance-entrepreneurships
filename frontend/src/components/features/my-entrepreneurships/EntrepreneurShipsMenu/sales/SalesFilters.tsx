import { ArrowUpDown, Filter, RotateCcw } from "lucide-react";
import {
  SORT_OPTIONS,
  STATUS_OPTIONS,
} from "../../../../../constants/salesFilters";
import type { DateRange } from "../../../../../types";
import { DateRangeFilter } from "../../../../shared/DateRangeFilter";
import FilterSelector from "../../../admin-entrepreneurs/FilterSelector";
import SearchInput from "../../../../shared/SearchInput";

import type { ReactNode } from "react";

interface Props {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  sortBy: string;
  onSortChange: (val: string) => void;
  dateRange: DateRange | null;
  onDateRangeChange: (val: DateRange | null) => void;
  exportButton?: ReactNode;
}

export default function SalesFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  dateRange,
  onDateRangeChange,
  exportButton,
}: Props) {
  const statusLabel =
    STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ??
    "Todos los estados";
  const sortLabel =
    SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Ordenar";

  return (
    <div className="flex flex-col lg:flex-row gap-3 items-center bg-white p-4 rounded-4xl md:rounded-2xl border border-gray-100 shadow-sm">
      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Buscar por cliente, correo o producto..."
      />

      <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
        <div className="w-full lg:w-44 min-w-0">
          <FilterSelector
            label={statusLabel}
            icon={Filter}
            items={STATUS_OPTIONS.map((opt) => ({
              key: opt.value,
              label: opt.label,
              onClick: () => onStatusChange(opt.value),
            }))}
          />
        </div>
        <div className="w-full lg:w-44 min-w-0">
          <DateRangeFilter value={dateRange} onChange={onDateRangeChange} />
        </div>
        <div className="w-full lg:w-44 min-w-0">
          <FilterSelector
            label={sortLabel}
            icon={ArrowUpDown}
            items={SORT_OPTIONS.map((opt) => ({
              key: opt.value,
              label: opt.label,
              onClick: () => onSortChange(opt.value),
            }))}
          />
        </div>
      </div>

      {exportButton}

      {(searchQuery || statusFilter !== "all" || sortBy !== "date-desc" || dateRange) && (
        <button
          type="button"
          onClick={() => {
            onSearchChange("");
            onStatusChange("all");
            onSortChange("date-desc");
            onDateRangeChange(null);
          }}
          className="p-2.5 text-gray-400 hover:text-primary rounded-xl cursor-pointer transition-colors"
          title="Limpiar filtros"
        >
          <RotateCcw size={18} />
        </button>
      )}
    </div>
  );
}
