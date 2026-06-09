import { useMemo, useState } from "react";
import { useAdminData } from "../../../../hooks/useAdminData";
import type { SaleItemDetail } from "../../../../types";

export const useAdminEntrepreneurs = () => {
  const adminData = useAdminData();
  const [view, setView] = useState<"summary" | "detailed">("summary");
  const [selectedEntId, setSelectedEntId] = useState<string | null>(null);

  const selectedEntrepreneur = useMemo(
    () =>
      adminData.fullEntrepreneursSummary.find((e) => e.id === selectedEntId),
    [adminData.fullEntrepreneursSummary, selectedEntId],
  );

  const detailedSales = useMemo(() => {
    if (!selectedEntId) return [];
    const filtered = adminData.sales.filter((s) =>
      s.sale_items.some(
        (item: SaleItemDetail) =>
          item.products.entrepreneurships.id === selectedEntId,
      ),
    );
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return adminData.sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [adminData.sales, selectedEntId, adminData.sortOrder]);

  const toggleAllVisible = () => {
    const pendingSalesIds = detailedSales
      .filter((s) => !s.payroll_processed && !s.refunded)
      .map((s) => s.id);

    if (adminData.selectedSales.length === pendingSalesIds.length) {
      adminData.setSelectedSales([]);
    } else {
      adminData.setSelectedSales(pendingSalesIds);
    }
  };

  const handleBackToSummary = () => {
    adminData.setSearchQuery("");
    setView("summary");
    setSelectedEntId(null);
  };

  const handleSelectEntrepreneur = (id: string) => {
    adminData.setSearchQuery("");
    setSelectedEntId(id);
    setView("detailed");
  };

  return {
    ...adminData,
    view,
    selectedEntrepreneur,
    detailedSales,
    selectedEntId,
    toggleAllVisible,
    handleBackToSummary,
    handleSelectEntrepreneur,
  };
};
