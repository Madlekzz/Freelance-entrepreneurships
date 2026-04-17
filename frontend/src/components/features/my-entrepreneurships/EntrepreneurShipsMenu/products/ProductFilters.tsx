import { ChevronDown } from "lucide-react";
import {
  SORT_OPTIONS,
  STATUS_OPTIONS,
} from "../../../../../constants/productsFilters";
import FilterDropdown from "../../../../shared/FilterDropdown";
import SearchInput from "../../../../shared/SearchInput";

interface Props {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export default function ProductFilters(props: Props) {
  return (
    <div className="flex flex-col lg:flex-row gap-3 items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
      <SearchInput
        value={props.searchQuery}
        onChange={props.onSearchChange}
        placeholder="Buscar producto..."
      />

      <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto mt-2 lg:mt-0">
        <div className="w-full lg:w-44 min-w-0">
          <FilterDropdown
            options={STATUS_OPTIONS}
            value={props.statusFilter}
            onChange={props.onStatusChange}
          />
        </div>
        <div className="w-full lg:w-44 min-w-0">
          <FilterDropdown
            options={SORT_OPTIONS}
            value={props.sortBy}
            onChange={props.onSortChange}
            icon={<ChevronDown size={14} className="text-gray-400" />}
          />
        </div>
      </div>
    </div>
  );
}
