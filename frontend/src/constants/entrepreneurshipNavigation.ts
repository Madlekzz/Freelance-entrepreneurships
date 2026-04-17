import { CircleDollarSign, LayoutDashboard, Package } from "lucide-react";

export const GET_ENTREPRENEURSHIP_NAV = (id: string) => [
  {
    label: "Resumen",
    path: `/dashboard/entrepreneurships/${id}`,
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Productos",
    path: `/dashboard/entrepreneurships/${id}/products`,
    icon: Package,
    end: false,
  },
  {
    label: "Ventas",
    path: `/dashboard/entrepreneurships/${id}/sales`,
    icon: CircleDollarSign,
    end: false,
  },
];
