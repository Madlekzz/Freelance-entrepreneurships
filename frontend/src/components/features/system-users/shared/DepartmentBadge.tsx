// DepartmentBadge.tsx
import {
  Cable,
  Camera,
  Database,
  FileUser,
  Hammer,
  type LucideIcon,
  Users,
} from "lucide-react";

export default function DepartmentBadge({ dept }: { dept?: string }) {
  const DEPT_ICONS: Record<string, LucideIcon> = {
    IT: Cable,
    MARKETING: Camera,
    INFRAESTRUCTURA: Hammer,
    RECLUTAMIENTO: FileUser,
    HR: Users,
    DATA: Database,
  };
  const Icon = DEPT_ICONS[dept?.toUpperCase() || ""] || FileUser;

  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
      <Icon size={14} className="text-gray-400" />
      <span className="capitalize">{dept?.toLowerCase() || "No asignado"}</span>
    </div>
  );
}
