import { CircleCheck, CircleDollarSign, Clock, ShoppingBag } from "lucide-react";
import { formatCurrency } from "../../utils/format";
import { StatCard } from "./StatCard";

interface SaleWithStats {
  total: number;
  payroll_processed: boolean;
  refunded?: boolean;
  payment_type: "credit" | "immediate";
  sale_items: Array<{
    subtotal: number;
    refunded?: boolean;
    entrepreneur_processed?: boolean;
    products: {
      entrepreneurships: {
        id: string;
      };
    };
  }>;
}

interface Props {
  sales: SaleWithStats[];
  selectedEntId?: string;
}

export default function DetailedSalesStats({ sales, selectedEntId }: Props) {
  const totalSales = sales.length;

  const processedFiltered = sales.filter(
    (s) => s.payment_type !== "immediate" && s.payroll_processed && !s.refunded,
  );
  const paidFiltered = sales.filter(
    (s) =>
      s.payment_type === "immediate" &&
      s.sale_items.every((item) => item.entrepreneur_processed || item.refunded) &&
      !s.refunded,
  );
  const pendingFiltered = sales.filter(
    (s) =>
      !s.refunded &&
      ((s.payment_type !== "immediate" && !s.payroll_processed) ||
        (s.payment_type === "immediate" &&
          !s.sale_items.every((item) => item.entrepreneur_processed || item.refunded))),
  );

  const processedTotal = selectedEntId
    ? processedFiltered
        .flatMap((s) => s.sale_items)
        .filter(
          (item) =>
            !item.refunded &&
            item.products.entrepreneurships.id === selectedEntId,
        )
        .reduce((acc, item) => acc + item.subtotal, 0)
    : processedFiltered.reduce((acc, s) => acc + s.total, 0);

  const paidTotal = selectedEntId
    ? paidFiltered
        .flatMap((s) => s.sale_items)
        .filter(
          (item) =>
            !item.refunded &&
            item.products.entrepreneurships.id === selectedEntId,
        )
        .reduce((acc, item) => acc + item.subtotal, 0)
    : paidFiltered.reduce((acc, s) => acc + s.total, 0);

  const pendingTotal = selectedEntId
    ? pendingFiltered
        .flatMap((s) => s.sale_items)
        .filter(
          (item) =>
            !item.refunded &&
            item.products.entrepreneurships.id === selectedEntId,
        )
        .reduce((acc, item) => acc + item.subtotal, 0)
    : pendingFiltered.reduce((acc, s) => acc + s.total, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard
        icon={ShoppingBag}
        label="Total Ventas"
        value={String(totalSales)}
        color="text-primary bg-primary/5 border-primary/20"
        textColor="text-primary"
      />
      <StatCard
        icon={CircleCheck}
        label="Procesadas"
        value={formatCurrency(processedTotal)}
        color="text-emerald-600 bg-emerald-50 border-emerald-100"
        textColor="text-emerald-700"
      />
      <StatCard
        icon={CircleDollarSign}
        label="Pago Realizado"
        value={formatCurrency(paidTotal)}
        color="text-emerald-600 bg-emerald-50 border-emerald-100"
        textColor="text-emerald-700"
      />
      <StatCard
        icon={Clock}
        label="Pendientes"
        value={formatCurrency(pendingTotal)}
        color="text-amber-600 bg-amber-50 border-amber-100"
        textColor="text-amber-700"
      />
    </div>
  );
}
