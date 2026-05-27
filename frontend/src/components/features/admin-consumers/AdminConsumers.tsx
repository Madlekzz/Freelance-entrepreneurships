import { SummaryEmptyState } from "../admin-entrepreneurs/SummaryEmptyState";
import { AdminConsumersSkeleton } from "./AdminConsumersSkeleton";
import { BulkActionBanner } from "./BulkActionBanner";
import { ConsumerDetailedDesktop } from "./ConsumerDetailedDesktop";
import { ConsumerDetailedMobile } from "./ConsumerDetailedMobile";
import { ConsumersDesktop } from "./ConsumersDesktop";
import { ConsumersFilters } from "./ConsumersFilter";
import { ConsumersHeader } from "./ConsumersHeader";
import { ConsumersMobile } from "./ConsumersMobile";
import { useAdminConsumers } from "./hooks/useAdminConsumers";

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

  if (loading) return <AdminConsumersSkeleton />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 md:pb-0">
      <ConsumersHeader
        view={view}
        selectedConsumerName={selectedConsumer?.name}
        onBack={handleBackToSummary}
      />

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
