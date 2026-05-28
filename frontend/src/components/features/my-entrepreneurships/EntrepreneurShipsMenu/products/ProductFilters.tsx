import { ArrowUpDown, Filter, Package } from "lucide-react";
import {
  SORT_OPTIONS,
  STOCK_OPTIONS,
  STATUS_OPTIONS,
} from "../../../../../constants/productsFilters";
import FilterSelector from "../../../admin-entrepreneurs/FilterSelector";
import SearchInput from "../../../../shared/SearchInput";

interface Props {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  stockFilter: string;
  onStockChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export default function ProductFilters(props: Props) {
  const statusLabel =
    STATUS_OPTIONS.find((o) => o.value === props.statusFilter)?.label ??
    "Todos los estados";
  const stockLabel =
    STOCK_OPTIONS.find((o) => o.value === props.stockFilter)?.label ??
    "Todo el stock";
  const sortLabel =
    SORT_OPTIONS.find((o) => o.value === props.sortBy)?.label ?? "Ordenar";

  return (
    <div className="flex flex-col lg:flex-row gap-3 items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
      <SearchInput
        value={props.searchQuery}
        onChange={props.onSearchChange}
        placeholder="Buscar producto..."
      />

      <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto mt-2 lg:mt-0">
        <div className="w-full lg:w-44 min-w-0">
          <FilterSelector
            label={statusLabel}
            icon={Filter}
            items={STATUS_OPTIONS.map((opt) => ({
              key: opt.value,
              label: opt.label,
              onClick: () => props.onStatusChange(opt.value),
            }))}
          />
        </div>
        <div className="w-full lg:w-44 min-w-0">
          <FilterSelector
            label={stockLabel}
            icon={Package}
            items={STOCK_OPTIONS.map((opt) => ({
              key: opt.value,
              label: opt.label,
              onClick: () => props.onStockChange(opt.value),
            }))}
          />
        </div>
        <div className="w-full lg:w-44 min-w-0">
          <FilterSelector
            label={sortLabel}
            icon={ArrowUpDown}
            items={SORT_OPTIONS.map((opt) => ({
              key: opt.value,
              label: opt.label,
              onClick: () => props.onSortChange(opt.value),
            }))}
          />
        </div>
      </div>
    </div>
  );
}
