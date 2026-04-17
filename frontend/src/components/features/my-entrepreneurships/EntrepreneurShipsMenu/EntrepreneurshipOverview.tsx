import { useParams } from "react-router-dom";
import { useProducts } from "../../../../hooks/useProducts";
import { useSales } from "../../../../hooks/useSales";
import { useOverviewStats } from "./hooks/useOverviewStats";
import InventoryAndTips from "./InventoryAndTips";
import ProductTableSkeleton from "./products/ProductTableSkeleton";
import StatsGrid from "./StatsGrid";
import WelcomeHeader from "./WelcomeHeader";

export default function EntrepreneurshipOverview() {
  const { id } = useParams<{ id: string }>();

  const { sales, loading: loadingSales } = useSales(id);
  const { products, loading: loadingProducts } = useProducts(id);

  const stats = useOverviewStats(sales || [], products || []);

  if (loadingSales || loadingProducts) return <ProductTableSkeleton />;
  if (!id) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <WelcomeHeader id={id} />

      <StatsGrid
        revenue={stats.totalRevenue}
        salesCount={stats.totalSalesCount}
        pendingPayroll={stats.pendingPayrollCount}
        averageTicket={stats.averageTicket}
      />

      <InventoryAndTips
        id={id}
        totalProducts={stats.totalProducts}
        lowStock={stats.lowStockProducts}
        outOfStock={stats.outOfStock}
      />
    </div>
  );
}
