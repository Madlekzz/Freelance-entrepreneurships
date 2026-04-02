import {
  Activity,
  CreditCard,
  DollarSign,
  Landmark,
  LayoutGrid,
  type LucideIcon,
  Package,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Store,
  TrendingUp,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAdminData } from "../../../../hooks/useAdminData";
import { useDashboard } from "../../../../hooks/useDashboard";
import { useITData } from "../../../../hooks/useITData";

export default function GeneralDashboard() {
  const { user, roles } = useDashboard();
  const canSeeAdmin = roles.includes("ADMIN");
  const canSeeIT = roles.includes("IT");
  const isProvider = roles.includes("PROVEEDOR");
  const isConsumer = roles.includes("CONSUMIDOR");

  const { sales, loading, entrepreneursSummary } = useAdminData(canSeeAdmin);
  const {
    totalUsers,
    pendingRequests,
    activeSessions,
    loading: itLoading,
  } = useITData(canSeeIT);

  const dashboardData = useMemo(() => {
    // --- Lógica de Datos ---
    const adminStats = {
      totalRevenue: sales.reduce((acc, s) => acc + s.total, 0),
      pendingPayroll: sales
        .filter((s) => !s.payroll_processed)
        .reduce((acc, s) => acc + s.total, 0),
      totalSales: sales.length,
      activeEntrepreneurs: entrepreneursSummary.length,
    };

    const providerSales = sales.filter((s) =>
      s.sale_items.some(
        (item) => item.products.entrepreneurships.owner_id === user?.id,
      ),
    );
    const providerStats = {
      revenue: providerSales.reduce((acc, s) => acc + s.total, 0),
      salesCount: providerSales.length,
    };

    const consumerPurchases = sales.filter((s) => s.users.id === user?.id);
    const consumerStats = {
      totalSpent: consumerPurchases.reduce((acc, s) => acc + s.total, 0),
      purchaseCount: consumerPurchases.length,
    };

    return { adminStats, providerStats, consumerStats };
  }, [sales, entrepreneursSummary, user]);

  const rolesList = new Intl.ListFormat("es", {
    style: "long",
    type: "conjunction",
  }).format(roles.map((role) => role.charAt(0) + role.slice(1).toLowerCase()));

  if (loading || itLoading) return <LoadingSkeleton />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* 1. SECCIÓN DE BIENVENIDA (Estilo Emprendimiento) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            ¡Hola, {user?.name}! 👋
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {roles.length > 1
              ? "Aquí tienes un resumen consolidado de todas tus labores."
              : "Este es el estado actual de tu actividad en la plataforma."}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all border border-gray-200"
          >
            <LayoutGrid size={20} />
            <span>Ver Catálogo</span>
          </Link>
        </div>
      </div>

      {/* --- SECCIÓN PARA ADMINISTRADOR (Finanzas y Operaciones) --- */}
      {canSeeAdmin && (
        <section className="space-y-6 animate-in slide-in-from-left duration-500">
          <SectionHeader
            title="Panel Administrativo"
            icon={Landmark}
            color="text-purple-500"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              label="Ventas Globales"
              value={`$${dashboardData.adminStats.totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              color="bg-emerald-500"
              description="Ingresos acumulados de la red"
            />
            <StatCard
              label="Pendiente Liquidar"
              value={`$${dashboardData.adminStats.pendingPayroll.toLocaleString()}`}
              icon={Activity}
              color="bg-amber-500"
              description="Nómina pendiente de proceso"
            />
            <StatCard
              label="Emprendimientos Activos"
              value={dashboardData.adminStats.activeEntrepreneurs.toString()}
              icon={Store}
              color="bg-indigo-500"
              description="Negocios operando en el sistema"
            />
          </div>
        </section>
      )}

      {/* --- SECCIÓN PARA IT (DATOS REALES) --- */}
      {canSeeIT && (
        <section className="space-y-6 animate-in slide-in-from-left duration-500 delay-150">
          <SectionHeader
            title="Infraestructura y Salud del Sistema"
            icon={ShieldCheck}
            color="text-blue-600"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              label="Sesiones Activas"
              value={activeSessions.toString()}
              icon={Zap}
              color="bg-amber-500"
              description="Usuarios activos (últimas 24h)"
            />

            <StatCard
              label="Solicitudes Pendientes"
              value={pendingRequests.toString()}
              icon={UserPlus}
              color="bg-blue-600"
              description="Registros esperando aprobación"
            />

            <StatCard
              label="Usuarios Totales"
              value={totalUsers.toString()}
              icon={Users}
              color="bg-slate-800"
              description="Cuentas creadas en el ecosistema"
            />
          </div>
        </section>
      )}

      {/* --- VISTA PROVEEDOR / CONSUMIDOR EN GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lado Proveedor */}
        {isProvider && (
          <div className="space-y-6">
            <SectionHeader
              title="Mi Actividad como Proveedor"
              icon={Store}
              color="text-emerald-500"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard
                label="Mis Ingresos"
                value={`$${dashboardData.providerStats.revenue.toLocaleString()}`}
                icon={CreditCard}
                color="bg-emerald-600"
                description="Ventas de tus productos"
              />
              <StatCard
                label="Ventas Realizadas"
                value={dashboardData.providerStats.salesCount.toString()}
                icon={ShoppingBag}
                color="bg-sky-600"
                description="Órdenes despachadas"
              />
            </div>
          </div>
        )}

        {/* Lado Consumidor */}
        {isConsumer && (
          <div className="space-y-6">
            <SectionHeader
              title="Mi Actividad como Comprador"
              icon={ShoppingCart}
              color="text-blue-500"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard
                label="Total Comprado"
                value={`$${dashboardData.consumerStats.totalSpent.toLocaleString()}`}
                icon={ShoppingCart}
                color="bg-blue-600"
                description="Gasto acumulado"
              />
              <StatCard
                label="Órdenes Pedidas"
                value={dashboardData.consumerStats.purchaseCount.toString()}
                icon={Package}
                color="bg-violet-600"
                description="Historial de compras"
              />
            </div>
          </div>
        )}
      </div>

      {/* Panel Inferior de Tips (Estilo Emprendimiento) */}
      <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 relative overflow-hidden flex flex-col justify-center">
        <div className="relative z-10">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
            <TrendingUp size={20} />
          </div>
          <h3 className="text-lg font-bold text-primary mb-2">
            Resumen de Cuenta
          </h3>
          <p className="text-primary/80 text-sm leading-relaxed max-w-2xl">
            Tu cuenta tiene actualmente acceso como:{" "}
            <strong>{rolesList}</strong>. Puedes navegar entre las secciones de{" "}
            {roles.includes("ADMIN") || roles.includes("IT") ? "gestión, " : ""}
            ventas y compras desde este panel centralizado.
          </p>
        </div>
        <LayoutGrid className="absolute -bottom-6 -right-6 text-primary/5 w-40 h-40 rotate-12" />
      </div>
    </div>
  );
}

// --- Componentes Reutilizables con Estética Unificada ---

// --- Interfaces ---

interface SectionHeaderProps {
  title: string;
  icon: LucideIcon; // Tipado específico para iconos de Lucide
  color: string;
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  description: string;
}

// --- Componentes ---

function SectionHeader({ title, icon: Icon, color }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`p-2 rounded-lg bg-white border border-gray-100 shadow-sm ${color}`}
      >
        <Icon size={18} />
      </div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  description,
}: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`${color} p-3 rounded-2xl text-white shadow-lg shadow-current/20`}
        >
          <Icon size={24} />
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded-md">
          En tiempo real
        </span>
      </div>
      <div className="space-y-1">
        <h3 className="text-gray-500 text-sm font-medium">{label}</h3>
        <p className={`text-3xl font-bold text-gray-900`}>{value}</p>
        <p className="text-xs text-gray-400 font-medium pt-1">{description}</p>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Banner Skeleton */}
      <div className="h-32 bg-gray-100 rounded-3xl w-full"></div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-44 bg-gray-50 rounded-3xl border border-gray-100"
          ></div>
        ))}
      </div>
    </div>
  );
}
