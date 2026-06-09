import { CircleCheck, Clock, ShoppingBag } from "lucide-react";
import { formatCurrency } from "../../utils/format";

interface SaleWithStats {
  total: number;
  payroll_processed: boolean;
  refunded?: boolean;
  sale_items: Array<{
    subtotal: number;
    refunded?: boolean;
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
    (s) => s.payroll_processed && !s.refunded,
  );
  const pendingFiltered = sales.filter(
    (s) => !s.payroll_processed && !s.refunded,
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-5 md:p-6 rounded-4xl md:rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
          <ShoppingBag size={24} />
        </div>
        <div>
          <p className="text-xs md:text-sm text-gray-500 font-medium">
            Total Ventas
          </p>
          <p className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
            {totalSales}
          </p>
        </div>
      </div>

      <div className="bg-white p-5 md:p-6 rounded-4xl md:rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
          <CircleCheck size={24} />
        </div>
        <div>
          <p className="text-xs md:text-sm text-gray-500 font-medium">
            Procesadas
          </p>
          <p className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
            {formatCurrency(processedTotal)}
          </p>
        </div>
      </div>

      <div className="bg-white p-5 md:p-6 rounded-4xl md:rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
          <Clock size={24} />
        </div>
        <div>
          <p className="text-xs md:text-sm text-gray-500 font-medium">
            Pendientes
          </p>
          <p className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
            {formatCurrency(pendingTotal)}
          </p>
        </div>
      </div>
    </div>
  );
}
