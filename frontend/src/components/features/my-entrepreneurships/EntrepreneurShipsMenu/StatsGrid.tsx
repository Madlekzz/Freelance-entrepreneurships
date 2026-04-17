import { DollarSign, Store, TrendingUp } from "lucide-react";
import { formatCurrency } from "../../../../utils/format";

interface Props {
  revenue: number;
  salesCount: number;
  pendingPayroll: number;
  averageTicket: number;
}

export default function StatsGrid({
  revenue,
  salesCount,
  pendingPayroll,
  averageTicket,
}: Props) {
  const stats = [
    {
      label: "Ingresos Totales",
      value: formatCurrency(revenue),
      icon: DollarSign,
      color: "bg-emerald-500",
      description: "Suma de todas las ventas",
    },
    {
      label: "Ventas Realizadas",
      value: salesCount.toString(),
      icon: TrendingUp,
      color: "bg-blue-500",
      description: `${pendingPayroll} pendientes de nómina`,
    },
    {
      label: "Ticket Promedio",
      value: formatCurrency(averageTicket),
      icon: Store,
      color: "bg-purple-500",
      description: "Gasto medio por cliente",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`${stat.color} p-3 rounded-2xl text-white shadow-lg`}
            >
              <stat.icon size={24} />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded-md">
              Real-time
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-400 font-medium pt-1">
              {stat.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
