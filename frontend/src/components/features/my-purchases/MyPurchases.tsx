import { Calendar } from "lucide-react";
import { useState } from "react";
import { useConsumerSales } from "../../../hooks/useCustomerSales";
import { formatCurrency } from "../../../utils/format";
import { MONTHS } from "../../../utils/payrollUtils";
import { DateRangeFilter } from "../../shared/DateRangeFilter";
import SearchInput from "../../shared/SearchInput";
import FilterSelector from "../admin-entrepreneurs/FilterSelector";
import MyPurchasesDesktop from "./MyPurchasesDesktop";
import MyPurchasesEmpty from "./MyPurchasesEmpty";
import MyPurchasesMobile from "./MyPurchasesMobile";

export default function MyPurchases() {
  const {
    sales,
    loading,
    searchQuery,
    setSearchQuery,
    selectedMonth,
    setSelectedMonth,
    dateRange,
    setDateRange,
  } = useConsumerSales();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleRow = (id: string) =>
    setExpandedId(expandedId === id ? null : id);
  const hasNoSales = !loading && sales.length === 0;

  const totalFiltered = sales.reduce((sum, sale) => sum + sale.total, 0);
  const countFiltered = sales.length;

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col lg:flex-row gap-3 mb-4 items-center bg-white p-4 rounded-4xl md:rounded-2xl border border-gray-100 shadow-sm">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar por producto o ID de la venta..."
        />

        <div className="grid grid-cols-2 lg:flex lg:flex-nowrap items-center gap-2 w-full lg:w-auto">
          <FilterSelector
            label={selectedMonth !== null ? MONTHS[selectedMonth] : "Meses"}
            icon={Calendar}
            items={[
              {
                key: "all",
                label: "Todos los meses",
                onClick: () => setSelectedMonth(null),
              },
              ...MONTHS.map((m, i) => ({
                key: i,
                label: m,
                onClick: () => setSelectedMonth(i),
              })),
            ]}
          />

          <DateRangeFilter value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      {hasNoSales ? (
        <MyPurchasesEmpty />
      ) : (
        <div className="bg-white md:border border-gray-100 rounded-4xl md:rounded-2xl overflow-hidden md:shadow-sm">
          <MyPurchasesDesktop
            sales={sales}
            loading={loading}
            expandedId={expandedId}
            onToggle={toggleRow}
            fmt={formatCurrency}
          />
          <MyPurchasesMobile
            sales={sales}
            loading={loading}
            expandedId={expandedId}
            onToggle={toggleRow}
            fmt={formatCurrency}
          />
        </div>
      )}

      {!hasNoSales && (
        <div className="mt-4 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Total Consumido
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">
              {countFiltered} {countFiltered === 1 ? "compra" : "compras"}
            </span>
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalFiltered)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
