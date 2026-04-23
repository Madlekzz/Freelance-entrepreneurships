import {
  Landmark,
  type LucideIcon,
  ShieldCheck,
  ShoppingBag,
  Users,
} from "lucide-react";

export const AVAILABLE_ROLES = [
  { value: "CONSUMIDOR", label: "Consumidor" },
  { value: "IT", label: "IT" },
  { value: "PROVEEDOR", label: "Emprendedor" },
  { value: "ADMIN", label: "Administración" },
];

export const DEPARTMENTS = [
  { id: "IT", label: "IT" },
  { id: "MARKETING", label: "Marketing" },
  { id: "HR", label: "HR" },
  { id: "DATA", label: "Data" },
  { id: "INFRAESTRUCTURA", label: "Infraestructura" },
  { id: "ADMIN", label: "Administración" },
];

export const ROLE_CONFIG: Record<
  string,
  { label: string; color: string; icon: LucideIcon }
> = {
  it: {
    label: "IT",
    color: "bg-blue-50 text-blue-600 border-blue-100",
    icon: ShieldCheck,
  },
  consumidor: {
    label: "Consumidor",
    color: "bg-green-50 text-green-600 border-green-100",
    icon: Users,
  },
  proveedor: {
    label: "Emprendedor",
    color: "bg-purple-50 text-purple-600 border-purple-100",
    icon: ShoppingBag,
  },
  admin: {
    label: "Administración",
    color: "bg-red-50 text-red-600 border-red-100",
    icon: Landmark,
  },
};
