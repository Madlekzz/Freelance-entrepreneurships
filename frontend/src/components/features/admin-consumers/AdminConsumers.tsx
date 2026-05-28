import { Download } from "lucide-react";
import { SummaryEmptyState } from "../admin-entrepreneurs/SummaryEmptyState";
import DetailedSalesStats from "../../shared/DetailedSalesStats";
import { AdminConsumersSkeleton } from "./AdminConsumersSkeleton";
import { BulkActionBanner } from "./BulkActionBanner";
import { ConsumerDetailedDesktop } from "./ConsumerDetailedDesktop";
import { ConsumerDetailedMobile } from "./ConsumerDetailedMobile";
import { ConsumersDesktop } from "./ConsumersDesktop";
import { ConsumersFilters } from "./ConsumersFilter";
import { ConsumersHeader } from "./ConsumersHeader";
import { ConsumersMobile } from "./ConsumersMobile";
import { useAdminConsumers } from "./hooks/useAdminConsumers";
import { exportSalesToExcel } from "../../../utils/exportToExcel";

export default function AdminConsumers() {
  const {
    consumersSummary,
    detailedSales,
    view,
    setView,
    selectedSales,
    setSelectedSales,
    selectedConsumer,
    setSelectedUserEmail,
    loading,
    processingIds,
    processPayroll,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    selectedMonth,
    setSelectedMonth,
    dateRange,
    setDateRange,
    toggleSaleSelection,
    toggleAllVisible,
    handleBackToSummary,
  } = useAdminConsumers();

  const handleExport = () => {
    if (!detailedSales.length) return;
    exportSalesToExcel(detailedSales, selectedConsumer?.name ?? "compras");
  };

  if (loading) return <AdminConsumersSkeleton />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 md:pb-0">
      <ConsumersHeader
        view={view}
        selectedConsumerName={selectedConsumer?.name}
        onBack={handleBackToSummary}
      />

      {view === "detailed" && detailedSales.length > 0 && (
        <DetailedSalesStats sales={detailedSales} />
      )}

      <ConsumersFilters
        view={view}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        dateRange={dateRange}
        setDateRange={setDateRange}
        exportButton={
          view === "detailed" && (
            <button
              type="button"
              onClick={handleExport}
              disabled={detailedSales.length === 0}
              className="cursor-pointer flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-xl border border-primary/20 hover:border-primary/30 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <Download size={14} />
              Exportar Excel
            </button>
          )
        }
      />

      <BulkActionBanner
        count={selectedSales.length}
        isProcessing={processingIds.length > 0}
        onProcess={async () => {
          await processPayroll(selectedSales);
          setSelectedSales([]);
        }}
      />

      <div className="min-h-100">
        {view === "summary" ? (
          <div className="grid grid-cols-1 gap-4 md:bg-white md:rounded-3xl md:border md:border-gray-100 md:shadow-sm overflow-hidden">
            {consumersSummary.length === 0 ? (
              <SummaryEmptyState query={searchQuery} />
            ) : (
              <>
                <ConsumersDesktop
                  data={consumersSummary}
                  onSelect={(email) => {
                    setSearchQuery("");
                    setSelectedUserEmail(email);
                    setView("detailed");
                  }}
                />
                <ConsumersMobile
                  data={consumersSummary}
                  onSelect={(email) => {
                    setSearchQuery("");
                    setSelectedUserEmail(email);
                    setView("detailed");
                  }}
                />
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4 md:bg-white md:rounded-3xl md:border md:border-gray-100 md:shadow-sm overflow-hidden animate-in slide-in-from-right duration-300">
            {detailedSales.length === 0 ? (
              <SummaryEmptyState query={searchQuery} />
            ) : (
              <>
                <ConsumerDetailedDesktop
                  sales={detailedSales}
                  selectedSales={selectedSales}
                  toggleSelection={toggleSaleSelection}
                  toggleAll={toggleAllVisible}
                  onProcessSingle={(id) => processPayroll([id])}
                  processingIds={processingIds}
                />
                <ConsumerDetailedMobile
                  sales={detailedSales}
                  selectedSales={selectedSales}
                  toggleSelection={toggleSaleSelection}
                  onProcessSingle={(id) => processPayroll([id])}
                  processingIds={processingIds}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
