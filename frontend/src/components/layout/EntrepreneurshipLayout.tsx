import {
  ChevronLeft,
  CircleDollarSign,
  LayoutDashboard,
  LogOut,
  Package,
  Store,
} from "lucide-react";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";
import { useDashboard } from "../../hooks/useDashboard";
import { useEntrepreneurshipDetail } from "../../hooks/useEntrepreneurshipDetail";
import Sidebar from "../layout/Sidebar";

export default function EntrepreneurshipLayout() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: biz, loading: loadingBiz } = useEntrepreneurshipDetail(id);

  // Reutilizamos el hook para mantener el Sidebar sincronizado
  const { activeTab, user, roles, navConfig, handleNavigation } =
    useDashboard();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const navItems = [
    {
      label: "Resumen",
      path: `/dashboard/entrepreneurships/${id}`,
      icon: LayoutDashboard,
      end: true,
    },
    {
      label: "Productos",
      path: `/dashboard/entrepreneurships/${id}/products`,
      icon: Package,
      end: false,
    },
    {
      label: "Ventas",
      path: `/dashboard/entrepreneurships/${id}/sales`,
      icon: CircleDollarSign,
      end: false,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* 1. SIDEBAR (Nivel Global) */}
      <Sidebar
        roles={roles}
        navConfig={navConfig}
        activeId={activeTab}
        onNavigate={handleNavigation}
        user={user}
      />

      {/* 2. CONTENEDOR DE CONTENIDO (Derecha) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* ── Topbar Especial para Emprendimientos ── */}
        <header className="bg-white border-b border-gray-100 px-8 pt-4 sticky top-0 z-30 shadow-sm shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard/entrepreneurships")}
                className="cursor-pointer p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-primary transition-all"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-3 border-l pl-4 border-gray-100">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-inner">
                  <Store size={22} />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 leading-tight">
                    {biz?.name}
                  </h1>
                  <p className="text-[0.65rem] text-gray-400 font-bold uppercase tracking-widest">
                    Gestión de Negocio
                  </p>
                </div>
              </div>
            </div>

            {/* Acciones Rápidas (Logout) */}
            <button
              type="button"
              onClick={handleLogout}
              title="Cerrar sesión"
              className="group flex cursor-pointer items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-red-200 active:scale-90"
            >
              <LogOut
                size={18}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
            </button>
          </div>

          {/* Navegación de Pestañas (Tabs) */}
          <nav className="flex gap-8 overflow-x-auto no-scrollbar">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) => `
                  flex items-center gap-2 py-3 border-b-2 text-sm font-bold transition-all whitespace-nowrap
                  ${
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200"
                  }
                `}
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        {/* ── Contenido de la Sub-ruta (Overview, Products, etc.) ── */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Outlet context={{ biz, loadingBiz }} />
          </div>
        </main>
      </div>
    </div>
  );
}
