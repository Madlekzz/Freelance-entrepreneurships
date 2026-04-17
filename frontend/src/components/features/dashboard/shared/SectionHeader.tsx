import type { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  icon: LucideIcon;
  color: string;
}

export function SectionHeader({
  title,
  icon: Icon,
  color,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`p-2 rounded-lg bg-white border border-gray-100 shadow-sm ${color}`}
      >
        <Icon size={18} />
      </div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
    </div>
  );
}
