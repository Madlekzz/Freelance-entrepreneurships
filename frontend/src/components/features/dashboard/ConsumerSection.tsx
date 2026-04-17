import { Package, ShoppingCart } from "lucide-react";
import { formatCurrency } from "../../../utils/format";
import { SectionHeader } from "./shared/SectionHeader";
import { StatCard } from "./shared/StatCard";

interface Props {
  stats: {
    totalSpent: number;
    purchaseCount: number;
  };
}

export default function ConsumerSection({ stats }: Props) {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500 delay-300">
      <SectionHeader
        title="Mi Actividad Comprador"
        icon={ShoppingCart}
        color="text-blue-500"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="Total Comprado"
          value={formatCurrency(stats.totalSpent)}
          icon={ShoppingCart}
          color="bg-blue-600"
          description="Gasto acumulado"
        />
        <StatCard
          label="Órdenes Pedidas"
          value={stats.purchaseCount}
          icon={Package}
          color="bg-violet-600"
          description="Historial de compras"
        />
      </div>
    </div>
  );
}
