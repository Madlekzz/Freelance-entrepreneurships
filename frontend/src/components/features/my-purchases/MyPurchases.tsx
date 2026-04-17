import { useState } from "react";
import { useConsumerSales } from "../../../hooks/useCustomerSales";
import { formatCurrency } from "../../../utils/format"; // <-- Importamos la utilidad
import SearchInput from "../../shared/SearchInput";
import MyPurchasesDesktop from "./MyPurchasesDesktop";
import MyPurchasesEmpty from "./MyPurchasesEmpty";
import MyPurchasesMobile from "./MyPurchasesMobile";

export default function MyPurchases() {
  const { sales, loading, searchQuery, setSearchQuery } = useConsumerSales();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleRow = (id: string) =>
    setExpandedId(expandedId === id ? null : id);
  const hasNoSales = !loading && sales.length === 0;

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col lg:flex-row gap-3 mb-4 items-center bg-white p-4 rounded-4xl md:rounded-2xl border border-gray-100 shadow-sm">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar por producto o ID de la venta..."
        />
      </div>

      {hasNoSales ? (
        <MyPurchasesEmpty />
      ) : (
        <div className="bg-white md:border border-gray-100 rounded-4xl md:rounded-2xl overflow-hidden md:shadow-sm">
          {/* Pasamos formatCurrency como prop fmt */}
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
    </div>
  );
}
