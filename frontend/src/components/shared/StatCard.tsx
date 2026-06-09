import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
  textColor: string;
  count?: number;
  countLabel?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  color,
  textColor,
  count,
  countLabel,
}: StatCardProps) {
  const isZero = count !== undefined && count === 0;

  return (
    <div
      className={`bg-white rounded-2xl border ${color} p-4 shadow-sm ${isZero ? "opacity-40" : ""}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className={textColor} />
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
          {label}
        </span>
      </div>
      <p className={`text-lg font-black ${textColor}`}>{value}</p>
      {count !== undefined && (
        <p className="text-[10px] text-gray-400">
          {count} {countLabel ?? ""}
        </p>
      )}
    </div>
  );
}
