import { CreditCard, ShoppingBag, Store } from "lucide-react";
import { formatCurrency } from "../../../utils/format";
import { SectionHeader } from "./shared/SectionHeader";
import { StatCard } from "./shared/StatCard";

interface Props {
  stats: {
    revenue: number;
    salesCount: number;
  };
}

export default function ProviderSection({ stats }: Props) {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500 delay-300">
      <SectionHeader
        title="Mi Actividad Proveedor"
        icon={Store}
        color="text-emerald-500"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="Mis Ingresos"
          value={formatCurrency(stats.revenue)}
          icon={CreditCard}
          color="bg-emerald-600"
          description="Ventas de tus productos"
        />
        <StatCard
          label="Ventas Realizadas"
          value={stats.salesCount}
          icon={ShoppingBag}
          color="bg-sky-600"
          description="Órdenes despachadas"
        />
      </div>
    </div>
  );
}
