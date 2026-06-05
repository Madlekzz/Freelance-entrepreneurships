import { ChevronLeft, LogOut, Store } from "lucide-react";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import { GET_ENTREPRENEURSHIP_NAV } from "../../constants";
import { useDashboard } from "../../hooks/useDashboard";
import { useEntrepreneurshipDetail } from "../../hooks/useEntrepreneurshipDetail";
import { useAuth } from "../features/login/hooks/useAuth";
import Sidebar from "../layout/Sidebar";

export default function EntrepreneurshipLayout() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Obtenemos datos del negocio
  const { data: biz, loading: loadingBiz } = useEntrepreneurshipDetail(id);

  // Reutilizamos la lógica del dashboard para el Sidebar (ahora más simple)
  const { activeTab, navConfig, handleNavigation } = useDashboard();

  const navItems = GET_ENTREPRENEURSHIP_NAV(id ?? "");

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* 1. SIDEBAR */}
      <Sidebar
        navConfig={navConfig}
        activeId={activeTab}
        onNavigate={handleNavigation}
      />

      {/* 2. CONTENEDOR DE CONTENIDO */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* ── Topbar Especial de Emprendimientos ── */}
        <header className="bg-white border-b border-gray-100 px-8 pt-4 sticky top-0 z-30 shadow-sm shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard/entrepreneurships")}
                className="cursor-pointer p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-primary transition-all active:scale-95"
                title="Volver a mis emprendimientos"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-3 border-l pl-4 border-gray-100">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-inner">
                  <Store size={22} />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg font-bold text-gray-900 leading-tight truncate">
                    {loadingBiz ? "Cargando..." : biz?.name}
                  </h1>
                  <p className="text-[0.65rem] text-gray-400 font-bold uppercase tracking-widest">
                    Gestión de Negocio
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              aria-label="Cerrar sesión"
              className="group flex cursor-pointer items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm active:scale-95"
            >
              <LogOut
                size={18}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
            </button>
          </div>

          {/* Navegación de Pestañas (Tabs Locales) */}
          <nav className="flex gap-8 overflow-x-auto no-scrollbar">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) => `
                  flex flex-col md:flex-row items-center gap-2 py-3 border-b-2 text-sm font-bold transition-all whitespace-nowrap
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

        {/* ── Contenido Dinámico ── */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Pasamos los datos del negocio a través del context de Outlet */}
            <Outlet context={{ biz, loadingBiz }} />
          </div>
        </main>
      </div>
    </div>
  );
}
