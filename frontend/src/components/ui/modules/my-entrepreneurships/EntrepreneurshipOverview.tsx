import {
  AlertCircle,
  DollarSign,
  LayoutGrid,
  Package,
  Plus,
  Store,
  TrendingUp,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../../../../hooks/useProducts";
import { useSales } from "../../../../hooks/useSales";
import ProductTableSkeleton from "./products/ProductTableSkeleton";

export default function EntrepreneurshipOverview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Consumimos la data real de nuestros hooks
  const { sales, loading: loadingSales } = useSales(id);
  const { products, loading: loadingProducts } = useProducts(id);

  if (loadingSales || loadingProducts) return <ProductTableSkeleton />;

  // --- Lógica de Estadísticas Reales ---
  const totalRevenue = sales.reduce((acc, sale) => acc + sale.total, 0);
  const totalProducts = products.length;
  const lowStockProducts = products.filter(
    (p) => p.current_stock <= 5 && p.current_stock > 0,
  ).length;
  const outOfStock = products.filter((p) => p.current_stock === 0).length;
  const averageTicket = sales.length > 0 ? totalRevenue / sales.length : 0;

  const stats = [
    {
      label: "Ingresos Totales",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-emerald-500",
      description: "Suma de todas las ventas",
    },
    {
      label: "Ventas Realizadas",
      value: sales.length.toString(),
      icon: TrendingUp,
      color: "bg-blue-500",
      description: `${sales.filter((s) => !s.payroll_processed).length} pendientes de nómina`,
    },
    {
      label: "Ticket Promedio",
      value: `$${averageTicket.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      icon: Store,
      color: "bg-purple-500",
      description: "Gasto medio por cliente",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Sección de Bienvenida / Acciones Rápidas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            ¡Hola de nuevo! 👋
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Este es el rendimiento actual de tu emprendimiento.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(`/dashboard/entrepreneurships/${id}/products`, {
                state: { openModal: true }, // Enviamos el estado aquí
              })
            }
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
          >
            <Plus size={18} /> Nuevo Producto
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all border border-gray-200"
          >
            <LayoutGrid size={20} />
            <span className="font-medium">Ver Catálogo</span>
          </Link>
        </div>
      </div>

      {/* Grid de Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`${stat.color} p-3 rounded-2xl text-white shadow-lg`}
              >
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded-md">
                Real-time
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-gray-500 text-sm font-medium">
                {stat.label}
              </h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-400 font-medium pt-1">
                {stat.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Grid Inferior: Inventario y Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel de Inventario Crítico */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              Estado del Inventario
            </h3>
            <Package size={20} className="text-gray-400" />
          </div>

          <div className="space-y-6">
            {lowStockProducts > 0 && (
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl border border-orange-100">
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-orange-500" size={20} />
                  <div>
                    <p className="text-sm font-bold text-orange-900">
                      Stock Bajo
                    </p>
                    <p className="text-xs text-orange-700">
                      {lowStockProducts} productos por agotarse
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/dashboard/entrepreneurships/${id}/products?sort=`,
                    )
                  }
                  className="text-xs font-bold text-orange-600 hover:underline cursor-pointer"
                >
                  Revisar
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {totalProducts}
                </p>
                <p className="text-[10px] text-gray-500 uppercase font-bold">
                  Total Productos
                </p>
              </div>
              <div
                className={`p-4 rounded-2xl border text-center ${outOfStock > 0 ? "bg-red-50 border-red-100" : "bg-gray-50 border-gray-100"}`}
              >
                <p
                  className={`text-2xl font-bold ${outOfStock > 0 ? "text-red-600" : "text-gray-900"}`}
                >
                  {outOfStock}
                </p>
                <p className="text-[10px] text-gray-500 uppercase font-bold">
                  Sin Stock
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de Tips Dinámicos */}
        <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 relative overflow-hidden group flex flex-col justify-center">
          <div className="relative z-10">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-lg font-bold text-primary mb-2">
              Tip para vender más
            </h3>
            <p className="text-primary/80 text-sm leading-relaxed mb-6">
              {outOfStock > 0
                ? `Tienes ${outOfStock} productos agotados. Reponer stock es la forma más rápida de recuperar ventas perdidas.`
                : "¡Tu inventario está al día! Intenta crear un cupón de descuento para incentivar a tus clientes actuales a comprar de nuevo."}
            </p>
          </div>
          <Store className="absolute -bottom-6 -right-6 text-primary/5 w-40 h-40 rotate-12" />
        </div>
      </div>
    </div>
  );
}
