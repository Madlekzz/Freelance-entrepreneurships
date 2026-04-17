import { ShieldCheck } from "lucide-react";
import { ROLE_CONFIG } from "../../../../constants";

export default function RoleBadge({ roleId }: { roleId: string }) {
  const config = ROLE_CONFIG[roleId.toLowerCase()] || {
    label: roleId,
    color: "bg-gray-50 text-gray-600 border-gray-100",
    icon: ShieldCheck,
  };
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border uppercase tracking-tight ${config.color}`}
    >
      <Icon size={10} />
      {config.label}
    </span>
  );
}
