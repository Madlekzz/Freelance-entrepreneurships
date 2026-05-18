import { useMemo, useState } from "react";
import { useAdminData } from "../../../../hooks/useAdminData";
import type { SaleItemDetail } from "../../../../types";

export function useAdminConsumers() {
  const adminData = useAdminData();
  const { fullConsumersSummary, sales, statusFilter, searchQuery } = adminData;

  const [view, setView] = useState<"summary" | "detailed">("summary");
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(
    null,
  );
  const [selectedSales, setSelectedSales] = useState<string[]>([]);

  const selectedConsumer = useMemo(
    () => fullConsumersSummary.find((c) => c.email === selectedUserEmail),
    [fullConsumersSummary, selectedUserEmail],
  );

  const detailedSales = useMemo(() => {
    if (!selectedUserEmail) return [];
    return sales.filter((s) => {
      const matchesUser = s.users.email === selectedUserEmail;
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "pending"
            ? !s.payroll_processed && !s.refunded
            : statusFilter === "refunded"
              ? s.refunded === true
              : s.payroll_processed;
      const matchesSearch =
        s.sale_items.some((item: SaleItemDetail) =>
          item.products.name.toLowerCase().includes(searchQuery.toLowerCase()),
        ) || s.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesUser && matchesStatus && matchesSearch;
    });
  }, [sales, selectedUserEmail, statusFilter, searchQuery]);

  const toggleSaleSelection = (saleId: string) => {
    setSelectedSales((prev) =>
      prev.includes(saleId)
        ? prev.filter((id) => id !== saleId)
        : [...prev, saleId],
    );
  };

  const toggleAllVisible = () => {
    const pendingSalesIds = detailedSales
      .filter((s) => !s.payroll_processed && !s.refunded)
      .map((s) => s.id);
    setSelectedSales(
      selectedSales.length === pendingSalesIds.length ? [] : pendingSalesIds,
    );
  };

  const handleBackToSummary = () => {
    setView("summary");
    setSelectedUserEmail(null);
    setSelectedSales([]);
  };

  return {
    ...adminData,
    view,
    setView,
    selectedUserEmail,
    setSelectedUserEmail,
    selectedSales,
    setSelectedSales,
    selectedConsumer,
    detailedSales,
    toggleSaleSelection,
    toggleAllVisible,
    handleBackToSummary,
  };
}
