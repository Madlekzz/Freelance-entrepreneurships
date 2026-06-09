import { DollarSign, ShoppingBag } from "lucide-react";
import { formatCurrency } from "../../../../../utils/format";
import { StatCard } from "../../../../shared/StatCard";

interface Props {
  totalSales: number;
  totalRevenue: number;
}

export default function SalesSummary({ totalSales, totalRevenue }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StatCard
        icon={ShoppingBag}
        label="Ventas Encontradas"
        value={String(totalSales)}
        color="text-primary bg-primary/5 border-primary/20"
        textColor="text-primary"
      />
      <StatCard
        icon={DollarSign}
        label="Total en Ventas"
        value={formatCurrency(totalRevenue)}
        color="text-emerald-600 bg-emerald-50 border-emerald-100"
        textColor="text-emerald-700"
      />
    </div>
  );
}
