import { ChevronDown } from "lucide-react";
import {
  SORT_OPTIONS,
  STATUS_OPTIONS,
} from "../../../../../constants/salesFilters";
import FilterDropdown from "../../../../shared/FilterDropdown";
import SearchInput from "../../../../shared/SearchInput";

import type { ReactNode } from "react";

interface Props {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  sortBy: string;
  onSortChange: (val: string) => void;
  exportButton?: ReactNode;
}

export default function SalesFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  exportButton,
}: Props) {
  return (
    <div className="flex flex-col lg:flex-row gap-3 items-center bg-white p-4 rounded-4xl md:rounded-2xl border border-gray-100 shadow-sm">
      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Buscar por cliente, correo o producto..."
      />

      <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
        <div className="w-full lg:w-44 min-w-0">
          <FilterDropdown
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={onStatusChange}
          />
        </div>
        <div className="w-full lg:w-44 min-w-0">
          <FilterDropdown
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={onSortChange}
            icon={<ChevronDown size={14} className="text-gray-400" />}
          />
        </div>
      </div>

      {exportButton}
    </div>
  );
}
