import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSales } from "../../../../../hooks/useSales";
import { refundSale } from "../../../../../services/saleService";
import type { EntrepreneurshipSale } from "../../../../../types";
import ProductTableSkeleton from "../products/ProductTableSkeleton";
import SalesCardsMobile from "./SalesCardMobile";
import SalesEmptyState from "./SalesEmptyState";
import SalesFilters from "./SalesFilters";
import SalesSummary from "./SalesSummary";
import SalesTableDesktop from "./SalesTableDesktop";
import RefundSaleModal from "./RefundSaleModal";

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
    refetch,
  } = useSales(id);

  const [refundingSale, setRefundingSale] =
    useState<EntrepreneurshipSale | null>(null);
  const [isRefunding, setIsRefunding] = useState(false);

  const handleRefund = useCallback((sale: EntrepreneurshipSale) => {
    setRefundingSale(sale);
  }, []);

  const handleCloseRefund = useCallback(() => {
    setRefundingSale(null);
    setIsRefunding(false);
  }, []);

  const handleConfirmRefund = useCallback(
    async (itemIds: number[]) => {
      if (!refundingSale) return;
      try {
        setIsRefunding(true);
        const result = await refundSale(refundingSale.id, {
          item_ids: itemIds,
        });
        if (result.type === "full") {
          toast.success("Venta reembolsada correctamente");
        } else {
          toast.success("Items reembolsados correctamente");
        }
        setRefundingSale(null);
        refetch();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error al procesar el reembolso";
        toast.error(errorMessage);
      } finally {
        setIsRefunding(false);
      }
    },
    [refundingSale, refetch],
  );

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
            <SalesTableDesktop
              sales={sales}
              onRefund={handleRefund}
            />
          </div>
          <div className="md:hidden">
            <SalesCardsMobile
              sales={sales}
              onRefund={handleRefund}
            />
          </div>
        </>
      )}

      {refundingSale && (
        <RefundSaleModal
          isOpen={true}
          onClose={handleCloseRefund}
          onConfirm={handleConfirmRefund}
          isLoading={isRefunding}
          saleItems={refundingSale.sale_items}
          saleTotal={refundingSale.total}
          saleId={refundingSale.id}
        />
      )}
    </div>
  );
}
