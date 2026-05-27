import { useOutletContext, useParams } from "react-router-dom";
import { Download } from "lucide-react";
import { useSales } from "../../../../../hooks/useSales";
import type { Entrepreneurship } from "../../../../../types";
import { exportSalesToExcel } from "../../../../../utils/exportToExcel";
import ProductTableSkeleton from "../products/ProductTableSkeleton";
import SalesCardsMobile from "./SalesCardMobile";
import SalesEmptyState from "./SalesEmptyState";
import SalesFilters from "./SalesFilters";
import SalesSummary from "./SalesSummary";
import SalesTableDesktop from "./SalesTableDesktop";

export default function MySales() {
  const { id } = useParams<{ id: string }>();
  const { biz } = useOutletContext<{ biz: Entrepreneurship | null }>();
  const {
    sales,
    loading,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    statusFilter,
    setStatusFilter,
  } = useSales(id);

  const handleExport = () => {
    if (!sales.length) return;
    exportSalesToExcel(sales, biz?.name ?? "ventas");
  };

  if (loading) return <ProductTableSkeleton />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 md:pb-0">
      <SalesSummary totalSales={sales.length} />

      <SalesFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        exportButton={
          <button
            type="button"
            onClick={handleExport}
            disabled={sales.length === 0}
            className="cursor-pointer flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-xl border border-primary/20 hover:border-primary/30 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Download size={14} />
            Exportar Excel
          </button>
        }
      />

      {sales.length === 0 ? (
        <SalesEmptyState
          isFiltering={!!searchQuery || statusFilter !== "all"}
        />
      ) : (
        <>
          <div className="hidden md:block">
            <SalesTableDesktop sales={sales} />
          </div>
          <div className="md:hidden">
            <SalesCardsMobile sales={sales} />
          </div>
        </>
      )}
    </div>
  );
}
