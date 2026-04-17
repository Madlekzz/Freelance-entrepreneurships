import { ArrowDown, ArrowUp, CheckCircle2, User } from "lucide-react";
import type { GlobalSale, SaleItemDetail } from "../../../types";
import { formatCurrency } from "../../../utils/format";

interface Props {
  sales: GlobalSale[];
  selectedSales: string[];
  toggleSelection: (id: string) => void;
  toggleAll: () => void;
  onProcessSingle: (id: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  processingIds: string[];
}

export const DetailedDesktop = (props: Props) => {
  const {
    sales,
    selectedSales,
    toggleSelection,
    toggleAll,
    onProcessSingle,
    sortOrder,
    setSortOrder,
    processingIds,
  } = props;

  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-100">
            <th className="px-6 py-4 w-10">
              <input
                type="checkbox"
                onChange={toggleAll}
                className="rounded text-primary cursor-pointer"
              />
            </th>
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase">
              Cliente
            </th>
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase">
              Productos
            </th>
            <th
              className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase cursor-pointer group"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              <div className="flex items-center gap-1 group-hover:text-primary transition-colors">
                Fecha{" "}
                {sortOrder === "asc" ? (
                  <ArrowUp size={12} />
                ) : (
                  <ArrowDown size={12} />
                )}
              </div>
            </th>
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase text-center">
              Acción
            </th>
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase text-right">
              Monto
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {sales.map((sale) => (
            <tr key={sale.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4">
                <input
                  type="checkbox"
                  disabled={
                    sale.payroll_processed || processingIds.includes(sale.id)
                  }
                  checked={selectedSales.includes(sale.id)}
                  onChange={() => toggleSelection(sale.id)}
                  className="rounded text-primary cursor-pointer disabled:opacity-30"
                />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    <User size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {sale.users.name}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {sale.users.email}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                {sale.sale_items.map((item: SaleItemDetail) => (
                  <p
                    key={item.products.id}
                    className="text-[11px] text-gray-600"
                  >
                    <b className="text-primary">{item.quantity}x</b>{" "}
                    {item.products.name}
                  </p>
                ))}
              </td>
              <td className="px-6 py-4 text-xs text-gray-500">
                {new Date(sale.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-center">
                {!sale.payroll_processed ? (
                  <button
                    type="button"
                    onClick={() => onProcessSingle(sale.id)}
                    disabled={processingIds.includes(sale.id)}
                    className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-600 disabled:opacity-50 cursor-pointer transition-all"
                  >
                    {processingIds.includes(sale.id) ? "..." : "Liquidar"}
                  </button>
                ) : (
                  <CheckCircle2
                    size={18}
                    className="text-emerald-500 opacity-40 mx-auto"
                  />
                )}
              </td>
              <td className="px-6 py-4 text-right font-bold text-gray-900">
                {formatCurrency(sale.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
