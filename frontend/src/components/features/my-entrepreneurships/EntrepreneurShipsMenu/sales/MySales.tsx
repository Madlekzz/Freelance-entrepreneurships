import { useParams } from "react-router-dom";
import { useSales } from "../../../../../hooks/useSales";
import ProductTableSkeleton from "../products/ProductTableSkeleton";
import SalesCardsMobile from "./SalesCardMobile";
import SalesEmptyState from "./SalesEmptyState";
import SalesFilters from "./SalesFilters";
import SalesSummary from "./SalesSummary";
import SalesTableDesktop from "./SalesTableDesktop";

export default function MySales() {
  const { id } = useParams<{ id: string }>();
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
