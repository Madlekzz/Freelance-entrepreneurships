import { Select } from "antd";
import { Filter } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}

export default function FilterDropdown({
  options,
  value,
  onChange,
  placeholder,
  icon,
}: FilterDropdownProps) {
  return (
    <div className="relative min-w-45">
      <Select
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        options={options}
        className="w-full h-10.5 custom-select"
        suffixIcon={icon || <Filter size={14} className="text-gray-400" />}
      />
    </div>
  );
}
