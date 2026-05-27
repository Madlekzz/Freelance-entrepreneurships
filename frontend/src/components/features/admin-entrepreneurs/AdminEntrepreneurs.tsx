import { Download } from "lucide-react";
import ConfirmationModal from "../../shared/ConfirmationModal";
import { AdminConsumersSkeleton } from "../admin-consumers/AdminConsumersSkeleton";
import { BulkActionBanner } from "./BulkActionBanner";
import { DetailedView } from "./DetailedView";
import { EntrepreneursFilters } from "./EntrepreneursFilters";
import { EntrepreneursHeader } from "./EntrepreneursHeader";
import { useAdminEntrepreneurs } from "./hooks/useAdminEntrepreneurs";
import { SummaryView } from "./SummaryView";
import { exportSalesToExcel } from "../../../utils/exportToExcel";

export default function AdminEntrepreneurs() {
  const logic = useAdminEntrepreneurs();

  const handleExport = () => {
    if (!logic.detailedSales.length) return;
    exportSalesToExcel(
      logic.detailedSales,
      logic.selectedEntrepreneur?.name ?? "ventas",
      logic.selectedEntId ?? undefined,
    );
  };

  if (logic.loading) return <AdminConsumersSkeleton />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 md:pb-0 scrollbar-gutter:stable">
      <EntrepreneursHeader
        view={logic.view}
        entrepreneurName={logic.selectedEntrepreneur?.name}
        onBack={logic.handleBackToSummary}
      />

      <EntrepreneursFilters
        view={logic.view}
        searchQuery={logic.searchQuery}
        setSearchQuery={logic.setSearchQuery}
        statusFilter={logic.statusFilter}
        setStatusFilter={logic.setStatusFilter}
        selectedMonth={logic.selectedMonth}
        setSelectedMonth={logic.setSelectedMonth}
        payrollCycle={logic.payrollCycle}
        setPayrollCycle={logic.setPayrollCycle}
        exportButton={
          logic.view === "detailed" && (
            <button
              type="button"
              onClick={handleExport}
              disabled={logic.detailedSales.length === 0}
              className="cursor-pointer flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-xl border border-primary/20 hover:border-primary/30 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <Download size={14} />
              Exportar Excel
            </button>
          )
        }
      />

      {logic.selectedSales.length > 0 && (
        <BulkActionBanner
          count={logic.selectedSales.length}
          onProcess={() => logic.openProcessPayroll(logic.selectedSales)}
          isLoading={logic.modalProps.isLoading}
        />
      )}

      <div className="min-h-100">
        {logic.view === "summary" ? (
          <SummaryView
            data={logic.entrepreneursSummary}
            onSelect={logic.handleSelectEntrepreneur}
            searchQuery={logic.searchQuery}
          />
        ) : (
          <DetailedView
            sales={logic.detailedSales}
            selectedSales={logic.selectedSales}
            toggleSelection={logic.toggleSaleSelection}
            toggleAll={logic.toggleAllVisible}
            onProcessSingle={(id) => logic.openProcessPayroll([id])}
            sortOrder={logic.sortOrder}
            setSortOrder={logic.setSortOrder}
            processingIds={logic.processingIds}
            searchQuery={logic.searchQuery}
            selectedEntId={logic.selectedEntId}
          />
        )}
      </div>

      <ConfirmationModal {...logic.modalProps} type="info" />
    </div>
  );
}
