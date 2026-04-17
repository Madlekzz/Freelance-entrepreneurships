import { ShoppingBag } from "lucide-react";

interface Props {
  totalSales: number;
}

export default function SalesSummary({ totalSales }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-5 md:p-6 rounded-4xl md:rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
          <ShoppingBag size={24} />
        </div>
        <div>
          <p className="text-xs md:text-sm text-gray-500 font-medium">
            Ventas Encontradas
          </p>
          <p className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
            {totalSales}
          </p>
        </div>
      </div>
    </div>
  );
}
